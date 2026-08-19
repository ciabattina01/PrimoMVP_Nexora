export const INTRO_STEPS = [
  {
    id: 'intro-step-1',
    order: 1,
    title: 'Step A — Capire il mercato • cosa significa operare',
    block: 'Mercati · Forex e compra/vendi · perchè i prezzi si muovono · simulazione/reale',
    question: ` ** 1-Cosa puoi scambiare?**

    • **Azioni:** rappresentano una quota di partecipazione in una società. Acquistando un'azione, diventi proprietario di una piccola fetta di quella società. 
    • **CFD (Contratti per differenza):** invece di acquistare direttamente un asset, apri un contratto legato al suo prezzo. Se il prezzo cambia, il risultato dell’operazione dipende dalla differenza tra il prezzo di apertura e quello di chiusura.
Esempio: puoi operare sul prezzo dell’oro senza comprare realmente dell’oro.
 • **Forex:** il valore di una valuta viene espresso rispetto a un’altra, quindi a coppie, come euro e dollaro. • **Indici:** rappresentano l’andamento di un insieme di aziende.  • **Materie prime:** comprendono, ad esempio, oro e petrolio. • **Obbligazioni:** sono strumenti attraverso cui Stati o aziende prendono denaro in prestito dagli investitori.

 Non devi conoscerli tutti per iniziare. Nei prossimi esercizi ci concentreremo soprattutto sul Forex e sulla lettura del grafico.

**2 — Come funziona una coppia Forex?** 👉 Nell'immagine: come leggere una coppia Forex e capire cosa significa il prezzo.

🛍️🛒**Cosa significa comprare o vendere una coppia Forex?**

Comprare EUR/USD → significa aprire un’operazione con cui puoi guadagnare se EUR/USD sale.
Vendere EUR/USD → significa aprire un’operazione con cui puoi guadagnare se EUR/USD scende.

🧐**Ma sto davvero comprando e ricevendo euro o dollari?**
Non necessariamente. Nel trading retail, in molti casi non stai facendo un normale cambio di valuta: attraverso il broker **apri una posizione sull’andamento del prezzo di EUR/USD.**

**Allora da dove arriva il guadagno o la perdita?**
Quando apri l’operazione viene registrato il prezzo di entrata. Quando la chiudi, il risultato dipende **da quanto è cambiato il prezzo, dalla direzione scelta (Compra o Vendi) e dalla quantità utilizzata.**

Se il movimento è stato a tuo favore hai un profitto; se è stato contrario hai una perdita. Il risultato viene aggiunto o sottratto al saldo del tuo conto.

**3 — Perché il prezzo si muove?** 👉 Nell'immagine: alcuni dei principali fattori che influenzano il valore di una valuta.
`,
    answers: [
      { key: 'A', text: 'Mi concentro subito sull’ingresso senza osservare il contesto.' },
      { key: 'B', text: 'Osservo prima la direzione generale e poi cerco i dettagli.' },
      { key: 'C', text: 'Guardo solo l’ultima candela e decido subito.' },
    ],
    feedback:
      `**4- Cosa fa salire o scendere il prezzo?** 👉 Nell'immagine: compratori e venditori non sono sempre in equilibrio.

     **Rialzo e ribasso** 
Quando la pressione della domanda prevale sull’offerta, il prezzo tende a salire: questo movimento si definisce rialzista.
Quando invece prevale la pressione dell’offerta, il prezzo tende a scendere: questo movimento si definisce ribassista.

Trend bullish = trend rialzista
Trend bearish = trend ribassista
Sono semplicemente due modi diversi per indicare lo stesso concetto.
Trend = direzione prevalente del prezzo.
Struttura = il modo in cui massimi e minimi si susseguono sul grafico e ci aiutano a riconoscere quella direzione.

Importante: non devi memorizzare tutti i termini, lo stesso concetto può avere diversi termini.
**Come riconoscere un trend rialzista/ribassista?**

**Trend rialzista:** i minimi e i massimi si formano progressivamente più in alto.
Ciò che fa da "impalcatura" al trend sono i **minimi strutturali:**
cioè i minimi da cui si creano **nuovi massimi più alti dei precedenti.**
**Trend ribassista:** i minimi e i massimi si formano progressivamente più in basso.
Ciò che fa da "impalcatura" al trend sono i **massimi struttursli**.
cioè i massimi da cui si creano **nuovi minimi più bassi dei precedenti.**


  **5-Cosa puoi fare in una piattaforma come TradingView?** 👉 Nell'immagine: 3 ambienti.
    
      📊 **Osservare e analizzare:**
Su una piattaforma grafica come TradingView puoi vedere il prezzo e disegnare un’entrata o un livello, ma non stai operando realmente.

 **Fare pratica in simulazione**
Con un ambiente di paper trading/simulazione puoi invece provare ad aprire e chiudere operazioni utilizzando **denaro virtuale.** 
Ad esempio, puoi utilizzare il Paper Trading di TradingView o un **conto demo** su una piattaforma di trading.

      **🏦 E quando vuoi operare realmente: il Broker**
      Il broker è una **società finanziaria che fa da intermediario fra te e il mercato**, permettendoti di accedere al mercato con un conto di trading. 
Quando invii un ordine di acquisto o vendita, il broker ne gestisce l’esecuzione.

      **6-Come puoi analizzare il mercato?** due modi di interpretare il mercato.
      🌐 **Analisi fondamentale** → guarda cosa può influenzare il mercato: economia, tassi d’interesse, inflazione, notizie ecc.
📈 **Analisi tecnica** → guarda direttamente ciò che il prezzo sta facendo sul grafico: direzione, livelli e struttura.

**Nei prossimi esercizi useremo soprattutto la seconda: imparerai a osservare un grafico e prendere una decisione.**

   **7 - Quanto può durare un'operazione?**
   
**Scalping:** operazioni molto brevi, di pochi minuti.
**Intraday:** operazioni aperte e chiuse nella stessa giornata.
**Swing:** operazioni mantenute per più giorni, a volte ancche settimane.
**Position trading:** operazioni mantenute per settimane o mesi.
**Il ragionamento sul grafico può essere utilizzato in tipi di operatività diversi:**cambiano soprattutto i tempi, i timeframe utilizzati e la gestione dell’operazione.
      `,
  },
  {
    id: 'intro-step-2',
    order: 2,
    title: 'Step B —  Elementi del grafico • quantità e rischio',
    block: 'Candele e prezzi · Quantità e rischio',
    question:
      ` **1 - Come interpretare le candele e il timeframe?**👉 Nell'immagine: candele e timeframe.
     
      **Corpo della candela = parte colorata compresa tra Apertura e Chiusura**.
      Massimo = punto più alto raggiunto dalla candela  |  Minimo = punto più basso raggiunto dalla candela
      I tratti sottili sopra e sotto il corpo della candela rappresentano le **ombre (Wick)**.

      **Esempio con timeframe M5:** 
      alle 10:00 inizia una nuova candela; nei 5 minuti successivi il prezzo può salire e scendere e la candela può cambiare colore. Alle 10:05 la candela si chiude: se il prezzo è sopra quello di apertura è rialzista, se è sotto è ribassista.
Il colore finale indica quindi quale pressione ha prevalso in quei 5 minuti: **compratrice se la candela chiude rialzista (verde nell'immagine), venditrice se chiude ribassista (rossa nell'immagine).**

      **Come si sceglie il giusto timeframe?**⏰
  Non esiste un timeframe migliore in assoluto: dipende da cosa vuoi osservare.

**Timeframe superiore → quadro generale**
Serve per capire l’andamento e il contesto generale.

**Timeframe inferiore → “zoom” sul prezzo**
Mostra lo stesso mercato in intervalli di tempo più brevi: permette di cercare una possibile conferma per l’ingresso.

Un modo pratico come riferimento iniziale:
Puoi scendere a un timeframe circa **4–6 volte più breve.**
**H4 → H1**
**H1 → M15**

      **2 - Perchè ci sono 2 prezzi?**👉 Nell'immagine: bid/ask e spread.
      
    👀Ricorda: i compratori vogliono comprare al prezzo più basso possibile,
        i venditori vogliono vendere al prezzo più alto possibile.
💡  
     **Ask:** miglior offerta di vendita disponibile → se vuoi comprare, è il miglior prezzo a cui puoi comprare.
     **Bid:** miglior offerta di acquisto disponibile → se vuoi vendere, è il miglior prezzo a cui puoi vendere.

     **Ask-Bid= Spread.** Generalmente **Ask > Bid**.

    ** Lo spread è il divario tra il prezzo a cui puoi comprare e quello a cui puoi vendere.** Questa differenza rappresenta un piccolo **costo quando entri in un’operazione.**

      🛍️**3 - Quanto è facile trovare compratori e venditori? liquidità.**
Quando invii un ordine, deve esserci una controparte dall’altra parte dello scambio: **più è facile trovarla a prezzi vicini a quelli attuali, maggiore è la liquidità.**
Quindi in un mercato ad alta liquidità è più semplice entrare e uscire da un’operazione e gli spread tendono a essere più contenuti.

**Esempio:** vuoi vendere un asset che in quel momento viene scambiato intorno a 10 €.
Se ci sono molti compratori disposti a pagare circa 10 €, puoi venderlo facilmente vicino a quel prezzo.
Se invece i compratori sono pochi e alcuni sono disposti a pagare solo 9,50 €, per vendere subito potresti dover accettare un prezzo più basso.

      `,
    answers: [
      { key: 'A', text: 'Evidenzio i livelli chiave e ignoro il rumore.' },
      { key: 'B', text: 'Considero ogni minimo movimento con lo stesso peso.' },
      { key: 'C', text: 'Cambio idea ad ogni candela senza criterio.' },
    ],
    feedback:
      ` ** IMPOSTARE UN\'OPERAZIONE**
     ** 4 - Come scegli quando entrare?** 👉 Nell'immagine: ordine Market, Limit e Stop.
      
** 5 - Ma quanto stai comprando o vendendo? i Lotti**
Quando apri un’operazione non scegli soltanto se comprare o vendere, ma anche quanto acquistare o vendere.
Un lotto standard corrisponde a **100.000 unità della valuta base** della coppia. Esistono però dimensioni più piccole:
* 1 lotto = 100.000 unità
* 0,1 lotti = 10.000 unità
* 0,01 lotti = 1.000 unità
Esempio: in EUR/USD, l’euro è la valuta base. Aprire una posizione da 0,01 lotti significa quindi operare su 1.000 EUR.

La quantità non si sceglie a caso: **più avanti vedremo come collegarla al rischio e allo Stop Loss.**

**6 - Ma se 0,01 lotti sono già 1.000 €, significa che devo avere 1.000 € sul conto? la Leva**
•Non necessariamente. Supponiamo che hai **500 € di capitale sul conto.**

La **leva disponibile dipende dal broker** e dallo strumento, quindi non la scegli te.
•**Tu → scegli la dimensione della posizione indicando i lotti.** Per esempio, su EUR/USD **0,01 lotti = 1.000 EUR di posizione.**
Esposizione totale =1000 € significa che stai controllando una posizione sul mercato del valore di 1.000 €.

•A quel punto la **piattaforma calcola il Margine richiesto**: è la **parte del capitale che viene “riservata” per mantenere aperta quella posizione.** Non viene spesa, ma finché l’operazione è aperta non è disponibile come margine libero.

•**Leva 10:1 significa: per ogni 1 € di margine puoi controllare 10 € di posizione.**

•**→ Margine = dimensione della posizione / leva**
1000 € / 10 = 100 € → **Margine richiesto: 100€**
Ma stai comunque operando su 1.000 €, non su 100 €: per questo la leva amplifica l’effetto dei movimenti del prezzo.

• Guarda l'immagine a destra: il risultato si calcola sulla **posizione**.
Posizione 1.000 € → **esempio movimento ±1%** → **risultato ±10 €**
Conto 500 € →** 490 € se perdi / 510 € se guadagni.**

🔎**Unità di Pip**
Indica di **quanto si è mosso il prezzo di una coppia Forex.**

Nelle coppie **senza** lo yen (JPY): **1 pip = 0,0001**

EUR/USD: 1,1500 → 1,1520 = +20 pips
GBP/USD: 1,3000 → 1,3045 = +45 pips

Nelle coppie **con lo yen (JPY): 1 pip = 0,01**

USD/JPY: 145,20 → 145,50 = +30 pips

Il pip è utilizzato soprattutto nel Forex. Su altri strumenti il movimento del prezzo può essere espresso in punti, tick o altre unità, a seconda dello strumento e della piattaforma.
`,
  },
  {
    id: 'intro-step-3',
    order: 3,
    title: 'Step C — Esempio di un’operazione rialzista: grafico reale',
    block: 'Timeframe superiore · Zona · Trigger · Stop Loss · Take Profit',
    question: ` **COME SI COSTRUISCE UN\'OPERAZIONE RIALZISTA (O LONG)**

**Obiettivo:** Esempio pratico di un\'operazione rialzista: sul timeframe superiore si individua trend e zona; su quello inferiore cerchiamo l\'ingresso e definiamo stop loss e take profit.

** • Sul timeframe superiore si individua il trend rialzista e le zone**

**1 - Da dove inizia la struttura rialzista?**
Prima di cercare il trend rialzista, capiamo quando la precedente** struttura ribassista smette di essere valida.**

____Cosa sostiene la struttura ribassista?
 Abbiamo imparato che ciò che sostiene un trend ribassista sono i** massimi strutturali: i massimi da cui nasce un nuovo minimo più basso rispetto al precedente.**

____Quando un massimo è davvero strutturale (in un trend ribassista)?
Non basta che da quel massimo nasca un minimo più basso rispetto al precedente (come il minimo 1), serve che **una candela chiuda al di sotto del livello del minimo precedente.**

Ora sappiamo riconoscere un **massimo strutturale ribassista**. ____

_____Troviamo l\'inizio del trend rialzista.

Adesso ci interessa il **riferimento più recente che mantiene valida la struttura ribassista**: **l\'ultimo massimo ribassista** che si è formato (indicato sul grafico).

Tracciamo la linea arancione in orizzontale, cioè il livello di **rottura**: se una candela supera questo livello il trend diventa rialzista.

 ____**🟡 è il punto di conferma: qui il prezzo supera il livello arancione.**
Non basta che sia l\'ombra a superarla, serve una **chiusura della candela sopra il livello per confermare il cambio trend da ribassista a rialzista.**

**Inizia la nuova struttura rialzista.**
_____
**2 - Minimi strutturali rialzisti (nel grafico sono i 🔵)**

I ** minimi strutturali sono i minimi da cui nasce un nuovo massimo più alto rispetto al precedente.**

____Quando un minimo è davvero strutturale (in un trend rialzista)? 
Non basta che da quel minimo nasca un massimo più alto rispetto al precedente, **serve che una candela chiuda al di sopra del livello del massimo precedente.**

Sul grafico:
Il Minimo 2 crea il nuovo Max 2.
Il **🟢 indica la candela grigia che chiude sopra il livello dal Max 1 precedente: questa chiusura conferma che il minimo 2 🔵 è strutturale rialzista**.
_____

**CONCETTO CHIAVE: specularità**
ribassista: massimo strutturale → nuovo minimo → chiusura sotto
rialzista: minimo strutturale→ nuovo massimo → chiusura sopra

    **3 - Zona interessante - nasce da un minimo strutturale rialzista (o da un massimo nel caso di struttura ribassista)**

  ____ **A cosa serve**
È l’area in cui, se il prezzo ritorna, iniziamo a osservare se può esserci una **continuazione del movimento rialzista e una possibile conferma per un ingresso Long.**

_____ **Come viene costruita**
Nel caso di una struttura rialzista, la zona viene rappresentata prendendo il range di prezzo della candela che forma il minimo strutturale, cioè **l’area compresa tra il suo massimo e il suo minimo, e proiettandolo verso destra nel tempo.**

 
____**Quale candela utilizzo?**
Si utilizza sempre la **candela che forma il minimo strutturale rialzista.**👉🏻
Se prima di questa candela di minimo è **presente anche una candela ribassista non eccessivamente lunga, la zona può essere ampliata includendo anche quest’ultima.**
`,
    answers: [
      { key: 'A', text: 'Osservo prima il timeframe superiore, poi cerco conferma sul timeframe inferiore.' },
      { key: 'B', text: 'Parto direttamente dal timeframe inferiore senza contesto.' },
      { key: 'C', text: 'Scelgo ingresso e gestione senza definire prima la zona.' },
    ],
    feedback: `



    •**Ci spostiamo su un TIMEFRAME INFERIORE**

**TRIGGER: possibile conferma per l’ingresso.**

**Cerchiamo la conferma di una ripresa di trend rialzista: 
un riallineamento con il trend rialzista osservato sul timeframe superiore. Questo punto rappresenta l'ingresso rialzista (o Long).**

Come abbiamo fatto prima, per trovarla cerchiamo il punto in cui il trend ribassista viene invalidato. Quindi individuiamo** l’ultimo massimo strutturale ribassista**, cioè il riferimento più recente che mantiene valida quella struttura.

Dal suo livello tracciamo una **linea orizzontale.**

La conferma arriva quando una **candela rompe e chiude sopra questo livello**: **inizio trend rialzista confermato**
la precedente struttura ribassista viene invalidata e il prezzo mostra un possibile **riallineamento alla struttura rialzista osservata sul timeframe superiore.**
Nel grafico, il 🟡 indica proprio questo punto di conferma: nel nostro esempio è il Trigger, cioè il possibile punto di ingresso Long.


**TAKE PROFIT**
 Rivedi il primo **grafico del timeframe superiore** .Spesso viene posizionato sul **massimo strutturale creato dal minimo da cui è nata la zona (minimo 1), è proprio il Max 1.**
Rappresenta il primo obiettivo logico del movimento rialzista.

**STOP LOSS**
Viene posizionato **sotto la zona che era stata individuata sul timeframe superiore.**
Rappresenta il livello **sotto la quale l’idea di operazione non viene più considerata valida.**

    **7 - Come scegli quanti lotti usare?**

Prima decidi quanto sei disposto a perdere al massimo e individui lo Stop Loss.
Poi scegli i lotti in modo che, se il prezzo raggiunge lo Stop Loss, la perdita resti entro quel limite.

A parità di rischio:
Stop Loss più lontano → meno lotti
Stop Loss più vicino → più lotti

Esempio: conto 1.000 €, rischio massimo 1% = 10 €. Con uno Stop Loss di 20 pips e uno di 50 pips userai quantità diverse, ma in entrambi i casi l’obiettivo è non superare circa 10 € di perdita.

    **8 - Rischio/Rendimento e Win Ratio**: Non conta solo quante operazioni vinci, ma anche quanto guadagni quando hai ragione e quanto perdi quando sbagli.

    Rapporto Rischio/Rendimento Indica quanto sei disposto a perdere rispetto al guadagno che cerchi. 
    
    Esempio: 1:2 significa rischiare 10 EUR per puntare a 20 EUR. Win Ratio È la percentuale di operazioni chiuse in profitto. Se vinci 4 operazioni su 10, il tuo Win Ratio è del 40%. Qual è il rapporto tra i due? Più alto è il guadagno medio rispetto alla perdita media, meno operazioni vincenti servono per compensare quelle perdenti. 
    
    Al contrario, se guadagni poco quando vinci e perdi molto quando sbagli, può non bastare nemmeno un Win Ratio elevato. 
    
    ** Esempio semplice, ignorando costi e spread: Rischio/Rendimento Win Ratio circa necessario per il pareggio 1:1 50% 1:2 33% 1:3 25% Esempio: Win Ratio 40% e Rischio/Rendimento 1:2 Immagina 10 operazioni, rischiando 10 EUR per tentare di guadagnarne 20. Se 4 operazioni vincono e 6 perdono: guadagni 80 EUR e perdi 60 EUR. Il risultato complessivo è +20 EUR, anche se hai vinto solo 4 volte su 10. **
`,
    riskWinSection: {
      title: '8 - Rischio/Rendimento e Win Ratio: perché vanno letti insieme',
      intro:
        'Non conta solo quante operazioni vinci, ma anche quanto guadagni quando hai ragione e quanto perdi quando sbagli.',
      riskRewardCard: {
        title: 'Rapporto Rischio/Rendimento',
        text:
          'Indica quanto sei disposto a perdere rispetto al guadagno che cerchi. Esempio: 1:2 significa rischiare 10 EUR per puntare a 20 EUR.',
      },
      winRatioCard: {
        title: 'Win Ratio',
        text:
          'È la percentuale di operazioni chiuse in profitto. Se vinci 4 operazioni su 10, il tuo Win Ratio è del 40%.',
      },
      relationTitle: 'Qual è il rapporto tra i due?',
      relationText:
        'Vanno letti insieme: un guadagno medio maggiore della perdita può compensare anche diverse operazioni perdenti',
      exampleTitle: 'Esempio: Win Ratio 40% e Rischio/Rendimento 1:2',
      exampleText:
        'Su 10 operazioni rischi 10 € per cercare di guadagnarne 20.\n\nSe 4 operazioni vincono e 6 perdono:\n\n• 4 × 20 € = 80 € guadagnati\n\n• 6 × 10 € = 60 € persi\n\n**Risultato complessivo: +20 €**, anche se hai vinto solo 4 volte su 10.',
      closingText:
        '',
    },
  },
]

export function getIntroStepById(stepId) {
  return INTRO_STEPS.find((step) => step.id === stepId) || null
}
