# Promo audio — हिन्दी (`hi`)

Spoken examples for the intro sheet.

Each language ships one clip as a store-hosted asset pack — Background
Assets on iOS, Play Asset Delivery on Android — fetched only when a user
asks to hear it. See
[`src/services/introAssetPacks/SPEC.md`](../../src/services/introAssetPacks/SPEC.md).

The first five prompts were each answered by a different frontier model, so
the set demonstrates range rather than one vendor. The sixth is written for
the app and is the one that ships in the intro sheet.

Conventions that matter once this is spoken aloud:

- The product name is **Mr Broccoli**, never "Mr. Broccoli". The period
  creates an unwanted pause in speech.
- Text is written for the ear: no lists, no markup, nothing that reads oddly
  when read out.
- Recordings are generated from the approved text here. Audio is invisible to
  a diff, so a mistranslation inside a clip cannot be caught by reading one —
  this file is where the wording gets reviewed.
- Word counts are not comparable across languages. Turkish and the Slavic
  languages say the same thing in far fewer, longer words than English; Hindi
  and Urdu in more. Match the spoken **duration** of the other clips, not the
  count — and do not pad a text to hit a number.

---

## 1. Electricity

**Model:** OpenAI `gpt-5.6-sol`

**Prompt**

> समझाओ कि बिजली असल में पावर स्टेशन से मेरी रसोई तक कैसे पहुँचती है।

**Answer**

_Not generated yet._

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> मैं लगातार नए काम शुरू करता हूँ और कभी पूरे नहीं करता। ऐसा क्यों होता है, और सच में क्या मदद करता है?

**Answer**

_Not generated yet._

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> मुझे ज़्यादा तनख़्वाह वाली नौकरी मिली है, लेकिन दोस्तों से दूर जाना पड़ेगा। इस पर सोचने में मेरी मदद करो।

**Answer**

_Not generated yet._

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> आज रात मैं छह लोगों के लिए खाना बना रहा हूँ, और उनमें से एक दूध से बनी चीज़ें नहीं खाता। मेरे साथ सोचो कि क्या बनाऊँ।

**Answer**

_Not generated yet._

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> कुछ भाषाओं में एक ही चीज़ के लिए इतने सारे शब्द क्यों होते हैं?

**Answer**

_Not generated yet._

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** ElevenLabs `Eleven v3` — this is the clip the intro sheet plays.

**Prompt**

> यह ऐप असल में काम कैसे करता है?

**Answer** (517 words)

तुम बोलते हो, और Mr Broccoli जो तुमने कहा उसे टेक्स्ट में बदलता है, उसे उस मॉडल के पास भेजता है जो तुमने चुना, और फिर जवाब तुम्हें पढ़कर सुनाता है। पूरा चक्र बस इतना ही है। फ़र्क़ यह है कि बीच में क्या रहेगा, यह तुम तय करते हो, और उस फ़ैसले की कोई बात तुमसे छिपाई नहीं जाती।

इसे चलाने के तीन तरीक़े हैं, और ये सचमुच अलग-अलग समझौते हैं, एक ही चीज़ के स्तर नहीं।

पहला यह कि किसी ऐसे प्रोवाइडर की कुंजी इस्तेमाल करो जो तुम्हारे पास पहले से है: OpenAI, Anthropic, Google और कई और। तुम्हें उनके सबसे अच्छे मॉडल मिलते हैं, वही जो उनके अपने ऐप में मिलते, और जो तुम इस्तेमाल करते हो उसका भुगतान सीधे उन्हीं को करते हो। Mr Broccoli उस पैसे को कभी नहीं छूता और उस पर कुछ जोड़ता भी नहीं।

दूसरा यह कि ऐसे मॉडल डाउनलोड करो जो पूरी तरह इसी फ़ोन पर चलते हैं। पहली बार इसमें कुछ समय लगता है और जगह चाहिए, लेकिन उसके बाद इसका कोई ख़र्च नहीं और यह बिना सिग्नल के भी चलता है: हवाई जहाज़ में, मेट्रो में, कहीं भी। ये मॉडल ऑनलाइन वालों से छोटे हैं, इसलिए मुश्किल तर्क में कमज़ोर हैं। ऐप तुम्हें यह साफ़ बता देता है, इसके उलट दिखाने की कोशिश नहीं करता।

तीसरा बस वही आवाज़ है जो तुम्हारे फ़ोन में पहले से है, और इंस्टॉल करते ही काम करती है।

तुम इन्हें मिला भी सकते हो। कोई शीर्ष मॉडल सोचे, और तुम्हारे अपने फ़ोन की आवाज़ पढ़कर सुनाए। या कोई स्थानीय मॉडल एक बढ़िया आवाज़ के साथ। सोचना और बोलना अलग फ़ैसले हैं।

निजता के बारे में, सुविधाजनक बात के बजाय सटीक बात यह है। तुम्हारी बातचीत इसी डिवाइस पर रहती है, और Mr Broccoli का कोई सर्वर कहीं नहीं है। कोई खाता नहीं, कोई सिंक नहीं, कुछ ऐसा नहीं जो लीक हो सके। लेकिन जब तुम ऑनलाइन मॉडल इस्तेमाल करते हो, तो जो तुम कहते हो वह उस प्रोवाइडर तक जाता है, उसकी शर्तों पर, ठीक वैसे ही जैसे उसके अपने ऐप में जाता। यह ऐप जिसकी गारंटी देता है वह यह है कि वह वहीं जाता है और कहीं और नहीं, और यह कि हर एक संदेश पर तुम देख सकते हो कि किस रास्ते ने उसका जवाब दिया।

आख़िरी बात जो जानने लायक़ है: Mr Broccoli तेज़ होने से ज़्यादा सही होने को चुनता है। ज़्यादातर वॉइस असिस्टेंट चुपचाप तुम्हें कमज़ोर मॉडल पर भेज देते हैं ताकि जवाब जल्दी आए, और तुम्हें कभी पता नहीं चलता। यह ऐसा नहीं करता। अगर तुम सोचा-समझा जवाब माँगोगे, तो यह उतना समय लेगा जितना ऐसे जवाब को चाहिए, और इस दौरान दिखाता रहेगा कि वह क्या कर रहा है: सोच रहा है, खोज रहा है, बोल रहा है। ख़ामोशी और घूमते हुए गोले के बजाय। तुम जब चाहो रोक सकते हो। और वही सवाल दोबारा किसी दूसरे मॉडल से पूछकर दोनों जवाबों की तुलना भी कर सकते हो।

और इनमें से कुछ भी बँधा हुआ नहीं है। तुम प्रोवाइडर, मॉडल या आवाज़ कभी भी बदल सकते हो, बातचीत के बीच में भी, और बातचीत नए विकल्प के साथ बस चलती रहती है।

---
