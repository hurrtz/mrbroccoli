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
  "https://github.com/hurrtz/libphonemize/releases/download/packs-v2";

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
    downloadBytes: 1_510_052,
    sha256:
      "32d3fcdae82c101bfb7a9e735c4b50ada49429dd8a33a491b43c13d4f3323817",
    license: "BSD-2-Clause (CMUdict)",
  },
  {
    id: "en-us.g2p",
    languages: ["en"],
    installedEntry: "en-us.g2p",
    downloadBytes: 11_621_439,
    sha256:
      "12da3574c6a5a3aa1c8da78073cf9713c526ef0dca2cf36df1816c0de9602b23",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "de.lpk",
    languages: ["de"],
    installedEntry: "de.lpk",
    downloadBytes: 8_409_024,
    sha256:
      "2d6e9d0574228bcdb2e67f3d2e90edba9c6498007f7aeff026878eccc76fe756",
    license: "MIT (ipa-dict) with CC BY-SA gap-fill (WikiPron)",
  },
  {
    id: "de.g2p",
    languages: ["de"],
    installedEntry: "de.g2p",
    downloadBytes: 6_140_104,
    sha256:
      "c78750ad94bb042a5131641b07969395e23b2b379713c0320e40b5f83f63d11d",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "fr.lpk",
    languages: ["fr"],
    installedEntry: "fr.lpk",
    downloadBytes: 2_908_972,
    sha256:
      "caf5d97c039cb71c646ed2c83b5671136c8618c65ac8ba06c72142987158983f",
    license: "MIT (ipa-dict) with CC BY-SA gap-fill (WikiPron)",
  },
  {
    id: "fr.g2p",
    languages: ["fr"],
    installedEntry: "fr.g2p",
    downloadBytes: 5_931_058,
    sha256:
      "8db71ddeb9b3b6b132fc399c196a38e1c15d8c436e435fe653b69d20035794f7",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "es.lpk",
    languages: ["es"],
    installedEntry: "es.lpk",
    downloadBytes: 6_478_031,
    sha256:
      "810a55a301183eb92826ae96913150facf0cb6bd36275840c81dcb3e05edecd2",
    license: "MIT (ipa-dict)",
  },
  {
    id: "es.g2p",
    languages: ["es"],
    installedEntry: "es.g2p",
    downloadBytes: 5_795_127,
    sha256:
      "80d9ef948b90a3cc1b61487fd77fd3d01ccd32584917d1c69a23f98feb268d77",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "it.lpk",
    languages: ["it"],
    installedEntry: "it.lpk",
    downloadBytes: 980_118,
    sha256:
      "39c690b144c2b3e54e2d3bdc7ca1cdc2ca5437c126d8a4dee2d45882683ddd45",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "it.g2p",
    languages: ["it"],
    installedEntry: "it.g2p",
    downloadBytes: 5_908_171,
    sha256:
      "e7a288d5281d0b9471f63cc96b8faecf891ad9dbd3d38256e3ffff1a9f268f39",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "pt.lpk",
    languages: ["pt"],
    installedEntry: "pt.lpk",
    downloadBytes: 694_765,
    sha256:
      "b2b15c9c172ac3268cb4dfd02e5f4b8b5c58d223b97d336999d970fe5be914b3",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "pt.g2p",
    languages: ["pt"],
    installedEntry: "pt.g2p",
    downloadBytes: 5_913_538,
    sha256:
      "18e9eb50107127a908f1fa6370d531744a1d2c5f69902f982c71895d606f4725",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "pt-br.lpk",
    languages: ["pt-BR"],
    installedEntry: "pt-br.lpk",
    downloadBytes: 708_494,
    sha256:
      "bf039fea0eff3358d8b18dce26d8fdbe0ba04cb1e1005c492980fb13a736ff92",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "pt-br.g2p",
    languages: ["pt-BR"],
    installedEntry: "pt-br.g2p",
    downloadBytes: 5_946_831,
    sha256:
      "036d66eb6505de742f44a924341c03ab1c3a40b2d97ab32fb2bd9f2b295a798e",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "ru.lpk",
    languages: ["ru"],
    installedEntry: "ru.lpk",
    downloadBytes: 5_936_543,
    sha256:
      "c70f842ceffa2e634dce023ebe40ce9928b0aecdcc72f39682f79d5259c9442d",
    license: "CC BY-SA 4.0 (openrussian)",
  },
  {
    id: "ru.g2p",
    languages: ["ru"],
    installedEntry: "ru.g2p",
    downloadBytes: 5_826_722,
    sha256:
      "6ec23663a06d53c1145dce36573626e4103f2c6d6a43f698a02b04c12257d6c0",
    license: "Apache-2.0 (libphonemize weights)",
  },
] as const satisfies readonly PhonemePackDefinition[];

export type PhonemePackId = (typeof PHONEME_PACKS)[number]["id"];

export function getPhonemePackDownloadUrl(pack: PhonemePackDefinition) {
  return `${PHONEME_PACK_RELEASE_URL}/${pack.id}.tar.bz2`;
}

/**
 * Packs required for a conversation language: the lexicon pack plus the
 * neural G2P, so out-of-vocabulary words (names, brands, neologisms) are
 * pronounced instead of dropped.
 */
export function getPhonemePacksForLanguage(
  language: SpeechLanguage,
): PhonemePackDefinition[] {
  return PHONEME_PACKS.filter((pack) =>
    (pack.languages as readonly SpeechLanguage[]).includes(language),
  );
}
