#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MrBroccoliDiagnostics, NSObject)

RCT_EXTERN_METHOD(consumePostmortemRecords:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
