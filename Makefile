SHELL := /bin/bash
.DEFAULT_GOAL := help
.NOTPARALLEL:

ANDROID_GRADLE := ./android/gradlew -p android
IOS_DESTINATION ?= generic/platform=iOS Simulator

.PHONY: \
	help \
	hooks-install \
	worktree-check \
	config \
	typecheck \
	test \
	i18n \
	maestro-verify \
	license \
	doctor \
	dependencies-check \
	android-unit \
	android-debug \
	ios-pods \
	ios-build \
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
		'make prerelease-preflight Verify every secret and signing prerequisite first' \
		'make pre-release-static Run the complete spend-free native/static release phase' \
		'make pre-release-live  Run the fail-fast live provider/model matrix' \
		'make pre-release-maestro Build/install and run the cross-platform visual suite' \
		'make pre-release       Run every local release gate in quota-safe order' \
		'make release-aab       Build and secret-scan the signed Android release AAB' \
		'make maestro-verify      Verify the E2E locale and screenshot contract' \
		'make android-debug      Build a debug APK' \
		'make ios-build          Build the app for the generic iOS Simulator'

hooks-install:
	@git config core.hooksPath .githooks
	@printf '%s\n' 'Installed repository hooks from .githooks.'

worktree-check:
	@git diff --check
	@git diff --cached --check

config:
	@npm run config:verify

typecheck:
	@npm run typecheck

test:
	@npm test -- --runInBand --watchman=false

i18n:
	@npm run i18n:verify

maestro-verify:
	@npm run maestro:test
	@npm run maestro:verify

license:
	@npm run license:test
	@npm run license:verify

doctor:
	@npx expo-doctor

dependencies-check:
	@npx expo install --check

android-unit:
	@NODE_ENV=test $(ANDROID_GRADLE) :app:testDebugUnitTest

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

pre-push:
	@$(MAKE) worktree-check
	@npm run prerelease:env:test
	@npm run prerelease:live:test
	@npm run maestro:prerelease:test
	@npm run release-notes:test
	@npm run release-notes:verify
	@node --test scripts/verify-release-artifact-secrets.test.mjs
	@$(MAKE) maestro-verify
	@$(MAKE) license
	@$(MAKE) config
	@$(MAKE) typecheck
	@$(MAKE) test

# This target must remain the first action of every comprehensive release run.
# It performs no provider request and aborts before quota can be consumed.
prerelease-preflight:
	@npm run prerelease:env:verify

# The spend-free phase is intentionally separate from the later live-provider
# and Maestro phase. It is safe to rerun while developing the release suite.
pre-release-static:
	@$(MAKE) prerelease-preflight
	@$(MAKE) pre-push
	@$(MAKE) doctor
	@$(MAKE) dependencies-check
	@$(MAKE) i18n
	@$(MAKE) android-unit
	@$(MAKE) ios-build

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
	@EXPO_NO_DOTENV=1 NODE_ENV=production $(ANDROID_GRADLE) :app:bundleRelease
	@node scripts/verify-release-artifact-secrets.mjs android/app/build/outputs/bundle/release/app-release.aab
