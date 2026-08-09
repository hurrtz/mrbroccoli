import { PROVIDER_MODELS } from "../../../src/constants/models";
import { getLocalModelsForCapability } from "../../../src/constants/localModels";
import { getRouteBylineModel } from "../../../src/screens/main/routeBylineModel";
import { en } from "../../../src/i18n/locales/en";
import type { Provider, ResponseModeConfig } from "../../../src/types";

const t = ((key: keyof typeof en) => en[key]) as never;

function mode(route: unknown): ResponseModeConfig {
  return { id: "mode-1", route } as ResponseModeConfig;
}

/** The first shipped model that actually exposes a scale, so the fixture
 * follows the picker rather than pinning an id that will drift. */
function findModelWithEffortScale() {
  for (const [provider, models] of Object.entries(PROVIDER_MODELS)) {
    for (const model of models) {
      if ((model.effort?.options?.length ?? 0) > 1) {
        return {
          effort: model.effort!.options[0].id,
          model: model.id,
          provider: provider as Provider,
        };
      }
    }
  }

  return null;
}

const firstLocalLlm = getLocalModelsForCapability("llm")[0];

describe("getRouteBylineModel", () => {
  it("names the provider route and keeps its brand mark", () => {
    const scale = findModelWithEffortScale()!;
    const result = getRouteBylineModel(
      mode({ ...scale, runtime: "cloud" }),
      "en",
      t,
    );

    expect(result.local).toBe(false);
    expect(result.provider).toBe(scale.provider);
    expect(result.providerLabel).toBeTruthy();
    expect(result.modelName).toBeTruthy();
  });

  it("says an on-device route is on-device before it says which model", () => {
    // The runtime is what changes what the user can expect of the answer, so
    // it leads. A brand mark would be wrong: there is no provider.
    const result = getRouteBylineModel(
      mode({ localModelId: firstLocalLlm.id, runtime: "local" }),
      "en",
      t,
    );

    expect(result.local).toBe(true);
    expect(result.provider).toBeUndefined();
    expect(result.modelName.startsWith(en.settingsOnDevice)).toBe(true);
    expect(result.modelName).toContain("·");
  });

  it("exposes the model's own effort scale, low to high", () => {
    const scale = findModelWithEffortScale();

    expect(scale).not.toBeNull();

    const result = getRouteBylineModel(
      mode({ ...scale!, runtime: "cloud" }),
      "en",
      t,
    );

    expect(result.effortLevels.length).toBeGreaterThan(1);
    // The current effort has to be findable in the scale, or the byline draws
    // no filled dots at all.
    expect(result.effortLevels).toContain(result.effort);
  });

  it("gives an on-device route no scale to draw", () => {
    const result = getRouteBylineModel(
      mode({ localModelId: firstLocalLlm.id, runtime: "local" }),
      "en",
      t,
    );

    expect(result.effortLevels).toEqual([]);
  });
});
