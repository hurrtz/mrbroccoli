import {
  getTtsListenLanguageLabel,
  TTS_LISTEN_LANGUAGE_OPTIONS,
} from "../../src/constants/localTts";
import { APP_LANGUAGES } from "../../src/i18n/localeRegistry";

describe("TTS listen-language labels", () => {
  it.each(APP_LANGUAGES)(
    "provides every listen-language label for registered app language %s",
    (appLanguage) => {
      TTS_LISTEN_LANGUAGE_OPTIONS.forEach((listenLanguage) => {
        expect(
          getTtsListenLanguageLabel(listenLanguage, appLanguage).trim().length,
        ).toBeGreaterThan(0);
      });
    },
  );
});
