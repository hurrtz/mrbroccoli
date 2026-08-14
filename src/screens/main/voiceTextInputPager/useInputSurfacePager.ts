import React from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { PAGE_GAP } from "./styles";
import { InputSurface } from "./types";
import { useInputSurfaceGesture } from "./useInputSurfaceGesture";

interface UseInputSurfacePagerParams {
  disabled: boolean;
  initialSurface: InputSurface;
  initialTextMessage: string;
  isActive: boolean;
  onInputSurfaceChange?: (surface: InputSurface) => void;
  onSubmitTextMessage: (text: string) => void;
  onTextMessageChange?: (text: string) => void;
  submissionDisabled?: boolean;
}

export function useInputSurfacePager({
  disabled,
  initialSurface,
  initialTextMessage,
  isActive,
  onInputSurfaceChange,
  onSubmitTextMessage,
  onTextMessageChange,
  submissionDisabled = false,
}: UseInputSurfacePagerParams) {
  const { width: windowWidth } = useWindowDimensions();
  const textInputRef = React.useRef<TextInput>(null);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [activeSurface, setActiveSurface] =
    React.useState<InputSurface>(initialSurface);
  const [textFocused, setTextFocused] = React.useState(false);
  const [textMessage, setTextMessage] = React.useState(initialTextMessage);
  const pageWidth = viewportWidth || Math.max(1, windowWidth - 32);
  const pageStride = pageWidth + PAGE_GAP;
  const trimmedTextMessage = textMessage.trim();
  const textSubmitDisabled =
    disabled ||
    submissionDisabled ||
    isActive ||
    trimmedTextMessage.length === 0;

  const focusTextInput = React.useCallback(() => {
    requestAnimationFrame(() => textInputRef.current?.focus());
  }, []);

  const applySurface = React.useCallback(
    (surface: InputSurface, focusText: boolean) => {
      setActiveSurface(surface);
      onInputSurfaceChange?.(surface);
      if (surface === "text" && focusText && !disabled && !isActive) {
        focusTextInput();
      } else if (surface === "voice") {
        Keyboard.dismiss();
      }
    },
    [disabled, focusTextInput, isActive, onInputSurfaceChange],
  );

  const handleTextMessageChange = React.useCallback(
    (text: string) => {
      setTextMessage(text);
      onTextMessageChange?.(text);
    },
    [onTextMessageChange],
  );

  const {
    panGesture,
    selectSurface,
    textInputGesture,
    textPageStyle,
    trackAnimatedStyle,
    voicePageStyle,
  } = useInputSurfaceGesture({
    activeSurface,
    applySurface,
    pageStride,
  });

  React.useEffect(() => {
    if (isActive) {
      Keyboard.dismiss();
    }
  }, [isActive]);

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setViewportWidth((currentWidth) =>
      Math.abs(currentWidth - nextWidth) >= 1 ? nextWidth : currentWidth,
    );
  }, []);

  const handleSubmitTextMessage = React.useCallback(() => {
    if (textSubmitDisabled) {
      return;
    }

    onSubmitTextMessage(trimmedTextMessage);
    setTextMessage("");
    onTextMessageChange?.("");
    Keyboard.dismiss();
  }, [
    onSubmitTextMessage,
    onTextMessageChange,
    textSubmitDisabled,
    trimmedTextMessage,
  ]);

  return {
    activeSurface,
    handleLayout,
    handleSubmitTextMessage,
    handleTextMessageChange,
    pageWidth,
    panGesture,
    selectSurface,
    setTextFocused,
    textFocused,
    textInputGesture,
    textInputRef,
    textMessage,
    textPageStyle,
    textSubmitDisabled,
    trackAnimatedStyle,
    voicePageStyle,
  };
}
