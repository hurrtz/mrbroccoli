import { providerContext } from "./provider";

// OpenRouter is a gateway, not the model creator. Its model catalog is dynamic,
// so routed models are intentionally represented in the runtime picker rather
// than duplicated as provider-owned catalog rows.
export const llms = providerContext.defineLlms([]);
