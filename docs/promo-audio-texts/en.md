# Promo audio — English (`en`)

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

> Explain how electricity actually gets from a power station into my kitchen.

**Answer** (370 words)

At the power station, a generator converts mechanical energy into alternating-current electricity. Steam, falling water, wind, or a gas turbine spins magnets relative to coils of wire, creating an oscillating voltage, usually 50 or 60 times per second depending on the country.

A transformer then raises that voltage, often into the hundreds of thousands of volts. For the same amount of power, higher voltage means lower current, and lower current dramatically reduces heating losses in the wires. That high-voltage electricity travels across the transmission grid on large towers.

Near towns and cities, substations progressively lower the voltage. The local distribution network carries it along streets, and a nearby transformer reduces it again to the household supply voltage. Depending on where you live, that might be about 120 and 240 volts split-phase, or roughly 230 volts single-phase.

A service cable brings the supply into your home through the electricity meter and then into the main electrical panel. The panel contains breakers or fuses that divide the supply into separate circuits. One of those circuits runs to your kitchen outlets, lights, refrigerator, oven, or other appliances.

When you switch on a kettle, you complete a circuit. Alternating voltage creates an electric field through the wiring, causing electrons already present in the wires to oscillate back and forth. The energy is delivered through that electromagnetic field and converted by the kettle’s heating element into heat. The individual electrons do not race all the way from the power station to your kitchen; they move only tiny distances, while the electrical effect propagates through the network at a substantial fraction of the speed of light.

The current returns through the neutral conductor, completing the operating circuit. The protective earth or ground conductor normally carries no current; it provides a low-resistance safety path if a fault energizes a metal casing, allowing a breaker or residual-current device to disconnect the supply quickly.

Meanwhile, grid operators continuously balance generation with consumption. The instant you switch on the kettle, generators across the interconnected grid collectively supply slightly more power. So your kitchen is not usually connected to one identifiable power station. It is drawing energy from a synchronized network in which many generators and consumers all interact at once.

---

## 2. Unfinished projects

**Model:** Anthropic `claude-fable-5`

**Prompt**

> I keep starting projects and never finishing them. Why does that happen, and what actually helps?

**Answer** (481 words)

Oh, this is such a good question, and the answer is genuinely fascinating neuroscience: your brain rewards starting way more than finishing. Dopamine fires on anticipation, not delivery, so the ideation phase, where the project is pure possibility, is literally the neurochemical peak. Everything after that is a comedown.

Motivation across a project is basically U-shaped. There's a phenomenon called the goal gradient effect, where rats run faster as they approach food and people fill coffee punch cards faster near the end, because a visible finish line pulls you forward. The problem is the messy middle, where novelty is dead and the end is too far away to exert any pull. That's where projects go to die.

There's also an ego-protection layer. An unfinished project is infinitely promising, but a finished one can be judged. So bailing right before things get real is often perfectionism in disguise, protecting the fantasy version from contact with reality.

And here's the sneakiest part: planning itself partially delivers the reward. Gabriele Oettingen's research shows that vividly fantasizing about the finished outcome actually drains motivation, and related work on the Zeigarnik effect found that just making a detailed plan releases the mental tension of an unfinished task. So elaborate planning can feel like progress while quietly defusing the very itch that would have driven you to finish.

Now, what actually works. First, shrink scope brutally. The goal gradient only helps if the finish line is close enough to feel, so define a version one that's almost embarrassingly small and ship it. Completion is a muscle, and tiny finishes train it.

Second, implementation intentions, which is Peter Gollwitzer's if-then planning. Something like, when I sit down with coffee Saturday morning, I open chapter two. It has one of the strongest effect sizes in behavior change research because it moves the decision from willpower to a trigger.

Third, a work-in-progress limit of one, straight out of kanban. Pair it with an idea parking lot, a capture list for shiny new ideas. Writing them down satisfies the novelty itch without letting them hijack the current project.

Fourth, make progress visible. Teresa Amabile's progress principle found that small wins are the single biggest motivator in creative work, so keep a done list, not just a to-do list. And steal Hemingway's trick of stopping mid-sentence and leaving a breadcrumb, because most projects don't die in a dramatic quit. They die in a restart that never happens.

Last nuance: quitting isn't the enemy, drifting is. Some abandonment is healthy explore-exploit behavior, since early exits are cheap information. So set kill criteria up front, meaning you decide in advance what evidence would make you deliberately stop. That turns quitting into a portfolio decision instead of a slow guilty fade. And one caveat, if this pattern is lifelong and shows up everywhere, interest-based attention differences like ADHD are worth ruling out with a professional.

---

## 3. Job offer

**Model:** DeepSeek `deepseek-v4-pro`

**Prompt**

> I've been offered a job that pays more but means moving away from my friends. Help me think it through.

**Answer** (595 words)

Alright, let's geek out on this. You've got a classic multi-variable optimization problem here, with both quantifiable and fuzzy inputs. The first thing I'd do is calculate the real financial delta, because a raw salary bump can be wildly misleading. Factor in taxes at the new bracket, cost of living differences—use Numbeo or the MIT living wage calculator—plus the one-time moving friction and any recurring travel back to see friends. That will give you the actual discretionary income boost, which we can then turn into a "marginal utility" figure. If the raise is, say, twenty grand but gets chewed up by higher rent and flights, you might only net a few thousand, and that can totally reframe the decision. On the other hand, if it's a fifty percent jump in real terms, you're looking at a compound growth difference that, invested early, could shave years off your financial independence timeline. That's a serious option value.

Now let's talk social capital. You're not losing your friends, you're renegotiating the relationship architecture. Strong ties can absolutely survive distance if you deliberately migrate your rituals—think synchronous gaming sessions, a standing weekly video call, or co-watching something with Teleparty. The bigger hidden cost is the loss of "weak ties," those casual acquaintances who often provide serendipitous opportunities. But here's the counter: moving to a new city forces you to rebuild that loose network from scratch, which can actually accelerate your personal and professional growth because you're forced out of the local maximum your current social graph represents. It's a higher variance play, but often higher expected return.

Then there's the career trajectory itself. Is this just a salary bump, or does the role compound in other ways? A more prestigious company on your resume, a faster promotion track, exposure to a larger market or a niche technology? Those intangibles often have a far larger net present value than the immediate cash difference. Think of it as human capital arbitrage: you're moving to where your skills are priced higher and where you can acquire even more valuable skills. If you can model the next decade's earning potential in both paths, the delta might be enormous.

Don't ignore the emotional undercurrent either, but let's not treat it as unmeasurable. Try a regret minimization framework: project yourself to age eighty and ask which path leaves you with more "what if" weight. Is it the fear of losing those friendships or the fear of never knowing what that leap could have built? Often the pain of inaction outscores the pain of action because we adapt to new circumstances—a process called hedonic adaptation—but we never adapt to the lingering question of an untaken path.

One practical hack: build a simple decision tree with discounted cash flows and subjective probabilities for happiness. Assign rough utils to states like "lonely and rich" vs "happy and broke" and estimate how long each might last. You'll probably find the crossover point where the higher salary enables enough trips back and quality visits that the net happiness loss is minimal. And remember, decisions like this are partially reversible. If you move and hate it after eighteen months, you can often boomerang back, often with a higher title and salary to a remote or local role. The option to quit is itself a valuable asset.

Ultimately, lean into the fact that you're in an enviable position: you have two good options, both with positive expected value. Now it's about optimizing for the best mosaic of wealth, connection, and growth. What's your gut telling you when you strip away the noise?

---

## 4. Cooking

**Model:** Google `gemini-3.6-flash`

**Prompt**

> I'm cooking for six tonight and one of them doesn't eat dairy. Talk me through what to make.

**Answer** (403 words)

Hosting six people when someone is dairy-free is a fantastic opportunity to showcase techniques that build rich, velvety textures using pure physics and culinary chemistry, rather than relying on heavy cream or processed dairy substitutes. My go-to strategy here is a menu built around collagen breakdown, starch gelatinization, and stable lipid emulsions. Think slow-braised red wine beef short ribs over an ultra-silky parsnip and cauliflower puree, paired with a bright, bitter-greens and citrus salad. 

For the short ribs, you want bone-in English-cut ribs. Hard-sear them to maximize the Maillard reaction, then build a deeply aromatic base with a fine mirepoix and tomato paste. Deglaze with a full-bodied red wine like a Cabernet or Syrah, reducing it down to burn off the alcohol and concentrate the tartaric acid. When you submerge the meat in a rich bone stock and braise it at two hundred and seventy-five degrees Fahrenheit for three to four hours, the triple-helix collagen fibers in the connective tissue hydrolyze into gelatin. When you reduce that braising liquid at the end, that dissolved gelatin gives the sauce a lush, viscous body. Finish it by whisking in a finishing-grade extra virgin olive oil off the heat, which forms a glossy lipid emulsion that coats the palate identically to a traditional butter-mounted sauce.

The puree is where people usually fall into the butter and cream trap, but you can achieve incredible mouthfeel through mechanical breakdown and starch suspensions. Roast parsnips and cauliflower until tender, which concentrates their natural sugars through caramelization while softening their pectin walls. Process them hot in a high-speed blender with a bit of the simmering water and a warm garlic-infused olive oil. The sheer force from the blender shears the cellular material, releasing soluble fibers and starches that trap the fat droplets in a stable emulsion. It ends up shockingly smooth, rich, and naturally sweet, perfectly complementing the savory depth of the beef.

To cut through all those heavy lipids and rich gelatin, you need sharp acidity and structural crunch. A shaved fennel and blood orange salad tossed with radicchio and a bright champagne vinegar dressing provides the perfect contrast. The anthocyanins and citric acid from the oranges reset the palate between bites, while the anise notes of the fennel harmonize with the red wine reduction. You can pull this whole meal off ahead of time, meaning you actually get to enjoy your guests instead of stressing over the stove.

---

## 5. Words for the same thing

**Model:** xAI `grok-4.5`

**Prompt**

> Why do some languages have so many words for the same thing?

**Answer** (481 words)

Oh, this is one of my absolute favorite rabbit holes in linguistics.

The short version is that languages almost never have truly identical words for the exact same thing. What looks like a pile of synonyms usually carries subtle differences in shade, formality, emotion, region, or the company those words keep.

English is a spectacular example because it has been a sponge for centuries. It started with a Germanic core, then got flooded with Norman French after 1066, then soaked up Latin and Greek for science, law, and fancy writing, plus bits from everywhere else through trade and empire. So you end up with pairs or triples like ask, question, and interrogate, or kingly, royal, and regal. Same basic idea, totally different flavor and register.

Culture and environment crank this up hard. When a society cares deeply about something, the lexicon elaborates. Arabic famously has a huge vocabulary around camels, desert life, and different kinds of sand or wind, not because people were bored but because those distinctions mattered for survival and poetry. Same story with Japanese rain words, or the many precise terms for snow and ice conditions in various Inuit languages. The old “hundred words for snow” claim is overstated and oversimplified, but the underlying principle is real: domains of cultural importance get dense lexical packing.

Morphology plays a huge role too. Some languages generate related words almost automatically through roots and patterns or compounding. Semitic languages can spin out families of words from a three-consonant root. Highly synthetic languages can pack nuance into single complex words that English would need a whole phrase for. English itself loves compounding and derivation, so you get fresh shades without inventing brand-new roots.

Then there’s contact, dialect mixing, and literary tradition. When dialects or neighboring languages mash together, variants stick around as stylistic options. Poets and writers hate repeating the same word, so they cultivate elegant variation. Taboo and euphemism cycles keep inventing softer or sharper replacements for the same concept, especially around death, sex, bodily functions, or status. Over centuries that piles up.

There’s also just historical accident and layering. Words drift in meaning, old ones hang on in fixed expressions or specialized niches, and new borrowings arrive before the old ones fully die. Perfect synonyms are unstable; one usually specializes, becomes archaic, or picks up attitude.

The tradeoff is fascinating. A rich synonym set gives you precision, style, humor, and social signaling. You can sound clinical, poetic, slangy, or archaic on purpose. But it makes the language heavier to learn and can create ambiguity for outsiders. Languages with tighter vocabularies often lean harder on context, tone, compounding, or grammar to do the same work. Neither is better; they just solve the problem of meaning differently.

What looks like wasteful redundancy is usually a living map of history, contact, culture, and the endless human urge to draw finer lines around experience.

---

## 6. How the app works

**Model:** written for this app, not model-generated

**Voiced by:** ElevenLabs `Eleven v3` — this is the clip the intro sheet plays.

**Prompt**

> How does this application work?

**Answer** (469 words)

When you speak, Mr Broccoli turns what you said into text, sends it to the model you picked, and reads the answer back to you. That is the whole loop. What makes it different is that you choose what sits in the middle, and nothing about that choice is hidden from you.

There are three ways to power it, and they are genuinely different trades rather than tiers of the same thing.

The first is to use a key from a provider you already have — OpenAI, Anthropic, Google, and several others. You get their best models, the same ones you would get in their own apps, and you pay them directly for what you use. Mr Broccoli never touches that money and never marks it up.

The second is to download models that run entirely on this phone. That takes a while the first time and some storage, but afterwards it costs nothing at all and works with no signal — on a plane, underground, anywhere at all. These models are smaller than the hosted ones, so they are less capable on hard reasoning. The app tells you that rather than pretending otherwise.

The third is simply the voice your phone already has, which works from the moment you install.

You can mix them. A frontier model doing the thinking, with your phone's own voice reading it out. Or a local model with a premium voice. Thinking and speaking are separate choices.

On privacy, here is the precise version rather than the comfortable one. Your conversations are stored on this device, and there is no Mr Broccoli server anywhere. No account, no sync, nothing to breach. But when you use a hosted model, what you say goes to that provider, under their terms, exactly as it would in their own app. What this app guarantees is that it goes there and nowhere else, and that you can see which route answered every single message.

The last thing worth knowing is that Mr Broccoli would rather be right than fast. Most voice assistants quietly switch you to a weaker model so the reply arrives quickly, and you never find out it happened. This one does not. If you ask for a considered answer, it takes the time a considered answer takes, and it shows you what it is doing while it does it — thinking, searching, speaking — instead of leaving you with silence and a spinner. You can interrupt whenever you want. You can also ask the same question again on a different model and compare the two side by side.

And none of it is locked in. You can change the provider, the model, or the voice at any time, even in the middle of a conversation, and the conversation simply carries on with the new one.

---
