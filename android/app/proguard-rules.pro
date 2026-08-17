# Add project-specific R8 rules here. These rules extend the optimized Android
# baseline selected by the release build in build.gradle.
#
# For more details, see
#   https://developer.android.com/topic/performance/app-optimization/enable-app-optimization

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# sherpa-onnx JNI reads Kotlin configuration objects by their original class
# and field names. Renaming either side makes ART abort inside GetObjectField.
-keep class com.k2fsa.sherpa.onnx.** { *; }

# sherpa-onnx JNI also calls the boxed FloatArray callback created by the React
# Native TTS wrapper via invoke([F)Ljava/lang/Integer;. R8 must not merge or
# rewrite that anonymous callback class or the Release app aborts in ART.
-keep class com.sherpaonnx.SherpaOnnxTtsHelper$* { *; }

# Add any project-specific keep options here.
