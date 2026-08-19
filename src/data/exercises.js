const EXERCISE_ITEMS = [
  {
    id: 'day1-ex1',
    day: 1,
    title: 'Step 1 — Quando cambia il trend?',
    block: 'Trend / contesto',
    description: 'Individua le direzioni principali osservando la sequenza di massimi e minimi.',
    imageBefore: '/Grafici_2/domanda_trend_giorno_1.PNG',
    imageAfter: '/Grafici_2/risposta_trend_giorno_1.PNG',
    chartMeta: {
      source: 'Grafico qualitativo',
      timeframe: '',
      instrument: '',
    },
    question: `
Osserva il grafico **da sinistra verso destra. Nella prima parte il mercato costruisce una chiara struttura rialzista.**

👀 Questa volta concentrati soprattutto sui minimi che compongono il trend rialzista.

 Alcuni sono semplici oscillazioni interne, mentre altri rappresentano le impalcature della struttura rialzista: sono i minimi che, una volta formati, costruiscono nuovi massimi.

Chiediti:

• **I minimi principali stanno continuando a formarsi progressivamente più in alto?**

• **Quali minimi stanno realmente sostenendo la struttura rialzista? Cerca l'ultimo minimo (della struttura rialzista)da cui si è formato un nuovo massimo: è questo il minimo da considerare.**

• **Da quest'ultimo minimo, immagina una linea orizzontale. In quale punto il prezzo rompe e chiude al di sotto di questa linea? **


•**Obiettivo**: individua il punto in cui avviene la rottura di questa linea (livello di rottura), indica un'invalidazione della struttura ribassista, quindi il passaggio da rialzista a ribassista.

👉 **Domanda**: osservando i punti 1, 2 e 3, in quale punto viene invalidata la struttura rialzista e cambia la direzione, da rialzista a ribassista?`,
    answers: [
      { key: 'A', text: 'Punto 1' },
      { key: 'B', text: 'Punto 2' },
      { key: 'C', text: 'Punto 3' },
    ],
    correctAnswer: 'C',
    feedback: `🟩 **Risposta corretta: Punto 3.**


📈 Il mercato sta costruendo un trend rialzista perché i suoi minimi strutturali principali si formano progressivamente più in alto. Finché continuano a essere rispettati, la struttura rialzista rimane valida.

👀 Ma non tutti i minimi hanno la stessa importanza.

•**Dai punti 1 e 2 (minimi), il prezzo riparte verso l'alto, ma NON crea nuovi massimi più alti rispetto ai precedenti.** La struttura rialzista però non è ancora invalidata.

•👀**Per trovare il punto di invalidazione della struttura rialzista:**

individua **l'ultimo minimo strutturale della fase rialzista**: è il minimo da cui il prezzo crea l'ultimo nuovo massimo.

•🎯 **Arriviamo al Punto 3.**

Da quel minimo immaginiamo una linea orizzontale (livello di rottura): è il livello che non deve essere rotto affinchè la struttura resti rialzista.

Nel Punto 3 il prezzo rompe questo livello, cioè una candela chiude al di sotto del suo livello, e accade qualcosa di diverso:

- viene meno l'ultimo minimo che sosteneva la struttura rialzista;

- la sequenza di minimi crescenti viene invalidata;

- i compratori non riescono più a mantenere la precedente struttura;


•🔄 **Al Punto 3 la struttura rialzista viene invalidata, per iniziare poi la struttura ribassista.**
`,
    takeaway:
      'Per riconoscere una direzione non basta guardare una singola candela o un singolo movimento. Devi osservare la sequenza: massimi e minimi crescenti indicano una struttura rialzista, mentre massimi e minimi decrescenti indicano una struttura ribassista.',
  },
  {
    id: 'day1-ex2',
    day: 1,
    title: 'Step 2 — Zone per cercare un trade long',
    block: 'Zone importanti',
    description: 'Trova le zone chiave dove il prezzo ha reagito in passato.',
    imageBefore: '/Grafici_2/domanda_zone_giorno_1.PNG',
    imageAfter: '/Grafici_2/risposta_zone_giorno_1.PNG',
    chartMeta: {
      source: 'Grafico qualitativo',
      timeframe: '',
      instrument: '',
    },
    question: `**Qui analizzi lo stesso grafico di Step 1.**
    
    Osserva il grafico **da sinistra verso destra.** Nella prima parte il mercato si muove in **trend rialzista. **
    
    💡**Cos’è concretamente una zona?**

È un’area di prezzo individuata a partire dagli **estremi di una candela: in verticale comprende il range tra il suo massimo e il suo minimo.**
Sul grafico la **estendiamo poi verso destra, cioè nel tempo, per osservare cosa succede se il prezzo torna in quel range.**


In poche parole: la zona conserva il range di prezzi di quella candela e lo proietta in avanti nel grafico.

   👀 **Obiettivo: capire su quali minimi abbia senso cercare una possibile zona interessante.**

   💡 **Una zona diventa interessante per un possibile trade long, quando si trova intorno a un minimo da cui si creano nuovi massimi più alti, continuando la struttura rialzista.**

Per riconoscerla:

• da quel minimo il prezzo ha costruito un nuovo massimo pù alto del precedente?

• la struttura continua con massimi e minimi sempre più alti?

• oppure la struttura rialzista è già stata invalidata?

👉 **Domanda**: osservando le zone 1, 2, 3 e 4, quali sono le zone corrette in cui avrebbe senso cercare trade long?`,
    answers: [
      { key: 'A', text: 'Zone 1 e 3' },
      { key: 'B', text: 'Zona 2 e 3' },
      { key: 'C', text: 'Zona 1 e 4' },  
      { key: 'D', text: 'Zona 2 e 4' }, 
    ],
    correctAnswer: 'A',
    feedback: `🟩 **Risposta corretta: Zone 1 e 3.**
    
•**Principio semplice:**

👀 In un trend rialzista, una **zona può diventare interessante per cercare un possibile trade long quando si trova intorno a un minimo da cui il prezzo riparte e continua la struttura rialzista, costruendo un nuovo massimo più alto, rispetto al precedente.**


•Zona 1 — corretta

Da questo minimo il prezzo riparte verso l’alto e costruisce un nuovo massimo più alto. La struttura rialzista continua: per questo la Zona 1 è coerente con la ricerca di un possibile trade long.

•Zona 2 — errata

Il prezzo prova a ripartire da questo minimo, ma ** non riesce a superare il massimo precedente.** Successivamente scende e costruisce un minimo più basso (🔴)

📌 Vogliamo vedere che da quella zona il prezzo riesca effettivamente a proseguire la struttura rialzista.

•Zona 3 — corretta

Da questo minimo il prezzo riparte e costruisce un nuovo massimo più alto, continuando la struttura rialzista. Anche la Zona 3 è quindi coerente.

•Zona 4 — errata

**Attenzione❗: la precedente struttura rialzista è già stata invalidata in 🔵 ( 🔵 è il punto 3 trovato nel Step 1), la zona 4 è dopo 🔵, quindi siamo già nel trend ribassista.**

Da questo minimo il prezzo non riesce a costruire un nuovo massimo più alto e successivamente torna a scendere.




`,
  },
  {
    id: 'day1-ex3',
    day: 1,
    title: 'Step 3 — Dove entrare nella zona dello step 2',
    block: 'Trigger / Rischio',
    description: 'Valuta le condizioni che invalidano lo scenario e il rischio residuo.',
    imageBefore: '/Grafici_2/domanda_trigger_giorno_1.PNG',
    imageAfter: '/Grafici_2/risposta_trigger_giorno_1.PNG',
    chartMeta: {
      source: 'Grafico qualitativo',
      timeframe: '',
      instrument: '',
    },
    question: `**Nello Step 2 abbiamo individuato la Zona 1 come un’area interessante** per cercare un possibile trade long.

Ora passiamo a un **time frame inferiore** per cercare un possibile punto di ingresso.

📌 Il contesto di partenza è questo:

• da Step 2: sul time frame superiore la Zona 1 si trova su un minimo che sostiene una struttura rialzista;

•sul **timeframe inferiore**, come noterai sul grafico qua sopra, è presente una **struttura ribassista.**

• **Obiettivo: sul timeframe inferiore (grafico qua rappresentato), cerchiamo il punto di conferma della ripresa del trend rialzista, osservato sul timeframe superiore: il possibile ingresso long** (trigger)


👀 Prima di rispondere, **chiediti**:

• nota bene: è presente un trend ribassista da sinistra verso destra. Il prezzo sta ancora formando massimi e minimi decrescenti?

• quale massimo mantiene valida la struttura ribassista? Cioè: qual'è l'ultimo massimo della struttura ribassista?

• da quell'ultimo massimo immagina un livello orizzontale. In quale punto il prezzo rompe quel livello? Questa rottura rappresenta il punto di conferma del cambio di struttura da ribassista a rialzista.

👉 **Domanda:** osservando i punti 1, 2 e 3, qual è il punto in cui conviene entrare long?`,
    answers: [
      { key: 'A', text: 'Punto 1 ' },
      { key: 'B', text: 'Punto 2' },
      { key: 'C', text: 'Punto 3' },
     ],
    correctAnswer: 'C',
    feedback: `🟩 **Risposta corretta: Punto 3.**

**Sul time frame superiore avevamo individuato la Zona 1** come un’area in cui cercare un possibile long.

 •**Obiettivo: ora sul timeframe inferiore, cerchiamo una conferma della ripresa del trend rialzista, osservato sul timeframe superiore.**

 **Notiamo che il prezzo sta ancora formando una struttura ribassista.**

•Punto 1 — troppo presto

Al Punto 1 il prezzo sta ancora scendendo e continua a formare massimi e minimi decrescenti.

La struttura ribassista è ancora valida: entrare qui significherebbe anticipare il possibile cambio di direzione, senza una conferma.

•Punto 2 — non basta

Al Punto 2 il prezzo supera la linea orizzontale creata da un massimo. Ma quel massimo non è l’ultimo massimo della struttura ribassista.

Il ribasso sul time frame inferiore non è quindi ancora invalidato.

•Punto 3 — conferma

Al Punto 3 il prezzo rompe verso l'alto **il livello creato dall’ultimo massimo della struttura ribassista (indicato con 🔴).**

•🎯 Quindi il Punto 3 è il trigger dell’esercizio: **è la conferma della ripresa del trend rialzista, che era stato osservato su timeframe superiore.**
    
   `,
  },
  {
    id: 'day3-ex1',
    day: 3,
    title: 'Esercizio 7 — Quante volte la struttura diventa ribassista?',
    block: 'Trend / contesto',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 2.',
    imageBefore: '/Grafici_2/trend_domanda_2.jpeg',
    imageAfter: '/Grafici_2/trend_risposta_2_AGGIUNTA.JPG',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 H',
      instrument: 'Gold Spot / USD',
    },
    question:
      ` Ora lavoriamo su un **grafico reale**, quindi troverai più oscillazioni rispetto agli esempi precedenti. Per facilitare la lettura, la struttura principale è già stata disegnata sul grafico.

•👀 Concentrati sui **minimi che sostengono realmente il trend rialzista:** **sono quelli dai quali il mercato è riuscito successivamente a creare nuovi massimi rispetto ai precedenti.**

**🧐Rifletti bene**: perché un minimo venga confermato come minimo strutturale rialzista, il prezzo deve successivamente creare un nuovo massimo, con **una candela che chiude sopra il livello del massimo precedente.**

•**Obiettivo:** individuare in quali punti la struttura passa da rialzista a ribassista.

**Chiediti:**

• **quali minimi sostengono la struttura rialzista? Per ciascuno verifica: il massimo creato chiude davvero sopra il livello del massimo precedente? Se non accade, quel minimo non diventa un nuovo riferimento strutturale rialzista.**

• **da questi minimi immagina una linea orizzontale, esiste una candela che la supera, con chiusura al di sotto?**

• ** quante volte si ha un passaggio da struttura rialzista a ribassista?**

👉 **Domanda:** osservando l’intero grafico, in quanti punti la struttura diventa realmente ribassista, anche solo temporaneamente?`,
    answers: [
      { key: 'A', text: '1 volta' },
      { key: 'B', text: '2 volte' },
      { key: 'C', text: '3 volte' },
      { key: 'D', text: 'Nessuna volta' },
    ],
    correctAnswer: 'A',
    feedback: `🟩**Risposta corretta: 1 volta.**

Il grafico contiene numerosi ribassi, ma questo non significa che il trend diventi ribassista ogni volta.

•Nella prima parte, il **minimo 🔴 che sostiene la struttura rialzista.**

**Da quel punto il mercato genera un nuovo massimo più alto del precedente.** Le oscillazioni successive producono altri minimi, 

ma nessuno di questi genera a sua volta un nuovo massimo: per questo non diventano nuovi minimi strutturali dominanti.

_______

•**Ma il Massimo 2?**

**Per far sì che il minimo (🟡), che genera il massimo 2, sia un nuovo minimo strutturale rialzista, è necessario che il massimo 2 ( una candela), chiuda sopra la linea celeste del massimo 1. **


•**Ma qual è il livello del massimo 1?**

È l’estremo più alto raggiunto dalla candela (ombra superiore), cioè la punta della wick, **evidenziata dalla linea celeste.**


 In questo caso possiamo vedere che non accade.



Sopra il massimo 1 possono attivarsi nuovi acquisti, ma la pressione dei venditori riesce a riportare il prezzo sotto il livello: questa è una **presa di liquidità.**

**Conseguenza:**


Non essendoci una chiusura della candela sopra la linea celeste, il **massimo 2 non viene confermato come nuovo massimo**, di conseguenza il **minimo da cui è partito (🟡) non diventa un nuovo minimo strutturale rialzista.**
_______

**Finché il livello (linea arancione) stabilito dal minimo 🔴 rimane intatto, la struttura rialzista non viene invalidata.** 

•Al **punto A il mercato riparte e conferma nuovamente la direzione rialzista.**

•Più avanti troviamo invece il **minimo 🔵**. Questo minimo è diverso: **da lì il prezzo riesce effettivamente a costruire nuovi massimi e diventa quindi un nuovo riferimento strutturale.**

🎯 **Successivamente il prezzo rompe il livello di quel minimo e chiude al di sotto del suo livello: la struttura rialzista viene invalidata e diventa temporaneamente ribassista.**

Il ribasso non dura a lungo: al **punto B il mercato recupera il livello strutturale superiore e torna rialzista.**
`,
  },
  {
    id: 'day3-ex2',
    day: 3,
    title: 'Esercizio 8 — Quale zona non è valida?',
    block: 'Zone importanti',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 2.',
    imageBefore: '/Grafici_2/zone_domanda_2.jpeg',
    imageAfter: '/Grafici_2/zone_risposta_2.jpeg',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 H',
      instrument: 'Gold Spot / USD',
    },
    question: `

•**Obiettivo:**confronta le 4 zone (minimi) segnate sul grafico e individua quale non può essere considerata un minimo strutturale **confermato**.

•👀 Osserva cosa succede dopo ciascuna zona.

Ricordati ciò che abbiamo detto negli esercizi precedenti, una zona (in questo caso un minimo) diventa importante quando da quel punto il mercato fa qualche cosa…ricordi?

**Chiediti:**

•** da quali zone è partito un movimento capace di generare nuovi massimi?**

•** quale minimo ha realmente sostenuto la continuazione del trend?**

•** c’è una zona che, per ora, non ha ancora prodotto questa conferma?**

👉 **Domanda: **quale delle quattro zone indicate non può essere ancora considerata un minimo strutturale **confermato**?
 

`,
    answers: [
      { key: 'A', text: 'Zona 1' },
      { key: 'B', text: 'Zona 2' },
      { key: 'C', text: 'Zona 3' },
      { key: 'D', text: 'Zona 4' },
    ],
    correctAnswer: 'D',
    feedback: `
🟩 **Risposta corretta: Zona 4.**

Per capire quale zona sia errata, non basta osservare dove il prezzo ha semplicemente reagito. 

Dobbiamo verificare cosa è successo dopo quel minimo.

•**Le Zone 1, 2 e 3 sono valide** perché, partendo da quei minimi, il mercato è riuscito successivamente a costruire **nuovi massimi più alti rispetto ai precedenti**. Questo ci mostra che quei punti hanno realmente sostenuto la struttura rialzista e possono quindi essere considerati minimi portanti.

•La **Zona 4**, invece, è diversa.

Al momento mostrato nel grafico **non ha ancora creato un massimo più alto del precedente**. 

Per questo motivo non possiamo ancora sapere se quel minimo avrà davvero un ruolo strutturale oppure se rappresenterà soltanto una reazione temporanea.

•👀 **Se in futuro** il mercato partirà dalla Zona 4 e riuscirà a superare il massimo precedente, allora quel minimo potrà diventare un nuovo riferimento valido.

📌 Per ora, però, la** Zona 4 non è ancora confermata.**

`,
  },
  {
    id: 'day3-ex3',
    day: 3,
    title: 'Esercizio 9 — Qual è il trigger corretto su M1?',
    block: 'Trigger / Rischio',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 2.',
    imageBefore: '/Grafici_2/trigger_domanda_2.jpeg',
    imageAfter: '/Grafici_2/trigger_risposta_2.jpeg',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 min',
      instrument: 'Gold Spot / USD',
    },
    question: `**Riepilogo Step 7-8: **Negli esercizi precedenti abbiamo individuato sul time frame H1 la Zona 1 come un’area coerente con il trend rialzista.

•**Ora scendiamo su M1** e osserviamo cosa accade quando il prezzo entra nella zona. 

• **Obiettivo: sul timeframe inferiore, cerchiamo una conferma della ripresa del trend rialzista, osservato sul timeframe superiore: il possibile ingresso long** (trigger)

👀 **Prima di cercare il trigger.**
La zona indica dove iniziare a cercare una possibile reazione, ma il trigger non deve necessariamente trovarsi al suo interno. Il prezzo può entrare nella zona e poi uscirne verso l’alto.
Quello che devi verificare è che prima del trigger la zona non sia già stata invalidata: ossia non ci sia una candela che chiuda sotto al limite **inferiore della zona**.

**Chiediti**:

• **qual è l’ultimo massimo che sostiene realmente la struttura ribassista?**

• **quel massimo ha prodotto nuovi minimi?**

• **quale candela riesce a rompere il livello creato dall\'ultimo massimo (con chiusura della candela sopra il livello)?**

• prima del punto di trigger individuato, almeno una **candela ha chiuso sotto il limite inferiore della zona?**

👉** Domanda:** quale delle candele indicate rappresenta il trigger più corretto per cercare un ingresso long?


`,
    answers: [
      { key: 'A', text: 'Candela 2' },
      { key: 'B', text: 'Candela 1' },
      { key: 'C', text: 'Candela 3' },
      
    ],
    correctAnswer: 'B',
    feedback: `🟩 **Risposta corretta: Candela 1.**

•**Ricorda:**Sul time frame superiore abbiamo già individuato la Zona 1 come area in cui cercare possibili operazioni long.

•Scendendo su M1, però, vediamo che il prezzo entra nella zona mantenendo ancora una struttura ribassista.

Per entrare non basta quindi osservare una semplice reazione dentro alla Zona 1: dobbiamo aspettare che questa **struttura ribassista venga realmente invalidata.** 

•👀 **Il livello evidenziato dalla linea arancione corrisponde all’ultimo massimo strutturale del ribasso su M1.**

È un massimo importante perché, dopo essersi formato, il prezzo ha continuato a scendere creando nuovi** minimi** (🔴). Finché quel massimo non viene superato, la struttura ribassista rimane valida.

•**🎯 La Candela 1 è la prima che rompe e chiude sopra questo livello.** 

**In quel momento il precedente trend ribassista su M1 viene invalidato, è una conferma di un possibile trend rialzista.**

•**il setup è valido? **: in questo caso, prima del punto di trigger individuato (Candela 1), nessuna candela ha chiuso sotto il limite inferiore della zona, quindi la Zona non è stata invalidata. Questo ci conferma che il setup per l'ingresso può essere utilizzato.

•Abbiamo quindi il ciò che stavamo cercando:

- Il trigger corretto è quindi la Candela 1: la prima conferma strutturale del riallineamento tra time frame inferiore e superiore.

- il prezzo non supera il limite inferiore della zona, quindi non viene invalidato il setup per un possibile ingresso;


Le Candele 2 e 3 arrivano invece **quando il cambio strutturale è già avvenuto.**


🛡️ **Stop Loss: il punto più logico per posizionarlo è sotto la Zona 1, perché quella zona sostiene la struttura rialzista del time frame superiore. Se il prezzo la rompesse al ribasso, verrebbe meno il motivo principale per mantenere aperta l’operazione long.**`,
  },
  {
    id: 'day2-ex1',
    day: 2,
    title: 'Esercizio 4 — Quali minimi generano una continuazione del trend? ',
    block: 'Trend / contesto',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 3.',
    imageBefore: '/Grafici_2/domanda_trend_3.jpeg',
    imageAfter: '/Grafici_2/risposta_trend_3.png',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 H',
      instrument: '',
    },
    question: `In questo esempio teorico il mercato si trova in trend rialzista.
    
    •**Obiettivo:** capire quali minimi possono essere considerati realmente strutturali e quindi punti da cui parte una continuazione del trend.

    **👀Importante: il livello del massimo precedente corrisponde al punto più alto raggiunto dal prezzo, cioè all’estremo della sua ombra (wick).**

• Fai particolare attenzione a un dettaglio: non basta che il prezzo superi momentaneamente un massimo precedente con l’ombra della candela. Per confermare la continuazione vogliamo vedere che **una candela chiuda sopra il livello del massimo precedente**.

Nei punti **a e b è rappresentata proprio l’ombra di una candela**: osserva quindi con attenzione cosa viene realmente superato e cosa invece viene confermato in chiusura.

👉 **Domanda:** quali tra i minimi 1, 2, 3 e 4 rappresentano correttamente punti da cui parte una continuazione del trend rialzista?



`,
    answers: [
      { key: 'A', text: 'Minimi 1 e 4' },
      { key: 'B', text: 'Minimi 2 e 3' },
      { key: 'C', text: 'Minimi 1, 2 e 3' },
    
    ],
    correctAnswer: 'B',
    feedback: `🟩 Risposta corretta: Minimi 2 e 3.

    • Osserva: i cerchi 🟡 indicano i punti in cui la chiusura viene confermata sopra il livello del massimo precedente.

•Per riconoscere un minimo strutturale non basta vedere il prezzo reagire verso l’alto:

dobbiamo verificare se il movimento successivo riesce realmente a superare e chiudere sopra il livello del massimo precedente.

•Il **Minimo 1** può sembrare un minimo strutturale perché nel punto “a” il prezzo supera momentaneamente il livello del massimo precedente.

Notiamo però che a superarlo è l’ombra a della candela: il corpo non chiude sopra quel livello. Quindi il **Minimo 1 non è un minimo strutturale rialzista**.

•Dal **Minimo 2**, invece, il prezzo riparte creando un nuovo massimo: qui la candela chiude sopra il livello del massimo precedente. 

Questo conferma che il **minimo 2 ha sostenuto una vera continuazione del trend rialzista**.

•Lo stesso accade con il **Minimo 3**: il movimento successivo supera con chiusura il livello del massimo strutturale precedente, rendendo anche questo minimo valido.

•Il **Minimo 4** invece non viene confermato:

il movimento che parte da quel minimo non riesce a superare il livello del massimo precedente, né con la wick né con una chiusura. Successivamente si forma un nuovo minimo e sarà il movimento partito da quest’ultimo a superare il livello; per questo sarebbe quel nuovo minimo a diventare strutturale, non il Minimo 4.

`,
  },
  {
    id: 'day2-ex2',
    day: 2,
    title: 'Esercizio 5 — Quali sono le zone di conferma di una struttura rialzista?',
    block: 'Zone importanti',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 3.',
    imageBefore: '/Grafici_2/domanda_zone_3.jpeg',
    imageAfter: '/Grafici_2/risposta_zone_3.png',
    chartMeta: {
      source: 'TradingView',
      timeframe: '1 H',
      instrument: '',
    },
    question: `Riprendiamo la stessa struttura teorica dell’esercizio precedente. 
    
    Questa volta devi individuare le **zone da prendere in considerazione per cercare conferme della continuazione del trend rialzista.**
 
👀 **Quando una zona diventa interessante per un trade long?:** una zona è valida solo se nasce da un minimo da cui il mercato riesce poi a generare un nuovo massimo più alto. **In più, perchè questo nuovo massimo venga confermato, una candela deve chiudere sopra il livello del massimo precedente.**

**Non basta che il prezzo superi quel livello con la sola ombra della candela (wick). Per confermare la continuazione rialzista serve una chiusura del corpo della candela oltre quel livello.**

👉 **Domanda:** quali tra le zone 1, 2, 3, 4 e 5 possono essere considerate valide per cercare trade rialzisti?


`,
    answers: [
      { key: 'A', text: 'Zone 2, 3, 5' },
      { key: 'B', text: 'Zone 1, 3, 4' },
      { key: 'C', text: 'Zone 2, 4, 5' },
    
    ],
    correctAnswer: 'A',
    feedback: `🟩 Risposta corretta: Zone 2, 3 e 5.

    • Osserva: i cerchi 🟡 indicano i punti in cui la chiusura viene confermata sopra il livello del massimo precedente.

Per considerare valida una zona long, dobbiamo verificare cosa succede dopo il  minimo da cui nasce la zona in questione, il prezzo deve creare un nuovo massimo e una candela, deve chiudere sopra il livello del massimo precedente. 

**Solo così quel minimo diventa un vero supporto della struttura rialzista.**

La **Zona 1: il ragionamento è lo stesso dell’esercizio precedente:** dal minimo 1 il mercato reagisce, ma il livello del massimo precedente viene rotto solo dall’ombra della candela. Nessuna candela chiude sopra il livello del massimo precedente, quindi **non abbiamo una continuazione confermata.**

La **Zona 2: dal minimo 2 parte un movimento che crea un nuovo massimo e una candela chiude sopra il livello del massimo precedente.**

Anche la **Zona 3 è valida per lo stesso motivo:** il mercato riparte da lì e conferma la continuazione rialzista con una chiusura oltre il livello del massimo precedente.

La **Zona 4 non è valida:** come accadeva nel punto “b” dell’esercizio precedente, **non riesce a superare il massimo precedente **.

Infine la **Zona 5 è valida**, perché da quel minimo nasce un movimento che supera il livello del massimo precedente con una chiusura sopra, confermando il minimo.

`,
  },
  {
    id: 'day2-ex3',
    day: 2,
    title: 'Esercizio 6 — Esiste un trigger valido?',
    block: 'Trigger / Rischio',
    description: 'Placeholder in attesa dei contenuti specifici del giorno 3.',
    imageBefore: '/Grafici_2/domanda_trigger_3.jpeg',
    imageAfter: '/Grafici_2/risposta_trigger_3.png',
    chartMeta: {
      source: 'TradingView',
      timeframe: '5 min',
      instrument: '',
    },
    question: `**Riepilogo Step 4-5:**Sul time frame H1 abbiamo individuato una zona rialzista. 
    
    **Ora passiamo al time frame M5** .

**Obiettivo:** su M5 cerchiamo una conferma di una ripresa del trend rialzista, osservato sul timeframe superiore H1: la conferma si ha quando, da un trend ribassista, una candela su M5 rompe e chiude sopra il livello dell’ultimo massimo strutturale ribassista.


👀** Prima di cercare il trigger:**

**Il prezzo può entrare nella zona e poi uscirne verso l’alto: questo non invalida la zona.**

**❗Quello che devi verificare è che, prima del trigger, la zona non sia già stata invalidata: cioè almeno una candela non chiuda sotto il suo limite inferiore.**

Chiediti:

• vogliamo trovare il punto in cui la struttura ribassista ritorna rialzista su timeframe inferiore (quello che vedi nel grafico), questo ci da conferma di una possibile continuazione del trend rialzista su timeframe superiore. Qual è l\'ultimo massimo della struttura ribassista?

• il livello individuato da quest\'ultimo massimo, viene superato da una candela con chiusura al di sopra?

• prima di questa rottura del livello, cioè il possibile trigger, esiste almeno una candela **chiude sotto al limite inferiore della zona?** In quel caso allora la **zona è invalidata e non possiamo considerare il trigger valido.**




👉 **Domanda:** quale candela rappresenta un trigger valido per entrare long?


`, 
 answers: [
      { key: 'A', text: 'Candela 1' },
      { key: 'B', text: 'Candela 2' },
      { key: 'C', text: 'Candela 3' },
      { key: 'D', text: 'Candela 4' },
      { key: 'E', text: 'Nessuna' },
    ],
    correctAnswer: 'E',
    feedback: `🟩 Risposta corretta: Nessuna.

    A prima vista alcune delle candele indicate possono sembrare buone conferme, perché successivamente il prezzo rompe dei massimi strutturali su M5.

Ma prima di valutare il trigger dobbiamo controllare il contesto: la zona rialzista individuata su H1 è ancora valida?

Osservando il grafico, prima che arrivi la conferma su M5 compare una candela che chiude sotto il limite inferiore della zona H1. Nel criterio che stiamo usando, questa chiusura invalida la zona.

Da quel momento viene meno il motivo per cui stavamo cercando un long in quell’area.

Il Punto 1, se osservassimo soltanto M5, soddisferebbe il criterio della conferma rialzista perché arriva una rottura con chiusura sopra il livello del massimo strutturale precedente. 

**Ma questa conferma arriva dopo l’invalidazione della zona H1, quindi non può più essere utilizzata per questo setup.**

**Anche se nei punti 1, 2 e 4 il prezzo mostra successivamente delle conferme rialziste su M5, non possiamo più usarle per entrare long: prima del Punto 1 una candela aveva già chiuso sotto il limite inferiore della zona H1, invalidando il setup. Da quel momento, le conferme successive su M5 non appartengono più a quella zona.**


Il **Punto 3, invece, non è ancora una conferma rialzista: il prezzo non ha ancora rotto e chiuso sopra il livello dell’ultimo massimo strutturale della discesa.**
`,
  },
]

const STEP_ID_PATTERN = /^day(\d+)-ex(\d+)$/

function getExerciseSortIndex(exercise) {
  const id = String(exercise?.id || '')
  const match = id.match(STEP_ID_PATTERN)
  if (!match) return Number.MAX_SAFE_INTEGER

  const day = Number.parseInt(match[1], 10)
  const exerciseInDay = Number.parseInt(match[2], 10)
  if (Number.isNaN(day) || Number.isNaN(exerciseInDay)) return Number.MAX_SAFE_INTEGER

  return (day - 1) * 3 + exerciseInDay
}

export const EXERCISES = [...EXERCISE_ITEMS].sort((first, second) => {
  const firstIndex = getExerciseSortIndex(first)
  const secondIndex = getExerciseSortIndex(second)

  if (firstIndex !== secondIndex) {
    return firstIndex - secondIndex
  }

  return String(first?.id || '').localeCompare(String(second?.id || ''))
})

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
