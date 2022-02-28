'use strict';

export default function PressReviewController (
        $scope,
        AssetsStore
    ) {
        "ngInject";

  	     var ctrl = this;

         $scope.audio = [];

         ctrl.headerImage = AssetsStore.Image('home.pageHeaders.pressReview');

         ctrl.articles = [
            {
                 publisher: 'Corriere Innovazione',
                 logo: {link: AssetsStore.Press('corriereInnovazione_color')},
                 title: 'Cerchi una colf, una baby sitter o un personal trainer? Arrivano in meno di un\'ora',
                 tagline: 'La piattaforma «Il mio Supereroe» permette di prenotare online servizi qualificati per la casa e la persona. Basta collegarsi al sito, cercare la tipologia di professionista che occorre, prenotare e attendere l’arrivo della persona richiesta.',
                 publishDate: '19/05/2016',
                 content:   'Se è vero che il tempo è il bene più prezioso, allora è facile capire perché una nuova startup italiana che aiuta le persone a gestirlo nel migliore dei modi abbia scelto di chiamarsi proprio “Il mio supereroe.” Si tratta infatti di una piattaforma online che permette di prenotare in tempi brevissimi molteplici servizi per la casa, la persona e il tempo libero.<br><br>' +
                            '<b>Un aiuto in meno di un’ora</b><br>' +
                            'Nata a luglio dell’anno scorso da un’idea di Gabriele Di Bella, “Il mio supereroe” permette di trovare colf, babysitter, badanti e personal trainer qualificati e affidabili in pochi click. L’utente deve solo collegarsi al sito, cercare la tipologia di professionista che gli occorre e prenotare la prestazione più adatta alle sue esigenze. Fra le varie opzioni attive anche la possibilità di inserire il codice di avviamento postale, in modo da avvalersi del collaboratore più vicino alla propria abitazione. Perfetto per situazioni di emergenza, il servizio garantisce un tempo massimo di risposta di sole quattro ore, ma la media è di 50 minuti, quindi nessun problema se vostra suocera decide di venirvi a trovare senza preavviso e la casa è sottosopra o se la ragazza dei vostri sogni inaspettatamente accetta di uscire con voi, ma avevate promesso a vostra madre di badare al fratellino. Un duplice vantaggio: ci sono solo professionisti qualificati e non ci sarà più lavoro nero. I profili dei professionisti, infatti, sono verificati dal team de “Il mio supereroe” che si assicura che i membri della sua squadra abbiano due o tre anni di esperienza nel settore, il possesso del titolo di studio necessario o gradito e la partita IVA. Il sistema combatte anche il lavoro in nero, contrattualizzando i lavoratori e generando automaticamente le fatture. Infine la partnership con AXA Italia si occupa di assicurare i lavoratori a domicilio. Attivo a Milano, Monza-Brianza, Varese, Torino e relative province, “Il mio Supereroe” è pronto a conquistare anche altre città italiane e ad ampliare il ventaglio dei servizi proposti: stiratura e fisioterapista a domicilio quelli in dirittura di arrivo.<br><br>' + 
                            '<b>Pacchetti e servizi condivisi</b><br>' +
                            '“Vivo a Milano e conosco le difficoltà correlate alla vita di una grande città – commenta l’ideatore Di Bella. È importante poter contare su professionisti affidabili, prenotabili in pochi istanti, anche in mobilità, in grado di risolvere le mille situazioni di vita quotidiana. L’obiettivo è quello di riprendersi il tempo per se stessi”. L’utente può prenotare un pacchetto di prestazioni ottenendo tariffe più convenienti, può scegliere di affidarsi sempre allo stesso supereroe: la fidelizzazione è un punto di forza della startup che vanta un tasso di ritorno della clientela nel 90% dei casi circa. Tra i servizi più richiesti quello di personal trainer, che può essere condiviso con amici, garantendo prezzi scontati. Diversi i servizi offerti dai supereroi specializzati nella cura del corpo: si va dalla corsa al ciclismo, dall’allenamento funzionale alla ginnastica posturale, dal pilates allo yoga fino alla difesa personale e ai programmi di dimagrimento su misura. Dotato di un servizio di assistenza clienti costante “Il mio supereroe” è stato fino ad ora inserito nei programmi di welfare aziendale di 40 grandi aziende di diversi settori.'
            },
            {
                 publisher: 'Vanity Fair',
                 logo: {link: AssetsStore.Press('vanityFair_color')},
                 title: 'Pilates a domicilio. Ma non solo',
                 tagline: 'Anche yoga, corsa, ciclismo e difesa personale. E non sarai tu a dover andare in palestra, ma il personal trainer che verrà da te. Con un semplice click',
                 publishDate: '01/06/2016',
                 content:   'Ammettiamolo. Quante volte, prese dal sacro fuco del «fitness a tutti i costi» ci siamo iscritte in palestra per poi mollare dopo una settimana o poco più? Forse troppe. Una sorta di «sindrome da abbandono», ma al contrario. Nel senso che, accampando le scuse più strampalate, «ci siamo viste costrette» ad abbandonare la palestra e con essa la possibilità di rimetterci in forma o, più semplicemente, di stare bene. Perché alla fine fare attività fisica serve proprio a questo: stare bene.<br><br>' +
                            'Se ognuna di noi avesse la possibilità di fare fitness a casa o nel parco adiacente, o seguire classi di allenamento come yoga, pilates, difesa personale all\'orario che più si concilia con le varie esigenze di lavoro/famiglia, sarebbe più motivata. In questo senso un aiuto fondamentale lo fornisce il sito www.ilmiosupereroe.it.<br><br>' +
                            'Questa piattaforma online, nata come servizio di prenotazione di servizi per la casa e per il tempo libero che mette a disposizione baby sitter, badanti e colf, ha recentemente lanciato la nuova attività di Personal Trainer che permette diprenotare un professionista specializzato nella disciplina che si preferisce, nell\'orario desiderato, anche con un breve preavviso.<br><br>' +
                            '«Tutti i nostri personal trainer - spiega Gabriele di Bella, fondatore de ilmiosupereroe.it - hanno i titoli e la formazione necessaria: laurea in scienze motorie e corsi di specializzazione presso enti accreditati come CSEN o ISSA e hanno esperienza comprovata, come tutti i nostri Supereroi.» <br><br>' +
                            'Nell\'area dedicata è possibile consultare 8 programmi:allenamento funzionale, schemi personalizzati di dimagrimento, ginnastica posturale, corsa, difesa personale, yoga, pilates, ciclismo. Le sessioni si possono svolgere in maniera individuale o in gruppo, in casa o all\'esterno e durano minimo un\'ora. Se necessario il personal trainer porterà quanto necessario per la sessione, dal tappetino per fare yoga alle kettlebell per l\'allenamento funzionale. È anche possibile acuistare un carnet, ovvero un blocco di sessioni a prezzo scontato da potere utilizzare in totale libertà.<br><br>' +
                            'Insomma, adesso non abbiamo proprio più scuse per non allenarci!'
            },
             {
                 publisher: 'TGCOM 24',
                 logo: {link: AssetsStore.Press('tgcom24_color'), className: 'tgcom'},
                 title: 'AXA: PARTNERSHIP CON ILMIOSUPEREROE.IT PER SERVIZI A DOMICILIO',
                 tagline: '',
                 publishDate: '18/05/2016',
                 content:   'ilmiosupereroe.it, piattaforma online per la prenotazione di servizi per la persona, la casa e il tempo libero, e Axa Italia, primo brand assicurativo a livello mondiale , tramite Quadra Assicurazioni, società del Gruppo, annunciano l\'avvio di una partnership per offrire ai clienti del portale una copertura assicurativa per ogni servizio svolto dai Supereroi in caso di danni occorsi durante la prestazione, fino ad un massimale di 25.000 euro. Tutto ciò in automatico e senza alcun costo aggiuntivo: l\'assicurazione viene garantita ad ogni prenotazione effettuata attraverso la piattaforma, sempre alla stessa tariffa. L\'offerta de ilmiosupereroe.it è attualmente disponibile a Milano, Monza-Brianza, Varese, Torino (e relative province) ma è in corso l\'espansione in altre città italiane.'
             },
             {
                 publisher: 'OGGI.IT',
                 logo: {link: AssetsStore.Press('oggi_color')},
                 title: 'Tornare in forma? Con il personal trainer online è più facile. Prenota il tuo supereroe con un click',
                 tagline: 'Programmi personalizzati di dimagrimento, difesa personale, yoga o pilates: qualsiasi sia la disciplina in cui volete cimentarvi, c’è qualcuno disposto ad aiutarvi a raggiungere i vostri obiettivi. Online.',
                 publishDate: '02/05/2016',
                 content:   'Con pochi click sul sito www.ilmiosupereroe.it si può prenotare un PT specializzato nella disciplina preferita per il giorno, l’ora e il luogo. Le sessioni si possono svolgere a casa o all’esterno, durano minimo un’ora e possono essere individuali o in gruppo con amici (fino a cinque persone).<br>' +
                            'Se necessario il Personal Trainer porta l’occorrente per la sessione, ad esempio in caso di allenamento funzionale può portare il kettlebell o il necessario per il trx. Le tariffe sono consultabili online: per una sola sessione individuale la tariffa è di 50 Euro ma la tariffa scende in modo consistente prenotando in gruppo (fino a 22,50 Euro se ci si allena in cinque) o acquistando un Carnet, ovvero un blocco di sessioni a prezzo scontato di cui usufruire in libertà.<br>' +
                            '“Tutti i nostri Personal Trainer hanno i titoli e la formazione necessaria: laurea in scienze motorie e corsi di specializzazione presso enti accreditati come CSEN o ISSA e hanno esperienza comprovata, come tutti i nostri Supereroi” sottolinea Gabriele Di Bella, fondatore e socio di maggioranza del portale che, oltre a quelli dei personal trainer, offre anche i servizi di colf, badanti o baby sitter. Per qualsiasi dubbio o consiglio, inoltre, è disponibile il Servizio Clienti (02.86882279).<br>'
             },
             {
                 publisher: 'Adnkronos',
                 logo: {link: AssetsStore.Press('adn_color')},
                 title: 'Dalla colf al cuoco, al via la start up che ti manda un \'supereroe\' a domicilio',
                 tagline: 'Idea del milanese Gabriele di Bella, portare a casa le \'soluzioni\' dalla baby sitter al cuoco',
                 publishDate: '16/07/2015',
                 content:   'Una baby sitter ammalata e un\'emergenza che costringe a uscire. Un problema che molto spesso si presenta alle mamme, che, in certi casi, avrebbero proprio bisogno di un \'supereroe\' a disposizione. Qualcuno ci ha pensato e ha avviato una start up che, in caso di necessità, risponde in tempi rapidissimi con una soluzione efficace.<br>'+
                            '“Cominceremo su Milano e provincia, per poi estendere i nostri servizi ad altre aree metropolitane”, dice Gabriele di Bella, fondatore della piattaforma multiservizio che non a caso si chiama ilmioSupereroe.it, attiva da fine giugno.<br><br>'+
                            'Di Bella è un papà a tempo pieno e conosce bene i bisogni delle famiglie: “In città il ritmo della vita è diventato frenetico e le persone che lavorano hanno sempre meno tempo: dare a tutti la possibilità di trovare una persona valida, anche con poco preavviso, può rappresentare davvero un’ancora di salvezza”. Colf, ma soprattutto baby sitter e badanti, sono una novità nel mercato della prenotazione online dei servizi e sono disponibili su ilmioSupereroe.it. Ma nel giro di pochi mesi l’offerta di nuovi servizi sarà sempre più estesa, con la possibilità di prenotare ad esempio un personal trainer, un cuoco a domicilio e altre tipologie di professionisti. '+
                            'Una delle criticità che Di Bella ha dovuto affrontare nel costruire la start up, è stata la fiducia nella persona che viene selezionata per svolgere il servizio richiesto. “Io sono il primo che vorrebbe conoscere il più possibile chi mi sta venendo ad aiutare con ciò che ho più a cuore – continua Di Bella –. Tutti i nostri Supereroi sono stati scrupolosamente selezionati con l’obiettivo di scegliere i professionisti più adatti e competenti per il servizio da svolgere. Progressivamente, inoltre, per la scelta del professionista sarà anche possibile usare le opinioni dei Clienti che lo hanno già conosciuto e ne hanno dato una valutazione in precedenza”. '+
                            'La prenotazione dura due minuti grazie a un sito \'immediato\' e a un meccanismo automatizzato di comunicazione tra la piattaforma e il Supereroe, il quale visualizza immediatamente la richiesta e può dare un riscontro con un sms. '+
                            'Di Bella fa notare che questo è “il sistema di prenotazione più rapido del mercato: è possibile prenotare un Supereroe anche poche ore prima del servizio e non passano più di 4 ore senza avere una risposta. E questo diventa fondamentale se ho un’emergenza in giornata”. Si può richiedere un Supereroe per una sola volta, richiamarlo o contattarlo in maniera ricorrente. Fino a decidere di non poter più fare a meno di lui: con i Carnet (di diverse taglie) si risparmia e si premia la professionalità della nostra Baby Sitter, Badante o Colf preferita. '
             },
             {
                 publisher: 'Yahoo! Italia',
                 logo: {link: AssetsStore.Press('yahoo_color')},
                 title: 'Arriva l\'app che ti salva con colf, badanti e baby sitter',
                 tagline: 'Ilmiosupereroe.it è una piattaforma tutta italiana capace di fornire supporto durante le emergenze domestiche: colf, badanti e baby sitter sono a un click di distanza',
                 publishDate: '21/07/2015',
                 content:   'Vivere in una grande città non è facile, specie quando a tutti gli impegni della giornata si aggiunge un\'emergenza. Anche solo un rubinetto che perde può far saltare ogni piano. Proprio da questa situazione nasce il portale Ilmiosupereroe.it, piattaforma che spedisca a domicilio baby sitter, colf e badanti. A idearlo Gabriele Di Bella, socio fondatore e consulente direzionale. "Vivo a Milano e conosco le difficoltà correlate alla vita in una grande città. L\'importanza di sapere di poter avere un supporto nelle piccole grandi emergenze di casa ci ha fatto partire (insieme agli altri 20 soci, ndr.) con questo progetto". L\'obiettivo è riprendersi il tempo per se stessi, ci racconta Di Bella, affidandosi solo a dei professionisti.<br><br>'+
                            'Come funziona. Andando sul sito Ilmiosupereroe.it si possono inserire i propri dati e le proprie esigenze e, anche con pochissimo preavviso, si riceve subito l\'assistenza desiderata. Ma il tempismo nell\'esaudire le richieste non deve essere scambiato per approssimazione nella selezione dei professionisti. "Le persone che lavorano con noi passano attraverso una serie di valutazioni molto scrupolose: c\'è un incontro preliminare, poi verifichiamo le referenze, la professionalità e l\'esperienza. Cerchiamo di reclutare professionisti conosciuti e pubblichiamo i loro profili sul nostro sito. Sono tutti in grado di emettere fattura. Al termine della prestazione i clienti possono recensire la persona contattata, così da dare future indicazioni agli utenti che richiederanno lo stesso servizio, un ottimo feedback anche per noi". Presto oltre ai servizi di colf, badante e baby sitter, verranno integrati vari servizi nell\'ambito di benessere, assistenza fisioterapia, idraulica e manutenzione domestica. L\'uso della piattaforma da parte di chi cerca il servizio è gratuita. I professionisti invece ci riconoscono una piccola percentuale. Al momento il servizio è disponibile solo su Milano, ma presto verranno aggiunte anche altre città italiani.<br><br>'+
                            'Riprenditi il tuo tempo. "Il servizio è partito da poco più di una settimana, è troppo presto per valutare l\'attività, ma già dai primi feedback ricevuti abbiamo notato molto interesse per i servizi offerti. Chi ha usato il nostro servizio ha lodato sia la breve tempistica di prenotazione sia la professionalità di chi lavora con noi". Sembra dunque che, alla prossima emergenza, potrai avere al tuo fianco un vero supereroe, capace di salvare la tua giornata.'
             },
             {
                 publisher: 'Magazine delle Donne',
                 logo: {link: AssetsStore.Press('magazineDelleDonne_color'), className: 'magazine-delle-donne'},
                 title: 'Ilmiosuperoe.it, l\'app che tampona le emergenze (e non solo)',
                 tagline: 'Baby sitter, colf e badanti chiamate all\'ultimo minuto che arrivano a domicilio: ilmiosuperoe.it è l\'app che salva dalle emergenze. Paura degli sconosciuti? I professionisti sono tutti selezionati, le recensioni dei clienti fanno il resto.',
                 publishDate: '16/07/2015',
                 content:   'Nell\’era della sharing economy dove chi fa da sé fa almeno per tre, solo un genitore a tempo pieno avrebbe potuto inventarsi ilmioSupereroe.it, la piattaforma che salva dall’emergenza spedendo a domicilio una babysitter fidata o una colf efficiente e discreta o, ancora, una badante preparata. Lui si chiama Gabriele di Bella e la sua applicazione attiva da fine giugno ha tutte le carte per trasformarsi nelparacadute di molte famiglie alle prese con l’imprevedibile vita moderna. "In città- spiega il fondatore - il ritmo della vita è diventato frenetico e le persone che lavorano hanno sempre meno tempo: dare a tutti la possibilità di trovare una persona valida, anche con poco preavviso, può rappresentare davvero un’ancora di salvezza”. Il che vale anche per chi la prestazione la offre per cui la piattaforma è una vetrina più unica che rara. "Dovrai solo decidere quanto lavorare. Al resto ci pensiamo noi!" fa sapere il sito che promette pagamenti puntuali due volte al mese.<br>br>'+
                            'Insomma, la manna dal cielo. Per il momento solo su quello meneghino perché si comincia da Milano e provincia ma le previsioni sono di allargarsi a macchia d’olio un po’ ovunque. Stesso discorso vale per i supereroi che presto vestiranno anche i panni di personal trainer, cuochi e chi più ne ha, ne metta.<br><br>'+
                            'Le tariffe all’ora sono (abbastanza) nella media - 14 euro e mezzo per una baby sitter o una badante, 12.50 per una colf - ma di Bella lo sa bene: trovare la persona al momento giusto, non ha prezzo. "È il sistema di prenotazione più rapido del mercato - spiega - : è possibile prenotare un Supereroe anche poche ore prima del servizio e non passano più di 4 ore senza avere una risposta. E questo diventa fondamentale se ho un’emergenza in giornata”. Per prenotare bastano due minuti e qualche click, la risposta arriva (anche) per sms.<br><br>'+
                            'A chi obietta che mettere in casa uno sconosciuto a badare ai propri figli, genitori o oggetti, qualche ansia la generi, di Bella replica: "Io sono il primo che vorrebbe conoscere il più possibile chi mi sta venendo ad aiutare con ciò che ho più a cuore. Tutti i nostri Supereroi - continua - sono stati scrupolosamente selezionati con l’obiettivo di scegliere i professionisti più adatti e competenti per il servizio da svolgere”. Va da sé che in tempi 2.0 le recensioni faranno metà dell’opera: "progressivamente, inoltre, per la scelta del professionista sarà anche possibile usare le opinioni dei clienti che lo hanno già conosciuto e ne hanno dato una valutazione in precedenza”.<br><br>'+
                            'Insomma, con i tempi che corrono, ilmioSupereroe.it potrebbe presto trasformarsi nell’app che se la prima volta copre un’emergenza, quella dopo copre la quotidianità, come d’altra parte ipotizza di Bella che a tal fine ha previsto l’acquisto di carnet per risparmiare, certo che chi si appoggerà al servizio difficilmente riuscirà a farne a meno. '
             },
             {
                 publisher: 'RDS',
                 logo: {link: AssetsStore.Press('rds_color'), className: 'rds'},
                 title: 'RDS parla de ilmioSupereroe.it',
                 tagline: '',
                 publishDate: '18/07/2015',
                 audio: { source: AssetsStore.Audio('rds')},
                 content: 'Petra Loreggian e Beppe De Marco parlano de ilmioSupereroe.it su RDS. Ascolta la registrazione:'
             },
             {
                 publisher: 'Radio Capital',
                 logo: {link: AssetsStore.Press('radioCapital_color'), className: 'radio-capital'},
                 title: 'Intervista a Gabriele di Bella su Radio Capital',
                 tagline: '',
                 publishDate: '29/07/2015',
                 audio: { source: AssetsStore.Audio('radioCapital')},
                 content: 'Camilla Fraschini di radio Capital intervista Gabriele di Bella su ilmioSupereroe.it . Ascolta la registrazione:'
             },
             {
                 publisher: 'Fashionblabla',
                 logo: {link: AssetsStore.Press('fashionblabla_color'), className: 'fashion-blabla'},
                 title: 'Regali di Natale: ecco gli alternativi',
                 tagline: '',
                 publishDate: '07/12/2015',
                 content: 'IlmioSupereroe.it è una piattaforma Web/mobile che consente di prenotare servizi come una colf, una babysitter o una badante attraverso internet, rispondendo alle esigenze delle sempre più numerose persone che hanno bisogno di recuperare tempo per se stessi e per i propri familiari. Nel giro di alcuni mesi l’offerta verrà integrata da altri servizi (es. Personal Trainers, cuoco a domicilio ed altri ancora). La gestione è semplicissima e in 4 ore massimo si ha una risposta. In occasione del Natale ilmioSupereroe.it offre a privati ed aziende la possibilità di acquistare Gift Card da regalare rispettivamente a parenti/amici o ai propri dipendenti, offrendo loro il dono più prezioso: la possibilità di recuperare tempo per se stessi.'
             }
         ];

    }
