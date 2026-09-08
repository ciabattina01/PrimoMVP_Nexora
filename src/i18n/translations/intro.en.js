export const INTRO_TRANSLATIONS_EN = {
  'intro-step-1': {
    title: 'Step A — Understand markets • what trading means',
    block: 'Markets · Forex buy/sell · why prices move · simulation/live',
    question: `**1-What can you trade?**

• **Stocks:** represent partial ownership in a company. Buying a stock means owning a small part of that company.
• **CFDs (Contracts for Difference):** instead of buying the asset itself, you open a contract linked to its price. If price changes, result depends on the difference between entry and exit price.
Example: you can trade gold price without physically buying gold.
• **Forex:** currency value is always expressed against another currency, in pairs such as EUR/USD.
• **Indices:** represent performance of a basket of companies.
• **Commodities:** for example gold and oil.
• **Bonds:** instruments through which states or companies borrow money from investors.

You do not need to master all of them to start. In the next exercises we focus mostly on Forex and chart reading.

**2-How does a Forex pair work?** 👉 In the image: how to read a Forex pair and understand what the price means.

🛍️🛒**What does it mean to buy or sell a Forex pair?**

Buy EUR/USD → means opening a trade that can profit if EUR/USD rises.
Sell EUR/USD → means opening a trade that can profit if EUR/USD falls.

🧐**Am I actually buying and receiving euros or dollars?**
Not necessarily. In retail trading, in many cases you are not doing a standard currency exchange: through your broker **you open a position on EUR/USD price movement.**

**So where does profit or loss come from?**
When you open a trade, entry price is recorded. When you close it, result depends on **how much price changed, chosen direction (Buy or Sell), and position size.**

If move is in your favor you make profit; if not, you take a loss. Result is added or subtracted from your account balance.

**3-Why does price move?** 👉 In the image: some main factors affecting currency value.`,
    answers: {
      A: 'I focus immediately on entry without observing context.',
      B: 'I observe overall direction first, then details.',
      C: 'I only look at the last candle and decide immediately.',
    },
    feedback: `**4-What makes price go up or down?** 👉 In the image: buyers and sellers are not always balanced.

**Bullish and bearish**
When demand pressure prevails over supply, price tends to rise: this movement is bullish.
When supply pressure prevails, price tends to fall: this movement is bearish.

Bullish trend = rising trend | Bearish trend = falling trend.
Trend = prevailing direction of price. Structure = how highs and lows follow each other on chart and help us recognize that direction.

Important: you do not need to memorize all terms; the same concept can have different words.

**How to recognize a bullish/bearish trend?**

**Bullish trend:** lows and highs form progressively higher.
What supports trend are **structural lows:**
lows from which **new highs above previous highs** are created.

**Bearish trend:** lows and highs form progressively lower.
What supports trend are **structural highs:**
highs from which **new lows below previous lows** are created.

Structural lows and highs are not just one point: they are all the lows or highs that, during the trend, meet the condition described above.

**5-What can you do on a platform like TradingView?** 👉 In the image: 3 environments.

📊 **Observe and analyze:**
On a charting platform like TradingView you can see price and draw entries or levels, but you are not placing real trades there.

**Practice in simulation**
With paper trading/simulation you can test opening and closing positions using **virtual money.**
For example, TradingView Paper Trading or a **demo account** on a trading platform.

**🏦 And when you want to trade live: the Broker**
A broker is a **financial intermediary between you and the market**, giving you access through a trading account.
When you send a buy/sell order, broker handles execution.

**6-How can you analyze the market?** Two ways:
🌐 **Fundamental analysis** → studies what can influence markets: macro economy, rates, inflation, news.
📈 **Technical analysis** → focuses directly on what price is doing on chart: direction, levels, structure.

**In next exercises we mainly use the second: you will learn to observe a chart and make a decision.**

**7-How long can a trade last?**
**Scalping:** very short trades, minutes.
**Intraday:** opened and closed within the same day.
**Swing:** held for multiple days, sometimes weeks.
**Position trading:** held for weeks or months.
**The chart reasoning method can be used across different trading styles:** mostly what changes is time horizon, timeframe, and management.`,
  },
  'intro-step-2': {
    title: 'Step B — Chart elements • size and risk',
    block: 'Candles and price · Position size and risk',
    question: `**1-How to read candles and timeframe?** 👉 In the image: candles and timeframe.

**Candle body = colored part between Open and Close.**
High = highest point reached by candle | Low = lowest point reached by candle.
The thin lines above and below body are **wicks**.

**Example with M5 timeframe:**
at 10:00 a new candle starts; in next 5 minutes price can move up and down and candle can change color. At 10:05 candle closes: if close is above open it is bullish, if below it is bearish.
Final color shows which side prevailed in those 5 minutes: **buy pressure if bullish close (green in image), sell pressure if bearish close (red in image).**

**How do you choose the right timeframe?**⏰
There is no universally best timeframe: it depends on what you want to observe.

**Higher timeframe → big picture**
Used to understand overall trend and context.

**Lower timeframe → price zoom**
Shows same market in shorter intervals and helps look for entry confirmation.

A practical initial reference:
You can move to a timeframe roughly **4-6 times lower.**
**H4 → H1**
**H1 → M15**

**2-Why are there 2 prices?** 👉 In the image: bid/ask and spread.

👀 Remember: buyers want the lowest possible price,
sellers want the highest possible price.

**Ask:** best available selling offer → if you buy, this is your best buy price.
**Bid:** best available buying offer → if you sell, this is your best sell price.

**Ask-Bid = Spread.** Usually **Ask > Bid**.

**Spread is the gap between the price you can buy at and the price you can sell at.** This difference is a small **cost when entering a trade.**

🛍️**3-How easy is it to find buyers/sellers? Liquidity.**
When you send an order there must be a counterparty: **the easier it is to find one at prices close to current market, the higher liquidity.**
In high-liquidity markets it is easier to enter/exit and spreads tend to be smaller.

**Example:** you want to sell an asset traded around 10 €.
If many buyers are willing near 10 €, you can sell close to that price.
If buyers are few and some only pay 9.50 €, to sell immediately you may need to accept lower price.`,
    answers: {
      A: 'I highlight key levels and ignore noise.',
      B: 'I give every small move the same importance.',
      C: 'I change my mind on every candle without criteria.',
    },
    feedback: `**SETTING UP A TRADE**

**4-How do you choose when to enter?** 👉 In the image: Market, Limit and Stop orders.

**5-How much are you buying or selling? Lots**
When opening a trade, you do not choose only buy/sell direction, but also position size.
A standard lot equals **100,000 units of the base currency**. Smaller sizes exist:
* 1 lot = 100,000 units
* 0.1 lot = 10,000 units
* 0.01 lot = 1,000 units
Example: in EUR/USD, euro is base currency. A 0.01 lot position means exposure on 1,000 EUR.

Size is not random: later we connect it to risk and Stop Loss.

**6-If 0.01 lots are 1,000 €, do I need 1,000 € in account? Leverage**
•Not necessarily. Suppose you have **500 € account capital.**

Available leverage depends on broker and instrument, so you do not directly choose it.
•**You choose position size using lots.** For example, in EUR/USD, **0.01 lots = 1,000 EUR position.**
Total exposure = 1,000 € means you control that market value.

•Then platform calculates **required margin**: the **portion of capital reserved** to keep trade open. It is not spent, but unavailable as free margin while trade is open.

•**10:1 leverage means: for each 1 € margin you control 10 € position.**

•**→ Margin = position size / leverage**
1,000 € / 10 = 100 € → **Required margin: 100 €**
But you are still trading 1,000 €, not 100 €: this is why leverage amplifies price movement impact.

• Look at image on the right: result is calculated on **position**.
Position 1,000 € → **example ±1% move** → **result ±10 €**
Account 500 € → **490 € if loss / 510 € if gain.**

🔎**Pip unit**
Shows **how much a Forex pair moved.**

For pairs **without** JPY: **1 pip = 0.0001**
EUR/USD: 1.1500 → 1.1520 = +20 pips
GBP/USD: 1.3000 → 1.3045 = +45 pips

For pairs **with JPY: 1 pip = 0.01**
USD/JPY: 145.20 → 145.50 = +30 pips

Pip is mostly used in Forex. On other instruments price movement can be expressed in points, ticks, or other units depending on instrument and platform.`,
  },
  'intro-step-3': {
    title: 'Step C — Already know basics? Start with this example',
    block: 'Higher timeframe · Zone · Trigger · Stop Loss · Take Profit',
    question: `**HOW TO BUILD A BULLISH (LONG) TRADE**

**Goal:** practical example of a **bullish** trade: on higher timeframe identify trend and zone; on lower timeframe find entry and define stop loss and take profit.

**Part 1 - On higher timeframe identify bullish trend and zones**

**1-Where does bullish structure start?**
Before searching bullish trend, understand when previous **bearish structure stops being valid.**

**•**What supports bearish structure?
We learned bearish trend is supported by **structural highs: highs from which a new lower low is created.**

**•**When is a high truly structural (in bearish trend)?
It is not enough that a lower low forms (like low 1): we need **a candle to close below previous low level.**

Now we can recognize a **bearish structural high**.

**•**Find start of bullish trend.
Now we focus on **the most recent reference keeping bearish structure valid**: **the last bearish high** (already marked on chart).

Draw the orange horizontal line: this is the **break level**. If a candle breaks above it, trend becomes bullish.

**🟡 is the confirmation point:** here price breaks orange level and confirms start of bullish trend.
A wick-only break is not enough: we need **candle close above level** to confirm trend change from bearish to bullish.

**New bullish structure starts.**

**2-Bullish structural lows (🔵 on chart)**

**Structural lows are lows from which a new high above previous high is created.**

**•**When is a low truly structural (in bullish trend)?
It is not enough that a higher high is formed: **a candle must close above previous high level.**

On chart:
Low 2 creates new High 2.
**🟢 marks the gray candle that closes above High 1 level: this close confirms low 2 🔵 as bullish structural low.**

**KEY CONCEPT: symmetry**
bearish: structural high → new low → close below
bullish: structural low → new high → close above

**3-Interesting zone - built from a bullish structural low (or from a high in bearish structure)**

**•What is it for**
It is the area where, if price returns, we start observing whether bullish move may continue and whether we can get confirmation for a Long entry.

**•How it is built**
In bullish structure, zone is the price range of the candle that forms structural low, i.e. **area between its high and low projected to the right over time.**

**•Which candle should I use?**
Always use the **candle that forms the bullish structural low.**👉🏻
If before that low candle there is also a not-too-long bearish candle, zone can be extended to include that candle as well.`,
    answers: {
      A: 'I first observe higher timeframe, then seek confirmation on lower timeframe.',
      B: 'I start directly from lower timeframe without context.',
      C: 'I choose entry and management without defining zone first.',
    },
    feedback: `•**Part 2 - Move to LOWER TIMEFRAME**

**TRIGGER: possible entry confirmation.**

**•**We look for confirmation of bullish trend resumption:
realignment with bullish trend observed on higher timeframe. This point represents bullish entry (Long).

As before, to find it we look for the point where bearish trend is invalidated. So we identify **the last bearish structural high**, i.e. the most recent reference keeping that structure valid.

From that level we draw a **horizontal line.**

Confirmation comes when a **candle breaks and closes above this level**: **bullish trend start confirmed**;
previous bearish structure is invalidated and price shows possible **realignment with bullish structure observed on higher timeframe.**
On chart, 🟡 marks this confirmation point: in our example it is Trigger, i.e. possible Long entry point.

**TAKE PROFIT**
**•**The level where trade is closed in profit if price moves in expected direction.

Review the first **higher timeframe chart**. In our example it is placed at **the structural high created by low from which zone was built (low 1), exactly High 1.**
This is the **first logical target** of bullish move.

**STOP LOSS**
**•**The level beyond which **trade idea is no longer considered valid and limits loss.**

In our example it is placed **below the zone identified on higher timeframe.**
It represents the level **below which trade idea is no longer valid.**

In next steps you will also see a simple sizing example.

**7-How do you choose lot size?**

**•**First decide max amount you are willing to lose and identify Stop Loss.
Then choose lot size so that if price reaches Stop Loss, loss remains within that limit.

With same risk:
Wider Stop Loss → fewer lots
Tighter Stop Loss → more lots

Example: account 1,000 €, max risk 1% = 10 €. With a 20 pip stop versus 50 pip stop you use different size, but in both cases goal is to keep loss around 10 €.

**8-Risk/Reward and Win Ratio**: what matters is not only how many trades you win, but also how much you win when right and how much you lose when wrong.

Risk/Reward ratio indicates how much you are willing to lose relative to target gain.
Example: 1:2 means risking 10 EUR to target 20 EUR.
Win Ratio is the percentage of profitable trades. If you win 4 out of 10 trades, your Win Ratio is 40%.

How do they relate?
Higher average gain versus average loss means you need fewer winning trades to offset losing ones.
If gains are small and losses are large, even high Win Ratio might not be enough.

**Simple example, ignoring costs/spread: 1:1 requires about 50% Win Ratio, 1:2 requires about 33%, 1:3 requires about 25%. Example: Win Ratio 40% and Risk/Reward 1:2. Over 10 trades risking 10 EUR to target 20, if 4 win and 6 lose, gains are 80 EUR and losses are 60 EUR. Net result +20 EUR despite only 4 wins out of 10.**`,
    riskWinSection: {
      title: '8 - Risk/Reward and Win Ratio: why they must be read together',
      intro:
        'It is not just about how many trades you win, but also how much you gain when right and lose when wrong.',
      riskRewardCard: {
        title: 'Risk/Reward Ratio',
        text: 'It shows how much you are willing to lose versus potential gain. Example: 1:2 means risking 10 EUR to target 20 EUR.',
      },
      winRatioCard: {
        title: 'Win Ratio',
        text: 'It is the percentage of trades closed in profit. If you win 4 trades out of 10, your Win Ratio is 40%.',
      },
      relationTitle: 'How do they relate?',
      relationText:
        'They must be evaluated together: a higher average gain than average loss can compensate for multiple losing trades.',
      exampleTitle: 'Example: 40% Win Ratio and 1:2 Risk/Reward',
      exampleText:
        'On 10 trades, you risk 10 € to target 20 €.\n\nIf 4 trades win and 6 lose:\n\n• 4 × 20 € = 80 € gained\n\n• 6 × 10 € = 60 € lost\n\n**Net result: +20 €**, even with only 4 wins out of 10.',
      closingText: '',
    },
  },
}
