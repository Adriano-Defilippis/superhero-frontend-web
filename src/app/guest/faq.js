'use strict';

export default function FaqPageController (
    $scope, AssetsStore
) {
    "ngInject";

  	var self = this;

    self.model = {
      faqList : 1,
      headerImage: AssetsStore.Image('home.pageHeaders.faq'),
      sectionTaglineClient : "Hai capito che puoi avere un Supereroe tutto per te, ma ti sembra troppo bello per essere vero? Credici, è così! Di seguito trovi un po’ di domande e risposte per capire meglio come fare",
      sectionTaglineHero: "Qui spieghiamo meglio come fare. Scopri tutti i vantaggi di entrare a far parte del team di Supereroi!",
      clientPanes : [
        {
          header: "Cos'è ilmioSupereroe.it?",
          content: "È una piattaforma digitale che ti permette di prenotare servizi di diversa tipologia a domicilio e ottenere, anche in breve tempo, il supporto di professionisti referenziati e selezionati. L’utilizzo è facile ed immediato: per fare una prenotazione bastano 5 minuti. L’iscrizione è gratuita e i costi del servizio sono chiaramente visibili sul sito, senza sorprese."
        },{
          header: "Come faccio ad inserire una prenotazione per la prima volta?",
          content: "Prenotare un servizio è semplicissimo: basta indicare dove e quando lo desideri ricevere, scegliere, se vuoi, un professionista e pagare online. Voilà il gioco è fatto. Al primo accesso ti verrà anche mandata una e-mail per creare la tua password: ricordati di salvarla per poter accedere al tuo profilo ogni volta che vuoi."
        },{
          header: "Quando viene addebitato l’importo della prenotazione?",
          content: "L’addebito della prenotazione avviene solo 24 ore dopo il regolare svolgimento del servizio per offrirti la massima tranquillità e sicurezza. Al momento dell’inserimento della prenotazione riceverai solo una richiesta di autorizzazione di addebito sulla Tua carta, che non comporterà alcun costo. Fanno eccezione acquisto Carnet e costi per modifiche o cancellazioni, che vengono addebitati contestualmente alla richiesta."
        },{
          header: "I servizi offerti dai nostri supereroi sono assicurati?",
          content: "Sì. Tutti i nostri Supereroi sono assicurati sui danni alle cose fino a 25.000 euro. La copertura non ha alcun costo aggiuntivo ed è inclusa nel prezzo del servizio. Guarda <a href='http://ilmiosupereroe.it/assicurazione'>qui</a> per avere maggiori dettagli."
        },{
          header: "Come posso contattare il Servizio Clienti?",
          content: "Puoi chiamarci via telefono al numero 02/86882279 dalle 9 alle 18 durante i giorni feriali, o contattarci in qualsiasi momento via e-mail all’indirizzo info@ilmioSupereroe.it. Sei già nostro cliente ed hai bisogno di parlare con noi urgentemente (dopo le 18 o nei giorni festivi)? Nessun problema: puoi chiamarci al numero che trovi indicato nella mail di conferma degli appuntamenti."
        },{
          header: "In quali città è possibile trovare ilmioSupereroe.it?",
          content: "I nostri servizi sono disponibili sulle città di Milano, Torino, Monza/Brianza, Varese e sulle relative province. Presto verranno estesi ad altre città."
        },{
          header: "Quali servizi posso prenotare?",
          content: "Puoi vedere tutti i servizi disponibili direttamente nel menu della Home Page del sito (ad es: colf, badanti, baby sitter, tuttofare ecc.). Se avessi bisogno di un servizio non ancora attivo, comunque, contattaci: faremo di tutto per aiutarti."
        },{
          header: "Quali vantaggi ho nel prenotare un Supereroe?",
          content: "Prenotare un Supereroe vuol dire trovare un professionista serio e referenziato, disponibile quando ne hai bisogno. Puoi scegliere il profilo più adatto alle tue esigenze o lasciare al sito la scelta. Puoi trovare un Supereroe anche in caso di emergenza, nel giro di poche ore. Di ogni Supereroe puoi vedere la foto, conoscere il profilo e gli anni di esperienza, prima di decidere se prenotarlo. Puoi richiamare sempre lo stesso Supereroe o prenotare chi desideri di volta in volta. Puoi rilassarti e goderti la flessibilità del servizio senza pensare alla burocrazia: la fattura (ove prevista) la trovi direttamente sulla tua pagina personale ed il servizio dei Supereroi è coperto dalla nostra assicurazione sui danni alle cose. Che aspetti? Registrarti subito senza alcun costo e prova i nostri servizi!"
        },{
          header: "Quali vantaggi ho nell’acquistare un carnet?",
          content: `<div>
            L’acquisto di un Carnet, oltre a consentirti di usufruire di una tariffa oraria più bassa, ti offre molteplici vantaggi: <br />
              • potrai effettuare la prenotazione dei servizi in pochi istanti, usando le ore che hai già acquistato;<br />
              • in caso di necessità, potrai cancellare o modificare ad un costo inferiore i tuoi appuntamenti;<br />
              • se lo desideri, potrai cambiare in qualunque momento il Supereroe da te prescelto;<br />
              • le prenotazioni in fascia oraria notturna o l'assistenza di più di 1 bambino dal servizio Baby Sitter, non avranno alcun sovrapprezzo per te.
          </div>`
        },{
          header: "Quanto tempo è necessario per svolgere il servizio?",
          content: "Dipende: per i servizi Colf, Badante e Baby Sitter, la prenotazione richiede un tempo minimo di 2 ore. Per altri servizi inserendo la prenotazione, ti verrà consigliato il tempo più adatto alla prenotazione."
        },{
          header: "Posso scegliere io il Supereroe che preferisco?",
          content: "Sì. Dalla Home Page del sito clicca sul link “Conosci i nostri Supereroi”, inserisci il tuo cap e seleziona il servizio che ti serve: potrai scorrere i profili dei Supereroi disponibili nella zona di tuo interesse, scoprendone il volto e l’esperienza."
        },{
          header: "Entro quanto tempo riceverò la conferma della mia prenotazione?",
          content: "Dopo aver effettuato la prenotazione, riceverai subito una mail di conferma preliminare, con il riepilogo del servizio da Te richiesto. Entro 4 ore (ma in media in 1 ora) durante la fascia oraria lavorativa ti verrà inviata una seconda mail nella quale ti verrà data conferma definitiva dell’esito della richiesta, con l’indicazione del profilo del Supereroe incaricato (qualora non fosse stato direttamente scelto da te). Nel caso improbabile in cui l’appuntamento non dovesse essere accettato da nessun Supereroe, riceverai comunque una mail con l’avviso della mancata conferma e la Tua richiesta andrà a decadere: in questa evenienza nessun addebito verrà effettuato sulla Tua carta."
        },{
          header: "Posso prenotare un Supereroe con smartphone, tablet o App mobile?",
          content: "Sì, puoi prenotare un Supereroe dovunque tu sia e nella maniera più comoda per te. Il sito è ottimizzato per tutti i dispositivi mobile, è disponibile anche la App de ilmioSupereroe.it per <a href='https://appsto.re/it/9rcScb.i'>iOS</a> e <a href='https://play.google.com/store/apps/details?id=com.superhero1'>Android</a>."
        },{
          header: "Se ho un cambio di programma, posso modificare o cancellare la prenotazione?",
          content: "Si, puoi modificare la prenotazione fino a 24 ore prima dell’appuntamento, mentre puoi cancellarla anche con un preavviso minore. In base alla tua scelta ti saranno applicate delle commissioni. Visita la nostra pagina “Tariffe” per tutti i dettagli."
        },{
          header: "Posso prenotare lo stesso servizio per più appuntamenti, effettuando una sola prenotazione?",
          content: "Si, hai 2 diverse possibilità: la prenotazione ricorrente o la prenotazione multipla. Puoi inserire una prenotazione ricorrente per richiedere il tuo Supereroe preferito (lo stesso Supereroe) ogni settimana nella stessa fascia oraria (ad es. prenota una colf ogni lunedì dalle 10 alle 14). Per farlo ti basta cliccare su “ricorrenza”, dopo avere selezionato la prima data, e scegliere la frequenza e il numero di ricorrenze che desideri. Per prenotare, invece, più appuntamenti in giorni e orari diversi (ad. es. baby sitter lunedì dalle 15 alle 19; giovedì dalle 12 alle 15, e così via), basta aggiungere nuove date oltre la prima, scegliendo per ognuna il Supereroe che preferisci."
        },{
          header: "Quando posso conoscere il Supereroe?",
          content: "Potrai conoscerlo alla prima prenotazione contestualmente allo svolgimento del servizio. La piattaforma non prevede colloqui conoscitivi."
        },{
          header: "Come posso affidarmi sempre allo stesso Supereroe?",
          content: "Accedendo alla tua pagina personale, potrai visualizzare i professionisti con cui hai già effettuato prenotazioni e richiamarli tramite la funzione “Richiama”. In alternativa, acquistando un Carnet potrai scegliere il Supereroe a cui vuoi affidarti per tutte le prenotazioni, risparmiando anche sulla tariffa oraria. Visita la nostra pagina “Carnet” per scegliere quello più adatto alle tue esigenze."
        },{
          header: "I Supereroi richiesti possono svolgere il servizio anche la sera o nei weekend?",
          content: "Puoi prenotare un Supereroe quando vuoi, anche la sera o nei weekend. Nelle fasce orarie notturne, per alcuni servizi sono previste delle maggiorazioni. Visita la nostra pagina “Tariffe” per maggiori dettagli in merito. Ricorda che, in generale e soprattutto nel weekend e nelle fasce orarie serali, maggiore sarà la distanza tra la prenotazione e l’appuntamento, maggiore sarà la probabilità che la Tua richiesta venga confermata."
        },{
          header: "Posso utilizzare un carnet insieme ad un familiare/amico?",
          content: "Sì, una volta acquistato il Carnet è possibile associare più indirizzi presso i quali effettuare le prenotazioni, selezionando quello appropriato di volta in volta. Il Supereroe si recherà all’indirizzo che verrà scelto in fase di prenotazione."
        },{
          header: "Come faccio ad essere sicuro dell’affidabilità di un Supereroe?",
          content: "Tutti i nostri Supereroi hanno superato un rigoroso percorso di selezione: verifichiamo dati, esperienze, referenze e competenze. A questo proposito, anche il Tuo feedback è prezioso per noi e per gli altri clienti."
        },{
          header: "Devo trovarmi in casa quando un Supereroe effettua il suo lavoro?",
          content: "Non necessariamente: in fase di prenotazione potrai indicare come il Supereroe dovrà entrare in casa. Consigliamo, tuttavia, di essere presente almeno durante la prima prenotazione. In questo modo potrai conoscere il tuo Supereroe e comunicargli direttamente le Tue esigenze."
        },{
          header: "Devo mettere a disposizione dei prodotti per il lavoro dei supereroi?",
          content: "Si, salvo diverse indicazioni evidenziate sul sito, dovrai rendere disponibili tutti i prodotti necessari. Troverai, comunque, tutte le indicazioni in merito all’interno del flusso di prenotazione del Supereroe."
        },{
          header: "Posso valutare il lavoro di un Supereroe?",
          content: "Si, al termine di ogni appuntamento riceverai una mail con un link (oppure una notifica sulla App) dal quale potrai lasciare la tua opinione sul servizio svolto. La recensione verrà condivisa esponendo solo il tuo nome e l’iniziale del cognome (es. Elisa D.). In alternativa, mandaci una mail a info@ilmioSupereroe.it. La tua opinione è preziosa per noi e ci consente di supportare i Supereroi maggiormente meritevoli."
        },{
          header: "Quanto costa prenotare un servizio?",
          content: "Le tariffe variano in base al servizio ed all'impegno richiesto. Visita la nostra pagina “Tariffe” per tutti i dettagli. La cifra indicata è omnicomprensiva: non ci sono costi ulteriori per il servizio, né aggiunta di IVA."
        },{
          header: "Quali sono le modalità di pagamento possibili?",
          content: "Puoi pagare in modo sicuro tramite le principali carte di credito o prepagate. Per l’acquisto di carnet, è possibile pagare anche tramite bonifico: contatta il servizio clienti per ricevere i dati necessari."
        },{
          header: "I pagamenti sono sicuri?",
          content: "La sicurezza di ogni transazione effettuata su ilmioSupereroe.it è tutelata dall’utilizzo dei più recenti sistemi di crittografia."
        },{
          header: "Potrebbe succedere che venga prelevato l’importo più volte?",
          content: "No, al momento della prenotazione viene effettuata solo una richiesta di addebito della cifra, che non comporta alcun esborso immediato. La richiesta di addebito potrebbe venire reiterata in caso di modifiche alla prenotazione (da parte tua o del Servizio Clienti). L’addebito effettivo, in ogni caso, avviene solo 24 ore dopo il termine del servizio."
        },{
          header: "I servizi dei Supereroi vengono fatturati?",
          content: "Se hai scelto un Supereroe che ha la partita IVA, troverai la fattura della prestazione 24 ore dopo il termine del servizio nell'apposita sezione della tua pagina personale."
        },{
          header: "Perché ho ricevuto numerose e-mail?",
          content: "Il sistema provvede a trasmettere via e-mail conferma preliminare e definitiva delle prenotazioni, link di fatturazione, richieste di feedback, modifiche, cancellazioni, ecc. In generale vengono inviate notifiche per ogni variazione effettuata da te o dagli addetti del back office relativamente al servizio richiesto."
        },{
          header: "Come faccio a valutare quale servizio sia più appropriato per le mie esigenze (ad esempio quando scegliere un tuttofare o un elettricista)?",
          content: "Qualunque sia il tuo dubbio, contatta il nostro Servizio Clienti: ti saprà consigliare per il meglio, offrendoti tutti i chiarimenti di cui potresti avere bisogno (ad esempio, in tutti i casi in cui c’è da metter mano ai fili elettrici, sarà necessario l’intervento di un elettricista specializzato, capace di garantire le adeguate competenze tecniche e la sicurezza dell’intervento)."
        }
      ],
      heroPanes : [
        {
          header: "Come si diventa un Supereroe?",
          content: "Visita la pagina Diventa un Supereroe, scopri se il tuo identikit rispecchia quello del Supereroe che cerchiamo e invia la tua candidatura!"
        },
        {
          header: "Per diventare un Supereroe ho bisogno della Partita IVA?",
          content: "Sì. ilmioSupereroe.it collabora con lavoratori indipendenti, quindi muniti di partita IVA. In questo modo ogni collaboratore professionista ha la massima autonomia di scegliere dove e quando lavorare."
        },
        {
          header: "In quale città lavorano i Supereroi?",
          content: "I servizi de ilmioSupereroe.it si svolgono a Milano, Monza/Brianza, Varese e sulle relative province e presto verranno estesi ad altre zone d’Italia."
        },
        {
          header: "Dopo aver inviato la mia candidatura per diventare Supereroe, entro quanto tempo otterrò una risposta?",
          content: "Visioneremo la tua richiesta nel giro di pochi giorni. Se la tua richiesta è in linea con la nostra ricerca, verrai contattato per un colloquio conoscitivo."
        },{
          header: "Come riceverò le offerte di lavoro?",
          content: "Riceverai le richieste di incarico comodamente tramite sms, e-mail e il tuo profilo personale sul portale. Per accettare una proposta ti basterà rispondere con un sms."
        },
        {
          header: "Come riceverò i compensi per il lavoro svolto?",
          content: "Riceverai i compensi per le prestazioni comodamente sul tuo conto corrente bancario."
        },
      ]
    }

  }
