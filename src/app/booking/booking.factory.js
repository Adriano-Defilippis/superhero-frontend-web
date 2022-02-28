'use strict';

export default function BookingModelFactory (
    SERVICES, COLF_ADDITIONAL_SERVICES, BADANTE_ADDITIONAL_SERVICES, 
    BABYSITTER_ADDITIONAL_SERVICES, TUTTOFARE_ADDITIONAL_SERVICES,
    SERVIZI_IDRAULICI_ADDITIONAL_SERVICES, SERVIZI_ELETTRICI_ADDITIONAL_SERVICES, 
    TUTTOFARE_ADDITIONAL_TOOLS, SERVIZI_ELETTRICI_ADDITIONAL_TOOLS,
    SERVIZI_IDRAULICI_ADDITIONAL_TOOLS, AssetsStore
) {
    "ngInject";

    let services = [
        {
            id: SERVICES.COLF,
            label: 'Colf',
            icon: AssetsStore.Icon('service.one'),
            price: 12.5
        },
        {
            id: SERVICES.BADANTE,
            label: 'Badante',
            icon: AssetsStore.Icon('service.two'),
            price: 14.5
        },
        {
            id: SERVICES.BABYSITTER,
            label: 'Baby Sitter',
            icon: AssetsStore.Icon('service.three'),
            price: 14.5
        },
        {
            id: SERVICES.PERSONALTRAINER,
            label: 'Personal Trainer',
            icon: AssetsStore.Icon('service.four'),
            iconClass: 'personal-trainer',
            price: 0
        },
        {
            id: SERVICES.FISIOTERAPISTA,
            label: 'Fisioterapista/Osteopata',
            icon: AssetsStore.Icon('service.five'),
            iconClass: 'fisioterapista',
            price: 0
        },
        {
            id: SERVICES.STIRATURA,
            label: 'Stiratura',
            icon: AssetsStore.Icon('service.six'),
            iconClass: 'stiratura',
            price: 12.5
        },
        {
            id: SERVICES.TUTTOFARE,
            label: 'Tuttofare',
            icon: AssetsStore.Icon('service.seven'),
            iconClass: 'stiratura',
            price: 12.5,
            fixedPrice: 9.9,
        },
        {
            id: SERVICES.SERVIZI_ELETTRICI,
            label: 'Servizi elettrici',
            icon: AssetsStore.Icon('service.eight'),
            iconClass: 'stiratura',
            price: 29.9,
            fixedPrice: 29.9,
        },
        {
            id: SERVICES.SERVIZI_IDRAULICI,
            label: 'Servizi idraulici',
            icon: AssetsStore.Icon('service.nine'),
            iconClass: 'stiratura',
            price: 29.9,
            fixedPrice: 29.9,
        },
        {
            id: SERVICES.CHECKIN_CHECKOUT,
            label: 'Check-in / Check-out',
            icon: AssetsStore.Icon('service.ten'),
            iconClass: 'stiratura',
            price: 28,
            fixedPrice: 28,
        },
        {
            id: SERVICES.COLF_BNB,
            label: 'Colf',
            icon: AssetsStore.Icon('service.one'),
            iconClass: 'colfbnb',
            price: 17,
            fixedPrice: 17,
        },
    ];

    var competences = {
        'ATT-00000000-0000-0000-0001-000000000003': {
            relatedService: SERVICES.COLF
        },
        'ATT-00000000-0000-0000-0001-000000000002': {
            relatedService: SERVICES.BABYSITTER
        },
        'ATT-00000000-0000-0000-0001-000000000001': {
            relatedService: SERVICES.BADANTE
        },
        'ATT-00000000-0000-0000-0001-000000000004': {
            relatedService: SERVICES.ALLENAMENTOFUNZIONALE,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000005': {
            relatedService: SERVICES.DIMAGRIMENTO,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000006': {
            relatedService: SERVICES.GINNASTICAPOSTURALE,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000007': {
            relatedService: SERVICES.CICLISMO,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000008': {
            relatedService: SERVICES.YOGA,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000009': {
            relatedService: SERVICES.DIFESAPERSONALE,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000010': {
            relatedService: SERVICES.CORSA,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000011': {
            relatedService: SERVICES.PILATES,
            parent: SERVICES.PERSONALTRAINER
        },
        'ATT-00000000-0000-0000-0001-000000000013': {
            relatedService: SERVICES.STIRATURA,
        },
        'ATT-00000000-0000-0000-0001-000000000014': {
            relatedService: SERVICES.VALUTAZIONE_FUNZIONALE,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000015': {
            relatedService: SERVICES.FISIO_ORTOPEDICA,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000016': {
            relatedService: SERVICES.FISIO_NEUROLOGICA,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000017': {
            relatedService: SERVICES.FISIO_RESPIRATORIA,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000018': {
            relatedService: SERVICES.FISIO_CARDIOLOGICA,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000019': {
            relatedService: SERVICES.GINNASTICA_POSTURALE,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000020': {
            relatedService: SERVICES.LINFODRENAGGIO,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000021': {
            relatedService: SERVICES.MASSOTERAPIA_MEZZA,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000022': {
            relatedService: SERVICES.MASSOTERAPIA_INTERA,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000023': {
            relatedService: SERVICES.OSTEOPATIA,
            parent: SERVICES.FISIOTERAPISTA
        },
        'ATT-00000000-0000-0000-0001-000000000024': {
            relatedService: SERVICES.TUTTOFARE,
        },
        'ATT-00000000-0000-0000-0001-000000000025': {
            relatedService: SERVICES.SERVIZI_ELETTRICI,
        },
        'ATT-00000000-0000-0000-0001-000000000026': {
            relatedService: SERVICES.SERVIZI_IDRAULICI,
        },
        'ATT-00000000-0000-0000-0001-000000000027': {
            relatedService: SERVICES.CHECKIN_CHECKOUT,
        },
        'ATT-00000000-0000-0000-0001-000000000003A': {
            relatedService: SERVICES.COLF_BNB,
        },
    }

    let subServices = {
        [SERVICES.PERSONALTRAINER]: [
            { id: SERVICES.ALLENAMENTOFUNZIONALE,   label: 'Allenamento Funzionale',            icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'),    time: 60, price: 50 },
            { id: SERVICES.DIMAGRIMENTO,            label: 'Dimagrimento',                      icon: AssetsStore.Icon('personalTrainer.dimagrimento'),             time: 60, price: 50 },
            { id: SERVICES.GINNASTICAPOSTURALE,     label: 'Ginnastica Posturale',              icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),      time: 60, price: 50 },
            { id: SERVICES.CICLISMO,                label: 'Ciclismo',                          icon: AssetsStore.Icon('personalTrainer.ciclismo'),                 time: 60, price: 50 },
            { id: SERVICES.YOGA,                    label: 'Yoga',                              icon: AssetsStore.Icon('personalTrainer.yoga'),                     time: 90, price: 80 },
            { id: SERVICES.DIFESAPERSONALE,         label: 'Difesa Personale',                  icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),          time: 60, price: 50 },
            { id: SERVICES.CORSA,                   label: 'Corsa',                             icon: AssetsStore.Icon('personalTrainer.corsa'),                    time: 60, price: 50 },
            { id: SERVICES.PILATES,                 label: 'Pilates',                           icon: AssetsStore.Icon('personalTrainer.pilates'),                  time: 60, price: 80 },
        ],
        [SERVICES.FISIOTERAPISTA]: [
            { id: SERVICES.VALUTAZIONE_FUNZIONALE,  label: 'Valutazione Funzionale',            icon: AssetsStore.Icon('fisioterapista.valutazioneFunzionale'),    time: 45, price: 65 },
            { id: SERVICES.FISIO_ORTOPEDICA, label: 'Fisioterapia Ortopedica',                  icon: AssetsStore.Icon('fisioterapista.fisioterapiaOrtopedica'),             time: 45, price: 65 },
            { id: SERVICES.FISIO_NEUROLOGICA, label: 'Fisioterapia Neurologica',                icon: AssetsStore.Icon('fisioterapista.fisioterapiaNeurologica'),      time: 60, price: 65 },
            { id: SERVICES.FISIO_RESPIRATORIA, label: 'Fisioterapia Respiratoria',              icon: AssetsStore.Icon('fisioterapista.fisioterapiaRespiratoria'),                 time: 45, price: 65 },
            { id: SERVICES.FISIO_CARDIOLOGICA, label: 'Fisioterapia Cardiologica',              icon: AssetsStore.Icon('fisioterapista.fisioterapiaCardiologica'),                     time: 45, price: 65 },
            { id: SERVICES.GINNASTICA_POSTURALE, label: 'Ginnastica Posturale',                 icon: AssetsStore.Icon('fisioterapista.ginnasticaPosturale'),          time: 45, price: 65 },
            { id: SERVICES.LINFODRENAGGIO, label: 'Linfodrenaggio',                             icon: AssetsStore.Icon('fisioterapista.linfodrenaggio'),                    time: 60, price: 65 },
            { id: SERVICES.MASSOTERAPIA_MEZZA, label: 'Massoterapia Gambe o Schiena (30 min)',  icon: AssetsStore.Icon('fisioterapista.massoterapiaMezza'),                  time: 30, price: 45 },
            { id: SERVICES.MASSOTERAPIA_INTERA, label: 'Massoterapia Gambe e Schiena (60 min)', icon: AssetsStore.Icon('fisioterapista.massoterapiaIntera'),                  time: 60, price: 65 },
            { id: SERVICES.OSTEOPATIA, label: 'Osteopatia',                                     icon: AssetsStore.Icon('fisioterapista.osteopatia'),                  time: 45, price: 70 },
        ]
    }

    let additional = {
        [SERVICES.COLF]: [
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_FRIGORIFERO, label: "Pulizia Frigorifero", icon: AssetsStore.Icon('colfServices.fridge'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_FORNO, label: "Pulizia Forno", icon: AssetsStore.Icon('colfServices.oven'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_VETRI_INTERNI, label: "Pulizia Vetri interni", icon: AssetsStore.Icon('colfServices.windows'), time: 90 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_ARMADI, label: "Pulizia Armadi", icon: AssetsStore.Icon('colfServices.closet'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_LAMPADARI, label: "Pulizia Lampadari", icon: AssetsStore.Icon('colfServices.chandelier'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.LAVAGGIO_CAPI, label: "Lavaggio capi", icon: AssetsStore.Icon('colfServices.washing'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.STIRATURA, label: "Stiratura", icon: AssetsStore.Icon('colfServices.iron'), time: 60 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_TERRAZZA, label: "Pulizia Terrazza", icon: AssetsStore.Icon('colfServices.terrace'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_CANTINA, label: "Pulizia Cantina", icon: AssetsStore.Icon('colfServices.stairs'), time: 120 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_GARAGE, label: "Pulizia Garage", icon: AssetsStore.Icon('colfServices.garage'), time: 120 }
        ],
        [SERVICES.COLF_BNB]: [
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_FRIGORIFERO, label: "Pulizia Frigorifero", icon: AssetsStore.Icon('colfServices.fridge'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_FORNO, label: "Pulizia Forno", icon: AssetsStore.Icon('colfServices.oven'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_VETRI_INTERNI, label: "Pulizia Vetri interni", icon: AssetsStore.Icon('colfServices.windows'), time: 90 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_ARMADI, label: "Pulizia Armadi", icon: AssetsStore.Icon('colfServices.closet'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_LAMPADARI, label: "Pulizia Lampadari", icon: AssetsStore.Icon('colfServices.chandelier'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.LAVAGGIO_CAPI, label: "Lavaggio capi", icon: AssetsStore.Icon('colfServices.washing'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_TERRAZZA, label: "Pulizia Terrazza", icon: AssetsStore.Icon('colfServices.terrace'), time: 30 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_CANTINA, label: "Pulizia Cantina", icon: AssetsStore.Icon('colfServices.stairs'), time: 120 },
            { id: COLF_ADDITIONAL_SERVICES.PULIZIA_GARAGE, label: "Pulizia Garage", icon: AssetsStore.Icon('colfServices.garage'), time: 120 }
        ],
        [SERVICES.BADANTE]: [
            { id: BADANTE_ADDITIONAL_SERVICES.IGIENE_PERSONALE, label: "Igiene personale", icon: AssetsStore.Icon('badanteServices.personalHygene') },
            { id: BADANTE_ADDITIONAL_SERVICES.CUCINA, label: "Cucina", icon: AssetsStore.Icon('badanteServices.pan') },
            { id: BADANTE_ADDITIONAL_SERVICES.PULIZIE_DOMESTICHE, label: "Pulizie domestiche", icon: AssetsStore.Icon('badanteServices.cleaning') },
            //{ id: BADANTE_ADDITIONAL_SERVICES.PRESTAZIONI_INFERMIERISTICHE, label: "Prestazioni infermieristiche", icon: AssetsStore.Icon('badanteServices.bandAid') },
            { id: BADANTE_ADDITIONAL_SERVICES.MOBILITIZZAZIONE_DOMESTICA, label: "Mobilizzazione domestica", icon: AssetsStore.Icon('badanteServices.mobility') },
            { id: BADANTE_ADDITIONAL_SERVICES.COMMISIONI_VARIE, label: "Commissioni varie", icon: AssetsStore.Icon('badanteServices.shoppingCart') },
            //{ id: BADANTE_ADDITIONAL_SERVICES.ATTIVITA_FISIOTERAPICHE, label: "Attività fisioterapiche", icon: AssetsStore.Icon('badanteServices.cross') }
        ],
        [SERVICES.BABYSITTER]: [
            { id: BABYSITTER_ADDITIONAL_SERVICES.SUPPORTO_SCOLASTICO, label: "Supporto scolastico", icon: AssetsStore.Icon('babySitterServices.study')},
            { id: BABYSITTER_ADDITIONAL_SERVICES.PULIZIE, label: "Pulizie", icon: AssetsStore.Icon('babySitterServices.houseCleaning')},
            { id: BABYSITTER_ADDITIONAL_SERVICES.CUCINA, label: "Cucina", icon: AssetsStore.Icon('babySitterServices.pan')},
            { id: BABYSITTER_ADDITIONAL_SERVICES.COMMISIONI_VARIE, label: "Commissioni varie", icon: AssetsStore.Icon('babySitterServices.shoppingCart')}
        ],
        [SERVICES.TUTTOFARE]: [
            { id: TUTTOFARE_ADDITIONAL_SERVICES.MONTAGGIO_SMONTAGGIO_MOBILI, label: 'Montaggio e smontaggio mobili', icon: AssetsStore.Icon('tuttofareServices.montaggio') },
            { id: TUTTOFARE_ADDITIONAL_SERVICES.SPOSTAMENTO, label: 'Spostamento mobili o oggetti pesanti ', icon: AssetsStore.Icon('tuttofareServices.spostamento') },
            { id: TUTTOFARE_ADDITIONAL_SERVICES.TRASLOCHI, label: 'Aiuto nei traslochi', icon: AssetsStore.Icon('tuttofareServices.trasloco') },
            { id: TUTTOFARE_ADDITIONAL_SERVICES.CARICO_SCARICO_MERCI, label: 'Carico e scarico merci', icon: AssetsStore.Icon('tuttofareServices.scaricoMerci') },
            { id: TUTTOFARE_ADDITIONAL_SERVICES.GIARDINAGGIO, label: 'Piccoli lavori di giardinaggio', description: 'potatura piante, pulizia fioriere, cambio terra', icon: AssetsStore.Icon('tuttofareServices.giardinaggio') },
            { id: TUTTOFARE_ADDITIONAL_SERVICES.PICCOLI_LAVORI_DOMESTICI, label: 'Piccoli lavori domestici', icon: AssetsStore.Icon('tuttofareServices.lavoriDomestici'), description: 'sostituzione lampadine, sistemazione avvolgibili e tapparelle, montaggio mensole, sistemazione tende, montaggio e smontaggio plafoniere' },
            { id: TUTTOFARE_ADDITIONAL_SERVICES.SISTEMAZIONE_LEGNA, label: 'Sistemazione legna', icon: AssetsStore.Icon('tuttofareServices.legna') },
            { id: TUTTOFARE_ADDITIONAL_SERVICES.STUCCATURA, label: 'Stuccatura', icon: AssetsStore.Icon('tuttofareServices.stuccatura') },
        ],
        [SERVICES.SERVIZI_IDRAULICI]: [
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.RIPARAZIONE_RUBINETTI, label: 'Riparazione rubinetti gocciolanti', icon: AssetsStore.Icon('idraulico.rubinettoGocciolante'), time: 90, timeLabel: '1.5 ore per rubinetto' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.RIPARAZIONE_SCARICHI, label: 'Riparazione scarichi domestici', icon: AssetsStore.Icon('idraulico.riparazioneScarico'), time: 90, timeLabel: '1.5 ore per scarico' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.DISOTTURAZIONE_SCARICHI, label: 'Disotturazione scarichi', icon: AssetsStore.Icon('idraulico.disotturazioneScarico'), time: 60, timeLabel: '1 ora per scarico' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.INSTALLAZIONE_RUBINETTERIE, label: 'Installazione/sostituzione rubinetterie', icon: AssetsStore.Icon('idraulico.installazioneRubinetto'), time: 90, timeLabel: '1.5 ore per rubinetto' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.INSTALLAZIONE_SANITARI, label: 'Installazione sanitari', icon: AssetsStore.Icon('idraulico.sanitari'), time: 120, timeLabel: '2 ore per sanitario' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.SOSTITUZIONE_SANITARI, label: 'Sostituzione sanitari', icon: AssetsStore.Icon('idraulico.sanitari'), time: 180, timeLabel: '3 ore per sanitario' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.INSTALLAZIONE_BOILER_ELETTRICO, label: 'Installazione boiler elettrico (< 30 litri)', icon: AssetsStore.Icon('idraulico.boilerElettrico'), time: 120, timeLabel: '2 ore' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.SOSTITUZIONE_BOILER_ELETTRICO, label: 'Altro', icon: AssetsStore.Icon('idraulico.boilerElettrico'), time: 0, timeLabel: 'Specificare nelle note' },
            //{ id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.INSTALLAZIONE_BOILER_GAS, label: 'Installazione boiler a gas (< 30 litri)', icon: AssetsStore.Icon('idraulico.boilerGas'), time: 240, timeLabel: '4 ore' },
            //{ id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.SOSTITUZIONE_BOILER_GAS, label: 'Sostituzione boiler a gas (< 30 litri)', icon: AssetsStore.Icon('idraulico.boilerGas'), time: 360, timeLabel: '6 ore' },
            //{ id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.INSTALLAZIONE_PIATTO_DOCCIA, label: 'Installazione piatto doccia', icon: AssetsStore.Icon('idraulico.piattoDoccia'), time: 120, timeLabel: '2 ore' },
            //{ id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.SOSTITUZIONE_PIATTO_DOCCIA, label: 'Sostituzione piatto doccia', icon: AssetsStore.Icon('idraulico.piattoDoccia'), time: 360, timeLabel: '6 ore' },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.INSTALLAZIONE_COLONNA_DOCCIA, label: 'Installazione colonna per doccia', icon: AssetsStore.Icon('idraulico.colonnaDoccia'), time: 120, timeLabel: '2 ore' },
            //{ id: SERVIZI_IDRAULICI_ADDITIONAL_SERVICES.SOSTITUZIONE_POMPA_ACQUA, label: 'Installazione pompa di sollevamento acqua', icon: AssetsStore.Icon('idraulico.pompaAcqua'), time: 180, timeLabel: '3 ore' },
        ],
        [SERVICES.SERVIZI_ELETTRICI]: [
            { id: SERVIZI_ELETTRICI_ADDITIONAL_SERVICES.INSTALLAZIONE_LAMPADARI, label: 'Installazione/ sostituzione lampadari e plafoniere', icon: AssetsStore.Icon('elettricista.lampadario'), time: 45, timeLabel: '45 min per lampadario/plafoniera' },
            { id: SERVIZI_ELETTRICI_ADDITIONAL_SERVICES.CAMBIO_LAMPADINE, label: 'Cambio lampadine, led, neon', icon: AssetsStore.Icon('elettricista.lampadina'), time: 10, timeLabel: '10 min per lampadina/led/neon' },
            { id: SERVIZI_ELETTRICI_ADDITIONAL_SERVICES.INSTALAZIONE_PRESA_ELETTRICA, label: 'Installazione prese elettriche/ interruttori (in assenza di scatola muro)', icon: AssetsStore.Icon('elettricista.presaElettrica'), time: 60, timeLabel: '1 ora per presa/interruttore' },
            { id: SERVIZI_ELETTRICI_ADDITIONAL_SERVICES.SOSTITUZIONE_PRESA_ELETTRICA, label: 'Installazione/sostituzione prese elettriche/ interruttori (con scatola muro già presente)', icon: AssetsStore.Icon('elettricista.presaElettrica'), time: 20, timeLabel: '20 min per presa/interruttore' },
            { id: SERVIZI_ELETTRICI_ADDITIONAL_SERVICES.INSTALLAZIONE_TELEVISORE, label: 'Installazione/ sintonizzazione televisore a muro', icon: AssetsStore.Icon('elettricista.televisore'), time: 60, timeLabel: '1 ora' },
            { id: SERVIZI_ELETTRICI_ADDITIONAL_SERVICES.ALLACCIAMENTO_IMPIANTO_SATELLITARE, label: 'Altro', icon: AssetsStore.Icon('elettricista.allacciamentoImpianto'), time: 0, timeLabel: 'Specificare nelle note' },
            //{ id: SERVIZI_ELETTRICI_ADDITIONAL_SERVICES.ALLACCIAMENTO_IMPIANTO_SATELLITARE_SENZA_PARABOLA, label: 'Allacciamento impianto satellitare (con parabola da installare)', icon: AssetsStore.Icon('elettricista.allacciamentoImpianto'), time: 240, timeLabel: '4 ore' },
        ]
    };

    let tools = {
        [SERVICES.TUTTOFARE]: [
            { id: TUTTOFARE_ADDITIONAL_TOOLS.ATTREZZI_DI_BASE, label: 'Cassetta degli attrezzi', icon: AssetsStore.Icon('tuttofareServices.montaggio'), description: 'Prevede i seguenti attrezzi: metro, bolla d\'aria, martello, cacciavite, pinza, chiave inglese, taglierino, matita, trapano, avvitatore', price: 3.90 },
            { id: TUTTOFARE_ADDITIONAL_TOOLS.ATTREZZI_DI_GRANDI_DIMENSIONI, label: 'Attrezzi extra', icon: AssetsStore.Icon('tuttofareServices.attrezziExtra'), description: 'Prevede i seguenti attrezzi: scala (specificare altezza nelle note)', price: 10.90 },
        ],
        [SERVICES.SERVIZI_ELETTRICI]: [
            { id: SERVIZI_ELETTRICI_ADDITIONAL_TOOLS.ATTREZZI_DI_BASE, label: 'Cassetta degli attrezzi', icon: AssetsStore.Icon('tuttofareServices.montaggio'), description: 'Prevede i seguenti attrezzi: metro, bolla d\'aria, martello, cacciavite, pinza, chiave inglese, taglierino, matita, trapano, avvitatore', price: 3.90 },
            { id: SERVIZI_ELETTRICI_ADDITIONAL_TOOLS.ATTREZZI_DI_GRANDI_DIMENSIONI, label: 'Attrezzi extra', icon: AssetsStore.Icon('tuttofareServices.attrezziExtra'), description: 'Prevede i seguenti attrezzi: scala (specificare altezza nelle note)', price: 10.90 },
        ],
        [SERVICES.SERVIZI_IDRAULICI]: [
            { id: SERVIZI_IDRAULICI_ADDITIONAL_TOOLS.ATTREZZI_DI_BASE, label: 'Cassetta degli attrezzi', icon: AssetsStore.Icon('tuttofareServices.montaggio'), description: 'Prevede i seguenti attrezzi: metro, bolla d\'aria, martello, cacciavite, pinza, chiave inglese, taglierino, matita, trapano, avvitatore', price: 3.90 },
            { id: SERVIZI_IDRAULICI_ADDITIONAL_TOOLS.ATTREZZI_DI_GRANDI_DIMENSIONI, label: 'Attrezzi extra', icon: AssetsStore.Icon('tuttofareServices.attrezziExtra'), description: 'Prevede i seguenti attrezzi: scala (specificare altezza nelle note)', price: 10.90 },
        ]
    };

    let badanteAgeOptions = [
        { id: 'AGE_60_70', value: '60-70' },
        { id: 'AGE_70_80', value: '70-80' },
        { id: 'AGE_80_90', value: '80-90' },
        { id: 'AGE_90_OVER', value: '90+' }
    ];

    let personalTrainerAgeOptions = [
        { id: 'AGE_18_30', value: '18-30' },
        { id: 'AGE_30_40', value: '30-40' },
        { id: 'AGE_40_50', value: '40-50' },
        { id: 'AGE_50_60', value: '50-60' },
        { id: 'AGE_60_70', value: '60-70' },
    ];

    let personalTrainerDiscounts = [
        0, // no people
        0, // only user
        30, // 1 guest
        40, // 2 guests
        50, // so on..
        55
    ]

    let addressTypes = [
        { id: 'INTERNAL', label: 'Indirizzo abitazione' },
        { id: 'EXTERNAL', label: 'Indirizzo esterno' },
    ]

    let babySitterAgeOptions = [
        { id: BABYSITTER_ADDITIONAL_SERVICES.DA_0_A_2_ANNI, value: "Da 0 a 2 anni" },
        { id: BABYSITTER_ADDITIONAL_SERVICES.DA_3_A_6_ANNI, value: "Da 3 a 6 anni" },
        { id: BABYSITTER_ADDITIONAL_SERVICES.DA_7_A_12_ANNI, value: "Da 7 a 12 anni" },
        { id: BABYSITTER_ADDITIONAL_SERVICES.DA_13_A_PIU_ANNI, value: "più di 12 anni" }
    ];

    let recurrency = {
        frequency: [
            {id: 'DAILY', value: 'Ogni giorno'},
            {id: 'WEEKLY', value: 'Ogni settimana'},
            {id: 'TWO_WEEKS', value: 'Ogni due settimane'},
            {id: 'THREE_WEEKS', value: 'Ogni tre settimane'},
            {id: 'MONTHLY', value: 'Una volta al mese'}
        ],
        times: [
            {id: 1, value: 'Una volta'},
            {id: 2, value: 'Due volte'},
            {id: 3, value: 'Tre volte'},
            {id: 4, value: 'Quattro volte'},
            {id: 5, value: 'Cinque volte'},
            {id: 6, value: 'Sei volte'},
            {id: 7, value: 'Sette volte'},
            {id: 8, value: 'Otto volte'},
            {id: 9, value: 'Nove volte'},
            {id: 10, value: 'Dieci volte'}
        ]
    }

    let isAddressTypeExternal = (state) => {
        let newAddressInfo = state.steps.address.input.info;
        let userAddresses = state.steps.address.userAddresses;
        let selectedAddress = state.steps.address.selectedUserAddress;
        let isExternal = false;
        if (selectedAddress !== '' && _.isArray(userAddresses) && userAddresses.length > 0) {
            let selected = _.find(userAddresses, { id: selectedAddress });
            let _note = !selected.note ? '{ "type": "INTERNAL" }' : selected.note;
            let addressNotes = JSON.parse(_note);
            if (addressNotes.type === 'EXTERNAL') isExternal = true;
        } else if (_.isObject(newAddressInfo)) {
            if (newAddressInfo.type === 'EXTERNAL') isExternal = true;
        }

        return isExternal;
    }

    let getServiceSlug = (serviceId) => {
        if(serviceId === SERVICES.COLF || serviceId === SERVICES.COLF_BNB) return 'colf';
        else if (serviceId === SERVICES.BADANTE) return 'badante';
        else if (serviceId === SERVICES.BABYSITTER) return 'babySitter';
        else if (serviceId === SERVICES.PERSONALTRAINER) return 'personalTrainer';
        else if (serviceId === SERVICES.FISIOTERAPISTA) return 'fisioterapista';
        else if (serviceId === SERVICES.STIRATURA) return 'stiratura';
        else if (serviceId === SERVICES.TUTTOFARE) return 'tuttofare';
        else if (serviceId === SERVICES.SERVIZI_ELETTRICI) return 'elettricista';
        else if (serviceId === SERVICES.SERVIZI_IDRAULICI) return 'idraulico';
        else if (serviceId === SERVICES.CHECKIN_CHECKOUT) return 'checkincheckout';
    }

    let getFinalService = (serviceStep) => {
        let selectedService = serviceStep.selectedService;
        let _service = getServiceSlug(selectedService);
        if (serviceStep[_service] && _.isString(serviceStep[_service].subService) && serviceStep[_service].subService !== '') {
            selectedService = serviceStep[_service].subService;
        }
        return selectedService;
    }

    return {
        services,
        subServices,
        additional,
        tools,
        competences,
        babySitterAgeOptions,
        personalTrainerAgeOptions,
        badanteAgeOptions,
        addressTypes,

        personalTrainerDiscounts,

        recurrency,

        isAddressTypeExternal,
        getServiceSlug,
        getFinalService
    }
}
