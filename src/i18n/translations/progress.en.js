export const DEFAULT_PROGRESS_CONTENT_EN = {
  takeAway: 'Generic placeholder — Takeaway (fallback).',
  reflectionQuestions: [
    'Fallback placeholder 1',
    'Fallback placeholder 2',
    'Fallback placeholder 3',
  ],
  practicalRule: 'Generic placeholder — Practical rule (fallback).',
}

export const PROGRESS_CONTENT_TRANSLATIONS_EN = {
  1: {
    takeAway: `In a bullish structure, structural lows are what keep it standing.

To identify a possible structure change, find the last low that supports it,

i.e. the one from which price restarted and built a new high above the previous one.`,
    reflectionQuestions: [
      'Which lows are supporting the bullish structure?',
      'What is the last low that keeps it valid?',
      'Can you spot invalidation: if you draw a level from that low, does price break and close below it?',
    ],
    practicalRule: `Do not just look for any low that gets broken;

look for the low that truly supports trend structure.`,
  },
  2: {
    takeAway: `In a bullish structure, a zone can be interesting for a potential long when it is around a low from which price restarts and builds a higher high than previous. So not every low is an interesting zone!`,
    reflectionQuestions: [
      'From this low, did price create a new high above the previous one?',
      'Has bullish structure already been invalidated?',
      'Does this low still belong to bullish structure, or is it already part of bearish one?',
    ],
    practicalRule: `In a bullish trend, look for long zones on lows that truly support bullish structure and from which price creates a new higher high.`,
  },
  3: {
    takeAway: `On lower timeframe we observe Zone 1 identified in Step 2 and wait for confirmation of bullish trend resumption seen on higher timeframe.

Confirmation is the break of the last high that keeps bearish structure valid.

This break indicates structure change from bearish to bullish and represents potential long entry (trigger).`,
    reflectionQuestions: [
      'On lower timeframe, is price still forming lower highs and lower lows?',
      'What is the last high keeping bearish structure valid?',
      'At which point does price break that high level?',
    ],
    practicalRule: `On lower timeframe, wait for break of the last high level that keeps bearish structure valid.`,
  },
  4: {
    takeAway: 'To verify which lows generate bullish continuation, observe what happens after those lows: a new high must be created, confirmed by at least one candle closing above previous high level.',
    reflectionQuestions: [
      'Is the move from this low truly building bullish continuation, or only a temporary upward reaction?',
      'If new high is not confirmed, which low still remains the structural reference of bullish structure?',
    ],
    practicalRule: 'A new higher high alone is not enough. Before updating structural low, make sure that high is really confirmed, as seen in the Takeaway.',
  },
  5: {
    takeAway: 'A zone becomes interesting when it comes from a low from which price creates a new high. Confirmation arrives when at least one candle closes above previous high level.',
    reflectionQuestions: [
      'If I am observing a bullish structure, which lows are truly structural and can generate a zone worth considering?',
      'Is previous high level exceeded by a true close or only by the candle wick?',
    ],
    practicalRule: 'Do not mark a zone immediately whenever you see a new low and a higher high. First verify that high is truly confirmed; only then use that low as zone reference.',
  },
  6: {
    takeAway: `Before looking for a trigger on lower timeframe, always verify that the higher-timeframe zone is still valid.
In a bullish zone, price can enter and then leave upward; in the criterion we use, zone is invalidated if before trigger a candle closes below its lower boundary.`,
    reflectionQuestions: [
      'What is the last bearish structural high on lower timeframe that must be broken with a close to confirm potential bullish continuation?',
      'Before that confirmation arrives, is higher-timeframe zone still valid or has a candle already closed below its lower boundary?',
    ],
    practicalRule: `First check that higher-timeframe context is still valid;

only then look for trigger on lower timeframe. If zone is invalidated before trigger, setup is discarded.`,
  },
  7: {
    takeAway: `**__Bullish structural lows__**: for a low to be confirmed as a **bullish structural low**, price must later create a new high, with a **candle closing above previous high level.**

The **previous high level corresponds to the tip of its wick, i.e. the highest extreme reached by price.**

**If candle does not close with body above that level, the new high is not confirmed, and therefore the previous low does not become a new bullish structural reference.**`,
    reflectionQuestions: [
      'Did the **next high really close above previous high level**, or did it only exceed it briefly with the wick?',
      'Only **after this confirmation**, which low becomes the new bullish structural reference, and what happens if price closes below its level?',
    ],
    practicalRule: 'When checking whether a level was truly exceeded, do not stop at wick: look at candle body close. If level is exceeded only by wick but candle closes below, break is not confirmed.',
  },
  8: {
    takeAway: `**Filter useful information: observe what market builds after a low.**

In a bullish structure, a low is confirmed as structural when from there price can **create a new high above previous one.**

**If this has not happened yet, you still do not know whether that low will truly have a structural role.**`,
    reflectionQuestions: [
      'From which lows did a move start that created a higher high than previous high?',
      'Which low truly supported bullish continuation?',
      'Is there any low that, up to this moment, has not produced this confirmation?',
    ],
    practicalRule: 'Always wait for confirmation: from that low, price must create a new higher high than previous one.',
  },
  9: {
    takeAway: `Zone found on higher timeframe shows where to start looking for a possible entry,

but **trigger does not necessarily have to be inside the zone.**

**What matters is that before trigger, price has entered the zone.**`,
    reflectionQuestions: [
      'What is the last bearish structural high?',
      'From that high, did price create new lows?',
      'Which candle closes above that high level?',
    ],
    practicalRule: `For a potential long, identify the last bearish structural high on lower timeframe and wait for the first candle that breaks that level and closes above it.`,
  },
}
