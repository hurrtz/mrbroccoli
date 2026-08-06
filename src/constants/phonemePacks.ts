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
  "https://github.com/hurrtz/libphonemize/releases/download/packs-v3";

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
    downloadBytes: 1_510_217,
    sha256:
      "a375cbd088fba86369064c976f49513ae1ba3eedb369b686958e9951ad696b96",
    license: "BSD-2-Clause (CMUdict)",
  },
  {
    id: "en-us.g2p",
    languages: ["en"],
    installedEntry: "en-us.g2p",
    downloadBytes: 11_623_431,
    sha256:
      "a70850f3b1d430e61c23435a5dc2b5900419036cc827c8a4054aa3e300d7bdde",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "de.lpk",
    languages: ["de"],
    installedEntry: "de.lpk",
    downloadBytes: 8_413_267,
    sha256:
      "989dde17248c2575250ec69a497829ae4075fd5996af92b2633997e9620ee907",
    license: "MIT (ipa-dict) with CC BY-SA gap-fill (WikiPron)",
  },
  {
    id: "de.g2p",
    languages: ["de"],
    installedEntry: "de.g2p",
    downloadBytes: 6_140_980,
    sha256:
      "c0dbe4216fae793cf88f6b297aaee76e7eee0d7c504a74dbc3c9f7fd30d4237f",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "fr.lpk",
    languages: ["fr"],
    installedEntry: "fr.lpk",
    downloadBytes: 2_910_184,
    sha256:
      "bfc621eafd58e7ca0c109577e6fc4a45071836058926271e52f13c191e3c4e38",
    license: "MIT (ipa-dict) with CC BY-SA gap-fill (WikiPron)",
  },
  {
    id: "fr.g2p",
    languages: ["fr"],
    installedEntry: "fr.g2p",
    downloadBytes: 5_929_102,
    sha256:
      "dbd2736a050eb08fefde98444015176d1623496777e19f8f0fdd1840fce08257",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "es.lpk",
    languages: ["es"],
    installedEntry: "es.lpk",
    downloadBytes: 6_479_283,
    sha256:
      "c567c609a576847395c1b27499c90a6d4e8c0fc0485c17bb5faf4bd7417f1095",
    license: "MIT (ipa-dict)",
  },
  {
    id: "es.g2p",
    languages: ["es"],
    installedEntry: "es.g2p",
    downloadBytes: 5_789_577,
    sha256:
      "31a046cb742d8cd4b91f9837829272454977c189cae6232f7e58dc6aeb624d88",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "it.lpk",
    languages: ["it"],
    installedEntry: "it.lpk",
    downloadBytes: 987_775,
    sha256:
      "615e9f5edf67d8e42402834b997c92064b8437e60ed6cfa6ac1a5d8d907370e3",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "it.g2p",
    languages: ["it"],
    installedEntry: "it.g2p",
    downloadBytes: 5_904_597,
    sha256:
      "0836becb83344c3f31133ac4fd1033168a402a8d42b85d66347408b2887c9395",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "pt.lpk",
    languages: ["pt"],
    installedEntry: "pt.lpk",
    downloadBytes: 695_109,
    sha256:
      "30fddd9df0c58a0b84f8dfeda5329e6c86d0b51040faae1f3d906e0a24b6b506",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "pt.g2p",
    languages: ["pt"],
    installedEntry: "pt.g2p",
    downloadBytes: 5_923_461,
    sha256:
      "eefc5ba421160b2d811e0b115b36ac9effe8b0dac5a2ddbd3cf39a6b5cd16725",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "pt-br.lpk",
    languages: ["pt-BR"],
    installedEntry: "pt-br.lpk",
    downloadBytes: 708_431,
    sha256:
      "ce2a5445d29911518b22774a65f20d3874019cfbd0bf8a47fb6201cf1cb65cb3",
    license: "CC BY-SA 3.0 (WikiPron)",
  },
  {
    id: "pt-br.g2p",
    languages: ["pt-BR"],
    installedEntry: "pt-br.g2p",
    downloadBytes: 5_957_768,
    sha256:
      "20fa93eda7ed9f0c2077c046ce8051c7376fb2b86aa5c399a9c5f04213bfe040",
    license: "Apache-2.0 (libphonemize weights)",
  },
  {
    id: "ru.lpk",
    languages: ["ru"],
    installedEntry: "ru.lpk",
    downloadBytes: 5_937_302,
    sha256:
      "7dbe4332ba49b4adad52557565ff467230832b0be3e4b33c428c3132141e5788",
    license: "CC BY-SA 4.0 (openrussian)",
  },
  {
    id: "ru.g2p",
    languages: ["ru"],
    installedEntry: "ru.g2p",
    downloadBytes: 5_826_613,
    sha256:
      "6d44ca4f9011ba85c4864ea56ad4e87d5c1d11ed7e40d16b78972a84cb3cdd4c",
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
