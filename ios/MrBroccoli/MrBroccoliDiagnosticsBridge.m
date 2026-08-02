#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MrBroccoliDiagnostics, NSObject)

RCT_EXTERN_METHOD(consumePostmortemRecords:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDeviceCapabilities:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
