import { useCallback, useRef } from "react";

type InputSurface = "voice" | "text";

export function useMainScreenComposerDraft() {
  const inputSurfaceRef = useRef<InputSurface>("voice");
  const textMessageDraftRef = useRef("");

  const handleInputSurfaceChange = useCallback((surface: InputSurface) => {
    inputSurfaceRef.current = surface;
  }, []);

  const handleTextMessageChange = useCallback((text: string) => {
    textMessageDraftRef.current = text;
  }, []);

  return {
    handleInputSurfaceChange,
    handleTextMessageChange,
    inputSurfaceRef,
    textMessageDraftRef,
  };
}
