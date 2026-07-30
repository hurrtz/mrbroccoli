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

RCT_EXTERN_METHOD(setControls:(NSString *)mode
                  canRepeat:(BOOL)canRepeat
                  phaseLabel:(NSString *)phaseLabel
                  pauseLabel:(NSString *)pauseLabel
                  continueLabel:(NSString *)continueLabel
                  stopLabel:(NSString *)stopLabel
                  repeatLabel:(NSString *)repeatLabel
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearControls:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(consumePendingAction:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
