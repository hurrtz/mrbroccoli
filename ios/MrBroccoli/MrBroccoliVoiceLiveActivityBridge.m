#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MrBroccoliVoiceLiveActivity, NSObject)

RCT_EXTERN_METHOD(setState:(NSString *)phase
                  expectedSpeechAtMs:(NSNumber * _Nullable)expectedSpeechAtMs
                  phaseLabel:(NSString *)phaseLabel
                  statusLabel:(NSString *)statusLabel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(endActivity:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
