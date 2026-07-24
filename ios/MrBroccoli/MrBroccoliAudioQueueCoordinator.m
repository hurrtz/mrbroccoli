#import "MrBroccoliAudioQueueCoordinator.h"

#import <AVFoundation/AVFoundation.h>

#import "MrBroccoliAudioQueueSession.h"

@interface MrBroccoliAudioQueueCoordinator ()

- (void)handleItemDidPlayToEnd:(NSNotification *)notification;
- (void)handleItemFailedToPlayToEnd:(NSNotification *)notification;
- (void)handleItemFailure:(AVPlayerItem *)item error:(nullable NSError *)error;
- (void)armItemEndBoundaryForCurrentItem;
- (void)disarmItemEndBoundaryObserver;

@end

@implementation MrBroccoliAudioQueueCoordinator {
  AVQueuePlayer *_player;
  NSMutableDictionary<NSString *, NSDictionary *> *_contextsByItemKey;
  NSMutableDictionary<NSString *, AVPlayerItem *> *_itemsByItemKey;
  NSMutableSet<NSString *> *_startedItemKeys;
  NSString *_currentItemKey;
  id _itemEndBoundaryObserver;
  NSString *_itemEndBoundaryItemKey;
  NSString *_pendingBoundaryItemKey;
  BOOL _observingPlayer;
  BOOL _queueIsDrained;
}

- (instancetype)init
{
  if ((self = [super init])) {
    _contextsByItemKey = [NSMutableDictionary new];
    _itemsByItemKey = [NSMutableDictionary new];
    _startedItemKeys = [NSMutableSet new];
    _queueIsDrained = YES;
  }
  return self;
}

- (void)prepareForObservation
{
  [self ensurePlayer];
}

- (BOOL)prepare:(NSError **)error
{
  [self ensurePlayer];
  return [MrBroccoliAudioQueueSession activatePlaybackSession:error];
}

- (BOOL)enqueueUri:(NSString *)uri
            itemId:(NSString *)itemId
         requestId:(NSString *)requestId
            source:(NSString *)source
             error:(NSError **)error
{
  AVPlayerItem *item = nil;

  @try {
    [self ensurePlayer];

    NSURL *url = [self resolvedURLForUri:uri];
    item = [AVPlayerItem playerItemWithURL:url];
    NSString *itemKey = [self itemKey:item];

    _contextsByItemKey[itemKey] = @{
      @"itemId": itemId,
      @"uri": uri,
      @"requestId": requestId ?: [NSNull null],
      @"source": source ?: [NSNull null],
    };
    _itemsByItemKey[itemKey] = item;
    _queueIsDrained = NO;

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleItemDidPlayToEnd:)
                                                 name:AVPlayerItemDidPlayToEndTimeNotification
                                               object:item];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleItemFailedToPlayToEnd:)
                                                 name:AVPlayerItemFailedToPlayToEndTimeNotification
                                               object:item];
    [item addObserver:self
           forKeyPath:@"status"
              options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
              context:nil];

    [_player insertItem:item afterItem:nil];
    return YES;
  } @catch (NSException *exception) {
    if (item != nil) {
      [self cleanupItem:item];
    }
    if (_contextsByItemKey.count == 0 && _player.items.count == 0) {
      _queueIsDrained = YES;
    }
    if (error != nil) {
      *error = [NSError errorWithDomain:@"MrBroccoliAudioQueue"
                                   code:1
                               userInfo:@{
                                 NSLocalizedDescriptionKey :
                                     exception.reason ?: @"Audio queue enqueue failed."
                               }];
    }
    return NO;
  }
}

- (BOOL)start:(NSError **)error
{
  @try {
    [self ensurePlayer];
    if (_player.currentItem == nil && _player.items.count == 0) {
      return NO;
    }

    [_player play];
    [self emitStartedForCurrentItemIfNeeded];
    return YES;
  } @catch (NSException *exception) {
    if (error != nil) {
      *error = [NSError errorWithDomain:@"MrBroccoliAudioQueue"
                                   code:2
                               userInfo:@{
                                 NSLocalizedDescriptionKey :
                                     exception.reason ?: @"Audio queue start failed."
                               }];
    }
    return NO;
  }
}

- (BOOL)pause:(NSError **)error
{
  @try {
    if (_player != nil) {
      [_player pause];
    }
    return YES;
  } @catch (NSException *exception) {
    if (error != nil) {
      *error = [NSError errorWithDomain:@"MrBroccoliAudioQueue"
                                   code:4
                               userInfo:@{
                                 NSLocalizedDescriptionKey :
                                     exception.reason ?: @"Audio queue pause failed."
                               }];
    }
    return NO;
  }
}

- (BOOL)resume:(NSError **)error
{
  @try {
    [self ensurePlayer];
    if (_player.currentItem == nil && _player.items.count == 0) {
      return NO;
    }

    if (![MrBroccoliAudioQueueSession activatePlaybackSession:error]) {
      return NO;
    }

    [_player play];
    [self emitStartedForCurrentItemIfNeeded];
    return YES;
  } @catch (NSException *exception) {
    if (error != nil) {
      *error = [NSError errorWithDomain:@"MrBroccoliAudioQueue"
                                   code:5
                               userInfo:@{
                                 NSLocalizedDescriptionKey :
                                     exception.reason ?: @"Audio queue resume failed."
                               }];
    }
    return NO;
  }
}

- (BOOL)stop:(NSError **)error
{
  @try {
    if (_player != nil) {
      [self disarmItemEndBoundaryObserver];
      [_player pause];
      for (AVPlayerItem *item in _itemsByItemKey.allValues.copy) {
        [self removeObserversForItem:item];
      }
      [_player removeAllItems];
    }

    NSArray<NSString *> *itemKeys = _contextsByItemKey.allKeys.copy;
    for (NSString *itemKey in itemKeys) {
      NSDictionary *context = _contextsByItemKey[itemKey];
      [self emitEvent:@{
        @"type": @"stopped",
        @"itemId": context[@"itemId"] ?: @"",
        @"uri": context[@"uri"] ?: @"",
        @"requestId": context[@"requestId"] ?: [NSNull null],
        @"source": context[@"source"] ?: [NSNull null],
      }];
    }

    [_contextsByItemKey removeAllObjects];
    [_itemsByItemKey removeAllObjects];
    [_startedItemKeys removeAllObjects];
    _currentItemKey = nil;
    [self emitDrainedIfNeeded];
    [MrBroccoliAudioQueueSession deactivatePlaybackSessionIfIdleForPlayer:_player];
    return YES;
  } @catch (NSException *exception) {
    if (error != nil) {
      *error = [NSError errorWithDomain:@"MrBroccoliAudioQueue"
                                   code:3
                               userInfo:@{
                                 NSLocalizedDescriptionKey :
                                     exception.reason ?: @"Audio queue stop failed."
                               }];
    }
    return NO;
  }
}

- (void)invalidate
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [self disarmItemEndBoundaryObserver];
  [self detachPlayerObserversIfNeeded];
  for (AVPlayerItem *item in _itemsByItemKey.allValues.copy) {
    [self removeObserversForItem:item];
  }
  [_player pause];
  [_player removeAllItems];
  [MrBroccoliAudioQueueSession deactivatePlaybackSessionIfIdleForPlayer:_player];
  _player = nil;
  [_contextsByItemKey removeAllObjects];
  [_itemsByItemKey removeAllObjects];
  [_startedItemKeys removeAllObjects];
  _currentItemKey = nil;
  _queueIsDrained = YES;
}

- (void)ensurePlayer
{
  if (_player != nil) {
    return;
  }

  _player = [AVQueuePlayer queuePlayerWithItems:@[]];
  _player.actionAtItemEnd = AVPlayerActionAtItemEndAdvance;
  if ([_player respondsToSelector:@selector(setAutomaticallyWaitsToMinimizeStalling:)]) {
    _player.automaticallyWaitsToMinimizeStalling = NO;
  }

  [self attachPlayerObserversIfNeeded];
}

- (void)attachPlayerObserversIfNeeded
{
  if (_observingPlayer || _player == nil) {
    return;
  }

  [_player addObserver:self
            forKeyPath:@"currentItem"
               options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
               context:nil];
  [_player addObserver:self
            forKeyPath:@"timeControlStatus"
               options:NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
               context:nil];
  _observingPlayer = YES;
}

- (void)detachPlayerObserversIfNeeded
{
  if (!_observingPlayer || _player == nil) {
    return;
  }

  @try {
    [_player removeObserver:self forKeyPath:@"currentItem"];
    [_player removeObserver:self forKeyPath:@"timeControlStatus"];
  } @catch (__unused NSException *exception) {
  }

  _observingPlayer = NO;
}

- (NSString *)itemKey:(AVPlayerItem *)item
{
  return [NSString stringWithFormat:@"%p", item];
}

- (void)emitEvent:(NSDictionary *)payload
{
  if (self.eventHandler != nil) {
    self.eventHandler(payload);
  }
}

- (void)emitStartedForCurrentItemIfNeeded
{
  AVPlayerItem *item = _player.currentItem;
  if (item == nil || item.status != AVPlayerItemStatusReadyToPlay ||
      _player.timeControlStatus != AVPlayerTimeControlStatusPlaying) {
    return;
  }

  NSString *itemKey = [self itemKey:item];
  NSDictionary *context = _contextsByItemKey[itemKey];
  if (context == nil || [_startedItemKeys containsObject:itemKey]) {
    return;
  }

  [_startedItemKeys addObject:itemKey];
  _currentItemKey = itemKey;
  [self emitEvent:@{
    @"type": @"started",
    @"itemId": context[@"itemId"] ?: @"",
    @"uri": context[@"uri"] ?: @"",
    @"requestId": context[@"requestId"] ?: [NSNull null],
    @"source": context[@"source"] ?: [NSNull null],
  }];
}

- (void)disarmItemEndBoundaryObserver
{
  if (_itemEndBoundaryObserver != nil && _player != nil) {
    [_player removeTimeObserver:_itemEndBoundaryObserver];
  }

  _itemEndBoundaryObserver = nil;
  _itemEndBoundaryItemKey = nil;
  _pendingBoundaryItemKey = nil;
}

- (void)armItemEndBoundaryForCurrentItem
{
  AVPlayerItem *item = _player.currentItem;
  if (item == nil) {
    [self disarmItemEndBoundaryObserver];
    return;
  }

  if (item.status != AVPlayerItemStatusReadyToPlay) {
    return;
  }

  NSString *itemKey = [self itemKey:item];
  if ([_itemEndBoundaryItemKey isEqualToString:itemKey] ||
      [_pendingBoundaryItemKey isEqualToString:itemKey]) {
    return;
  }

  [self disarmItemEndBoundaryObserver];
  _pendingBoundaryItemKey = itemKey;

  __weak typeof(self) weakSelf = self;
  [item.asset loadValuesAsynchronouslyForKeys:@[ @"duration" ]
                            completionHandler:^{
    dispatch_async(dispatch_get_main_queue(), ^{
      __strong typeof(weakSelf) strongSelf = weakSelf;
      if (strongSelf == nil || strongSelf->_player.currentItem != item ||
          ![strongSelf->_pendingBoundaryItemKey isEqualToString:itemKey]) {
        return;
      }

      CMTime duration = item.duration;
      if (!CMTIME_IS_NUMERIC(duration) || CMTIME_IS_INDEFINITE(duration) ||
          CMTimeCompare(duration, kCMTimeZero) <= 0) {
        strongSelf->_pendingBoundaryItemKey = nil;
        return;
      }

      strongSelf->_pendingBoundaryItemKey = nil;
      strongSelf->_itemEndBoundaryItemKey = itemKey;
      strongSelf->_itemEndBoundaryObserver =
          [strongSelf->_player addBoundaryTimeObserverForTimes:@[
            [NSValue valueWithCMTime:duration]
          ]
                                                        queue:dispatch_get_main_queue()
                                                   usingBlock:^{
        __strong typeof(weakSelf) boundarySelf = weakSelf;
        if (boundarySelf == nil || boundarySelf->_player.currentItem != item) {
          return;
        }

        NSDictionary *context = boundarySelf->_contextsByItemKey[itemKey];
        if (context == nil) {
          return;
        }

        [boundarySelf emitEvent:@{
          @"type": @"finished",
          @"itemId": context[@"itemId"] ?: @"",
          @"uri": context[@"uri"] ?: @"",
          @"requestId": context[@"requestId"] ?: [NSNull null],
          @"source": context[@"source"] ?: [NSNull null],
        }];
        [boundarySelf cleanupItem:item];
        [boundarySelf disarmItemEndBoundaryObserver];
        [boundarySelf->_player advanceToNextItem];
        [boundarySelf armItemEndBoundaryForCurrentItem];
        [boundarySelf emitStartedForCurrentItemIfNeeded];
        [boundarySelf emitDrainedIfNeeded];
        [MrBroccoliAudioQueueSession
            deactivatePlaybackSessionIfIdleForPlayer:boundarySelf->_player];
      }];
    });
  }];
}

- (void)emitDrainedIfNeeded
{
  if (_player == nil || _queueIsDrained) {
    return;
  }

  if (_player.currentItem != nil || _player.items.count > 0 ||
      _contextsByItemKey.count > 0) {
    return;
  }

  _queueIsDrained = YES;
  _currentItemKey = nil;
  [_startedItemKeys removeAllObjects];
  [self emitEvent:@{ @"type": @"drained" }];
}

- (void)removeObserversForItem:(AVPlayerItem *)item
{
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:AVPlayerItemDidPlayToEndTimeNotification
                                                object:item];
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:AVPlayerItemFailedToPlayToEndTimeNotification
                                                object:item];
  @try {
    [item removeObserver:self forKeyPath:@"status"];
  } @catch (__unused NSException *exception) {
  }
}

- (void)cleanupItem:(AVPlayerItem *)item
{
  NSString *itemKey = [self itemKey:item];
  [self removeObserversForItem:item];
  [_contextsByItemKey removeObjectForKey:itemKey];
  [_itemsByItemKey removeObjectForKey:itemKey];
  [_startedItemKeys removeObject:itemKey];
  if ([_currentItemKey isEqualToString:itemKey]) {
    _currentItemKey = nil;
  }

  if ([_itemEndBoundaryItemKey isEqualToString:itemKey] ||
      [_pendingBoundaryItemKey isEqualToString:itemKey]) {
    [self disarmItemEndBoundaryObserver];
  }
}

- (NSURL *)resolvedURLForUri:(NSString *)uri
{
  NSURL *url = [NSURL URLWithString:uri];
  if (url != nil && url.scheme.length > 0) {
    return url;
  }

  return [NSURL fileURLWithPath:uri];
}

- (void)handleItemDidPlayToEnd:(NSNotification *)notification
{
  AVPlayerItem *item = notification.object;
  if (item == nil) {
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *itemKey = [self itemKey:item];
    NSDictionary *context = self->_contextsByItemKey[itemKey];
    if (context != nil) {
      [self emitEvent:@{
        @"type": @"finished",
        @"itemId": context[@"itemId"] ?: @"",
        @"uri": context[@"uri"] ?: @"",
        @"requestId": context[@"requestId"] ?: [NSNull null],
        @"source": context[@"source"] ?: [NSNull null],
      }];
    }

    [self cleanupItem:item];
    [self armItemEndBoundaryForCurrentItem];
    [self emitStartedForCurrentItemIfNeeded];
    [self emitDrainedIfNeeded];
    [MrBroccoliAudioQueueSession deactivatePlaybackSessionIfIdleForPlayer:self->_player];
  });
}

- (void)handleItemFailedToPlayToEnd:(NSNotification *)notification
{
  AVPlayerItem *item = notification.object;
  if (item == nil) {
    return;
  }

  NSError *error = notification.userInfo[AVPlayerItemFailedToPlayToEndTimeErrorKey];
  [self handleItemFailure:item error:error];
}

- (void)handleItemFailure:(AVPlayerItem *)item error:(NSError *)error
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *itemKey = [self itemKey:item];
    NSDictionary *context = self->_contextsByItemKey[itemKey];
    if (context != nil) {
      [self emitEvent:@{
        @"type": @"failed",
        @"itemId": context[@"itemId"] ?: @"",
        @"uri": context[@"uri"] ?: @"",
        @"requestId": context[@"requestId"] ?: [NSNull null],
        @"source": context[@"source"] ?: [NSNull null],
        @"message": error.localizedDescription ?: @"Audio playback failed.",
      }];

      [self cleanupItem:item];
      if (self->_player.currentItem == item) {
        [self->_player advanceToNextItem];
      } else if ([self->_player.items containsObject:item]) {
        [self->_player removeItem:item];
      }
    }

    [self armItemEndBoundaryForCurrentItem];
    [self emitStartedForCurrentItemIfNeeded];
    [self emitDrainedIfNeeded];
    [MrBroccoliAudioQueueSession deactivatePlaybackSessionIfIdleForPlayer:self->_player];
  });
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  if ([object isKindOfClass:[AVPlayerItem class]] &&
      [keyPath isEqualToString:@"status"]) {
    AVPlayerItem *item = (AVPlayerItem *)object;
    if (item.status == AVPlayerItemStatusFailed) {
      [self handleItemFailure:item error:item.error];
    } else if (item.status == AVPlayerItemStatusReadyToPlay) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (self->_player.currentItem == item) {
          [self armItemEndBoundaryForCurrentItem];
          [self emitStartedForCurrentItemIfNeeded];
        }
      });
    }
    return;
  }

  if (object != _player) {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    return;
  }

  if ([keyPath isEqualToString:@"currentItem"] ||
      [keyPath isEqualToString:@"timeControlStatus"]) {
    if ([keyPath isEqualToString:@"currentItem"]) {
      [self armItemEndBoundaryForCurrentItem];
    }
    [self emitStartedForCurrentItemIfNeeded];
    return;
  }

  [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
}

@end
