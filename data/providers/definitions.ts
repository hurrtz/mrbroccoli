import type {
  CatalogLlm,
  CatalogModelDocument,
  CatalogProvider,
  CatalogProviderDocument,
  CatalogService,
  CatalogStt,
  CatalogTts,
} from "../../src/catalog/types";

type CatalogModelForService<TService extends CatalogService> = Extract<
  CatalogModelDocument,
  { service: TService }
>;

type CatalogProviderSummaryInput = Omit<CatalogProvider["summaries"], "activeModels"> & {
  activeModels?: Partial<Record<CatalogService, string | null>>;
};

export interface CatalogProviderDefinition
  extends Omit<CatalogProvider, "summaries"> {
  summaries: CatalogProviderSummaryInput;
}

type ProviderScopedModelFields =
  | "service"
  | "providerId"
  | "providerName"
  | "officialSources"
  | "catalogScope"
  | "pricingSummary"
  | "regionSummary"
  | "openAiCompatible"
  | "languagesSummary";

type CatalogModelInput<TModel extends CatalogModelDocument> = Omit<
  TModel,
  ProviderScopedModelFields
> &
  Partial<Pick<TModel, ProviderScopedModelFields>>;

export function defineProvider<T extends CatalogProvider>(provider: T) {
  return provider;
}

export function defineProviderDefinition<T extends CatalogProviderDefinition>(
  definition: T,
) {
  return definition;
}

export function defineLlms<T extends CatalogLlm[]>(models: T) {
  return models;
}

export function defineSttModels<T extends CatalogStt[]>(models: T) {
  return models;
}

export function defineTtsModels<T extends CatalogTts[]>(models: T) {
  return models;
}

function isShortModelNote(note: string | null) {
  if (!note) {
    return false;
  }

  const normalized = note.trim();

  return (
    normalized.length > 0 &&
    normalized.length <= 48 &&
    !normalized.includes("\n") &&
    !/[.!?]\s/.test(normalized)
  );
}

function buildActiveModelsSummary(
  models: CatalogModelDocument[],
  service: CatalogService,
  definition: CatalogProviderDefinition,
) {
  if (!models.length) {
    return null;
  }

  return models
    .map((model) => {
      const noteSuffix =
        isShortModelNote(model.notes) &&
        model.notes !== definition.summaries.integrationNotes
          ? ` — ${model.notes?.trim()}`
          : "";

      return `${model.publicName} [${model.modelId}]${noteSuffix}`;
    })
    .join("\n");
}

function getDefaultLanguageSummary(
  service: CatalogService,
  definition: CatalogProviderDefinition,
) {
  if (service === "stt") {
    return definition.summaries.sttLanguages;
  }

  if (service === "tts") {
    return definition.summaries.ttsLanguages;
  }

  return null;
}

function buildModel<TService extends CatalogService>(
  service: TService,
  definition: CatalogProviderDefinition,
  input: CatalogModelInput<CatalogModelForService<TService>>,
): CatalogModelForService<TService> {
  return {
    ...input,
    service,
    providerId: input.providerId ?? definition.providerId,
    providerName: input.providerName ?? definition.providerName,
    officialSources: input.officialSources ?? definition.officialSources,
    catalogScope: input.catalogScope ?? definition.integration.coverage,
    pricingSummary: input.pricingSummary ?? definition.summaries.pricing,
    regionSummary: input.regionSummary ?? definition.summaries.region,
    openAiCompatible:
      input.openAiCompatible ?? definition.integration.openAiCompatible,
    languagesSummary:
      input.languagesSummary ?? getDefaultLanguageSummary(service, definition),
  } as CatalogModelForService<TService>;
}

function assertProviderDocument(document: CatalogProviderDocument) {
  const { provider } = document;
  const modelsByService: Record<
    CatalogModelDocument["service"],
    CatalogModelDocument[]
  > = {
    llm: document.llms,
    stt: document.stt,
    tts: document.tts,
  };
  const canonicalIds = new Set<string>();
  for (const [service, models] of Object.entries(modelsByService) as [
    CatalogModelDocument["service"],
    CatalogModelDocument[],
  ][]) {
    const ids = new Set<string>();
    const aliases = new Map<string, string>();

    for (const model of models) {
      if (model.providerId !== provider.providerId) {
        throw new Error(
          `Catalog provider mismatch for ${provider.providerId}/${service}/${model.modelId}: providerId ${model.providerId}`,
        );
      }

      if (model.providerName !== provider.providerName) {
        throw new Error(
          `Catalog provider mismatch for ${provider.providerId}/${service}/${model.modelId}: providerName ${model.providerName}`,
        );
      }

      if (model.service !== service) {
        throw new Error(
          `Catalog service mismatch for ${provider.providerId}/${service}/${model.modelId}: service ${model.service}`,
        );
      }

      if (ids.has(model.modelId)) {
        throw new Error(
          `Duplicate catalog model ID ${provider.providerId}/${service}/${model.modelId}`,
        );
      }

      ids.add(model.modelId);

      canonicalIds.add(model.modelId);

      for (const alias of model.aliases ?? []) {
        if (alias === model.modelId) {
          throw new Error(
            `Catalog alias duplicates canonical model ID ${provider.providerId}/${service}/${model.modelId}`,
          );
        }

        if (ids.has(alias)) {
          throw new Error(
            `Catalog alias collides with canonical model ID ${provider.providerId}/${service}/${alias}`,
          );
        }

        if (canonicalIds.has(alias)) {
          throw new Error(
            `Catalog alias collides with canonical model ID ${provider.providerId}/${alias}`,
          );
        }

        const existingOwner = aliases.get(alias);

        if (existingOwner && existingOwner !== model.modelId) {
          throw new Error(
            `Catalog alias collision ${provider.providerId}/${service}/${alias} shared by ${existingOwner} and ${model.modelId}`,
          );
        }

        aliases.set(alias, model.modelId);
      }
    }
  }
}

export function defineProviderDocument<T extends CatalogProviderDocument>(
  document: T,
) {
  assertProviderDocument(document);
  return document;
}

export function defineProviderDocuments<T extends CatalogProviderDocument[]>(
  documents: T,
) {
  const providerIds = new Set<string>();

  for (const document of documents) {
    assertProviderDocument(document);

    if (providerIds.has(document.provider.providerId)) {
      throw new Error(
        `Duplicate catalog provider ID ${document.provider.providerId}`,
      );
    }

    providerIds.add(document.provider.providerId);
  }

  return documents;
}

export function createProviderContext<TDefinition extends CatalogProviderDefinition>(
  definition: TDefinition,
) {
  const llm = (input: CatalogModelInput<CatalogLlm>) =>
    buildModel("llm", definition, input);
  const stt = (input: CatalogModelInput<CatalogStt>) =>
    buildModel("stt", definition, input);
  const tts = (input: CatalogModelInput<CatalogTts>) =>
    buildModel("tts", definition, input);

  return {
    definition,
    llm,
    stt,
    tts,
    defineLlms<TModels extends CatalogLlm[]>(models: TModels) {
      return defineLlms(models);
    },
    defineSttModels<TModels extends CatalogStt[]>(models: TModels) {
      return defineSttModels(models);
    },
    defineTtsModels<TModels extends CatalogTts[]>(models: TModels) {
      return defineTtsModels(models);
    },
    document(params: {
      llms: CatalogLlm[];
      stt: CatalogStt[];
      tts: CatalogTts[];
    }) {
      return defineProviderDocument({
        provider: {
          ...definition,
          summaries: {
            ...definition.summaries,
            activeModels: {
              llm:
                definition.summaries.activeModels?.llm ??
                buildActiveModelsSummary(params.llms, "llm", definition),
              stt:
                definition.summaries.activeModels?.stt ??
                buildActiveModelsSummary(params.stt, "stt", definition),
              tts:
                definition.summaries.activeModels?.tts ??
                buildActiveModelsSummary(params.tts, "tts", definition),
            },
          },
        },
        llms: params.llms,
        stt: params.stt,
        tts: params.tts,
      });
    },
  };
}
