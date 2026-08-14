import { useCallback, useRef } from "react";

type InputSurface = "voice" | "text";

export function useMainScreenComposerDraft() {
  const inputSurfaceRef = useRef<InputSurface>("voice");
  const textInputFocusedRef = useRef(false);
  const textMessageDraftRef = useRef("");

  const handleInputSurfaceChange = useCallback((surface: InputSurface) => {
    inputSurfaceRef.current = surface;
  }, []);

  const handleTextMessageChange = useCallback((text: string) => {
    textMessageDraftRef.current = text;
  }, []);

  const handleTextInputFocusChange = useCallback((focused: boolean) => {
    textInputFocusedRef.current = focused;
  }, []);

  return {
    handleInputSurfaceChange,
    handleTextInputFocusChange,
    handleTextMessageChange,
    inputSurfaceRef,
    textInputFocusedRef,
    textMessageDraftRef,
  };
}
