import { useCallback, useRef, useState } from "react";

type InputSurface = "voice" | "text";

export function useMainScreenComposerDraft() {
  const inputSurfaceRef = useRef<InputSurface>("voice");
  const textInputFocusedRef = useRef(false);
  const textMessageDraftRef = useRef("");

  const [acceptedDraftVersion, setAcceptedDraftVersion] = useState(0);
  const handleTextTurnAccepted = useCallback((submitted: string) => {
    if (textMessageDraftRef.current.trim() === submitted) {
      textMessageDraftRef.current = "";
      setAcceptedDraftVersion((version) => version + 1);
    }
  }, []);

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
    acceptedDraftVersion,
    handleTextTurnAccepted,
    handleInputSurfaceChange,
    handleTextInputFocusChange,
    handleTextMessageChange,
    inputSurfaceRef,
    textInputFocusedRef,
    textMessageDraftRef,
  };
}
