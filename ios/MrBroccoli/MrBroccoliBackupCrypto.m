#import <CommonCrypto/CommonKeyDerivation.h>
#import <CommonCrypto/CommonCryptoError.h>
#import <React/RCTBridgeModule.h>
#import <string.h>

@interface MrBroccoliBackupCrypto : NSObject <RCTBridgeModule>
@end

@implementation MrBroccoliBackupCrypto

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_queue_create("com.tobiaswinkler.mrbroccoli.backup-crypto",
                               DISPATCH_QUEUE_SERIAL);
}

RCT_REMAP_METHOD(pbkdf2Sha256,
                 passphrase:(NSString *)passphrase
                 saltBase64:(NSString *)saltBase64
                 iterations:(NSInteger)iterations
                 keyLength:(NSInteger)keyLength
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSData *salt = [[NSData alloc] initWithBase64EncodedString:saltBase64 options:0];
  NSData *password = [passphrase dataUsingEncoding:NSUTF8StringEncoding];
  if (salt == nil || password == nil || iterations <= 0 || keyLength <= 0) {
    reject(@"backup_key_derivation_invalid",
           @"Invalid backup key derivation parameters.",
           nil);
    return;
  }

  NSMutableData *key = [NSMutableData dataWithLength:(NSUInteger)keyLength];
  const int status = CCKeyDerivationPBKDF(
      kCCPBKDF2,
      password.bytes,
      password.length,
      salt.bytes,
      salt.length,
      kCCPRFHmacAlgSHA256,
      (uint)iterations,
      key.mutableBytes,
      key.length);

  if (status != kCCSuccess) {
    reject(@"backup_key_derivation_failed",
           @"Could not derive the backup encryption key.",
           nil);
    return;
  }

  NSString *keyBase64 = [key base64EncodedStringWithOptions:0];
  memset(key.mutableBytes, 0, key.length);
  resolve(keyBase64);
}

@end
