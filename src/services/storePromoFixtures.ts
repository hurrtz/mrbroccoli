import AsyncStorage from "@react-native-async-storage/async-storage";

import { APP_LANGUAGES, type AppLanguage } from "../i18n/localeRegistry";
import {
  buildConversationMetaFromConversation,
  sortConversationMeta,
} from "../hooks/conversations/meta";
import { persistActiveConversationId } from "../hooks/conversations/storage";
import { relativizeConversationImageAttachmentUris } from "./imageAttachmentFiles";
import { replaceAllConversationRows } from "./conversationStore";
import { toPublicSettings } from "../hooks/settings/storage";
import { STORAGE_KEY } from "../hooks/settings/types";
import {
  DEFAULT_SETTINGS,
  type Conversation,
  type Message,
  type Settings,
} from "../types";
import { getApplicationId } from "./debugRuntimeContext";
import {
  isStorePromoApplicationId,
  STORE_PROMO_ORB_STORAGE_KEY,
  STORE_PROMO_SCENE_STORAGE_KEY,
  type StorePromoOrbPresentation,
  type StorePromoScene,
} from "./storePromoPresentation";

const STORE_PROMO_FIXTURE_NOW_MS = Date.parse("2026-08-05T06:09:00.000Z");

export const STORE_PROMO_FIXTURE_MARKER_KEY =
  "@mrbroccoli/store-promo-fixture-locale";

export const STORE_PROMO_COLOR_SCHEMES = ["light", "dark"] as const;
export type StorePromoColorScheme =
  (typeof STORE_PROMO_COLOR_SCHEMES)[number];

type StorePromoCopy = {
  rootTitle: string;
  openingPrompt: string;
  openingReply: string;
  followUpPrompt: string;
  followUpReply: string;
  branchTitle: string;
  branchPrompt: string;
  branchReply: string;
  recentTitle: string;
  recentPrompt: string;
  recentReply: string;
};

const COPY: Record<AppLanguage, StorePromoCopy> = {
  en: {
    rootTitle: "A relaxed day in Berlin",
    openingPrompt:
      "Plan a relaxed day in Berlin with good food and as little travel as possible.",
    openingReply:
      "Start with breakfast in Kreuzberg, walk along the Landwehr Canal, and spend the afternoon around Museum Island. Everything stays close and easy to reach.",
    followUpPrompt: "What would you change if it rains?",
    followUpReply:
      "Move Museum Island to the morning, have lunch nearby, and finish with a quiet café or a concert. The route stays compact and mostly indoors.",
    branchTitle: "Sunny-day alternative",
    branchPrompt:
      "Change the plan for sunny weather and include more time outdoors.",
    branchReply:
      "Begin at Tempelhofer Feld, follow the canal toward Kreuzberg, and end with an evening picnic in the Tiergarten.",
    recentTitle: "Weekend ideas",
    recentPrompt: "Give me three calm ideas for the weekend.",
    recentReply:
      "Try a lakeside walk, a neighborhood market, or an afternoon with a book in a quiet café.",
  },
  de: {
    rootTitle: "Ein entspannter Tag in Berlin",
    openingPrompt:
      "Plane einen entspannten Tag in Berlin mit gutem Essen und möglichst kurzen Wegen.",
    openingReply:
      "Beginne mit einem Frühstück in Kreuzberg, spaziere am Landwehrkanal entlang und verbringe den Nachmittag rund um die Museumsinsel. Alles liegt nah beieinander und ist bequem erreichbar.",
    followUpPrompt: "Was würdest du ändern, wenn es regnet?",
    followUpReply:
      "Besuche die Museumsinsel am Vormittag, iss in der Nähe zu Mittag und beende den Tag in einem ruhigen Café oder bei einem Konzert. Die Strecke bleibt kurz und größtenteils überdacht.",
    branchTitle: "Alternative für sonniges Wetter",
    branchPrompt:
      "Passe den Plan an sonniges Wetter an und plane mehr Zeit im Freien ein.",
    branchReply:
      "Starte auf dem Tempelhofer Feld, folge dem Kanal in Richtung Kreuzberg und beende den Tag mit einem Picknick im Tiergarten.",
    recentTitle: "Ideen fürs Wochenende",
    recentPrompt: "Nenne mir drei ruhige Ideen für das Wochenende.",
    recentReply:
      "Wie wäre es mit einem Spaziergang am See, einem Markt im Kiez oder einem Nachmittag mit einem Buch in einem ruhigen Café?",
  },
  uk: {
    rootTitle: "Спокійний день у Берліні",
    openingPrompt:
      "Сплануй спокійний день у Берліні зі смачною їжею та якомога коротшими переїздами.",
    openingReply:
      "Почни зі сніданку в Кройцберзі, прогуляйся вздовж Ландвер-каналу й проведи пообідній час біля Музейного острова. Усе розташовано поруч і легко доступне.",
    followUpPrompt: "Що варто змінити, якщо йтиме дощ?",
    followUpReply:
      "Перенеси Музейний острів на ранок, пообідай неподалік і заверши день у затишній кавʼярні або на концерті. Маршрут залишиться коротким і переважно в приміщеннях.",
    branchTitle: "Варіант для сонячного дня",
    branchPrompt: "Зміни план для сонячної погоди й додай більше часу надворі.",
    branchReply:
      "Почни на Темпельгофер-Фельд, пройди вздовж каналу до Кройцберга й заверши день вечірнім пікніком у Тіргартені.",
    recentTitle: "Ідеї на вихідні",
    recentPrompt: "Запропонуй три спокійні ідеї на вихідні.",
    recentReply:
      "Спробуй прогулянку біля озера, районний ринок або пообідній час із книжкою в тихій кавʼярні.",
  },
  hi: {
    rootTitle: "बर्लिन में एक सुकून भरा दिन",
    openingPrompt:
      "अच्छे खाने और कम से कम यात्रा के साथ बर्लिन में एक सुकून भरा दिन तय करो।",
    openingReply:
      "क्रॉयज़बर्ग में नाश्ते से शुरुआत करें, लांडवेहर नहर के किनारे टहलें और दोपहर म्यूज़ियम आइलैंड के आसपास बिताएँ। सभी जगहें पास और आसानी से पहुँचने योग्य हैं।",
    followUpPrompt: "बारिश हो तो तुम क्या बदलोगे?",
    followUpReply:
      "सुबह म्यूज़ियम आइलैंड जाएँ, पास में दोपहर का खाना खाएँ और दिन किसी शांत कैफ़े या कॉन्सर्ट में समाप्त करें। रास्ता छोटा और अधिकतर अंदर रहेगा।",
    branchTitle: "धूप वाले दिन का विकल्प",
    branchPrompt: "धूप के मौसम के लिए योजना बदलो और बाहर अधिक समय रखो।",
    branchReply:
      "टेम्पेलहोफ़र फ़ेल्ड से शुरू करें, नहर के साथ क्रॉयज़बर्ग की ओर जाएँ और शाम टियरगार्टन में पिकनिक के साथ समाप्त करें।",
    recentTitle: "सप्ताहांत के विचार",
    recentPrompt: "सप्ताहांत के लिए तीन शांत सुझाव दो।",
    recentReply:
      "झील किनारे सैर, पड़ोस का बाज़ार या किसी शांत कैफ़े में किताब के साथ दोपहर आज़माएँ।",
  },
  es: {
    rootTitle: "Un día tranquilo en Berlín",
    openingPrompt:
      "Planea un día tranquilo en Berlín, con buena comida y desplazamientos cortos.",
    openingReply:
      "Empieza desayunando en Kreuzberg, pasea junto al canal Landwehr y pasa la tarde cerca de la Isla de los Museos. Todo queda cerca y es fácil de alcanzar.",
    followUpPrompt: "¿Qué cambiarías si llueve?",
    followUpReply:
      "Visita la Isla de los Museos por la mañana, come cerca y termina en una cafetería tranquila o en un concierto. La ruta seguirá siendo corta y casi toda a cubierto.",
    branchTitle: "Alternativa para un día soleado",
    branchPrompt:
      "Adapta el plan a un día soleado e incluye más tiempo al aire libre.",
    branchReply:
      "Empieza en Tempelhofer Feld, sigue el canal hacia Kreuzberg y termina con un pícnic al atardecer en Tiergarten.",
    recentTitle: "Ideas para el fin de semana",
    recentPrompt: "Dame tres ideas tranquilas para el fin de semana.",
    recentReply:
      "Prueba un paseo junto a un lago, un mercado de barrio o una tarde leyendo en una cafetería tranquila.",
  },
  fr: {
    rootTitle: "Une journée tranquille à Berlin",
    openingPrompt:
      "Prépare une journée tranquille à Berlin, avec de bons repas et peu de déplacements.",
    openingReply:
      "Commence par un petit-déjeuner à Kreuzberg, longe le canal Landwehr et passe l’après-midi autour de l’île aux Musées. Tout reste proche et facile d’accès.",
    followUpPrompt: "Que changerais-tu s’il pleut ?",
    followUpReply:
      "Visite l’île aux Musées le matin, déjeune à proximité et termine dans un café calme ou à un concert. Le parcours reste court et principalement à l’intérieur.",
    branchTitle: "Variante pour une journée ensoleillée",
    branchPrompt:
      "Adapte le programme au soleil et prévois davantage de temps dehors.",
    branchReply:
      "Commence à Tempelhofer Feld, suis le canal vers Kreuzberg et termine par un pique-nique en soirée dans le Tiergarten.",
    recentTitle: "Idées pour le week-end",
    recentPrompt: "Donne-moi trois idées tranquilles pour le week-end.",
    recentReply:
      "Essaie une promenade au bord d’un lac, un marché de quartier ou un après-midi de lecture dans un café calme.",
  },
  it: {
    rootTitle: "Una giornata tranquilla a Berlino",
    openingPrompt:
      "Organizza una giornata tranquilla a Berlino, con buon cibo e pochi spostamenti.",
    openingReply:
      "Inizia con una colazione a Kreuzberg, passeggia lungo il canale Landwehr e trascorri il pomeriggio vicino all’Isola dei Musei. Tutto rimane vicino e facile da raggiungere.",
    followUpPrompt: "Cosa cambieresti se piovesse?",
    followUpReply:
      "Visita l’Isola dei Musei al mattino, pranza nei dintorni e concludi in un caffè tranquillo o a un concerto. Il percorso resta breve e quasi tutto al coperto.",
    branchTitle: "Alternativa per una giornata di sole",
    branchPrompt:
      "Adatta il programma al sole e aggiungi più tempo all’aperto.",
    branchReply:
      "Inizia da Tempelhofer Feld, segui il canale verso Kreuzberg e termina con un picnic serale nel Tiergarten.",
    recentTitle: "Idee per il fine settimana",
    recentPrompt: "Dammi tre idee tranquille per il fine settimana.",
    recentReply:
      "Prova una passeggiata lungo un lago, un mercato di quartiere o un pomeriggio con un libro in un caffè tranquillo.",
  },
  pt: {
    rootTitle: "Um dia tranquilo em Berlim",
    openingPrompt:
      "Planeia um dia tranquilo em Berlim, com boa comida e poucas deslocações.",
    openingReply:
      "Começa com o pequeno-almoço em Kreuzberg, passeia junto ao canal Landwehr e passa a tarde perto da Ilha dos Museus. Tudo fica próximo e é fácil de alcançar.",
    followUpPrompt: "O que mudarias se chovesse?",
    followUpReply:
      "Visita a Ilha dos Museus de manhã, almoça por perto e termina num café tranquilo ou num concerto. O percurso continua curto e quase todo em espaços interiores.",
    branchTitle: "Alternativa para um dia de sol",
    branchPrompt:
      "Adapta o plano ao tempo soalheiro e inclui mais tempo ao ar livre.",
    branchReply:
      "Começa em Tempelhofer Feld, segue o canal em direção a Kreuzberg e termina com um piquenique ao fim da tarde no Tiergarten.",
    recentTitle: "Ideias para o fim de semana",
    recentPrompt: "Dá-me três ideias tranquilas para o fim de semana.",
    recentReply:
      "Experimenta um passeio junto a um lago, um mercado de bairro ou uma tarde com um livro num café tranquilo.",
  },
  "pt-BR": {
    rootTitle: "Um dia tranquilo em Berlim",
    openingPrompt:
      "Planeje um dia tranquilo em Berlim, com boa comida e poucos deslocamentos.",
    openingReply:
      "Comece com um café da manhã em Kreuzberg, caminhe pelo canal Landwehr e passe a tarde perto da Ilha dos Museus. Tudo fica próximo e é fácil de chegar.",
    followUpPrompt: "O que você mudaria se chovesse?",
    followUpReply:
      "Visite a Ilha dos Museus pela manhã, almoce por perto e termine em um café tranquilo ou em um concerto. O trajeto continua curto e quase todo em locais fechados.",
    branchTitle: "Alternativa para um dia de sol",
    branchPrompt:
      "Adapte o plano para um dia ensolarado e inclua mais tempo ao ar livre.",
    branchReply:
      "Comece em Tempelhofer Feld, siga o canal em direção a Kreuzberg e termine com um piquenique no fim da tarde no Tiergarten.",
    recentTitle: "Ideias para o fim de semana",
    recentPrompt: "Dê três ideias tranquilas para o fim de semana.",
    recentReply:
      "Experimente uma caminhada à beira de um lago, uma feira de bairro ou uma tarde com um livro em um café tranquilo.",
  },
  ru: {
    rootTitle: "Спокойный день в Берлине",
    openingPrompt:
      "Спланируй спокойный день в Берлине с хорошей едой и короткими переездами.",
    openingReply:
      "Начни с завтрака в Кройцберге, прогуляйся вдоль Ландвер-канала и проведи вторую половину дня у Музейного острова. Все места находятся рядом.",
    followUpPrompt: "Что изменить, если пойдёт дождь?",
    followUpReply:
      "Посети Музейный остров утром, пообедай неподалёку и заверши день в тихом кафе или на концерте. Маршрут останется коротким и почти полностью в помещении.",
    branchTitle: "Вариант для солнечного дня",
    branchPrompt:
      "Измени план для солнечной погоды и добавь больше времени на свежем воздухе.",
    branchReply:
      "Начни на Темпельхофер-Фельд, пройди вдоль канала к Кройцбергу и заверши день вечерним пикником в Тиргартене.",
    recentTitle: "Идеи на выходные",
    recentPrompt: "Предложи три спокойные идеи на выходные.",
    recentReply:
      "Попробуй прогулку у озера, районный рынок или день с книгой в тихом кафе.",
  },
  "zh-CN": {
    rootTitle: "在柏林度过轻松的一天",
    openingPrompt: "规划轻松的柏林一日行程，包含美食，并尽量减少路程。",
    openingReply:
      "先在克罗伊茨贝格吃早餐，沿兰德韦尔运河散步，下午游览博物馆岛。各处距离很近，前往也很方便。",
    followUpPrompt: "如果下雨，你会怎样调整？",
    followUpReply:
      "上午参观博物馆岛，在附近吃午餐，最后去安静的咖啡馆或听一场音乐会。路线依然紧凑，而且大部分时间都在室内。",
    branchTitle: "晴天方案",
    branchPrompt: "把行程改成适合晴天的版本，并增加户外时间。",
    branchReply:
      "从滕珀尔霍夫机场公园出发，沿运河前往克罗伊茨贝格，傍晚在蒂尔加滕公园野餐。",
    recentTitle: "周末灵感",
    recentPrompt: "给我三个轻松的周末建议。",
    recentReply: "可以去湖边散步、逛社区市集，或在安静的咖啡馆读一下午书。",
  },
  ar: {
    rootTitle: "يوم هادئ في برلين",
    openingPrompt:
      "خطط ليوم هادئ في برلين يتضمن طعامًا جيدًا وتنقلًا قصيرًا قدر الإمكان.",
    openingReply:
      "ابدأ بالإفطار في كرويتسبيرغ، ثم تنزّه بمحاذاة قناة لاندفير واقضِ فترة بعد الظهر قرب جزيرة المتاحف. جميع الأماكن قريبة ويسهل الوصول إليها.",
    followUpPrompt: "ماذا ستغيّر إذا هطل المطر؟",
    followUpReply:
      "زر جزيرة المتاحف صباحًا، وتناول الغداء في مكان قريب، ثم اختم اليوم في مقهى هادئ أو حفلة موسيقية. سيبقى المسار قصيرًا ومعظمه في أماكن مغلقة.",
    branchTitle: "خيار ليوم مشمس",
    branchPrompt: "عدّل الخطة لتناسب الطقس المشمس وأضف وقتًا أطول في الخارج.",
    branchReply:
      "ابدأ في تمبلهوفر فيلد، واتبع القناة باتجاه كرويتسبيرغ، ثم اختم اليوم بنزهة مسائية في تيرغارتن.",
    recentTitle: "أفكار لعطلة نهاية الأسبوع",
    recentPrompt: "اقترح ثلاث أفكار هادئة لعطلة نهاية الأسبوع.",
    recentReply:
      "جرّب نزهة بجانب بحيرة، أو سوقًا محليًا، أو قضاء فترة بعد الظهر مع كتاب في مقهى هادئ.",
  },
  ja: {
    rootTitle: "ベルリンで過ごす穏やかな一日",
    openingPrompt:
      "おいしい食事を楽しみながら、移動を少なくしたベルリンの穏やかな一日を計画して。",
    openingReply:
      "クロイツベルクで朝食をとり、ラントヴェーア運河を歩いて、午後は博物館島周辺で過ごしましょう。どこも近く、移動も簡単です。",
    followUpPrompt: "雨が降ったら、どのように変更する？",
    followUpReply:
      "午前中に博物館島を訪れ、近くで昼食をとり、静かなカフェかコンサートで一日を締めくくりましょう。移動は短く、ほとんど屋内です。",
    branchTitle: "晴れの日のプラン",
    branchPrompt: "晴れの日向けに変更して、屋外で過ごす時間を増やして。",
    branchReply:
      "テンペルホーファー・フェルトから始め、運河沿いにクロイツベルクへ向かい、夕方はティーアガルテンでピクニックを楽しみましょう。",
    recentTitle: "週末のアイデア",
    recentPrompt: "静かに過ごせる週末の案を三つ教えて。",
    recentReply:
      "湖畔の散歩、近所のマーケット、静かなカフェで本を読む午後がおすすめです。",
  },
  hu: {
    rootTitle: "Egy nyugodt nap Berlinben",
    openingPrompt:
      "Tervezz egy nyugodt napot Berlinben jó ételekkel és minél kevesebb utazással.",
    openingReply:
      "Kezdj reggelivel Kreuzbergben, sétálj a Landwehr-csatorna mentén, majd töltsd a délutánt a Múzeum-sziget környékén. Minden közel van és könnyen elérhető.",
    followUpPrompt: "Mit változtatnál, ha esne az eső?",
    followUpReply:
      "Délelőtt látogasd meg a Múzeum-szigetet, ebédelj a közelben, majd zárd a napot egy csendes kávézóban vagy koncerten. Az útvonal rövid és nagyrészt fedett marad.",
    branchTitle: "Napos időre szóló változat",
    branchPrompt:
      "Alakítsd át a tervet napos időre, és legyen benne több szabadtéri program.",
    branchReply:
      "Indulj a Tempelhofer Felden, kövesd a csatornát Kreuzberg felé, majd zárd a napot egy esti piknikkel a Tiergartenben.",
    recentTitle: "Hétvégi ötletek",
    recentPrompt: "Adj három nyugodt ötletet a hétvégére.",
    recentReply:
      "Próbálj ki egy tóparti sétát, egy környékbeli piacot vagy egy könyves délutánt egy csendes kávézóban.",
  },
  cs: {
    rootTitle: "Klidný den v Berlíně",
    openingPrompt:
      "Naplánuj klidný den v Berlíně s dobrým jídlem a co nejkratšími přesuny.",
    openingReply:
      "Začni snídaní v Kreuzbergu, projdi se podél Landwehrského kanálu a odpoledne strav v okolí Muzejního ostrova. Všechno je blízko a snadno dostupné.",
    followUpPrompt: "Co bys změnil, kdyby pršelo?",
    followUpReply:
      "Navštiv Muzejní ostrov dopoledne, dej si oběd poblíž a den zakonči v klidné kavárně nebo na koncertě. Trasa zůstane krátká a převážně uvnitř.",
    branchTitle: "Varianta pro slunečný den",
    branchPrompt: "Uprav plán pro slunečné počasí a přidej více času venku.",
    branchReply:
      "Začni na Tempelhofer Feld, pokračuj podél kanálu ke Kreuzbergu a den zakonči večerním piknikem v Tiergartenu.",
    recentTitle: "Nápady na víkend",
    recentPrompt: "Navrhni tři klidné nápady na víkend.",
    recentReply:
      "Zkus procházku u jezera, místní trh nebo odpoledne s knihou v klidné kavárně.",
  },
  pl: {
    rootTitle: "Spokojny dzień w Berlinie",
    openingPrompt:
      "Zaplanuj spokojny dzień w Berlinie z dobrym jedzeniem i możliwie krótkimi przejazdami.",
    openingReply:
      "Zacznij od śniadania w Kreuzbergu, przespaceruj się wzdłuż kanału Landwehr i spędź popołudnie w okolicy Wyspy Muzeów. Wszystko jest blisko i łatwo dostępne.",
    followUpPrompt: "Co zmienić, jeśli będzie padać?",
    followUpReply:
      "Odwiedź Wyspę Muzeów rano, zjedz obiad w pobliżu i zakończ dzień w spokojnej kawiarni lub na koncercie. Trasa pozostanie krótka i prawie w całości pod dachem.",
    branchTitle: "Wariant na słoneczny dzień",
    branchPrompt:
      "Dostosuj plan do słonecznej pogody i dodaj więcej czasu na świeżym powietrzu.",
    branchReply:
      "Zacznij na Tempelhofer Feld, idź wzdłuż kanału w stronę Kreuzbergu i zakończ dzień wieczornym piknikiem w Tiergartenie.",
    recentTitle: "Pomysły na weekend",
    recentPrompt: "Podaj trzy spokojne pomysły na weekend.",
    recentReply:
      "Wybierz spacer nad jeziorem, lokalny targ albo popołudnie z książką w spokojnej kawiarni.",
  },
  tr: {
    rootTitle: "Berlin’de sakin bir gün",
    openingPrompt:
      "İyi yemekler ve mümkün olduğunca kısa yolculuklarla Berlin’de sakin bir gün planla.",
    openingReply:
      "Kreuzberg’de kahvaltıyla başla, Landwehr Kanalı boyunca yürü ve öğleden sonrayı Müzeler Adası çevresinde geçir. Her yer birbirine yakın ve ulaşımı kolay.",
    followUpPrompt: "Yağmur yağarsa neyi değiştirirsin?",
    followUpReply:
      "Müzeler Adası’nı sabah ziyaret et, yakınlarda öğle yemeği ye ve günü sakin bir kafede ya da konserde bitir. Rota kısa ve büyük ölçüde kapalı alanlarda kalır.",
    branchTitle: "Güneşli gün alternatifi",
    branchPrompt:
      "Planı güneşli havaya göre değiştir ve dışarıda daha fazla zaman ekle.",
    branchReply:
      "Tempelhofer Feld’den başla, kanal boyunca Kreuzberg’e ilerle ve günü Tiergarten’de akşam pikniğiyle bitir.",
    recentTitle: "Hafta sonu fikirleri",
    recentPrompt: "Hafta sonu için üç sakin fikir ver.",
    recentReply:
      "Göl kenarında yürüyüş, mahalle pazarı veya sakin bir kafede kitapla geçirilen bir öğleden sonra deneyebilirsin.",
  },
  sv: {
    rootTitle: "En lugn dag i Berlin",
    openingPrompt:
      "Planera en lugn dag i Berlin med god mat och så korta resor som möjligt.",
    openingReply:
      "Börja med frukost i Kreuzberg, promenera längs Landwehrkanalen och tillbringa eftermiddagen kring Museiön. Allt ligger nära och är lätt att nå.",
    followUpPrompt: "Vad skulle du ändra om det regnar?",
    followUpReply:
      "Besök Museiön på morgonen, ät lunch i närheten och avsluta på ett lugnt kafé eller en konsert. Rutten förblir kort och till största delen inomhus.",
    branchTitle: "Alternativ för en solig dag",
    branchPrompt:
      "Anpassa planen för soligt väder och lägg in mer tid utomhus.",
    branchReply:
      "Börja på Tempelhofer Feld, följ kanalen mot Kreuzberg och avsluta dagen med en kvällspicknick i Tiergarten.",
    recentTitle: "Idéer för helgen",
    recentPrompt: "Ge mig tre lugna idéer för helgen.",
    recentReply:
      "Prova en promenad vid en sjö, en lokal marknad eller en eftermiddag med en bok på ett lugnt kafé.",
  },
  ur: {
    rootTitle: "برلن میں ایک پُرسکون دن",
    openingPrompt:
      "اچھے کھانے اور کم سے کم سفر کے ساتھ برلن میں ایک پُرسکون دن کا منصوبہ بنائیں۔",
    openingReply:
      "کروئٹس برگ میں ناشتے سے آغاز کریں، لینڈویئر نہر کے کنارے چہل قدمی کریں اور دوپہر میوزیم آئی لینڈ کے آس پاس گزاریں۔ تمام جگہیں قریب اور آسانی سے قابلِ رسائی ہیں۔",
    followUpPrompt: "اگر بارش ہو تو آپ کیا بدلیں گے؟",
    followUpReply:
      "صبح میوزیم آئی لینڈ جائیں، قریب دوپہر کا کھانا کھائیں اور دن کسی پُرسکون کیفے یا کنسرٹ میں ختم کریں۔ راستہ مختصر اور زیادہ تر اندر رہے گا۔",
    branchTitle: "دھوپ والے دن کا متبادل",
    branchPrompt:
      "منصوبے کو دھوپ کے موسم کے مطابق بدلیں اور باہر زیادہ وقت شامل کریں۔",
    branchReply:
      "ٹیمپل ہوفر فیلڈ سے آغاز کریں، نہر کے ساتھ کروئٹس برگ کی طرف جائیں اور شام ٹیرگارٹن میں پکنک کے ساتھ ختم کریں۔",
    recentTitle: "ہفتہ وار تعطیل کے خیالات",
    recentPrompt: "ہفتہ وار تعطیل کے لیے تین پُرسکون تجاویز دیں۔",
    recentReply:
      "جھیل کے کنارے چہل قدمی، محلے کی مارکیٹ یا کسی پُرسکون کیفے میں کتاب کے ساتھ دوپہر گزاریں۔",
  },
};

function usage(promptTokens: number, completionTokens: number) {
  return {
    kind: "reply" as const,
    source: "estimated" as const,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
  };
}

function message(
  value: Omit<Message, "timestamp"> & { timestampMs: number },
): Message {
  const { timestampMs, ...rest } = value;
  return { ...rest, timestamp: new Date(timestampMs).toISOString() };
}

export function isStorePromoLanguage(value: unknown): value is AppLanguage {
  return (
    typeof value === "string" && APP_LANGUAGES.includes(value as AppLanguage)
  );
}

export function isStorePromoColorScheme(
  value: unknown,
): value is StorePromoColorScheme {
  return (
    typeof value === "string" &&
    STORE_PROMO_COLOR_SCHEMES.includes(value as StorePromoColorScheme)
  );
}

export function buildStorePromoConversations(
  language: AppLanguage,
  nowMs = STORE_PROMO_FIXTURE_NOW_MS,
  includeUlraAudit = true,
) {
  const copy = COPY[language];
  const minute = 60_000;
  const sharedOpening = [
    message({
      id: "promo-user-1",
      role: "user",
      content: copy.openingPrompt,
      model: null,
      provider: null,
      timestampMs: nowMs - 18 * minute,
    }),
    message({
      id: "promo-assistant-1",
      role: "assistant",
      content: copy.openingReply,
      model: "gpt-5.6-sol",
      provider: "openai",
      usage: usage(184, 72),
      timestampMs: nowMs - 17 * minute,
    }),
  ];
  const root: Conversation = {
    id: "promo-root",
    title: copy.rootTitle,
    createdAt: new Date(nowMs - 20 * minute).toISOString(),
    updatedAt: new Date(nowMs - 4 * minute).toISOString(),
    messages: [
      ...sharedOpening,
      message({
        id: "promo-user-2",
        role: "user",
        content: copy.followUpPrompt,
        model: null,
        provider: null,
        timestampMs: nowMs - 6 * minute,
      }),
      message({
        id: "promo-assistant-2",
        role: "assistant",
        content: copy.followUpReply,
        model: "gpt-5.6-sol",
        provider: "openai",
        usage: usage(296, 96),
        metadata: includeUlraAudit
          ? {
              ulraMode: {
                convergenceReached: true,
                contributions: [
                  {
                    modeId: "mode-1",
                    model: "gpt-5.6-sol",
                    participant: 1,
                    provider: "openai",
                    round: 0,
                    usage: usage(142, 61),
                  },
                  {
                    modeId: "mode-2",
                    model: "claude-sonnet-5",
                    participant: 2,
                    provider: "anthropic",
                    round: 1,
                    reviewVerdict: "challenge",
                    usage: usage(158, 54),
                  },
                  {
                    modeId: "mode-3",
                    model: "gemini-3.6-flash",
                    participant: 3,
                    provider: "gemini",
                    round: 1,
                    reviewVerdict: "converged",
                    usage: usage(151, 49),
                  },
                ],
                estimatedIntermediateTokens: 515,
                failedCalls: 0,
                failures: [],
                retiredParticipants: 0,
                roundsCompleted: 2,
                roundsRequested: 2,
                successfulCalls: 3,
                synthesisContract: "evidence-ledger-v1",
                synthesisContributions: 3,
                synthesisEstimatedTokens: 515,
                synthesisOmittedContributions: 0,
              },
            }
          : undefined,
        timestampMs: nowMs - 4 * minute,
      }),
    ],
    contextSummary: copy.rootTitle,
    summarizedMessageCount: 2,
    knowledgeExcludedConversationIds: ["promo-branch"],
  };
  const branch: Conversation = {
    id: "promo-branch",
    title: copy.branchTitle,
    createdAt: new Date(nowMs - 3 * minute).toISOString(),
    updatedAt: new Date(nowMs - 1 * minute).toISOString(),
    messages: [
      ...sharedOpening,
      message({
        id: "promo-branch-user",
        role: "user",
        content: copy.branchPrompt,
        editedAt: new Date(nowMs - 3 * minute).toISOString(),
        model: null,
        provider: null,
        timestampMs: nowMs - 3 * minute,
      }),
      message({
        id: "promo-branch-assistant",
        role: "assistant",
        content: copy.branchReply,
        model: "claude-sonnet-5",
        provider: "anthropic",
        usage: usage(238, 78),
        timestampMs: nowMs - 1 * minute,
      }),
    ],
    branch: {
      rootConversationId: "promo-root",
      parentConversationId: "promo-root",
      parentMessageId: "promo-user-2",
      branchMessageId: "promo-branch-user",
      kind: "edited-prompt",
      createdAt: new Date(nowMs - 3 * minute).toISOString(),
    },
    knowledgeExcludedConversationIds: ["promo-root"],
  };
  const recent: Conversation = {
    id: "promo-recent",
    title: copy.recentTitle,
    createdAt: new Date(nowMs - 55 * minute).toISOString(),
    updatedAt: new Date(nowMs - 45 * minute).toISOString(),
    messages: [
      message({
        id: "promo-recent-user",
        role: "user",
        content: copy.recentPrompt,
        model: null,
        provider: null,
        timestampMs: nowMs - 55 * minute,
      }),
      message({
        id: "promo-recent-assistant",
        role: "assistant",
        content: copy.recentReply,
        model: "gemini-3.6-flash",
        provider: "gemini",
        usage: usage(92, 43),
        timestampMs: nowMs - 54 * minute,
      }),
    ],
  };

  return [root, branch, recent] as const;
}

export async function seedStorePromoFixture(
  language: AppLanguage,
  scene: StorePromoScene = "conversation",
  orb: StorePromoOrbPresentation | null = null,
  colorScheme: StorePromoColorScheme = "light",
) {
  const applicationId = await getApplicationId();
  if (!isStorePromoApplicationId(applicationId)) {
    return false;
  }

  // The previous run's conversations no longer need collecting: the fixture
  // replaces the whole table rather than deleting a list of keys.
  const storedSettingsRaw = await AsyncStorage.getItem(STORAGE_KEY);
  const storedSettings = storedSettingsRaw
    ? (JSON.parse(storedSettingsRaw) as Partial<Settings>)
    : {};
  const nextSettings: Settings = {
    ...DEFAULT_SETTINGS,
    ...storedSettings,
    apiKeys: DEFAULT_SETTINGS.apiKeys,
    language,
    activeResponseMode: "mode-1",
    responseModes: [
      {
        id: "mode-1",
        route: { provider: "openai", model: "gpt-5.6-sol" },
      },
      {
        id: "mode-2",
        route: { provider: "anthropic", model: "claude-sonnet-5" },
      },
      {
        id: "mode-3",
        route: { provider: "gemini", model: "gemini-3.6-flash" },
      },
    ],
    showDebugLogButton: false,
    spokenRepliesEnabled: false,
    theme: colorScheme,
    ulraModeActive: true,
    ulraModeEnabled: true,
    ulraModeWarningAcknowledged: true,
  };
  const conversations = buildStorePromoConversations(
    language,
    STORE_PROMO_FIXTURE_NOW_MS,
    true,
  );
  const metas = sortConversationMeta(
    conversations.map((conversation) =>
      buildConversationMetaFromConversation(conversation, {
        ...buildConversationMetaFromConversation(conversation),
        pinned: conversation.id === "promo-root",
      }),
    ),
  );
  const metaById = new Map(metas.map((meta) => [meta.id, meta] as const));

  // Conversations live in SQLite, so the fixture replaces the table wholesale
  // rather than clearing the previous run's AsyncStorage keys. Settings and the
  // promo markers stay in AsyncStorage.
  await AsyncStorage.multiSet([
    [STORAGE_KEY, JSON.stringify(toPublicSettings(nextSettings))],
    [STORE_PROMO_FIXTURE_MARKER_KEY, language],
    [STORE_PROMO_ORB_STORAGE_KEY, JSON.stringify(orb)],
    [STORE_PROMO_SCENE_STORAGE_KEY, scene],
  ]);
  await replaceAllConversationRows(
    conversations.map((conversation) => ({
      conversation,
      document: JSON.stringify(
        relativizeConversationImageAttachmentUris(conversation),
      ),
      meta:
        metaById.get(conversation.id) ??
        buildConversationMetaFromConversation(conversation),
    })),
  );
  await persistActiveConversationId("promo-root");

  return true;
}
