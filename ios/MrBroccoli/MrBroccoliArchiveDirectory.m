#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface MrBroccoliArchiveDirectory : NSObject <RCTBridgeModule>
@end

@implementation MrBroccoliArchiveDirectory

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_queue_create(
      "com.tobiaswinkler.mrbroccoli.archive-directory",
      DISPATCH_QUEUE_SERIAL);
}

RCT_REMAP_METHOD(createBookmark,
                 uri:(NSString *)uri
                 createResolver:(RCTPromiseResolveBlock)resolve
                 createRejecter:(RCTPromiseRejectBlock)reject)
{
  NSURL *url = [NSURL URLWithString:uri];
  if (url == nil || !url.isFileURL) {
    reject(@"archive_directory_invalid", @"The selected directory is invalid.", nil);
    return;
  }

  BOOL didStartAccessing = [url startAccessingSecurityScopedResource];
  NSError *error = nil;
  NSData *bookmark = [url bookmarkDataWithOptions:NSURLBookmarkCreationMinimalBookmark
                   includingResourceValuesForKeys:nil
                                    relativeToURL:nil
                                            error:&error];
  if (didStartAccessing) {
    [url stopAccessingSecurityScopedResource];
  }

  if (bookmark == nil || error != nil) {
    reject(@"archive_directory_bookmark_failed",
           @"The selected directory could not be saved.",
           error);
    return;
  }

  resolve(@{
    @"bookmark" : [bookmark base64EncodedStringWithOptions:0],
    @"uri" : url.absoluteString,
  });
}

RCT_REMAP_METHOD(resolveBookmark,
                 bookmarkBase64:(NSString *)bookmarkBase64
                 resolveResolver:(RCTPromiseResolveBlock)resolve
                 resolveRejecter:(RCTPromiseRejectBlock)reject)
{
  NSData *bookmark = [[NSData alloc] initWithBase64EncodedString:bookmarkBase64
                                                        options:0];
  if (bookmark == nil) {
    reject(@"archive_directory_bookmark_invalid",
           @"The saved directory access is invalid.",
           nil);
    return;
  }

  BOOL stale = NO;
  NSError *error = nil;
  NSURL *url = [NSURL URLByResolvingBookmarkData:bookmark
                                        options:0
                                  relativeToURL:nil
                            bookmarkDataIsStale:&stale
                                          error:&error];
  if (url == nil || error != nil) {
    reject(@"archive_directory_resolve_failed",
           @"The saved directory is no longer available.",
           error);
    return;
  }

  BOOL didStartAccessing = [url startAccessingSecurityScopedResource];
  NSData *currentBookmark = bookmark;
  if (stale) {
    NSError *refreshError = nil;
    NSData *refreshedBookmark =
        [url bookmarkDataWithOptions:NSURLBookmarkCreationMinimalBookmark
       includingResourceValuesForKeys:nil
                        relativeToURL:nil
                                error:&refreshError];
    if (refreshedBookmark == nil || refreshError != nil) {
      if (didStartAccessing) {
        [url stopAccessingSecurityScopedResource];
      }
      reject(@"archive_directory_refresh_failed",
             @"The saved directory access could not be refreshed.",
             refreshError);
      return;
    }
    currentBookmark = refreshedBookmark;
  }
  if (didStartAccessing) {
    [url stopAccessingSecurityScopedResource];
  }

  resolve(@{
    @"bookmark" : [currentBookmark base64EncodedStringWithOptions:0],
    @"stale" : @(stale),
    @"uri" : url.absoluteString,
  });
}

@end
