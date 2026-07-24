import { llms } from "./llms";
import { providerContext } from "./provider";
import { stt } from "./stt";
import { tts } from "./tts";

export default providerContext.document({
  llms,
  stt,
  tts,
});
