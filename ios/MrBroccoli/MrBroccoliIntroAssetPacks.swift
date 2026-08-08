import Foundation
import React

#if canImport(BackgroundAssets)
  import BackgroundAssets
  import System
#endif

/// Apple-hosted Background Assets delivery for the intro audio examples.
///
/// Every interface language has an example clip and any one user opens one or
/// two, so the clips ship as store-hosted asset packs rather than inside the
/// app. Apple serves them, which keeps roughly eighty megabytes of audio that
/// almost nobody plays out of every install.
///
/// `AssetPackManager` requires iOS 26, so everything here is gated on that. An
/// older system resolves `false`/`nil` instead of failing, and the intro sheet
/// falls back to its transcript -- the same branch that already covers a
/// language whose clip has not been recorded yet.
///
/// Only the iOS 26.0 surface is used. The 26.4 additions
/// (`assetPackIsAvailableLocally`, `status(relativeTo:)`) are conveniences over
/// calls that already exist at 26.0, and depending on them would raise the
/// feature floor by a whole point release for no capability.
@objc(MrBroccoliIntroAssetPacks)
final class MrBroccoliIntroAssetPacks: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { false }

  @objc(isSupported:rejecter:)
  func isSupported(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter _: @escaping RCTPromiseRejectBlock
  ) {
    #if canImport(BackgroundAssets)
      if #available(iOS 26.0, *) {
        resolve(true)
        return
      }
    #endif
    resolve(false)
  }

  /// Downloads the pack when needed, then resolves the clip's local path.
  ///
  /// A pack that does not exist resolves `nil` rather than rejecting. During
  /// rollout most languages have no pack yet, and that is an expected state,
  /// not an error worth surfacing over an optional example.
  @objc(ensurePack:fileName:resolver:rejecter:)
  func ensurePack(
    _ packName: String,
    fileName: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    #if canImport(BackgroundAssets)
      guard #available(iOS 26.0, *) else {
        resolve(nil)
        return
      }

      Task {
        let manager = AssetPackManager.shared
        let pack: AssetPack
        do {
          pack = try await manager.assetPack(withID: packName)
        } catch {
          // Thrown as `assetPackNotFound` for a pack that was never uploaded.
          resolve(nil)
          return
        }

        do {
          try await manager.ensureLocalAvailability(of: pack)
        } catch {
          reject(
            "intro_asset_pack_fetch_failed",
            "Could not make \(packName) available.",
            error
          )
          return
        }

        resolve(Self.localPath(manager: manager, fileName: fileName))
      }
    #else
      resolve(nil)
    #endif
  }

  /// Resolves a path only when the pack is already downloaded.
  ///
  /// Separate from `ensurePack` so the intro sheet can decide whether to offer
  /// a play control without starting a download nobody asked for.
  @objc(getLocalPath:fileName:resolver:rejecter:)
  func getLocalPath(
    _ packName: String,
    fileName: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter _: @escaping RCTPromiseRejectBlock
  ) {
    #if canImport(BackgroundAssets)
      guard #available(iOS 26.0, *) else {
        resolve(nil)
        return
      }

      Task {
        let manager = AssetPackManager.shared
        guard
          let status = try? await manager.status(ofAssetPackWithID: packName),
          status.contains(.downloaded)
        else {
          resolve(nil)
          return
        }
        resolve(Self.localPath(manager: manager, fileName: fileName))
      }
    #else
      resolve(nil)
    #endif
  }

  @objc(removePack:resolver:rejecter:)
  func removePack(
    _ packName: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    #if canImport(BackgroundAssets)
      guard #available(iOS 26.0, *) else {
        resolve(nil)
        return
      }

      Task {
        do {
          try await AssetPackManager.shared.remove(assetPackWithID: packName)
          resolve(nil)
        } catch {
          reject(
            "intro_asset_pack_remove_failed",
            "Could not remove \(packName).",
            error
          )
        }
      }
    #else
      resolve(nil)
    #endif
  }

  #if canImport(BackgroundAssets)
    /// Pack contents are addressed by their path inside the pack, so the URL is
    /// resolved through the manager rather than by assuming a container layout.
    @available(iOS 26.0, *)
    private static func localPath(
      manager: AssetPackManager,
      fileName: String
    ) -> String? {
      guard let url = try? manager.url(for: FilePath(fileName)) else {
        return nil
      }
      return url.path
    }
  #endif
}
