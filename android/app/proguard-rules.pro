# Add project-specific R8 rules here. These rules extend the optimized Android
# baseline selected by the release build in build.gradle.
#
# For more details, see
#   https://developer.android.com/topic/performance/app-optimization/enable-app-optimization

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project-specific keep options here.
