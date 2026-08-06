import type { SpeechLanguage } from "./speechLanguages";

/**
 * Pinned libphonemize language packs.
 *
 * The app ships an espeak-free sherpa-onnx runtime (see
 * docs/licensing-and-provider-terms.md): text-to-phoneme conversion for
 * Kokoro and Piper voices runs through libphonemize instead of the
 * GPL-licensed eSpeak NG. libphonemize loads its packs from the directory
 * the runtime receives as the model data directory, so a pack install
 * places files next to the `espeak-ng-data` folder a speech model already
 * provisions.
 *
 * Packs are curated artifacts with the same guarantees as the local model
 * catalogue: pinned source, exact size, and SHA-256 verified before use.
 */

export const PHONEME_PACK_CATALOG_VERSION = 1;

export const PHONEME_PACK_RELEASE_URL =
  "https://github.com/hurrtz/libphonemize/releases/download/packs-v1";

export interface PhonemePackDefinition {
  /** Pack id; also the archive base name. */
  id: string;
  /** Conversation languages this pack serves. */
  languages: SpeechLanguage[];
  /** File or directory the extracted archive must produce. */
  installedEntry: string;
  downloadBytes: number;
  sha256: string;
  /** Source data license, per libphonemize data/README.md. */
  license: string;
}

export const PHONEME_PACKS = [
  {
    id: "en-us.lpk",
    languages: ["en"],
    installedEntry: "en-us.lpk",
    downloadBytes: 1_509_997,
    sha256:
      "5dd47fe3e1dd55abccf641c0f6553ea4b2a241c3642d1bc07626876b10a06d42",
    license: "BSD-2-Clause (CMUdict)",
  },
  {
    id: "de.lpk",
    languages: ["de"],
    installedEntry: "de.lpk",
    downloadBytes: 8_235_893,
    sha256:
      "eddfcde18011a260e91e035bfb2a709a94236d66a58997f5496524f61f0b10b8",
    license: "MIT (ipa-dict)",
  },
  {
    id: "fr.lpk",
    languages: ["fr"],
    installedEntry: "fr.lpk",
    downloadBytes: 2_534_713,
    sha256:
      "64e338e4028de8a379413e3cec21b6b4565f4eaf670286d820abb8b55d9d4996",
    license: "MIT (ipa-dict)",
  },
  {
    id: "es.lpk",
    languages: ["es"],
    installedEntry: "es.lpk",
    downloadBytes: 6_478_039,
    sha256:
      "3c73b5443e22c40f038b377c768a8d3cd2f1f5cd1f20099661887b6894b73f30",
    license: "MIT (ipa-dict)",
  },
  {
    id: "it.lpk",
    languages: ["it"],
    installedEntry: "it.lpk",
    downloadBytes: 980_824,
    sha256:
      "1329e983bb4e5a85fff29f032e04598288ed12384d5ad5746b7e86a9ff4c7c24",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "pt.lpk",
    languages: ["pt", "pt-BR"],
    installedEntry: "pt.lpk",
    downloadBytes: 694_756,
    sha256:
      "be9531f76017c6fcdf73e481c5eb898de42f943909378022dde2a4aa94739ec1",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "ru.lpk",
    languages: ["ru"],
    installedEntry: "ru.lpk",
    downloadBytes: 5_936_618,
    sha256:
      "0aebdf76d3e09a651ef9fb24c26d5460e7d0365d78fa63aadbc0607de51e9694",
    license: "CC BY-SA 4.0 (openrussian)",
  },
  {
    id: "en-us.g2p",
    languages: ["en"],
    installedEntry: "en-us.g2p",
    downloadBytes: 11_542_683,
    sha256:
      "6b1c1bd2cd69abdd226f17ba2fb8272cde0379a2c6d98ce6c8f6670d2bb45a59",
    license: "Apache-2.0 (libphonemize)",
  },
] as const satisfies readonly PhonemePackDefinition[];

export type PhonemePackId = (typeof PHONEME_PACKS)[number]["id"];

export function getPhonemePackDownloadUrl(pack: PhonemePackDefinition) {
  return `${PHONEME_PACK_RELEASE_URL}/${pack.id}.tar.bz2`;
}

/**
 * Packs required for a conversation language. English additionally installs
 * the neural G2P so out-of-vocabulary words (names, brands) are pronounced
 * instead of dropped.
 */
export function getPhonemePacksForLanguage(
  language: SpeechLanguage,
): PhonemePackDefinition[] {
  return PHONEME_PACKS.filter((pack) =>
    (pack.languages as readonly SpeechLanguage[]).includes(language),
  );
}
