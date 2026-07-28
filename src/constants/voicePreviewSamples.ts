import { TtsListenLanguage } from "../types";

export const PROVIDER_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE: Record<
  TtsListenLanguage,
  string
> = {
  en: "Good morning! Beyond the quiet station, rain taps softly on the windows while the city wakes. At 7:45, Mr Broccoli calmly explains why bright ideas, curious questions, and the occasional ridiculous joke make a long conversation worth hearing.",
  de: "Guten Morgen! Zwischen grünen Hügeln fährt die Straßenbahn pünktlich über die große Brücke. Während draußen Vögel zwitschern, erklärt Mr. Brokkoli ruhig und präzise, warum zwölf frische Brötchen besser klingen als ein nüchterner Testton.",
  uk: "Доброго ранку! Тихий дощ легко стукає у вікна, поки місто прокидається. О сьомій сорок п’ять Пан Броколі спокійно пояснює, чому яскраві ідеї, допитливі запитання та несподіваний жарт роблять довгу розмову приємною для слуху.",
  "zh-CN": "早上好！清晨的雨轻轻敲着窗户，城市慢慢醒来。七点四十五分，西兰花先生平静地聊起明亮的想法、好奇的问题，还有偶尔冒出来的荒唐笑话，让你听听这段声音在长句中的节奏和温度。",
  es: "¡Buenos días! La lluvia golpea suavemente las ventanas mientras la ciudad despierta. A las siete y cuarenta y cinco, Mr Broccoli explica con calma por qué las ideas brillantes, las preguntas curiosas y algún chiste absurdo hacen que una conversación larga merezca la pena.",
  pt: "Bom dia! A chuva toca de leve nas janelas enquanto a cidade desperta. Às sete e quarenta e cinco, Mr Broccoli explica com calma por que ideias brilhantes, perguntas curiosas e uma piada inesperada tornam uma conversa longa mais agradável de ouvir.",
  "pt-BR": "Bom dia! A chuva toca suavemente as janelas enquanto a cidade acorda. Às sete e quarenta e cinco, Sr. Brócolis explica com calma por que ideias brilhantes, perguntas curiosas e uma piada inesperada tornam uma conversa longa agradável de ouvir.",
  hi: "सुप्रभात! सुबह की हल्की बारिश खिड़कियों पर दस्तक दे रही है और शहर धीरे-धीरे जाग रहा है। सात बजकर पैंतालीस मिनट पर, Mr Broccoli शांत आवाज़ में बताता है कि अच्छे विचार, जिज्ञासु सवाल और कभी-कभी कोई मज़ेदार बात लंबी बातचीत को सुनने लायक क्यों बनाते हैं।",
  fr: "Bonjour ! La pluie tambourine doucement aux fenêtres pendant que la ville s’éveille. À sept heures quarante-cinq, Mr Broccoli explique calmement pourquoi les idées lumineuses, les questions curieuses et une plaisanterie inattendue rendent une longue conversation agréable à écouter.",
  it: "Buongiorno! La pioggia picchietta piano sui vetri mentre la città si sveglia. Alle sette e quarantacinque, Mr Broccoli spiega con calma perché le idee brillanti, le domande curiose e una battuta inaspettata rendono piacevole anche una lunga conversazione.",
  ru: "Доброе утро! Тихий дождь мягко стучит по окнам, пока город просыпается. В семь сорок пять Мистер Брокколи спокойно объясняет, почему яркие идеи, любопытные вопросы и неожиданная шутка делают долгий разговор приятным для слуха.",
  ar: "صباح الخير! يطرق المطر الهادئ النوافذ برفق بينما تستيقظ المدينة. عند السابعة وخمس وأربعين دقيقة يشرح السيد بروكلي بهدوء لماذا تجعل الأفكار المضيئة والأسئلة الفضولية والمزحة المفاجئة المحادثة الطويلة ممتعة للاستماع.",
  ja: "おはようございます。静かな雨が窓をたたき、街がゆっくり目を覚まします。7時45分、Mr Broccoliは、ひらめきや素朴な疑問、ときどき交じる意外な冗談が、長い会話を楽しくする理由を落ち着いて話します。",
};

export const LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE: Record<
  TtsListenLanguage,
  string
> = {
  en: "Hello. This is a longer local voice preview for Mr Broccoli, spoken slowly enough that you can hear how clear the pronunciation is and whether the rhythm feels natural for a full conversation. If this voice sounds pleasant over these two sentences, it will usually also feel comfortable when the app reads longer replies aloud.",
  de: "Hallo. Dies ist eine längere lokale Stimmprobe für Mr. Brokkoli, damit du hören kannst, wie klar die Aussprache ist und ob die Stimme auch über mehrere Sätze hinweg angenehm klingt. Wenn sich diese Stimme hier ruhig und natürlich anhört, passt sie in der Regel auch gut für größere Antworten im Alltag.",
  uk: "Вітаю. Це довший локальний попередній перегляд голосу для Пана Броколі, щоб ви могли почути, наскільки чіткою є вимова і чи природно звучить ритм у кількох реченнях поспіль. Якщо цей голос звучить спокійно й приємно, він зазвичай добре підходить і для довших відповідей.",
  "zh-CN": "你好。这是一段较长的本地语音预览，用来帮助你判断这条声音是否清晰、自然，并且适合在日常对话里连续收听更长的回答。如果这两句话听起来稳定又舒服，那么它通常也适合让应用朗读完整回复。",
  es: "Hola. Esta es una muestra local de voz más larga para que puedas escuchar con calma si la pronunciación es clara y si el ritmo suena natural durante varias frases seguidas. Si esta voz te parece agradable en estas dos oraciones, normalmente también funcionará bien para respuestas más largas dentro de la aplicación.",
  pt: "Olá. Esta é uma amostra local de voz mais longa para que você possa perceber com calma se a pronúncia está clara e se o ritmo parece natural ao longo de várias frases. Se esta voz soar agradável nestas duas frases, normalmente também será uma boa escolha para respostas mais longas no aplicativo.",
  "pt-BR": "Olá. Esta é uma amostra local de voz mais longa para que você possa perceber com calma se a pronúncia está clara e se o ritmo soa natural ao longo de várias frases. Se esta voz parecer agradável nestas duas frases, ela normalmente também será uma boa escolha para respostas mais longas no aplicativo.",
  hi: "नमस्ते। यह स्थानीय आवाज़ का थोड़ा लंबा पूर्वावलोकन है, ताकि आप सुन सकें कि उच्चारण कितना साफ़ है और क्या यह आवाज़ कई वाक्यों तक स्वाभाविक और आरामदायक लगती है। अगर यह आवाज़ इन दो वाक्यों में संतुलित और सुखद लगे, तो आम तौर पर यह ऐप के लंबे उत्तर सुनने के लिए भी अच्छी रहेगी।",
  fr: "Bonjour. Voici un aperçu local plus long de la voix afin que vous puissiez entendre si la prononciation reste claire et si le rythme paraît naturel sur plusieurs phrases d'affilée. Si cette voix vous semble agréable sur ces deux phrases, elle conviendra en général aussi pour des réponses plus longues dans l'application.",
  it: "Ciao. Questa e una prova locale della voce un po' piu lunga, cosi puoi capire se la pronuncia e chiara e se il ritmo rimane naturale anche per piu frasi consecutive. Se questa voce ti sembra piacevole in queste due frasi, di solito sara una buona scelta anche per risposte piu lunghe nell'app.",
  ru: "Здравствуйте. Это более длинный локальный пример голоса для Мистера Брокколи, чтобы вы могли оценить чёткость произношения и естественность ритма в нескольких предложениях подряд. Если этот голос звучит спокойно и приятно, он обычно хорошо подходит и для более длинных ответов.",
  ar: "مرحباً. هذه معاينة محلية أطول لصوت السيد بروكلي، حتى تتمكن من سماع مدى وضوح النطق وما إذا كان الإيقاع طبيعياً عبر عدة جمل متتالية. إذا بدا هذا الصوت هادئاً ومريحاً هنا، فعادةً ما يكون مناسباً أيضاً لقراءة الردود الأطول.",
  ja: "こんにちは。これは少し長めのローカル音声プレビューで、発音の明瞭さや、複数の文を続けて聞いたときに自然に感じられるかどうかを確かめるためのものです。ここで落ち着いて聞こえる声であれば、アプリが長めの返答を読み上げる場合にもたいてい快適に使えます。",
};

export function getNativePreviewSampleText(language: TtsListenLanguage) {
  return LOCAL_PREVIEW_SAMPLE_TEXT_BY_LANGUAGE[language];
}
