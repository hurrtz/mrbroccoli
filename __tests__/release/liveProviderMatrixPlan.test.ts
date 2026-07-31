import {
  WEB_SEARCH_PROVIDER_CONTROL_SUPPORT,
  WEB_SEARCH_PROVIDER_IDS,
  WEB_SEARCH_SEARCH_MODE_VALUES,
} from "../../src/constants/webSearch";
import { RUNTIME_PROVIDER_MANIFEST } from "../../src/constants/providers/runtimeManifest";
import {
  buildLiveProviderMatrix,
  getLiveProviderMatrixReservedUsd,
} from "../../scripts/live-provider-matrix-plan";

describe("live provider pre-release matrix", () => {
  const steps = buildLiveProviderMatrix();

  it("covers every LLM model and every effort option", () => {
    for (const [provider, manifest] of Object.entries(
      RUNTIME_PROVIDER_MANIFEST,
    )) {
      for (const model of manifest.llm.models) {
        const expectedEfforts = model.effort?.options.map(
          (option) => option.id,
        ) ?? [undefined];
        const actualEfforts = steps
          .filter(
            (step) =>
              step.kind === "llm" &&
              step.provider === provider &&
              step.model === model.id,
          )
          .map((step) => step.effort);

        expect(actualEfforts).toEqual(expectedEfforts);
      }
    }
  });

  it("covers every provider STT and TTS model exactly once", () => {
    for (const [provider, manifest] of Object.entries(
      RUNTIME_PROVIDER_MANIFEST,
    )) {
      expect(
        steps
          .filter(
            (step) => step.kind === "stt" && step.provider === provider,
          )
          .map((step) => step.model),
      ).toEqual(manifest.stt.models.map((model) => model.id));

      const ttsSteps = steps.filter(
        (step) => step.kind === "tts" && step.provider === provider,
      );
      expect(ttsSteps.map((step) => step.model)).toEqual(
        manifest.tts.models.map((model) => model.id),
      );

      for (const step of ttsSteps) {
        if (!manifest.tts.requiresVoice) {
          continue;
        }

        if (!step.voice && !manifest.tts.voiceDirectory) {
          throw new Error(
            `${step.id} has neither a representative voice nor a directory`,
          );
        }
      }
    }
  });

  it("covers each search provider and every search mode the UI exposes", () => {
    for (const provider of WEB_SEARCH_PROVIDER_IDS) {
      const searchModes = steps
        .filter(
          (step) =>
            step.kind === "web-search" && step.provider === provider,
        )
        .map((step) => step.searchMode);

      expect(searchModes).toEqual(
        WEB_SEARCH_PROVIDER_CONTROL_SUPPORT[provider].searchMode
          ? [...WEB_SEARCH_SEARCH_MODE_VALUES]
          : ["balanced"],
      );
    }
  });

  it("cannot reintroduce removed direct providers", () => {
    const providerIds = steps.map((step) => step.provider);

    expect(providerIds).not.toContain("perplexity");
    expect(providerIds).not.toContain("moonshot-ai-kimi");
    expect(providerIds).not.toContain("bytedance-doubao-seed");
  });

  it("fits the agreed USD 1 release-test ceiling", () => {
    expect(getLiveProviderMatrixReservedUsd(steps)).toBeLessThanOrEqual(1);
  });

  it("reserves token and tool-call headroom for Anthropic web search", () => {
    expect(
      steps.find((step) => step.id === "web-search:anthropic:balanced")
        ?.reservedUsd,
    ).toBe(0.06);
  });

  it("has unique stable step identifiers", () => {
    expect(new Set(steps.map((step) => step.id)).size).toBe(steps.length);
  });
});
