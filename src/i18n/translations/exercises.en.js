export const EXERCISE_TRANSLATIONS_EN = {
  'day1-ex1': {
    title: 'Step 1 — When does the trend change?',
    block: 'Trend / context',
    description: 'Identify the main direction by observing highs and lows.',
    chartMeta: {
      source: 'Qualitative chart',
      timeframe: '',
      instrument: '',
    },
    question: `
Observe the chart **from left to right. In the first part, the market builds a clear bullish structure.**

👀 This time focus mainly on the lows that compose the bullish trend.

Some are just internal swings, while others are the structural pillars of the bullish structure: they are the lows that, once formed, create new highs.

Ask yourself:

• **Are the main lows still forming progressively higher?**

• **Which lows are really supporting the bullish structure? Find the last low (in the bullish structure) from which a new high is formed: that is the low to consider.**

• **From that last low, imagine a horizontal line. At which point does price break and close below it?**

• **Goal**: identify the break point of that line (break level), which marks invalidation of the bullish structure and the transition to bearish.

👉 **Question**: looking at points 1, 2, and 3, at which point is the bullish structure invalidated and direction changes from bullish to bearish?`,
    answers: {
      A: 'Point 1',
      B: 'Point 2',
      C: 'Point 3',
    },
    feedback: `🟩 **Correct answer: Point 3.**

📈 The market is building a bullish trend because its main structural lows are forming progressively higher. As long as they are respected, the bullish structure remains valid.

👀 But not all lows have the same importance.

•**At points 1 and 2 (lows), price moves up, but does NOT create higher highs than previous ones.** The bullish structure is still not invalidated.

•👀**To find the invalidation point of the bullish structure:**

identify **the last structural low of the bullish phase**: it is the low from which price creates the last new high.

•🎯 **Then we reach Point 3.**

From that low we imagine a horizontal line (break level): this is the level that must not be broken for structure to remain bullish.

At Point 3, price breaks that level, i.e. a candle closes below it, and something different happens:

- the last low supporting the bullish structure is lost;

- the sequence of higher lows is invalidated;

- buyers can no longer sustain the previous structure.

•🔄 **At Point 3 the bullish structure is invalidated, then the bearish structure starts.**`,
  },
  'day1-ex2': {
    title: 'Step 2 — Zones to look for a long trade',
    block: 'Key zones',
    description: 'Find key zones where price reacted in the past.',
    chartMeta: {
      source: 'Qualitative chart',
      timeframe: '',
      instrument: '',
    },
    question: `**Here you analyze the same chart from Step 1.**

    
    **This is a qualitative chart: the candles are not shown here. Each colored zone is a simplified representation of the area that, on a real chart, would be defined by the high and low of a candle.**
  

Observe the chart **from left to right.** In the first part, the market is in a **bullish trend.**

💡**What is a zone in practical terms?**

It is a price area identified from the **extremes of a candle: vertically it includes the range between its high and low.**
On the chart we then **extend it to the right, over time, to observe what happens if price comes back to that range.**

In short: the zone stores that candle's price range and projects it forward.

👀 **Goal: understand on which lows it makes sense to look for a potentially interesting zone.**

💡 **A zone becomes interesting for a potential long trade when it is around a low from which price creates new higher highs, continuing the bullish structure.**

To recognize it:

• from that low, did price build a new high above the previous one?

• does the structure continue with progressively higher highs and lows?

• or has the bullish structure already been invalidated?

👉 **Question**: looking at zones 1, 2, 3 and 4, which are the correct zones where it makes sense to look for long trades?`,
    answers: {
      A: 'Zones 1 and 3',
      B: 'Zones 2 and 3',
      C: 'Zones 1 and 4',
      D: 'Zones 2 and 4',
    },
    feedback: `🟩 **Correct answer: Zones 1 and 3.**

•**Simple principle:**

👀 In a bullish trend, a **zone can become interesting for a potential long trade when it is around a low from which price resumes and continues bullish structure, creating a higher high than the previous one.**

•Zone 1 — correct

From this low, price resumes upward and builds a new higher high. The bullish structure continues: this is why Zone 1 is coherent for a potential long.

•Zone 2 — wrong

Price tries to resume from this low, but **fails to break the previous high.** It later falls and forms a lower low (🔴).

📌 We want to see that from that zone price is actually able to continue the bullish structure.

•Zone 3 — correct

From this low, price resumes and builds a new higher high, continuing the bullish structure. So Zone 3 is also coherent.

•Zone 4 — wrong

**Attention❗: the previous bullish structure had already been invalidated at 🔵 (🔵 is Point 3 found in Step 1), Zone 4 is after 🔵, so we are already in bearish trend.**

From this low, price does not build a higher high and then falls again.`,
  },
  'day1-ex3': {
    title: 'Step 3 — Where to enter inside the Step 2 zone',
    block: 'Trigger / Risk',
    description: 'Evaluate conditions that invalidate the scenario and residual risk.',
    chartMeta: {
      source: 'Qualitative chart',
      timeframe: '',
      instrument: '',
    },
    question: `**In Step 2 we identified Zone 1 as an interesting area** to look for a potential long trade.

Now we move to a **lower timeframe** to search for a possible entry point.

📌 Starting context:

• from Step 2: on the higher timeframe, Zone 1 is on a low that supports a bullish structure;

• on the **lower timeframe**, as you can see on the chart above, there is a **bearish structure.**

• **Goal: on the lower timeframe (shown in this chart), find confirmation of bullish trend resumption seen on the higher timeframe: the potential long entry** (trigger).

👀 Before answering, **ask yourself**:

• note: there is a bearish trend from left to right. Is price still forming lower highs and lower lows?

• which high keeps the bearish structure valid? i.e. what is the last high of the bearish structure?

• from that last high, imagine a horizontal level. At which point does price break it? That break is confirmation of structural change from bearish to bullish.

👉 **Question:** looking at points 1, 2 and 3, what is the best point to enter long?`,
    answers: {
      A: 'Point 1',
      B: 'Point 2',
      C: 'Point 3',
    },
    feedback: `🟩 **Correct answer: Point 3.**

**On the higher timeframe we identified Zone 1** as an area to look for a potential long.

•**Goal: now on the lower timeframe, find confirmation of bullish trend resumption observed on the higher timeframe.**

**We can see price is still forming a bearish structure.**

•Point 1 — too early

At Point 1 price is still falling and keeps making lower highs and lower lows.

Bearish structure is still valid: entering here would mean anticipating a possible reversal without confirmation.

•Point 2 — not enough

At Point 2 price breaks the horizontal line drawn from a high. But that high is not the last high of the bearish structure.

So bearish structure on the lower timeframe is not invalidated yet.

•Point 3 — confirmation

At Point 3 price breaks upward **the level drawn from the last high of the bearish structure (marked with 🔴).**

•🎯 So Point 3 is the trigger: **it confirms bullish resumption that was observed on the higher timeframe.**`,
  },
  'day2-ex1': {
    title: 'Step 4 — Which lows generate trend continuation?',
    block: 'Trend / context',
    description: 'Placeholder pending day-3 specific content.',
    chartMeta: {
      source: 'Qualitative charts',
      timeframe: '1 H',
      instrument: '',
    },
    question: `In this theoretical example the market is in a bullish trend.

•**Goal:** understand which lows can be considered truly structural and therefore points from which trend continuation starts.

**👀Important: the level of the previous high corresponds to the highest price reached, i.e. the tip of its wick.**

• Pay close attention to one detail: it is not enough for price to temporarily exceed a previous high with the candle wick. To confirm continuation we want **a candle to close above the previous high level.**

At points **a and b you see candle wicks**: carefully observe what is really exceeded and what is confirmed at close.

👉 **Question:** among lows 1, 2, 3 and 4, which ones correctly represent points from which bullish trend continuation starts?`,
    answers: {
      A: 'Lows 1 and 4',
      B: 'Lows 2 and 3',
      C: 'Lows 1, 2 and 3',
    },
    feedback: `🟩 Correct answer: Lows 2 and 3.

• Observe: yellow circles 🟡 mark points where close is confirmed above the previous high level.

•To recognize a structural low, it is not enough to see price react upward:

we must verify whether the next move actually exceeds and closes above the previous high level.

•**Low 1** may seem structural because at point “a” price temporarily exceeds the previous high level.

But only the wick exceeds it: the body does not close above that level. So **Low 1 is not a bullish structural low**.

•From **Low 2**, however, price resumes and creates a new high: here a candle closes above the previous high level.

This confirms **Low 2 supported a real bullish continuation**.

•The same happens with **Low 3**: the next move exceeds with close the previous structural high level, so this low is also valid.

•**Low 4** is not confirmed:

the move from that low does not exceed the previous high level, neither with wick nor with close. Later a new low forms, and that later move exceeds the level; therefore that later low becomes structural, not Low 4.`,
  },
  'day2-ex2': {
    title: 'Step 5 — Which zones confirm a bullish structure?',
    block: 'Key zones',
    description: 'Placeholder pending day-3 specific content.',
    chartMeta: {
      source: 'Qualitative charts',
      timeframe: '1 H',
      instrument: '',
    },
    question: `Let us revisit the same theoretical structure from the previous exercise.

This time you must identify the **zones to consider when looking for confirmation of bullish continuation.**

👀 **When does a zone become interesting for a long trade?** A zone is valid only if it starts from a low from which the market then creates a new higher high. **Also, for that new high to be confirmed, a candle must close above the previous high level.**

**It is not enough for price to exceed that level only with the wick. To confirm bullish continuation, the candle body must close above that level.**

👉 **Question:** among zones 1, 2, 3, 4 and 5, which can be considered valid to look for bullish trades?`,
    answers: {
      A: 'Zones 2, 3, 5',
      B: 'Zones 1, 3, 4',
      C: 'Zones 2, 4, 5',
    },
    feedback: `🟩 Correct answer: Zones 2, 3 and 5.

• Observe: yellow circles 🟡 indicate points where close is confirmed above the previous high level.

To consider a long zone valid, we must verify what happens after the low from which the zone originates: price must create a new high and a candle must close above the previous high level.

**Only then does that low become true support of bullish structure.**

**Zone 1:** same reasoning as previous exercise: from low 1 the market reacts, but the previous high level is broken only by wick. No candle closes above it, so **continuation is not confirmed.**

**Zone 2:** from low 2 price creates a new high and a candle closes above previous high level.

**Zone 3 is also valid for the same reason:** market resumes from there and confirms bullish continuation with a close above previous high level.

**Zone 4 is not valid:** as in point “b” of previous exercise, **it fails to exceed previous high.**

Finally, **Zone 5 is valid**, because from that low a move exceeds previous high level with a close above, confirming the low.`,
  },
  'day2-ex3': {
    title: 'Step 6 — Is there a valid trigger?',
    block: 'Trigger / Risk',
    description: 'Placeholder pending day-3 specific content.',
    chartMeta: {
      source: 'TradingView',
      timeframe: '5 min',
      instrument: '',
    },
    question: `**Step 4-5 recap:** on H1 timeframe we identified a bullish zone.

**Now we move to M5 timeframe.**

**Goal:** on M5 we look for confirmation of bullish resumption observed on H1: confirmation happens when, from a bearish trend, an M5 candle breaks and closes above the level of the last bearish structural high.

👀**Before searching for trigger:**

**Price can enter the zone and then move upward out of it: this does not invalidate the zone.**

**❗What you must verify is that, before trigger, the zone has not already been invalidated: i.e. at least one candle has not closed below its lower boundary.**

Ask yourself:

• we want the point where lower-timeframe bearish structure turns bullish again (the one shown in this chart), confirming possible continuation of the higher-timeframe bullish trend. What is the last high of the bearish structure?

• is the level from that last high broken by a candle closing above it?

• before that break (possible trigger), is there at least one candle **closing below the zone lower boundary?** If yes, then **zone is invalidated and trigger cannot be considered valid.**

👉 **Question:** which numbered candle on the chart represents a valid long trigger?`,
    answers: {
      A: 'Candle 1',
      B: 'Candle 2',
      C: 'Candle 3',
      D: 'Candle 4',
      E: 'None',
    },
    feedback: `🟩 Correct answer: None.

At first glance, some marked candles may look like valid confirmations because price later breaks structural highs on M5.

• Before evaluating trigger, we must check context: is the bullish zone identified on H1 still valid?

Looking at the chart, before M5 confirmation arrives there is a candle closing below the lower boundary of H1 zone. In our criterion, this close invalidates the zone.

From that moment, the reason for searching a long in that area no longer holds.

• Point 1, if we looked only at M5, would satisfy bullish confirmation criterion because it breaks with close above the previous structural high level.

**But that confirmation comes after H1 zone invalidation**, so it can no longer be used for this setup.

• **Even if at points 1, 2 and 4 price later shows bullish confirmations on M5, we cannot use them anymore for long entries**: before Point 1, a candle had already closed below H1 zone lower boundary, invalidating the setup. From then on, later M5 confirmations no longer belong to that zone.

Point 3, instead, is not yet bullish confirmation: price has not yet broken and closed above the level of the last structural high of the decline.`,
  },
  'day3-ex1': {
    title: 'Step 7 — How many times does structure become bearish?',
    block: 'Trend / context',
    description: 'Placeholder pending day-2 specific content.',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 H',
      instrument: 'Gold Spot / USD',
    },
    question: `Now we work on a **real chart**, so you will find more oscillations than in previous examples. To make reading easier, the main structure is already drawn.

•👀 Focus on **the lows that really support bullish trend:** **they are those from which the market later creates new highs compared to previous ones.**

**🧐Think carefully**: for a low to be confirmed as a bullish structural low, price must later create a new high, with **a candle closing above previous high level.**

•**Goal:** identify at which points structure shifts from bullish to bearish.

**Ask yourself:**

• **which lows support bullish structure? For each, verify: does the created high really close above previous high level? If not, that low does not become a new bullish structural reference.**

• **from those lows imagine a horizontal line: is there a candle that breaks it and closes below?**

• **how many times does structure move from bullish to bearish?**

👉 **Question:** looking at the entire chart, in how many points does structure really become bearish, even temporarily?`,
    answers: {
      A: '1 time',
      B: '2 times',
      C: '3 times',
      D: 'Never',
    },
    feedback: `🟩**Correct answer: 1 time.**

The chart contains several pullbacks, but that does not mean trend turns bearish every time.

•In the first part, focus on **the red low 🔴 supporting bullish structure.**

**From that point market creates a new higher high.** Later oscillations produce other lows,

but none of those creates another new high in turn: therefore they do not become dominant new structural lows.

_______

•**What about High 2?**

**For the low (🟡) generating High 2 to become a new bullish structural low, High 2 (a candle) must close above the light-blue line of High 1.**

•**What is High 1 level?**

It is the highest point reached by the candle (upper wick tip), **highlighted by the light-blue line.**

In this case, that does not happen.

Above High 1 new buying may appear, but selling pressure pushes price back below level: this is a **liquidity grab.**

**Consequence:**

Without a candle close above the light-blue line, **High 2 is not confirmed as a new high**, therefore the **low from which it started (🟡) does not become a new bullish structural low.**

_______

**As long as the level (orange line) set by low 🔴 remains intact, bullish structure is not invalidated.**

•At **point A market resumes and confirms bullish direction again.**

•Later we find **low 🔵**. This low is different: **from there, price actually creates new highs and becomes a new structural reference.**

🎯 **Afterward price breaks that low level and closes below it: bullish structure is invalidated and temporarily becomes bearish.**

The bearish phase does not last long: at **point B market recovers the upper structural level and turns bullish again.**`,
  },
  'day3-ex2': {
    title: 'Step 8 — Which zone is not valid?',
    block: 'Key zones',
    description: 'Placeholder pending day-2 specific content.',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 H',
      instrument: 'Gold Spot / USD',
    },
    question: `•**Goal:** compare the 4 zones (lows) marked on the chart and identify which one cannot be considered a **confirmed** structural low.

•👀 Observe what happens after each zone.

Remember what we said in previous exercises: a zone (here, a low) becomes important when from that point the market does something... do you remember what?

**Ask yourself:**

•** from which zones did a move start that was able to create new highs?**

•** which low truly supported trend continuation?**

•** is there one zone that, for now, has not produced this confirmation yet?**

👉 **Question:** which of the four marked zones cannot yet be considered a **confirmed** structural low?`,
    answers: {
      A: 'Zone 1',
      B: 'Zone 2',
      C: 'Zone 3',
      D: 'Zone 4',
    },
    feedback: `🟩 **Correct answer: Zone 4.**

To understand which zone is wrong, it is not enough to look at where price simply reacted.

We must verify what happened after that low.

•**Zones 1, 2 and 3 are valid** because from those lows the market later built **new highs above previous ones**. This shows those points really supported bullish structure and can be considered supporting lows.

•**Zone 4** is different.

At the moment shown on chart, **it has not yet created a high above the previous one.**

For this reason we still cannot know whether that low will really have a structural role or just be a temporary reaction.

•👀 **If later** market starts from Zone 4 and manages to exceed previous high, then that low can become a new valid reference.

📌 For now, however, **Zone 4 is not confirmed yet.**`,
  },
  'day3-ex3': {
    title: 'Step 9 — Which is the correct trigger on M1?',
    block: 'Trigger / Risk',
    description: 'Placeholder pending day-2 specific content.',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 min',
      instrument: 'Gold Spot / USD',
    },
    question: `**Step 7-8 recap:** in previous exercises we identified Zone 1 on H1 timeframe as an area coherent with bullish trend.

•**Now we go down to M1** and observe what happens when price enters that zone.

• **Goal: on lower timeframe, look for confirmation of bullish trend resumption seen on higher timeframe: potential long entry** (trigger).

👀 **Before searching trigger.**
The zone tells you where to start looking for a potential reaction, but trigger does not have to be strictly inside the zone. Price can enter zone and then move upward out of it.
What you need to verify is that before trigger the zone has not already been invalidated: i.e. no candle has closed below the **lower boundary of the zone**.

**Ask yourself**:

• **what is the last high that truly supports bearish structure?**

• **did that high produce new lows?**

• **which candle can break the level created by the last high (with a close above the level)?**

• before the identified trigger point, has any **candle closed below the lower zone boundary?**

👉** Question:** which of the marked candles is the most correct trigger for looking for a long entry?`,
    answers: {
      A: 'Candle 2',
      B: 'Candle 1',
      C: 'Candle 3',
    },
    feedback: `🟩 **Correct answer: Candle 1.**

•**Remember:** on higher timeframe we had already identified Zone 1 as the area to look for potential long trades.

•On M1, however, price enters the zone while still maintaining a bearish structure.

So it is not enough to see a simple reaction inside Zone 1: we must wait for this **bearish structure to be truly invalidated.**

•👀 **The level highlighted by orange line is the last bearish structural high on M1.**

It is important because after it formed, price kept dropping and made new **lows** (🔴). As long as that high is not broken, bearish structure remains valid.

•**🎯 Candle 1 is the first candle that breaks and closes above this level.**

**At that moment the previous M1 bearish trend is invalidated, confirming a possible bullish trend.**

•**Is setup valid?** In this case, before identified trigger point (Candle 1), no candle closed below the lower zone boundary, so zone has not been invalidated. This confirms setup can be used for entry.

•So we got what we were looking for:

- Correct trigger is Candle 1: first structural confirmation of realignment between lower and higher timeframe.

- price does not break below lower zone boundary, so long setup remains valid.

Candles 2 and 3 come **after structural change has already happened.**

🛡️ **Stop Loss: the most logical placement is below Zone 1, because that zone supports higher-timeframe bullish structure. If price breaks it downward, the main reason to keep the long trade is gone.**`,
  },
}
