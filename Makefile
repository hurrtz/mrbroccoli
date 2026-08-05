SHELL := /bin/bash
.DEFAULT_GOAL := help
.NOTPARALLEL:

ANDROID_GRADLE := ./android/gradlew -p android
IOS_DESTINATION ?= generic/platform=iOS Simulator

.PHONY: \
	help \
	hooks-install \
	worktree-check \
	fresh-checkout \
	config \
	typecheck \
	static \
	test \
	coverage \
	i18n \
	maestro-verify \
	store-promos-verify \
	store-promos-ios \
	store-promos-android \
	license \
	doctor \
	dependencies-check \
	android-unit \
	android-instrumentation \
	android-debug \
	ios-pods \
	ios-build \
	ios-native-test \
	pre-push \
	prerelease-preflight \
	pre-release-static \
	pre-release-live \
	pre-release-maestro \
	pre-release \
	release-aab

help:
	@printf '%s\n' \
		'make hooks-install       Install the repository-managed pre-push hook' \
		'make pre-push           Run the fast, spend-free local validation gate' \
		'make fresh-checkout     Re-run pre-push from an isolated detached HEAD' \
		'make prerelease-preflight Verify every secret and signing prerequisite first' \
		'make pre-release-static Run the complete spend-free native/static release phase' \
		'make pre-release-live  Run the fail-fast live provider/model matrix' \
		'make pre-release-maestro Build/install and run the cross-platform visual suite' \
		'make pre-release       Run every local release gate in quota-safe order' \
		'make release-aab       Build, verify, and archive the signed Android release artifacts' \
		'make maestro-verify      Verify the E2E locale and screenshot contract' \
		'make store-promos-verify Verify the ten-image localized App Store screenshot contract' \
		'make store-promos-ios LOCALE=de DISPLAY=6.8 Build and capture one localized iOS store set' \
		'make store-promos-android LOCALE=de DISPLAY=phone Build and capture one localized Android store set' \
		'make android-debug      Build a debug APK' \
		'make android-instrumentation Run native runtime tests on one connected Android emulator' \
		'make ios-build          Build the app for the generic iOS Simulator' \
		'make ios-native-test    Run native lifecycle tests on one booted iOS Simulator'

hooks-install:
	@git config core.hooksPath .githooks
	@printf '%s\n' 'Installed repository hooks from .githooks.'

worktree-check:
	@git diff --check
	@git diff --cached --check

fresh-checkout:
	@npm run fresh-checkout:test
	@npm run fresh-checkout

config:
	@npm run config:verify

typecheck:
	@npm run typecheck

static:
	@npm run static:verify

test:
	@npm test -- --runInBand --watchman=false

coverage:
	@npm run test:coverage -- --runInBand --watchman=false

i18n:
	@npm run i18n:verify

maestro-verify:
	@npm run maestro:test
	@npm run maestro:verify

store-promos-verify:
	@npm run store-promos:test
	@npm run store-promos:verify

store-promos-ios:
	@test -n "$(LOCALE)" || (printf '%s\n' 'LOCALE is required, for example: make store-promos-ios LOCALE=de DISPLAY=6.8' >&2; exit 1)
	@npm run store-promos:ios -- --locale "$(LOCALE)" --display "$(or $(DISPLAY),6.8)" $(if $(UDID),--udid "$(UDID)",)

store-promos-android:
	@test -n "$(LOCALE)" || (printf '%s\n' 'LOCALE is required, for example: make store-promos-android LOCALE=de DISPLAY=phone' >&2; exit 1)
	@npm run store-promos:android -- --locale "$(LOCALE)" --display "$(or $(DISPLAY),phone)" $(if $(UDID),--udid "$(UDID)",)

license:
	@npm run license:test
	@npm run license:verify

doctor:
	@npx expo-doctor

dependencies-check:
	@npx expo install --check

android-unit:
	@NODE_ENV=test $(ANDROID_GRADLE) :app:testDebugUnitTest

android-instrumentation:
	@node scripts/run-android-instrumentation.mjs

android-debug:
	@NODE_ENV=development $(ANDROID_GRADLE) :app:assembleDebug

ios-pods:
	@npx pod-install

ios-build:
	@xcodebuild \
		-workspace ios/MrBroccoli.xcworkspace \
		-scheme MrBroccoli \
		-configuration Debug \
		-sdk iphonesimulator \
		-destination '$(IOS_DESTINATION)' \
		build

ios-native-test:
	@node scripts/run-ios-native-tests.mjs

pre-push:
	@$(MAKE) worktree-check
	@node --test scripts/makefile-contract.test.mjs
	@npm run spec-review:test
	@npm run ios:standalone:test
	@npm run prerelease:env:test
	@npm run prerelease:live:test
	@npm run maestro:prerelease:test
	@npm run release-notes:test
	@npm run release-notes:verify
	@node --test scripts/verify-release-artifact-secrets.test.mjs
	@node --test scripts/verify-android-release-artifacts.test.mjs
	@node --test scripts/run-android-instrumentation.test.mjs
	@node --test scripts/run-ios-native-tests.test.mjs
	@$(MAKE) maestro-verify
	@$(MAKE) license
	@$(MAKE) config
	@$(MAKE) static
	@$(MAKE) typecheck
	@$(MAKE) coverage

# This target must remain the first action of every comprehensive release run.
# It performs no provider request and aborts before quota can be consumed.
prerelease-preflight:
	@npm run prerelease:env:verify

# The spend-free phase is intentionally separate from the later live-provider
# and Maestro phase. It is safe to rerun while developing the release suite.
pre-release-static:
	@$(MAKE) prerelease-preflight
	@$(MAKE) fresh-checkout
	@$(MAKE) doctor
	@$(MAKE) dependencies-check
	@$(MAKE) i18n
	@$(MAKE) android-unit
	@$(MAKE) android-instrumentation
	@$(MAKE) ios-build
	@$(MAKE) ios-native-test

# The runner repeats the zero-network preflight internally before it loads any
# local credential into the Jest process. It then enforces the configured USD
# reservation, records a private sanitized cost report even on failure, and
# stops on the first failing provider configuration.
pre-release-live:
	@npm run prerelease:live

pre-release-maestro:
	@npm run maestro:prerelease

# Static and device failures are resolved before the live provider phase can
# spend quota. Each phase retains its own fail-fast preconditions as well.
pre-release:
	@$(MAKE) prerelease-preflight
	@$(MAKE) pre-release-static
	@$(MAKE) pre-release-maestro
	@$(MAKE) pre-release-live

release-aab:
	@EXPO_NO_DOTENV=1 NODE_ENV=production $(ANDROID_GRADLE) :app:bundleRelease :app:assembleRelease
	@node scripts/verify-release-artifact-secrets.mjs android/app/build/outputs/bundle/release/app-release.aab
	@node scripts/verify-android-release-artifacts.mjs
