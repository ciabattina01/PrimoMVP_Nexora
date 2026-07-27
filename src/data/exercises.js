export const EXERCISES = [
  {
    id: 'day1-ex1',
    day: 1,
    title: 'Esercizio 1 — Individua le direzioni principali',
    block: 'Trend / contesto',
    description: 'Individua le direzioni principali osservando la sequenza di massimi e minimi.',
    imageBefore: '/Grafici/Es_1_Trend_H1_Gold.PNG',
    imageAfter: '/Grafici/Es1_Trend_Feedback.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1H',
      instrument: 'Gold Spot / U.S. Dollar',
    },
    question: `In questo primo esercizio faremo un’analisi qualitativa. Più avanti entreremo nel dettaglio dei cambi di struttura (cambi di trend) e di come vengono confermati.

👉🏻Domanda: in modo qualitativo, quali trend noti in questo grafico?

•🧐Osserva i massimi:
i massimi stanno diventando progressivamente più alti oppure più bassi?

•🧐 Osserva i minimi:
anche i minimi seguono la stessa direzione dei massimi?

•❗ Cerca una sequenza:
un singolo massimo o minimo non basta.
Osserva se più massimi e minimi consecutivi costruiscono una struttura coerente.

🔁 Conferma la nuova struttura: non fermarti al primo movimento. Verifica che anche i massimi e i minimi successivi continuino nella nuova direzione.

Solo allora puoi considerare la nuova struttura sufficientemente chiara.`,
    answers: [
      { key: 'A', text: 'C’è solo un trend rialzista.' },
      { key: 'B', text: 'È presente una fase di congestione e poi un trend rialzista.' },
      { key: 'C', text: 'Trend rialzista, poi ribassista e infine rialzista.' },
    ],
    correctAnswer: 'C',
    feedback: `🟩La risposta corretta è la C: nel grafico si possono riconoscere tre strutture direzionali, evidenziate dalle due frecce verdi e dalla freccia rossa.

Zona 1 – Struttura rialzista 📈

Dalla prima freccia verde iniziano a susseguirsi massimi e minimi progressivamente più alti.

I compratori riescono quindi a spingere il prezzo verso livelli sempre superiori e la struttura assume una direzione rialzista.

Zona 2 – Passaggio a una struttura ribassista 📉

In corrispondenza della freccia rossa, la precedente sequenza rialzista smette di proseguire.

Da quel punto iniziano a formarsi massimi e minimi progressivamente più bassi, segnalando che i venditori hanno preso il controllo e che la struttura è diventata ribassista.

🧐 Durante questa zona compare anche un rialzo molto evidente. Quel movimento, però, non è sufficiente da solo per confermare un nuovo trend rialzista: dopo il massimo il prezzo torna infatti a scendere e forma ancora un minimo più basso.

Questo mostra perché non bisogna considerare ogni movimento contrario come un cambio di trend già confermato.

Zona 3 – Ritorno a una struttura rialzista 📈

Dalla seconda freccia verde il ragionamento è speculare.

La sequenza ribassista perde continuità e iniziano nuovamente a costruirsi massimi e minimi progressivamente più alti.

I compratori tornano quindi a prevalere e si sviluppa una nuova struttura rialzista.

La cosa importante è quindi seguire nel tempo il modo in cui si costruiscono i massimi e i minimi e verificare se la nuova direzione continua per più movimenti consecutivi.

`,
    takeaway:
      'Per riconoscere una direzione non basta guardare una singola candela o un singolo movimento. Devi osservare la sequenza: massimi e minimi crescenti indicano una struttura rialzista, mentre massimi e minimi decrescenti indicano una struttura ribassista.',
  },
  {
    id: 'day1-ex2',
    day: 1,
    title: 'Esercizio 2 — Individua la zona di reazione',
    block: 'Zone importanti',
    description: 'Trova le zone chiave dove il prezzo ha reagito in passato.',
    imageBefore: '/Grafici/GOLD_H1_DOMANDA_ZONE_1.PNG',
    imageAfter: '/Grafici/GOLD_H1_SOLUZIONE_ZONE_1.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1H',
      instrument: 'Gold Spot / U.S. Dollar',
    },
    question: ` Il grafico mostra lo stesso mercato dell’esercizio precedente (Esercizio 1), sempre sul timeframe 1H, ma con uno zoom su una parte.

Prima di rispondere, prova a riflettere su queste domande:

* Osservando le 3 zone, da quale nasce il movimento che genera nuovi massimi?
* Quel movimento riesce anche a superare i massimi precedenti?🔎 nota bene il massimo indicato dal pallino (1).
* Che cosa ti fa pensare che una zona possa continuare ad attirare l’interesse dei compratori se il prezzo dovesse tornarci?

Dopo aver selezionato la risposta, ti chiederemo di spiegare brevemente il tuo ragionamento.

👉🏻Domanda:

Secondo te, in quale delle zone indicate è più sensato cercare una possibile ripresa del trend rialzista?`,
    answers: [
      { key: 'A', text: 'Zona A' },
      { key: 'B', text: 'Zona B' },
      { key: 'C', text: 'Zona C' },  
    ],
    correctAnswer: 'B',
    feedback: `
🟩La risposta corretta è la Zona B. 

Per individuare una zona valida bisogna verificare che presenti almeno una di queste caratteristiche:

* la zona rappresenta un punto di continuazione del trend in corso, in questo caso rialzista;
* la zona rappresenta un punto di cambio strutturale del trend, in questo caso da ribassista a rialzista.

Studiamo ora ogni zona.

Zona A

Osserva 👀: il massimo locale precedente è indicato dalla seconda candela partendo da sinistra, contrassegnata dal pallino colorato (1).

🧐Ora chiediti: dal minimo A viene generato un massimo che, con la chiusura di una candela sopra il livello, supera il massimo (1)?

Possiamo notare che la zona A non soddisfa questa condizione: il massimo generato dopo il minimo A rimane infatti più basso rispetto al massimo (1).

La zona A, quindi, non può essere considerata una zona valida.

Zona C

La zona C non può essere considerata valida, perché non rappresenta né un punto di continuazione del trend né un punto in cui avviene un cambio strutturale.

Zona B

La zona B è quella corretta.

Rappresenta il minimo dal quale ha origine il cambio strutturale da trend ribassista a trend rialzista.

Il cambio di struttura viene confermato quando una candela chiude al di sopra del massimo indicato da (1).`,
  },
  {
    id: 'day1-ex3',
    day: 1,
    title: 'Esercizio 3 — Trova il punto d’ingresso',
    block: 'Trigger / Rischio',
    description: 'Valuta le condizioni che invalidano lo scenario e il rischio residuo.',
    imageBefore: '/Grafici/GOLD_TRIGGER_1_DOMANDA.PNG',
    imageAfter: '/Grafici/GOLD_TRIGGER_1_SOLUZIONE.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 min',
      instrument: 'Gold Spot / U.S. Dollar',
    },
    question: `Nell’esercizio precedente, Esercizio 2, hai individuato come corretta la zona B.

Prima di rispondere, prova a riflettere su queste due domande:

* 🧐Perché, secondo te, in questo esercizio analizziamo proprio la zona B individuata nell’esercizio precedente?
* Come noterai dal badge sopra al grafico, il timeframe è passato da 1 H a 1 min. Per quale motivo, secondo te, osserviamo un timeframe inferiore?

Dopo aver selezionato la risposta, ti chiederemo di spiegare brevemente il tuo ragionamento.

🔎In questo esercizio, la conferma che cerchiamo è la rottura della struttura ribassista.
👉🏻Domanda: osservando il grafico, quale candela numerata rappresenta il punto di ingresso con la conferma più chiara della ripresa del trend rialzista?`,
    answers: [
      { key: 'A', text: 'Candela 3 ' },
      { key: 'B', text: 'Candela 1' },
      { key: 'C', text: 'Candela 2' },
      { key: 'D', text: 'Candela 4' },
    ],
    correctAnswer: 'A',
    feedback: `🟩La risposta corretta è la Candela 3.
    
    Nell’esercizio precedente abbiamo individuato come corretta la zona B. 
    
    🧐Perchè questa zona B?
    
    In questo esercizio ci concentriamo proprio su questa zona, perché è qui che il prezzo torna dopo essersi allontanato (questo movimento viene chiamato ritracciamento), dandoci così la possibilità di cercare un punto di ingresso.

Sul timeframe 1 H abbiamo individuato il contesto generale del mercato e una zona in cui il trend rialzista potrebbe riprendere. Tuttavia, il solo fatto che il prezzo arrivi in quella zona non è sufficiente per entrare.

🔎Per questo motivo scendiamo su un timeframe più dettagliato:

in questo caso 1 minuto. Lo scopo non è trovare un nuovo trend, ma osservare cosa succede all’interno della zona B e cercare una conferma che il mercato stia davvero riprendendo il trend rialzista visto sul timeframe 1 H.

Osservando il grafico, notiamo che il prezzo continua inizialmente a costruire una struttura ribassista. Fino a quel momento non abbiamo ancora elementi sufficienti per dire che i compratori abbiano ripreso il controllo del mercato.

🧐A questo punto chiediti:

“Quale livello deve superare il prezzo per dimostrarci che la struttura ribassista è terminata?”

1- Individua l’ultimo massimo che tiene in piedi la struttura ribassista.

2- Questo massimo individua il livello di rottura, è proprio la linea arancione. 

3- Finché il prezzo non riesce a superare questo livello, il mercato continua la struttura ribassista.

💡Quando il prezzo supera quel livello, come avviene sulla Candela 3, il mercato ci mostra che la precedente struttura ribassista non è più valida e che i compratori stanno iniziando a riprendere il controllo. Questa è la conferma che stavamo cercando e ci indica che il trend rialzista osservato sul timeframe 1 H potrebbe riprendere.

Per questo motivo la Candela 3 rappresenta il punto di ingresso con la conferma più chiara della ripresa del trend rialzista.`,
  },
  {
    id: 'day2-ex1',
    day: 2,
    title: 'Esercizio 4 — Inizio e conferma di un trend ribassista',
    block: 'Trend / contesto',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 2.',
    imageBefore: '/Grafici/EURUSD_DAILY_DOMANDA_TREND_2.PNG',
    imageAfter: '/Grafici/EURUSD_DAILY_SOLUZIONE_TREND_2.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 Day',
      instrument: 'EUR/USD',
    },
    question:
      `Osserva il trend rialzista da sinistra verso destra. Noterai che poi inizia un trend ribassista. Individua l’ultimo minimo della struttura rialzista che precede quella ribassista. Quel minimo individua il livello (linea orizzontale) di rottura. Che vuol dire? che una candela che chiude sotto a questo livello indica l'inizio del trend ribassista.
      
      👉🏻Domanda: secondo te, qual è la candela numerata dove inizia il trend ribassista e qual è la candela numerata in cui questo trend ribassista viene confermato?`,
    answers: [
      { key: 'A', text: 'Il trend ribassista inizia alla candela 1 e viene confermato alla candela 3.' },
      { key: 'B', text: 'Il trend ribassista inizia alla candela 3 e viene confermato alla candela 4.' },
      { key: 'C', text: 'Il trend ribassista inizia alla candela 2 e viene confermato alla candela 4.' },
    ],
    correctAnswer: 'C',
    feedback: `🟩 Risposta corretta:
                 * Candela 2 = primo segnale di possibile inversione.
                 * Candela 4 = conferma della nuova struttura ribassista.

🔎Osserva:  L’ultimo minimo della struttura rialzista che precede quella ribassista è proprio indicato dal pallino 🟡. Quel minimo individua un livello (immagina una linea orizzontale da 🟡 verso destra) di rottura = possibile cambio di trend da rialzista a ribassista. A questo punto si cerca di capire quale candela chiude sotto a questo livello: è proprio la candela 2. La candela 2 indica l'inizio del trend ribassista. Fino a quel momento il mercato aveva costruito una struttura rialzista; da questa candela, invece, inizia a formarsi una sequenza di massimi e minimi decrescenti, indicando che i venditori stanno iniziando a prendere il controllo.

•🧐Presta attenzione: questo rappresenta però solo un primo segnale, non una conferma definitiva del nuovo trend.

•Minimo A: la conferma arriva nella Candela 4, quando il prezzo rompe e chiude al di sotto del minimo relativo A.

Quel minimo rappresentava infatti l’ultimo livello che manteneva ancora valida la precedente struttura rialzista. Finché il prezzo rimane sopra quel livello, esiste sempre la possibilità che il trend rialzista riprenda.

•Quando invece il mercato rompe e chiude sotto quel minimo, dimostra che i compratori non sono più riusciti a difendere la struttura rialzista e che i venditori hanno preso il controllo del mercato. È proprio questa rottura che conferma il nuovo trend ribassista.



`,
  },
  {
    id: 'day2-ex2',
    day: 2,
    title: 'Esercizio 5 — Due zone in un trend ribassista',
    block: 'Zone importanti',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 2.',
    imageBefore: '/Grafici/EURUSD_DAILY_DOMANDA_ZONE_2.PNG',
    imageAfter: '/Grafici/EURUSD_DAILY_SOLUZIONE_ZONE_2.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 Day',
      instrument: 'EUR/USD',
    },
    question: `

Osservazione qualitativa: come noterai, la parte destra del grafico è caratterizzata da un evidente trend ribassista.

Prova a riflettere su questo aspetto:

📉 Continuazione del trend ribassista

Per ciascun massimo chiediti:

* è l’ultimo massimo prima della continuazione del trend ribassista?
* qual è l’ultimo minimo precedente a quel massimo?
* una candela chiude sotto il livello individuato da quel minimo?

Solo se tutte queste condizioni sono soddisfatte, quella zona rappresenta una continuazione del trend ribassista.

Domanda

👉🏻 Riesci a individuare le 2 zone valide?

`,
    answers: [
      { key: 'A', text: 'Zone A e D' },
      { key: 'B', text: 'Zone B e C' },
      { key: 'C', text: 'Zone B e D' },
    ],
    correctAnswer: 'C',
    feedback: `🟩Risposta corretta: Zone B e D. Perchè?

Passo 1 – 📉 Osserva il trend ribassista

Concentrati solo sulla parte destra del grafico, dove è già presente un evidente trend ribassista.

In questo esercizio devi individuare quale massimo dà origine alla continuazione del trend ribassista.

⸻

Passo 2 – 🔎 Analizza le zone

Osserva i massimi indicati.

Chiediti:

🤔 Questo massimo è l’ultimo massimo prima della ripresa del movimento ribassista?

Se la risposta è no, quella zona non può essere quella corretta.

⸻

Passo 3 – Zona A e Zona C

La Zona A appartiene ancora alla precedente struttura rialzista.

Per questo motivo non rappresenta un massimo da cui ha origine la continuazione del trend ribassista.

Osserva ora la Zona C.

Dopo la Zona C, il prezzo forma ancora un altro massimo (Zona D) prima di riprendere il ribasso.

📶 È quindi la Zona D a rappresentare l’ultimo massimo.

Ora applica il procedimento:

* individua l’ultimo minimo precedente al massimo D;
* traccia mentalmente un livello orizzontale da quel minimo;
* osserva il movimento del prezzo;
* una candela chiude sotto quel livello (accettazione della rottura).

Questa sequenza conferma che il ribasso prosegue a partire dall’ultimo massimo, che è proprio il massimo D 😉, motivo per cui la Zona C non può essere la risposta corretta, ma è la D.

⸻

Passo 4 – Zona B

Applica ora lo stesso procedimento alla Zona B.

🤔 È l’ultimo massimo prima della continuazione del trend ribassista?

In questo caso, sì.

Ora ragiona allo stesso modo:

* individua l’ultimo minimo precedente al massimo B;
* traccia mentalmente un livello orizzontale da quel minimo;
* una candela chiude sotto quel livello (accettazione della rottura).

Questa sequenza conferma che il ribasso prosegue proprio a partire dalla Zona B.

Per questo motivo la Zona B è la risposta corretta, perché rappresenta l’ultimo massimo da cui prende avvio la continuazione del trend ribassista.

⸻`,
  },
  {
    id: 'day2-ex3',
    day: 2,
    title: 'Esercizio 6 — Punto d’ ingresso nella zona analizzata',
    block: 'Trigger / Rischio',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 2.',
    imageBefore: '/Grafici/EURUSD_H1_DOMANDA_TRIGGER_2.PNG',
    imageAfter: '/Grafici/EURUSD_H1_SOLUZIONE_TRIGGER_2.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 H',
      instrument: 'EUR/USD',
    },
    question: `Nell’esercizio precedente (Esercizio 5) hai individuato come corrette le zone B e D.

Prima di rispondere, prova a riflettere su queste due domande:

* Perché, secondo te, in questo esercizio analizziamo solo la zona D e non anche la zona B?
* Come noterai dal badge sopra al grafico, il timeframe è passato da 1 Day a 1 H. Per quale motivo, secondo te, osserviamo un timeframe inferiore?

Dopo aver selezionato la risposta, ti chiederemo di spiegare brevemente il tuo ragionamento.

🔎Ricordi l'esercizio 3? Lì hai visto la stessa rottura strutturale, ma in direzione rialzista. Qui si applica lo stesso criterio al contrario. In questo esercizio, la conferma che cerchiamo è la rottura della struttura rialzista sul timeframe H1.

👉🏻Domanda: osservando il grafico, quale candela numerata rappresenta il punto di ingresso con la conferma più chiara della ripresa del trend ribassista?`,
    answers: [
      { key: 'A', text: 'Candela 1' },
      { key: 'B', text: 'Candela 2' },
      { key: 'C', text: 'Candela 3' },
      { key: 'D', text: 'Candela 4' },
    ],
    correctAnswer: 'B',
    feedback: `🟩Risposta corretta: Candela 2. 
   
  ___  Piccola parentesi: 🧐Perchè la zona D?
    
     Perché è l’unica delle due zone in cui il prezzo torna dopo essersi allontanato (questo movimento viene chiamato ritracciamento), dandoci così la possibilità di cercare un punto di ingresso.
___

🔎Sul timeframe Daily abbiamo individuato il contesto generale del mercato e una zona in cui il trend ribassista potrebbe riprendere. Tuttavia, il solo fatto che il prezzo arrivi in quella zona non è sufficiente per entrare.

Per questo motivo scendiamo su un timeframe più dettagliato, in questo caso 1 H. Lo scopo non è trovare un nuovo trend, ma osservare cosa succede all’interno della zona D e 🔁 cercare una conferma che il mercato stia davvero riprendendo il trend ribassista visto sul Daily.

 Osservando il grafico H1, notiamo che il massimo indicato dal pallino 🟡, individua l’ultimo massimo della struttura rialzista. A questo punto dobbiamo chiederci:

💡Ecco lo stesso ragionamento (al contrario) dell'esercizio 3: 

1. 🧐“Da quale minimo è partito questo nuovo massimo? Questo minimo tiene in piedi ancora la struttura rialzista.

2. Quel minimo corrisponde al punto da cui parte la linea arancione.

Linea arancione = livello di rottura: finchè quel livello rimane intatto, il mercato continua a mostrare una struttura rialzista sul timeframe H1.

3.🎯Quando il prezzo rompe quel livello, come avviene sulla Candela 2, la struttura rialzista viene invalidata e il mercato ci fornisce la conferma che stavamo cercando: 🔁il trend ribassista osservato sul Daily potrebbe riprendere.

Per questo motivo la Candela 2 rappresenta il punto di ingresso con la conferma più chiara della ripresa del trend ribassista.`,
  },
  {
    id: 'day3-ex1',
    day: 3,
    title: 'Esercizio 7 — Passaggio dal trend ribassista al trend rialzista',
    block: 'Trend / contesto',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 3.',
    imageBefore: '/Grafici/GBPUSD_H4_DOMANDA_TREND_3.PNG',
    imageAfter: '/Grafici/GBPUSD_H4_SOLUZIONE_TREND_3.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '4 H',
      instrument: 'GBP/USD',
    },
    question: `


* Obiettivo: cercare il punto di conferma del cambio di struttura da trend ribassista a trend rialzista.
Osserva: a sinistra è presente un evidente trend ribassista.

* Qual è l’ultimo massimo appartenente a questo trend ribassista?

Devi quindi individuare l’ultimo massimo appartenente alla precedente struttura ribassista.

* Partendo da quel massimo, traccia mentalmente un linea (livello) orizzontale.

* Infine: quale candela chiude al di sopra di questa linea orizzontale? Cerca la chiusura sopra questo livello

 Quella candela che chiude sopra questo livello è la conferma del cambio di struttura da trend ribassista a trend rialzista.
 
👉🏻Domanda: individua la candela dalla quale viene confermato l’inizio del trend rialzista, ossia il punto di conferma del cambio di struttura da trend ribassista a trend rialzista.
`,
    answers: [
      { key: 'A', text: 'Candela 1' },
      { key: 'B', text: 'Candela 2' },
      { key: 'C', text: 'Candela 3' },
      { key: 'D', text: 'Candela 4' },
    ],
    correctAnswer: 'C',
    feedback: `🟩Risposta corretta: Candela 3. Perchè?

🧐 1. Individua l’ultimo minimo del trend ribassista

Osserva la parte sinistra del grafico.

È presente un evidente trend ribassista, caratterizzato da una successione di massimi e minimi decrescenti.

Qual è l’ultimo minimo appartenente a questo trend ribassista?

È proprio da questo minimo che inizia il ragionamento.

⸻

👀 2. Individua il massimo che ha generato quel minimo

Ora chiediti: 🧐da quale massimo è nato quel minimo?

Quel massimo rappresenta l’ultimo massimo della precedente struttura ribassista.

È proprio questo il massimo che dovrai prendere come riferimento.

⸻

 🎯 3. Il livello di rottura

Traccia mentalmente una linea orizzontale da quel massimo.

Segui poi il movimento del prezzo verso destra.

Osserva bene 👀: non basta che una candela tocchi o superi momentaneamente quel livello.

La conferma arriva solo quando una candela chiude sopra quel livello (linea orizzontale).

Questa chiusura indica che il mercato ha accettato la rottura.

⸻

👉🏻 4. Individua la candela

La candela numero 3 è la prima candela che chiude sopra il massimo della precedente struttura ribassista.

Da quel momento il cambio di struttura viene confermato e il mercato passa da trend ribassista a trend rialzista.

`,
  },
  {
    id: 'day3-ex2',
    day: 3,
    title: 'Esercizio 8 — Zona che non genera continuazione del trend o cambio strutturale',
    block: 'Zone importanti',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 3.',
    imageBefore: '/Grafici/GBPUSD_H4_DOMANDA_ZONE_3.PNG',
    imageAfter: '/Grafici/GBPUSD_H4_SOLUZIONE_ZONE_3.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '4 H',
      instrument: 'GBP/USD',
    },
    question: `Osserva la parte sinistra del grafico che identifica un breve trend rialzista, e poi il trend ribassista. Per questo esercizio non importa che osservi la parte destra del grafico (dal punto 4 in poi). 

Prova a riflettere su questi 2 aspetti:

* Continuazione del trend ribassista. Per ciascuna zona chiediti: qual è il minimo oltre il quale i venditori hanno superato i compratori, facendo proseguire il movimento ribassista?
* Cambio strutturale del trend: da rialzista a ribassista. Individua la zona oltre la quale i venditori riprendono il controllo rispetto al precedente trend rialzista.

Un piccolo aiuto 🔎:

In un trend rialzista, individua l’ultimo massimo e poi il minimo precedente che appartiene alla stessa struttura rialzista. Tracciando una linea orizzontale da quel minimo ottieni un livello importante: la sua rottura può indicare un cambio strutturale.

👉🏻Domanda: c’è una zona fra 1, 2, 3 e 4 che NON genera né una continuazione del trend ribassista né un cambio strutturale da trend rialzista a ribassista, quale?

`,
    answers: [
      { key: 'A', text: 'Zona 1' },
      { key: 'B', text: 'Zona 2' },
      { key: 'C', text: 'Zona 3' },
      { key: 'D', text: 'Zona 4' },
    ],
    correctAnswer: 'A',
    feedback: `🟩Risposta corretta: Zona 1. Perchè?
    * Zona 1

La zona 1 appartiene ancora alla precedente struttura rialzista. Da questo punto in poi i compratori non riescono più a creare un nuovo massimo significativo e iniziano progressivamente a perdere il controllo del mercato.

🔎1. Tuttavia questa zona non rappresenta ancora una continuazione del trend ribassista, perché il trend ribassista non è ancora iniziato.

🔁2. Inoltre, questa zona non rappresenta nemmeno il punto in cui avviene il cambio di struttura da rialzista a ribassista.

Per individuare un vero cambio di struttura dobbiamo infatti individuare l’ultimo massimo appartenente alla precedente struttura rialzista e, successivamente, l’ultimo minimo che ha generato proprio quel massimo.

È proprio quel minimo a rappresentare il livello strutturale più importante: quando una candela chiude al di sotto di quel livello, i venditori prendono il controllo del mercato e il cambio di struttura viene confermato. 

Per questo motivo, la zona 1 non rappresenta ancora il punto in cui avviene il cambio di struttura. È invece la Zona 2 a rappresentare la zona valida da cui ha origine il cambio di struttura da trend rialzista a ribassista.

 👀Perché non è il minimo indicato dalla freccia rossa?

Per individuare un cambio di struttura bisogna considerare l’ultimo minimo che ha generato l’ultimo massimo, ❗ della precedente struttura rialzista.

Il minimo indicato dalla freccia rossa non soddisfa questa condizione: si forma dopo che la struttura rialzista ha già iniziato a perdere forza e appartiene a un semplice movimento di ritracciamento. 🔎 Lo si capisce perché il massimo successivo (Zona 2) non riesce più a superare il massimo precedente (Zona 1), ma si ferma più in basso, mostrando che i compratori stanno perdendo il controllo del mercato.

* Zona 3

Osserviamo ora la zona 3.

A questo punto il trend è già diventato ribassista.

Dopo il rimbalzo sembra che i compratori stiano provando a riprendere il controllo del mercato. Tuttavia il tentativo fallisce: i venditori tornano a prevalere e il prezzo rompe il livello individuato dal minimo precedente (linea arancione orizzontale).

La conferma arriva quando una candela chiude al di sotto di quel livello. Questa chiusura è fondamentale perché indica che il mercato ha accettato la rottura e che i venditori hanno ripreso il controllo.

👉 La zona 3 rappresenta quindi una continuazione del trend ribassista.

In altre parole, è la zona oltre la quale i venditori tornano a prevalere e il movimento ribassista prosegue.

* Zona 4

Anche la zona 4 segue lo stesso principio.

Dopo un nuovo tentativo dei compratori di far risalire il prezzo, i venditori tornano a prevalere.

Anche in questo caso il prezzo rompe il livello individuato dal minimo precedente (linea arancione orizzontale).

Osserva bene 👀: la conferma arriva quando una candela chiude al di sotto di quel livello, segnalando che il mercato ha accettato la rottura e che i venditori hanno ripreso il controllo.

👉 Anche la zona 4 rappresenta quindi una continuazione del trend ribassista.`,
  },
  {
    id: 'day3-ex3',
    day: 3,
    title: 'Esercizio 9 — Stop Loss e ingresso',
    block: 'Trigger / Rischio',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 3.',
    imageBefore: '/Grafici/GBPUSD_M15_APERTA_TRIGGER_STOPLOSS_3.PNG',
    imageAfter: '/Grafici/GBPUSD_M15_SOLUZIONE_TRIGGER_STOPLOSS_3.PNG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '15 min',
      instrument: 'GBP/USD',
    },
    question: `

👀Nel precedente esercizio (8) abbiamo individuato un trend rialzista su H4. In questo esercizio analizziamo una parte diversa dello stesso grafico e la zona A.

In questo grafico siamo su timeframe m15 (15 minuti) per individuare il trigger di entrata.

💡 Ricorda: si sceglie un timeframe inferiore di almeno 8–16 volte rispetto a quello utilizzato per individuare il trend principale.

Rifletti:

* SL: ripensa al ragionamento sulle zone del precedente esercizio 8.
* Ingresso: quale punto conferma che il trend rialzista si stia riconfermando anche su m15?

👉🏻Domanda:

Perché l’ingresso e lo stop loss sono posizionati dove indicato sul grafico?`,
    feedback: `Qui siamo su m15, Zona A. 
    
    •ENTRATA: dobbiamo trovare un trigger. 
    
    🧐 cosa significa trovare un trigger di entrata? Significa trovare il punto oltre cui si riconferma il trend rialzista anche su m15. 
    
    📉 Osserva il trend da sinistra verso destra, si nota un trend ribassista. 
    
    Qual è l'ultimo massimo di questo trend ribassista?  Si vede bene che l'ultimo massimo è individuato da (1). Questo massimo identifica proprio un livello di rottura (la nostra linea orizzontale verde).
    
    A questo punto basta vedere quale candela chiude al di sopra di questo livello (accettazione della rottura). 🎯Ecco il nostro punto di entrata! 
  
    ___


      •STOPLOSS: 
      
      🔎Ricorda il concetto visto negli esercizi precedenti, un trend resta valido finché il prezzo non rompe i livelli che ne sostengono la struttura. 
    
    Un trend rialzista, quindi, rimane tale finché vengono rispettati i minimi principali; 
    
    Un trend ribassista resta valido finché non vengono superati i massimi principali.

📈Per questo motivo, in un’operazione rialzista, può avere senso posizionare lo stop loss sotto una zona importante che sostiene il trend del time frame superiore, come nell’esempio mostrato in figura. 


Lo stop viene quindi collocato nel punto in cui viene meno il motivo principale per cui l’operazione era stata aperta.`,
  },
]

export const EXERCISE_DAYS = [1, 2, 3]

export const EXERCISES_BY_DAY = EXERCISES.reduce((acc, exercise) => {
  if (!acc[exercise.day]) {
    acc[exercise.day] = []
  }
  acc[exercise.day].push(exercise)
  return acc
}, {})

export function getExercisesForDay(day) {
  return EXERCISES_BY_DAY[day] || []
}

export function getExerciseById(id) {
  return EXERCISES.find((exercise) => exercise.id === id) || null
}
