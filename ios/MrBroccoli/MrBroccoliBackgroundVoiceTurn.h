#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

FOUNDATION_EXPORT void MrBroccoliSetBackgroundDownloadCompletionHandler(
    NSString *identifier,
    void (^completionHandler)(void));

@interface MrBroccoliBackgroundVoiceTurn : NSObject <RCTBridgeModule>

- (void)setTurnActive:(BOOL)active;
- (void)invalidate;

@end

NS_ASSUME_NONNULL_END
