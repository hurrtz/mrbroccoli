#import <RNBackgroundDownloader.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>

void MrBroccoliSetBackgroundDownloadCompletionHandler(
    NSString *identifier,
    void (^completionHandler)(void))
{
  [RNBackgroundDownloader
      setCompletionHandlerWithIdentifier:identifier
                       completionHandler:completionHandler];
}

@interface MrBroccoliBackgroundVoiceTurn : NSObject <RCTBridgeModule>
@end

@interface MrBroccoliBackgroundVoiceTurn ()
- (void)beginBackgroundTaskIfNeeded;
- (void)endBackgroundTask;
@end

@implementation MrBroccoliBackgroundVoiceTurn {
  BOOL _turnActive;
  UIBackgroundTaskIdentifier _backgroundTask;
  id _didEnterBackgroundObserver;
  id _willEnterForegroundObserver;
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (instancetype)init
{
  if ((self = [super init])) {
    _backgroundTask = UIBackgroundTaskInvalid;

    __weak typeof(self) weakSelf = self;
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    _didEnterBackgroundObserver =
        [center addObserverForName:UIApplicationDidEnterBackgroundNotification
                           object:nil
                            queue:[NSOperationQueue mainQueue]
                       usingBlock:^(__unused NSNotification *notification) {
                         [weakSelf beginBackgroundTaskIfNeeded];
                       }];
    _willEnterForegroundObserver =
        [center addObserverForName:UIApplicationWillEnterForegroundNotification
                           object:nil
                            queue:[NSOperationQueue mainQueue]
                       usingBlock:^(__unused NSNotification *notification) {
                         [weakSelf endBackgroundTask];
                       }];
  }
  return self;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(setTurnActive:(BOOL)active)
{
  _turnActive = active;

  if (!active) {
    [self endBackgroundTask];
    return;
  }

  if ([UIApplication sharedApplication].applicationState ==
      UIApplicationStateBackground) {
    [self beginBackgroundTaskIfNeeded];
  }
}

- (void)beginBackgroundTaskIfNeeded
{
  if (!_turnActive || _backgroundTask != UIBackgroundTaskInvalid) {
    return;
  }

  __weak typeof(self) weakSelf = self;
  _backgroundTask = [[UIApplication sharedApplication]
      beginBackgroundTaskWithName:@"Mr Broccoli voice turn"
                expirationHandler:^{
                  RCTLogWarn(@"Mr Broccoli voice turn background time expired.");
                  [weakSelf endBackgroundTask];
                }];

  if (_backgroundTask == UIBackgroundTaskInvalid) {
    RCTLogWarn(@"Mr Broccoli could not begin voice turn background time.");
  }
}

- (void)endBackgroundTask
{
  if (_backgroundTask == UIBackgroundTaskInvalid) {
    return;
  }

  UIBackgroundTaskIdentifier task = _backgroundTask;
  _backgroundTask = UIBackgroundTaskInvalid;
  [[UIApplication sharedApplication] endBackgroundTask:task];
}

- (void)invalidate
{
  _turnActive = NO;
  [self endBackgroundTask];

  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  if (_didEnterBackgroundObserver != nil) {
    [center removeObserver:_didEnterBackgroundObserver];
    _didEnterBackgroundObserver = nil;
  }
  if (_willEnterForegroundObserver != nil) {
    [center removeObserver:_willEnterForegroundObserver];
    _willEnterForegroundObserver = nil;
  }
}

- (void)dealloc
{
  [self invalidate];
}

@end
