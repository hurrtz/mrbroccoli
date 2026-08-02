# Free and Premium distribution

Reviewed on 2026-08-02. The app uses one binary and one permanent in-app
purchase; it does not maintain separate Free and Premium builds.

## Product boundary

| Capability                                                 | Free                                                        | Premium                                                  |
| ---------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| Account                                                    | None                                                        | None required                                            |
| Conversations and session manager                          | Local                                                       | Local, with all advanced controls                        |
| Listening, reasoning, and speech                           | One automatically selected on-device profile                | All local routes and configured providers                |
| Model setup                                                | Language choice, device check, one download-and-test action | Full catalogue, providers, models, voices, and fallbacks |
| Provider keys                                              | Never used by the effective Free runtime                    | BYOK through the existing secure-store flow              |
| Web search, images, Drive, and Uber Mode                    | Unavailable                                                 | Available                                                |
| Past-session knowledge and portable archive sync           | Unavailable                                                 | Available                                                |
| Backup import and export, privacy, theme, and app language | Available                                                   | Available                                                |

Free is not a crippled cloud trial. It is a private, useful local product with
no variable inference cost. Premium unlocks breadth, customization, and all
network-capable features without changing the user's stored settings.

## Free eligibility and preparation

The user selects every language they intend to use. The app then:

1. Probes platform, architecture, physical memory, free storage, low-power
   state, memory pressure, and thermal state.
2. Finds one LLM, STT model, and TTS model that all support every selected
   language and meet the device's hard requirements.
3. Prefers a viable, already installed combination before requesting another
   download. Known current-device benchmark failures rank behind alternatives.
4. Shows the exact recommended models and combined download size.
5. Downloads only after consent, verifies the pinned model artifacts, and runs
   a per-model benchmark on the current device.
6. Enables conversation input only after all three installed models have a
   viable benchmark for the current platform, architecture, OS version, and
   physical-memory profile.

The download itself requires internet access to the pinned model hosts. After
installation, the effective Free runtime has a local LLM route, local STT,
local TTS, empty provider credentials, web search off, no provider fallbacks,
no image route, no past-session retrieval, and no portable archive sync.
Stored Premium configuration is overlaid rather than deleted, so upgrading or
restoring Premium immediately brings it back.

Current complete TTS profiles cover English, Simplified Chinese, German,
Spanish, French, and Brazilian Portuguese. The multilingual LLM and Whisper
support more languages, but Free correctly remains unavailable until one local
TTS route covers the user's entire selected language set.

## Premium product

- Product type: permanent, non-consumable one-time purchase.
- Product ID: `com.tobiaswinkler.app.mrbroccoli.premium.lifetime`.
- Recommended initial base price: EUR 14.99, with store-managed localized
  equivalents. The app displays the localized store price and never hardcodes
  it in product copy.
- Premium unlocks all current provider, response-mode, speech, search, image,
  Drive, Uber Mode, past-session knowledge, portable archive, and
  advanced-settings features.

The product ID is part of the entitlement contract. Do not rename or reuse it
for a subscription or consumable.

## Serverless entitlement lifecycle

No Mr Broccoli server is required for this permanent unlock:

- Apple and Google process payment and expose owned non-consumable purchases
  through their platform billing APIs.
- After the store reports ownership, the app stores a device-local entitlement
  in `expo-secure-store`, grants Premium, and finalizes the non-consumable
  transaction.
- On launch and after returning to the foreground, the app reconciles the cache
  with the store when it is reachable. A transient outage does not revoke a
  previously confirmed offline entitlement; an authoritative empty ownership
  result does.
- **Restore purchase** performs the platform's explicit restore/sync flow and
  then checks ownership again.
- After deletion, reinstallation, or moving to another device, the same App
  Store account restores the iOS purchase and the same Play Store account
  restores the Android purchase.

This design deliberately accepts three limits:

1. An iOS purchase does not unlock Android, or vice versa. Cross-platform
   ownership needs a Mr Broccoli account and backend entitlement service.
2. Client-side enforcement is less resistant to a modified or rooted app than
   backend receipt verification. This is proportionate while Premium only
   unlocks client features and does not expose developer-funded inference.
3. Store lifecycle changes are observed when the app next reconciles, not via
   real-time server notifications. A backend becomes appropriate if Premium
   later includes hosted AI costs, subscriptions, web purchases, shared
   accounts, or stricter fraud/refund enforcement.

Apple documents non-consumables as current entitlements and requires a restore
mechanism. Google supports client-only acknowledgement but recommends a secure
backend for stronger purchase verification and lifecycle management:

- https://developer.apple.com/documentation/storekit/transaction/currententitlements
- https://developer.apple.com/in-app-purchase/
- https://developer.android.com/google/play/billing/integrate
- https://developer.android.com/google/play/billing/security
- https://www.openiap.dev/docs/apis

## Store-console setup

The repository cannot create or price store products. Before distributing the
binary:

### App Store Connect

1. Change the base app price to Free.
2. Create a **Non-Consumable** in-app purchase with the exact product ID above.
3. Add localized name, description, review screenshot, availability, and the
   selected price tier.
4. Confirm agreements, tax, and banking are active.
5. Test first purchase, cancellation, Ask to Buy/deferred state, interrupted
   completion, refund/revocation reconciliation, reinstall, second device, no
   purchase to restore, and explicit restore with StoreKit sandbox accounts.

### Google Play Console

1. Make the application Free before the public Free/Premium launch.
2. Create and activate a **one-time product** with the exact product ID above,
   a non-consumable purchase option, localized listing, and localized prices.
3. Configure license testers and test tracks, then test purchased and pending
   outcomes, cancellation, interrupted completion, acknowledgement, reinstall,
   second device, refund/revocation reconciliation, and restore with no owned
   product.

`expo-iap` is native code and therefore requires a development or release build;
Expo Go cannot exercise purchases.

## Existing-user migration gate

Before changing either store listing from paid download to Free, confirm that
there are no production users who paid for the old binary. Store ownership of
the app itself does not automatically mint ownership of this new in-app
product. If paid production users exist, define and test a grandfathering path
before launch; do not silently make them buy the same functionality again.

Closed beta installations and store license-test purchases should be handled
as an explicit product decision. Local-only grandfathering can preserve the
current installation but cannot reliably restore after reinstall; durable
cross-device grandfathering requires a store-supported entitlement signal or a
small backend migration service.
