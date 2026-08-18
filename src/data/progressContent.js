export const DEFAULT_PROGRESS_CONTENT = {
  takeAway: 'Placeholder generico — Porta con te (fallback).',
  reflectionQuestions: [
    'Placeholder fallback 1',
    'Placeholder fallback 2',
    'Placeholder fallback 3',
  ],
  practicalRule: 'Placeholder generico — Regola pratica (fallback).',
}

export const PROGRESS_CONTENT_BY_EXERCISE = {
  1: {
    takeAway: `Una struttura rialzista sono i minimi strutturali a tenerla in piedi.
    
    Per individuare un possibile cambio di struttura, cerca l’ultimo minimo che la sostiene, 
    
    cioè quello da cui il prezzo è ripartito per creare un nuovo massimo più alto del precedente.`,
    reflectionQuestions: [
      'Quali minimi stanno sostenendo la struttura rialzista?',
      'Qual è l’ultimo minimo che la tiene in piedi?',
      "Riconosci l'invalidazione: se traccio un livello da quel minimo, il prezzo lo rompe al di sotto?",
    ],
    practicalRule: `

     Non cercare semplicemente un minimo che viene rotto; 
     

     cerca il minimo che sta realmente sostenendo la struttura del trend.`,
  },
  2: {
    takeAway: ` In una struttura rialzista, una zona può essere interessante per cercare un possibile long quando si trova intorno a un minimo da cui il prezzo riparte e costruisce un nuovo massimo più alto del precedente. Quindi non tutti i minimi sono zone interessanti!
`,
    reflectionQuestions: [
      'Da questo minimo il prezzo è riuscito a creare un nuovo massimo più alto del precedente?',
      'La struttura rialzista è già stata invalidata?',
      'Questo minimo fa ancora parte della struttura rialzista oppure è già parte di quella ribassista?',
    ],
    practicalRule: `In un trend rialzista, una zona long si cerca sui minimi che sostengono davvero la struttura rialzista e da cui il prezzo crea un nuovo massimo più alto rispetto al precedente.

`,
  },
  3: {
    takeAway: ` Sul time frame inferiore osserviamo la Zona 1 trovata nello Step 2 e aspettiamo una conferma della ripresa del trend rialzista, osservata proprio sul timeframe superiore. 
    
    La conferma è la rottura dell’ultimo massimo che mantiene valida la struttura ribassista.

Questa rottura indica il cambio di struttura da ribassista a rialzista e rappresenta il possibile ingresso long (trigger).`,
    reflectionQuestions: [
      'Sul timeframe inferiore il prezzo sta ancora formando massimi e minimi sempre più bassi?',
      'Qual è l\'ultimo massimo che mantiene valida la struttura ribassista?',
      'In quale punto il prezzo rompe il livello di quel massimo?',
    ],
    practicalRule: ` Sul timeframe inferiore aspetta la rottura del livello dell\'ultimo massimo che mantiene valida la struttura ribassista.
`,
  },
  7: {
    takeAway: `**__Minimi strutturali rialzisti__**: perché un minimo venga confermato come **minimo strutturale rialzista**, il prezzo deve successivamente creare un nuovo massimo, con una **candela che chiude sopra il livello del massimo precedente.**

Il **livello del massimo precedente corrisponde alla punta della sua wick, cioè all’estremo più alto raggiunto dal prezzo.**

**Se la candela non chiude con il corpo sopra quel livello, il nuovo massimo non è confermato e quindi nemmeno il minimo precedente diventa un nuovo riferimento strutturale rialzista.**`,
    reflectionQuestions: [
      'Il **massimo successivo ha davvero chiuso sopra il livello del massimo precedente?**, oppure lo ha solo superato momentaneamente con la wick?',
      'Solo **dopo questa conferma:** **quale minimo diventa il nuovo riferimento strutturale rialzista e cosa succede se il prezzo chiude sotto il suo livello? **',
      
    ],
    practicalRule: 'Quando controlli se un livello è stato realmente superato, non fermarti alla wick: guarda dove chiude il corpo della candela. Se il prezzo supera il livello solo con la wick ma la candela chiude sotto, la rottura non è confermata.',
  },
  8: {
    takeAway:  `**Filtra le informazioni utili: osserva cosa il mercato costruisce dopo un minimo.**

In una struttura rialzista, un minimo viene confermato come riferimento strutturale quando da lì il prezzo riesce a **creare un nuovo massimo più alto del precedente.**

**Se questo non è ancora successo, non sai ancora se quel minimo avrà realmente un ruolo strutturale.**
`,
    reflectionQuestions: [
      'Da quali minimi è partito un movimento capace di creare un massimo più alto del precedente massimo?',
      'Quale minimo ha realmente sostenuto la continuazione della struttura rialzista?',
      'C\'è un minimo che. fino a questo momento, non ha prodotto questa conferma?',
    ],
    practicalRule: `Aspetta sempre una conferma: da quel minimo  il prezzo deve creare un nuovo massimo più alto del precedente. `,
  },
  9: {
    takeAway: `La zona trovata sul timeframe superiore indica dove iniziare a cercare una possibile entrata, 
    
    ma **il trigger non deve necessariamente trovarsi all’interno della zona.**
    
    **L’importante è che, prima del trigger, il prezzo entri nella Zona**
`,
    reflectionQuestions: [
      'Qual è l\'ultimo massimo strutturale ribassista?',
      'Da quel massimo il prezzo ha creato nuovi minimi?',
      'Qual è la candela che chiude al di sopra il livello di quel massimo?',
    ],
    practicalRule: `Per un possibile long, individua l’ultimo massimo strutturale del ribasso sul timeframe inferiore e aspetta la prima candela che rompe quel livello e chiude al di sopra.`,
  },
  4: {
    takeAway: 'Per verificare quali minimi generano una continuazione del trend rialzista, osserva il movimento che parte da quei minimi: deve creare un nuovo massimo, confermato da almeno una candela che chiude sopra il livello del massimo precedente.',
    reflectionQuestions: [
      'Il movimento partito da questo minimo sta davvero costruendo una continuazione rialzista o sta soltanto reagendo verso l\'alto?',
      'Se il nuovo massimo non viene confermato, quale minimo rimane ancora il riferimento strutturale della struttura rialzista?',
      
    ],
    practicalRule: 'Un nuovo massimo più alto non basta da solo. Prima di aggiornare il minimo strutturale,** verifica che quel massimo sia davvero confermato, come visto nel Porta con te.**',
  },
  5: {
    takeAway: 'Una zona diventa interessante quando nasce da un minimo da cui il prezzo crea un nuovo massimo.** La conferma arriva quando almeno una candela chiude sopra il livello del massimo precedente.**',
    reflectionQuestions: [
      'Se sto osservando una struttura rialzista, quali minimi sono davvero strutturali e quindi possono generare una zona da prendere in considerazione?',
      'Il livello del massimo precedente viene superato con una vera chiusura oppure soltanto con l\'ombra della candela (wick)?',
  
    ],
    practicalRule: 'Non segnare subito una zona ogni volta che vedi un nuovo minimo e un massimo più alto. Prima verifica che quel massimo sia realmente confermato; solo allora usa quel minimo come riferimento per la zona.?',
  },
  6: {
    takeAway:  `Prima di cercare un trigger sul timeframe inferiore, verifica sempre che la zona del timeframe superiore sia ancora valida.
In una zona rialzista, il prezzo può entrare e poi uscirne verso l’alto; nel criterio che stiamo usando,** la zona viene invalidata se prima del trigger una candela chiude sotto il suo limite inferiore. ** `,
    reflectionQuestions: [
      'Qual è l\'ultimo massimo strutturale della discesa sul timeframe inferiore che deve essere rotto con una chiusura per avere una possibile conferma rialzista?',
      'Prima che arrivi quella conferma, la zona del timeframe superiore è ancora valida oppure una candela ha già chiuso sotto il suo limite inferiore?',
     
    ],
    practicalRule: `Prima controlla che il contesto del timeframe superiore sia ancora valido; 
    
    solo dopo cerca il trigger sul timeframe inferiore. Se la zona viene invalidata prima del trigger, il setup viene scartato.`,
  },
}

export function getProgressContentByExercise(exerciseNumber) {
  const direct = PROGRESS_CONTENT_BY_EXERCISE[exerciseNumber]
  if (direct) return direct

  const normalizedNumber = Number.parseInt(String(exerciseNumber), 10)
  if (!Number.isNaN(normalizedNumber) && PROGRESS_CONTENT_BY_EXERCISE[normalizedNumber]) {
    return PROGRESS_CONTENT_BY_EXERCISE[normalizedNumber]
  }

  return DEFAULT_PROGRESS_CONTENT
}
