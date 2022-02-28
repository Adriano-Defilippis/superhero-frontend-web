/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function ServicesService (
    AssetsStore, SERVICES, RestService, BookingModel
){
    "ngInject";

    var self = this;

    const personalTrainerServices = [
        '0004', // allenamento funzionale
        '0005', // dimagrimento
        '0006', // ginnastica posturale
        '0007', // ciclismo
        '0008', // yoga
        '0009', // difesa personale
        '0010', // corsa
        '0011', // pilates
    ];

    const fisioterapistaServices = [
        '0014', // allenamento funzionale
        '0015', // dimagrimento
        '0016', // ginnastica posturale
        '0017', // ciclismo
        '0018', // yoga
        '0019', // difesa personale
        '0020', // corsa
        '0021', // pilates
        '0022', // pilates
        '0023', // pilates
    ];

    const servicesMeta = {
        'ATT-00000000-0000-0000-0001-000000000003': {
            icon: AssetsStore.Icon('service.one'),
            descrizione: 'Colf',
            number: 1,
        },
        'ATT-00000000-0000-0000-0001-000000000001': {
            icon: AssetsStore.Icon('service.two'),
            descrizione: 'Badante',
            number: 2,
        },
        'ATT-00000000-0000-0000-0001-000000000002': {
            icon: AssetsStore.Icon('service.three'),
            descrizione: 'Baby Sitter',
            number: 3,
        },
        'ATT-00000000-0000-0000-0001-000000000012': {
            icon: AssetsStore.Icon('service.five'),
            descrizione: 'Fisioterapista/Osteopata',
            number: 5,
        },
        [SERVICES.PERSONALTRAINER]: {
            icon: AssetsStore.Icon('service.four'),
            descrizione: 'Personal Trainer',
            number: 4,
        },
        [SERVICES.FISIOTERAPISTA]: {
            icon: AssetsStore.Icon('service.five'),
            descrizione: 'Fisioterapista/Osteopata',
            number: 5,
        },
        'ATT-00000000-0000-0000-0001-000000000013': {
            icon: AssetsStore.Icon('service.six'),
            descrizione: 'Stiratura',
            number: 6,
        },
        'ATT-00000000-0000-0000-0001-000000000024': {
            icon: AssetsStore.Icon('service.seven'),
            descrizione: 'Tuttofare',
            number: 7,
        },
        'ATT-00000000-0000-0000-0001-000000000025': {
            icon: AssetsStore.Icon('service.eight'),
            descrizione: 'Servizi elettrici',
            number: 8,
        },
        'ATT-00000000-0000-0000-0001-000000000026': {
            icon: AssetsStore.Icon('service.nine'),
            descrizione: 'Servizi idraulici',
            number: 9,
        },
        'ATT-00000000-0000-0000-0001-000000000027': {
            icon: AssetsStore.Icon('service.nine'),
            descrizione: 'Check-in/check-out',
            number: 10,
        },
        'ATT-00000000-0000-0000-0001-000000000003A': {
            icon: AssetsStore.Icon('service.one'),
            descrizione: 'Colf',
            number: 11,
        },
    }

    const services = {

    }


    self.loadData = function(data) {
        let allServices = data.data.plain();
        allServices.forEach(service => {
            const suffix = service.id.substr(service.id.length - 4);
            const isPersonalTrainer = _.includes(personalTrainerServices, suffix);
            const isFisioterapista = _.includes(fisioterapistaServices, suffix);
            let serviceMeta = servicesMeta[service.competenza.id];
            if (isPersonalTrainer) serviceMeta = servicesMeta[SERVICES.PERSONALTRAINER];
            if (isFisioterapista) serviceMeta = servicesMeta[SERVICES.FISIOTERAPISTA];
            if (serviceMeta) {
                services[service.id] = {
                    label: (isPersonalTrainer || isFisioterapista) ? serviceMeta.descrizione + ' ('+service.competenza.descrizione+')' : service.competenza.descrizione,
                    icon: serviceMeta.icon,
                    descrizione: service.prestazione,
                    competence: service.competenza.id,
                    number: serviceMeta.number,
                    id: service.id
                }
            }
        });
        RestService.getAttributes().then(loadSubCompetences);
    }

    function loadSubCompetences (data) {
        let allServices = data.data.plain();
        allServices = _.groupBy(allServices, (value) => value.tipo === "Competenza");
        allServices.false.forEach(service => {
            
            let serviceMeta = servicesMeta[service.id];
            if (serviceMeta){

                const serviceId = _.findKey(BookingModel.additional, (value) => _.findIndex(value, {id: service.id}) > -1);
                services[service.id] = {
                    label: servicesMeta[services[serviceId].competence].descrizione + ' ('+service.descrizione+')',
                    icon: serviceMeta.icon,
                    descrizione: service.prestazione,
                    number: serviceMeta.number,
                    id: service.id
                }

            }
        });
    }

    var competenze = {
        'ATT-00000000-0000-0000-0001-000000000003': {
            label: 'Colf',
            relatedService: 'TS-0000-0000-0000-0003',
            number: 1
        },
        'ATT-00000000-0000-0000-0001-000000000002': {
            label: 'Baby Sitter',
            relatedService: 'TS-0000-0000-0000-0002',
            number: 3
        },
        'ATT-00000000-0000-0000-0001-000000000001': {
            label: 'Badante',
            relatedService: 'TS-0000-0000-0000-0001',
            number: 2
        },
        'ATT-00000000-0000-0000-0001-000000000004': {
            label: 'Allenamento Funzionale',
            relatedService: 'TS-0000-0000-0000-0004',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000005': {
            label: 'Dimagrimento',
            relatedService: 'TS-0000-0000-0000-0005',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000006': {
            label: 'Ginnastica Posturale',
            relatedService: 'TS-0000-0000-0000-0006',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000007': {
            label: 'Ciclismo',
            relatedService: 'TS-0000-0000-0000-0007',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000008': {
            label: 'Yoga',
            relatedService: 'TS-0000-0000-0000-0008',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000009': {
            label: 'Difesa Personale',
            relatedService: 'TS-0000-0000-0000-0009',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000010': {
            label: 'Corsa',
            relatedService: 'TS-0000-0000-0000-0010',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000011': {
            label: 'Pilates',
            relatedService: 'TS-0000-0000-0000-0011',
            number: 4
        },
        'ATT-00000000-0000-0000-0001-000000000014': {
            label: 'Valutazione Funzionale',
            relatedService: 'TS-0000-0000-0000-0014',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000015': {
            label: 'Fisioterapia Ortopedica',
            relatedService: 'TS-0000-0000-0000-0015',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000016': {
            label: 'Fisioterapia Neurologica',
            relatedService: 'TS-0000-0000-0000-0016',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000017': {
            label: 'Fisioterapia Respiratoria',
            relatedService: 'TS-0000-0000-0000-0017',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000018': {
            label: 'Fisioterapia Cardiologica',
            relatedService: 'TS-0000-0000-0000-0018',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000019': {
            label: 'Ginnastica Posturale',
            relatedService: 'TS-0000-0000-0000-0019',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000020': {
            label: 'Linfodrenaggio',
            relatedService: 'TS-0000-0000-0000-0020',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000021': {
            label: 'Massoterapia Gambe o Schiena (30 min)',
            relatedService: 'TS-0000-0000-0000-0021',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000022': {
            label: 'Massoterapia Gambe e Schiena (60 min)',
            relatedService: 'TS-0000-0000-0000-0022',
            number: 5
        },
        'ATT-00000000-0000-0000-0001-000000000023': {
            label: 'Osteopatia',
            relatedService: 'TS-0000-0000-0000-0023',
            number: 5
        },

        'ATT-00000000-0000-0000-0001-000000000013': {
            label: 'Stiratura',
            relatedService: 'TS-0000-0000-0000-0013',
            number: 6
        },
        'ATT-00000000-0000-0000-0001-000000000024': {
            label: 'Tuttofare',
            relatedService: 'TS-0000-0000-0000-0024',
            number: 7
        },
        'ATT-00000000-0000-0000-0001-000000000025': {
            label: 'Servizi Elettrici',
            relatedService: 'TS-0000-0000-0000-0025',
            number: 8
        },
        'ATT-00000000-0000-0000-0001-000000000026': {
            label: 'Servizi Idraulici',
            relatedService: 'TS-0000-0000-0000-0026',
            number: 9
        },
        'ATT-00000000-0000-0000-0001-000000000027': {
            label: 'Check-in / check-out',
            relatedService: 'TS-0000-0000-0000-0027',
            number: 10
        },
        'ATT-00000000-0000-0000-0001-000000000003A': {
            label: 'Colf',
            relatedService: 'TS-0000-0000-0000-0003A',
            number: 11
        },
    }

    var serviceDetails = {
        //                                                          COLF
        'ATT-00000000-0000-0000-0002-000000000001': {
            id: 'ATT-00000000-0000-0000-0002-000000000001',
            label: "Pulizie abitazioni private",
            parent: 'ATT-00000000-0000-0000-0001-000000000003',
            icon: false,
            searchDisabled :true,
        },
        'ATT-00000000-0000-0000-0002-000000000002': {
            id: 'ATT-00000000-0000-0000-0002-000000000002',
            label: "Pulizie condomini",
            parent: 'ATT-00000000-0000-0000-0001-000000000003',
            icon: false,
            searchDisabled :true,
        },
        'ATT-00000000-0000-0000-0002-000000000003': {
            id: 'ATT-00000000-0000-0000-0002-000000000003',
            label: "Pulizie Hotels",
            parent: 'ATT-00000000-0000-0000-0001-000000000003',
            icon: false,
            searchDisabled :true,
        },
        'ATT-00000000-0000-0000-0002-000000000004': {
            id: 'ATT-00000000-0000-0000-0002-000000000004',
            label: "Pulizie uffici",
            parent: 'ATT-00000000-0000-0000-0001-000000000003',
            icon: false,
            searchDisabled :true,
        },
        'ATT-00000000-0000-0000-0002-000000000005': {
            id: 'ATT-00000000-0000-0000-0002-000000000005',
            label: "Pulizie edifici industriali",
            parent: 'ATT-00000000-0000-0000-0001-000000000003',
            icon: false,
            searchDisabled :true,
        },
        'ATT-00000000-0000-0000-0002-000000000006': {
            id: 'ATT-00000000-0000-0000-0002-000000000006',
            label: "Stiro",
            parent: 'ATT-00000000-0000-0000-0001-000000000003',
            icon: false
        },
        'ATT-00000000-0000-0000-0002-000000000007': {
            id: 'ATT-00000000-0000-0000-0002-000000000007',
            label: "Pulizie altro",
            parent: 'ATT-00000000-0000-0000-0001-000000000003',
            icon: false,
            searchDisabled :true,
        },
        //                                                        BADANTE
        'ATT-00000000-0000-0000-0002-000000000008': {
            id: 'ATT-00000000-0000-0000-0002-000000000008',
            label: 'Igiene personale',
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.personalHygene')
        },
        'ATT-00000000-0000-0000-0002-000000000009': {
            id: 'ATT-00000000-0000-0000-0002-000000000009',
            label: "Mobilizzazione domestica",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.mobility')
        },
        'ATT-00000000-0000-0000-0002-000000000010': {
            id: 'ATT-00000000-0000-0000-0002-000000000010',
            label: "Prestazioni infermieristiche",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.bandAid'),
            disabled: true,
            searchDisabled :true,
        },
        'ATT-00000000-0000-0000-0002-000000000011': {
            id: 'ATT-00000000-0000-0000-0002-000000000011',
            label: "Attività fisioterapiche",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.cross'),
            disabled: true,
            searchDisabled :true,
        },
        'ATT-00000000-0000-0000-0002-000000000012': {
            id: 'ATT-00000000-0000-0000-0002-000000000012',
            label: "Cucina",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.pan')
        },
        'ATT-00000000-0000-0000-0002-000000000013': {
            id: 'ATT-00000000-0000-0000-0002-000000000013',
            label: "Pulizie domestiche",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.cleaning')
        },

        'ATT-00000000-0000-0000-0002-000000000014': {
            id: 'ATT-00000000-0000-0000-0002-000000000014',
            label: "Commissioni varie",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.shoppingCart')
        },
        'ATT-00000000-0000-0000-0002-000000000015': {
            id: 'ATT-00000000-0000-0000-0002-000000000015',
            label: "Stirare",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('colfServices.iron'),
            disabled: true,
            searchDisabled: true,
        },
        'ATT-00000000-0000-0000-0002-000000000016': {
            id: 'ATT-00000000-0000-0000-0002-000000000016',
            label: "Altro",
            parent: 'ATT-00000000-0000-0000-0001-000000000001',
            icon: AssetsStore.Icon('badanteServices.shoppingCart'),
            searchDisabled: true,
        },
        //                                                        BABY SITTER
        'ATT-00000000-0000-0000-0002-000000000017': {
            id: 'ATT-00000000-0000-0000-0002-000000000017',
            label: "Supporto scolastico",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: AssetsStore.Icon('babySitterServices.study')
        },
        'ATT-00000000-0000-0000-0002-000000000019': {
            id: 'ATT-00000000-0000-0000-0002-000000000019',
            label: "Pulizie",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: AssetsStore.Icon('babySitterServices.houseCleaning')
        },
        'ATT-00000000-0000-0000-0002-000000000018': {
            id: 'ATT-00000000-0000-0000-0002-000000000018',
            label: "Cucina",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: AssetsStore.Icon('babySitterServices.pan')
        },
        'ATT-00000000-0000-0000-0002-000000000020': {
            id: 'ATT-00000000-0000-0000-0002-000000000020',
            label: "Commissioni varie",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: AssetsStore.Icon('babySitterServices.shoppingCart')
        },
        'ATT-00000000-0000-0000-0002-000000000036': {
            id: 'ATT-00000000-0000-0000-0002-000000000036',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Montaggio e smontaggio mobili', 
            icon: AssetsStore.Icon('tuttofareServices.montaggio') 
        },
        'ATT-00000000-0000-0000-0002-000000000037': { 
            id: 'ATT-00000000-0000-0000-0002-000000000037',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Spostamento mobili o oggetti pesanti ', 
            icon: AssetsStore.Icon('tuttofareServices.spostamento') 
        },
        'ATT-00000000-0000-0000-0002-000000000038': { 
            id: 'ATT-00000000-0000-0000-0002-000000000038',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Aiuto nei traslochi', 
            icon: AssetsStore.Icon('tuttofareServices.trasloco') 
        },
        'ATT-00000000-0000-0000-0002-000000000039': { 
            id: 'ATT-00000000-0000-0000-0002-000000000039',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Carico e scarico merci', 
            icon: AssetsStore.Icon('tuttofareServices.scaricoMerci') 
        },
        'ATT-00000000-0000-0000-0002-000000000040': { 
            id: 'ATT-00000000-0000-0000-0002-000000000040',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Piccoli lavori di giardinaggio', 
            description: 'potatura piante, pulizia fioriere, cambio terra', 
            icon: AssetsStore.Icon('tuttofareServices.giardinaggio') 
        },
        'ATT-00000000-0000-0000-0002-000000000041': { 
            id: 'ATT-00000000-0000-0000-0002-000000000041',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Piccoli lavori domestici', 
            icon: AssetsStore.Icon('tuttofareServices.lavoriDomestici'), 
            description: 'sostituzione lampadine, sistemazione avvolgibili e tapparelle, montaggio mensole, sistemazione tende, montaggio e smontaggio plafoniere' 
        },
        'ATT-00000000-0000-0000-0002-000000000042': { 
            id: 'ATT-00000000-0000-0000-0002-000000000042',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Sistemazione legna', 
            icon: AssetsStore.Icon('tuttofareServices.legna') 
        },
        'ATT-00000000-0000-0000-0002-000000000043': { 
            id: 'ATT-00000000-0000-0000-0002-000000000043',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Stuccatura', 
            icon: AssetsStore.Icon('tuttofareServices.stuccatura') 
        },
        'ATT-00000000-0000-0000-0002-000000000044': { 
            id: 'ATT-00000000-0000-0000-0002-000000000044',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Cassetta degli attrezzi', 
            icon: AssetsStore.Icon('tuttofareServices.montaggio') 
        },
        'ATT-00000000-0000-0000-0002-000000000045': { 
            id: 'ATT-00000000-0000-0000-0002-000000000045',
            parent: 'ATT-00000000-0000-0000-0001-000000000024',
            label: 'Attrezzi extra', 
            icon: AssetsStore.Icon('tuttofareServices.attrezziExtra') 
        },
        'ATT-00000000-0000-0000-0002-000000000046': {
            id: 'ATT-00000000-0000-0000-0002-000000000046',
            parent: 'ATT-00000000-0000-0000-0001-000000000025',
            label: 'Cassetta degli attrezzi', 
            icon: AssetsStore.Icon('tuttofareServices.montaggio') 
        },
        'ATT-00000000-0000-0000-0002-000000000047': {
            id: 'ATT-00000000-0000-0000-0002-000000000047',
            parent: 'ATT-00000000-0000-0000-0001-000000000025',
            label: 'Attrezzi extra', 
            icon: AssetsStore.Icon('tuttofareServices.attrezziExtra') 
        },
        'ATT-00000000-0000-0000-0002-000000000048': {
            id: 'ATT-00000000-0000-0000-0002-000000000048',
            parent: 'ATT-00000000-0000-0000-0001-000000000026',
            label: 'Cassetta degli attrezzi', 
            icon: AssetsStore.Icon('tuttofareServices.montaggio') 
        },
        'ATT-00000000-0000-0000-0002-000000000049': {
            id: 'ATT-00000000-0000-0000-0002-000000000049',
            parent: 'ATT-00000000-0000-0000-0001-000000000026',
            label: 'Attrezzi extra', 
            icon: AssetsStore.Icon('tuttofareServices.attrezziExtra') 
        },
        'ATT-00000000-0000-0000-0002-000000000021': {
            id: 'ATT-00000000-0000-0000-0002-000000000021',
            label: "Dai 0 ai 2 anni",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: false,
            searchDisabled :true,
            disabled: true
        },
        'ATT-00000000-0000-0000-0002-000000000022': {
            id: 'ATT-00000000-0000-0000-0002-000000000022',
            label: "Dai 3 ai 6 anni",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: false,
            searchDisabled :true,
            disabled: true
        },
        'ATT-00000000-0000-0000-0002-000000000023': {
            id: 'ATT-00000000-0000-0000-0002-000000000023',
            label: "Dai 7 ai 12 anni",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: false,
            searchDisabled :true,
            disabled: true
        },
        'ATT-00000000-0000-0000-0002-000000000024': {
            id: 'ATT-00000000-0000-0000-0002-000000000024',
            label: "Dai 12 anni in su",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            icon: false,
            searchDisabled :true,
            disabled: true
        },
        'ATT-00000000-0000-0000-0002-000000000025': {
            id: 'ATT-00000000-0000-0000-0002-000000000025',
            label: "Altro",
            parent: 'ATT-00000000-0000-0000-0001-000000000002',
            searchDisabled :true,
            icon: false
        },

        // Lingue
        'ATT-00000000-0000-0000-0003-000000000011': {
            label: "Inglese Scarso",
        },
        'ATT-00000000-0000-0000-0003-000000000012': {
            label: "Inglese Discreto",
        },
        'ATT-00000000-0000-0000-0003-000000000013': {
            label: "Inglese Medio",
        },
        'ATT-00000000-0000-0000-0003-000000000014': {
            label: "Inglese Buono",
        },
        'ATT-00000000-0000-0000-0003-000000000015': {
            label: "Inglese Ottimo",
        },
        'ATT-00000000-0000-0000-0003-000000000016': {
            label: "Inglese Madrelingua",
        },
        'ATT-00000000-0000-0000-0003-000000000001': {
            label: "Francese Scarso",
        },
        'ATT-00000000-0000-0000-0003-000000000002': {
            label: "Francese Discreto",
        },
        'ATT-00000000-0000-0000-0003-000000000003': {
            label: "Francese Medio",
        },
        'ATT-00000000-0000-0000-0003-000000000004': {
            label: "Francese Buono",
        },
        'ATT-00000000-0000-0000-0003-000000000005': {
            label: "Francese Ottimo",
        },
        'ATT-00000000-0000-0000-0003-000000000006': {
            label: "Francese Madrelingua",
        },
    }

    var additionalColf = [
        { title: "Pulizia Frigorifero", icon: AssetsStore.Icon('colfServices.fridge') },
        { title: "Pulizia Forno", icon: AssetsStore.Icon('colfServices.oven') },
        { title: "Pulizia Vetri interni", icon: AssetsStore.Icon('colfServices.windows') },
        { title: "Pulizia Armadi", icon: AssetsStore.Icon('colfServices.closet') },
        { title: "Pulizia Lampadari", icon: AssetsStore.Icon('colfServices.chandelier') },
        { title: "Lavaggio capi", icon: AssetsStore.Icon('colfServices.washing') },
        { title: "Stiratura", icon: AssetsStore.Icon('colfServices.iron') },
        { title: "Pulizia Terrazza", icon: AssetsStore.Icon('colfServices.terrace') },
        { title: "Pulizia Cantina", icon: AssetsStore.Icon('colfServices.stairs') },
        { title: "Pulizia Garage", icon: AssetsStore.Icon('colfServices.garage') },
        { id: 10, title: 'Riparazione rubinetti gocciolanti', icon: AssetsStore.Icon('idraulico.rubinettoGocciolante') },
        { id: 11, title: 'Riparazione scarichi domestici', icon: AssetsStore.Icon('idraulico.riparazioneScarico') },
        { id: 12, title: 'Disotturazione scarichi', icon: AssetsStore.Icon('idraulico.disotturazioneScarico') },
        { id: 13, title: 'Installazione/sostituzione rubinetterie', icon: AssetsStore.Icon('idraulico.installazioneRubinetto') },
        { id: 14, title: 'Installazione sanitari', icon: AssetsStore.Icon('idraulico.sanitari') },
        { id: 15, title: 'Sostituzione sanitari', icon: AssetsStore.Icon('idraulico.sanitari') },
        { id: 16, title: 'Installazione boiler elettrico (< 30 litri)', icon: AssetsStore.Icon('idraulico.boilerElettrico') },
        { id: 17, title: 'Sostituzione boiler elettrico (< 30 litri)', icon: AssetsStore.Icon('idraulico.boilerElettrico') },
        //{ id: 18, title: 'Installazione boiler a gas (< 30 litri)', icon: AssetsStore.Icon('idraulico.boilerGas'), time: 240, timeLabel: '4 ore' },
        //{ id: 19, title: 'Sostituzione boiler a gas (< 30 litri)', icon: AssetsStore.Icon('idraulico.boilerGas'), time: 360, timeLabel: '6 ore' },
        //{ id: 20, title: 'Installazione piatto doccia', icon: AssetsStore.Icon('idraulico.piattoDoccia'), time: 120, timeLabel: '2 ore' },
        //{ id: 21, title: 'Sostituzione piatto doccia', icon: AssetsStore.Icon('idraulico.piattoDoccia'), time: 360, timeLabel: '6 ore' },
        { id: 22, title: 'Installazione colonna per doccia', icon: AssetsStore.Icon('idraulico.colonnaDoccia') },
        //{ id: 23, title: 'Installazione pompa di sollevamento acqua', icon: AssetsStore.Icon('idraulico.pompaAcqua'), time: 180, timeLabel: '3 ore' },
        { id: 24, title: 'Installazione/sostituzione lampadari e plafoniere', icon: AssetsStore.Icon('elettricista.lampadario') },
        { id: 25, title: 'Cambio lampadine, led, neon', icon: AssetsStore.Icon('elettricista.lampadina') },
        { id: 26, title: 'Installazione prese elettriche/interruttori (in assenza di scatola muro)', icon: AssetsStore.Icon('elettricista.presaElettrica') },
        { id: 27, title: 'Installazione/sostituzione prese elettriche/interruttori (con scatola muro già presente)', icon: AssetsStore.Icon('elettricista.presaElettrica') },
        { id: 28, title: 'Installazione/sintonizzazione televisore a muro', icon: AssetsStore.Icon('elettricista.televisore') },
        { id: 29, title: 'Allacciamento impianto satellitare (con parabola già installata)', icon: AssetsStore.Icon('elettricista.allacciamentoImpianto') },
        //{ id: 30, label: 'Allacciamento impianto satellitare (con parabola da installare)', icon: AssetsStore.Icon('elettricista.allacciamentoImpianto') },

    ];

    var carnet = [{
        costo: 270,
        id: "TC-0000-0000-0001-0001",
        mesiValidita: 2,
        stato: "Attivo",
        tipo: "Small",
        tipoServizio: {
            costoUnitario: 13.5,
            descrizione: "Badante",
            id: "TS-0000-0000-0001-0001",
            margine: 18,
            modalitaAcquisto: "CarnetSmall",
            prestazione: "Badante",
            tipo: "Orario"
        },
        totaleOre: 20
    },{
        costo: 270,
        id: "TC-0000-0000-0001-0002",
        mesiValidita: 2,
        stato: "Attivo",
        tipo: "Small",
        tipoServizio: {
            costoUnitario: 13.5,
            descrizione: "BabySitter",
            id: "TS-0000-0000-0001-0002",
            margine: 18,
            modalitaAcquisto: "CarnetSmall",
            prestazione: "BabySitter",
            tipo: "Orario"
        },
        totaleOre: 20
    },{
        costo: 230,
        id: "TC-0000-0000-0001-0003",
        mesiValidita: 2,
        stato: "Attivo",
        tipo: "Small",
        tipoServizio: {
            costoUnitario: 11.5,
            descrizione: "Colf",
            id: "TS-0000-0000-0001-0003",
            margine: 18,
            modalitaAcquisto: "CarnetSmall",
            prestazione: "Colf",
            tipo: "Orario"
        },
        totaleOre: 20
    },{
        costo: 625,
        id: "TC-0000-0000-0002-0001",
        mesiValidita: 4,
        stato: "Attivo",
        tipo: "Medium",
        tipoServizio: {
            costoUnitario: 12.5,
            descrizione: "Badante",
            id: "TS-0000-0000-0002-0001",
            margine: 18,
            modalitaAcquisto: "CarnetMedium",
            prestazione: "Badante",
            tipo: "Orario"
        },
        totaleOre: 50
    },{
        costo: 200,
        id: "TC-0000-0000-0002-0002",
        mesiValidita: 4,
        stato: "Attivo",
        tipo: "Medium",
        tipoServizio: {
            costoUnitario: 12.5,
            descrizione: "BabySitter",
            id: "TS-0000-0000-0002-0002",
            margine: 18,
            modalitaAcquisto: "CarnetMedium",
            prestazione: "BabySitter",
            tipo: "Orario"
        },
        totaleOre: 50
    },{
        costo: 625,
        id: "TC-0000-0000-0002-0003",
        mesiValidita: 4,
        stato: "Attivo",
        tipo: "Medium",
        tipoServizio: {
            costoUnitario: 11.5,
            descrizione: "Colf",
            id: "TS-0000-0000-0002-0003",
            margine: 18,
            modalitaAcquisto: "CarnetMedium",
            prestazione: "Colf",
            tipo: "Orario"
        },
        totaleOre: 50
    },{
        costo: 1725,
        id: "TC-0000-0000-0003-0001",
        mesiValidita: 9,
        stato: "Attivo",
        tipo: "Large",
        tipoServizio: {
            costoUnitario: 11.5,
            descrizione: "Badante",
            id: "TS-0000-0000-0003-0001",
            margine: 18,
            modalitaAcquisto: "CarnetLarge",
            prestazione: "Badante",
            tipo: "Orario"
        },
        totaleOre: 150
    },{
        costo: 1575,
        id: "TC-0000-0000-0003-0002",
        mesiValidita: 9,
        stato: "Attivo",
        tipo: "Large",
        tipoServizio: {
            costoUnitario: 11.5,
            descrizione: "BabySitter",
            id: "TS-0000-0000-0003-0002",
            margine: 18,
            modalitaAcquisto: "CarnetLarge",
            prestazione: "BabySitter",
            tipo: "Orario"
        },
        totaleOre: 150
    },{
        costo: 1725,
        id: "TC-0000-0000-0003-0003",
        mesiValidita: 9,
        stato: "Attivo",
        tipo: "Large",
        tipoServizio: {
            costoUnitario: 10.5,
            descrizione: "Colf",
            id: "TS-0000-0000-0003-0003",
            margine: 18,
            modalitaAcquisto: "CarnetLarge",
            prestazione: "Colf",
            tipo: "Orario"
        },
        totaleOre: 150
    },{
        costo: 1360,
        id: "TC-0000-0000-0004-0001",
        mesiValidita: 3,
        stato: "Attivo",
        tipo: "XXL",
        tipoServizio: {
            costoUnitario: 8.5,
            descrizione: "Badante",
            id: "TS-0000-0000-0004-0001",
            margine: 18,
            modalitaAcquisto: "CarnetXXL",
            prestazione: "Badante",
            tipo: "Orario"
        },
        totaleOre: 160
    },{
        costo: 1360,
        id: "TC-0000-0000-0004-0002",
        mesiValidita: 3,
        stato: "Attivo",
        tipo: "XXL",
        tipoServizio: {
            costoUnitario: 8.5,
            descrizione: "BabySitter",
            id: "TS-0000-0000-0004-0002",
            margine: 18,
            modalitaAcquisto: "CarnetXXL",
            prestazione: "BabySitter",
            tipo: "Orario"
        },
        totaleOre: 160
    }];

    self.isSubService = function(serviceId){
        const suffix = serviceId.substr(serviceId.length - 4);
        return _.includes(personalTrainerServices, suffix) || _.includes(fisioterapistaServices, suffix);
        
    }

    self.CompetenzaByServizio = function(servizioId){
        console.log(services[servizioId]);
        /*var servizio = services[servizioId].number;
        var competenza = '';
        for(var key in competenze){
            if ( hasOwnProperty.call( competenze,  key ) ) {
                if(competenze[key].number == servizio) competenza = key;
            }
        }*/
        return services[servizioId].competence;
    }

    self.ServizioByAttributo = function(attributoId){
        console.log(attributoId);
        return competenze[attributoId];
    }

    self.Carnet = function(idTipoCarnet){
        var found = _.find(carnet, function(c){
            return c.id == idTipoCarnet;
        });
        if(found) return found;
        else return {};
    }

    self.CarnetByService = function(idService){
        var found = _.find(carnet, function(c){
            return c.tipoServizio.id == idService;
        });
        if(found) return found;
        else return {};
    }

    self.byCompetenza = function (competenza) {
        if (!_.isString(competenza)) return {};
        return competenze[competenza].relatedService;
    }

    self.Number = function(descrizione){
        var service = _.find(services, function(s){
            return s.descrizione == descrizione;
        });
        if(service)
        return service.number;
        else {
            return 0;
        }
    }

    self.PrestazioneById = function(id){
        return services[id].descrizione;
    }

    self.CarnetRoot = function(prestazione){
        var found = _.find(services, function(s){
            return s.descrizione == prestazione;
        });

        if(found) return found.id;
        else return '';
    }

    self.NumberById = function(id){
        return services[id].number;
    }

    self.Icon = function(serviceId){
        return services[serviceId].icon;
    }

    self.Label = function(serviceId){
        return typeof services[serviceId] !== 'undefined' ? services[serviceId].label : '';
    }

    self.LabelFromNumber = function(num){
        var found = _.find(services, function(s){
            return s.number == num;
        });
        if(found) return found.label;
        else return '';
    }

    self.Details = function(serviceId){
        var details = [];
        for(var key in serviceDetails){
            if ( hasOwnProperty.call( serviceDetails,  key ) ) {
                if(serviceDetails[key].parent == serviceId) details.push(serviceDetails[key]);
            }
        }
        return details;
    }

    self.ActiveDetails = function(serviceId){
        var details = [];
        for(var key in serviceDetails){
            if ( hasOwnProperty.call( serviceDetails,  key ) ) {
                if(serviceDetails[key].parent == serviceId && !serviceDetails[key].disabled) details.push(serviceDetails[key]);
            }
        }
        return details;
    }

    self.Competenze = {
        Label: function(competenzaId){
            return competenze[competenzaId].label;
        }
    }

    self.sottoCompetenzeAttive = function () {
        let sottoCompetenzeAttive = {};
        for (const key in serviceDetails) {
            if (angular.isUndefined(sottoCompetenzeAttive[serviceDetails[key].parent])){
                sottoCompetenzeAttive[serviceDetails[key].parent] = [];
            }
            if (angular.isUndefined(serviceDetails[key].searchDisabled) || (angular.isDefined(serviceDetails[key].searchDisabled) && serviceDetails[key].searchDisabled === false)) {
                sottoCompetenzeAttive[serviceDetails[key].parent] = sottoCompetenzeAttive[serviceDetails[key].parent].concat([serviceDetails[key]]);
            }
        }
        return sottoCompetenzeAttive;
    }

    self.detail = {
        colf: {
            Icon: function(service){
                service = _.find(additionalColf, function(s){
                    return s.title == service;
                });
                if(service) return service.icon;
                else return false;
            }
        },
        Icon: function(serviceId){
            if (serviceDetails[serviceId]) {
                return serviceDetails[serviceId].icon;
            }
            else return null;
        },
        Label: function(serviceId){
            if (serviceDetails[serviceId]) {
                return serviceDetails[serviceId].label;
            }
            else return '';
        },
        GetParent: function(serviceId){
            if (serviceDetails[serviceId]) {
                return serviceDetails[serviceId].parent;
            }
            else return null;
        }
    }

    self.allCompetences = function() {
        return competenze;
    }

    self.allServices = function() {
        return services;
    }

}
