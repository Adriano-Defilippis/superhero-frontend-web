'use strict';

export default function BuyGiftCardController (
    $scope, AssetsStore, SERVICES, Services
){
    "ngInject";

    var self = this;

    self.headerImage = AssetsStore.Image('home.pageHeaders.regalaGiftCardClienti');

    self.condizioniUtilizzoGiftCard = AssetsStore.PDF('cliente.condizioniUtilizzoGiftCard');

    self.services = [{
        icon: AssetsStore.Icon('service.one'),
        title: 'Colf',
        subtitle: 'Carnet Gift Card<br>Colf',
        content: '23 ore<br>Validità 2 mesi'
    },
    {
        icon: AssetsStore.Icon('service.two'),
        title: 'Badante',
        subtitle: 'Carnet Gift Card<br>Badante',
        content: '20 ore<br>Validità 2 mesi'
    },
    {
        icon: AssetsStore.Icon('service.three'),
        title: 'Baby Sitter',
        subtitle: 'Carnet Gift Card<br>Baby Sitter',
        content: '20 ore<br>Validità 2 mesi'
    }];

    self.disabledServices = [];

    let pricingInfo = {
        [SERVICES.COLF]: {
            service: 'Colf',
            icon: AssetsStore.Icon('service.one'),
            base: 12.5,
            carnet: {
                small: { price: 230, hourly: 11.5, hours: 20, validity: 2 },
                medium: { price: 525, hourly: 10.5, hours: 50, validity: 4 },
                large: { price: 950, hourly: 9.5, hours: 100, validity: 7 },
                xxl: null
            },
          serviceType: 'standard',
            notes: ['Fascia oraria 21.00 – 07.00: + 20% sulla normale tariffa']
        },
        [SERVICES.BADANTE]: {
            service: 'Badante',
            icon: AssetsStore.Icon('service.two'),
            base: 14.5,
            carnet: {
                small: { price: 270, hourly: 13.5, hours: 20, validity: 2 },
                medium: { price: 625, hourly: 12.5, hours: 50, validity: 4 },
                large: { price: 1725, hourly: 11.5, hours: 150, validity: 9 },
                xxl: { price: 1360, hourly: 8.5, hours: 160, validity: 3 },
            },
          serviceType: 'standard',
            notes: []
        },
        [SERVICES.BABYSITTER]: {
            service: 'Baby Sitter',
            icon: AssetsStore.Icon('service.three'),
            base: 14.5,
            carnet: {
                small: { price: 270, hourly: 13.5, hours: 20, validity: 2 },
                medium: { price: 625, hourly: 12.5, hours: 50, validity: 4 },
                large: { price: 1725, hourly: 11.5, hours: 150, validity: 9 },
                xxl: { price: 1360, hourly: 8.5, hours: 160, validity: 3 },
            },
          serviceType: 'standard',
            notes: ['Fascia oraria 00.00 – 07.00: + 20% sulla normale tariffa', 'Più di 1 bambino: + 10% sulla normale tariffa per ogni bambino in più']
        },
        [SERVICES.ALLENAMENTOFUNZIONALE]: {
            service: Services.Label(SERVICES.ALLENAMENTOFUNZIONALE),
            icon: AssetsStore.Icon('service.four'),
            base: 50,
            carnet: {
                small: { price: 225, hourly: 45, hours: 5, validity: 2 },
                medium: { price: 425, hourly: 42.5, hours: 10, validity: 4 },
                large: { price: 1600, hourly: 40, hours: 40, validity: 9 },
                xxl: null,
            },
          serviceType: 'standard',
            notes: []
        },
        [SERVICES.DIMAGRIMENTO]: {
            service: Services.Label(SERVICES.DIMAGRIMENTO),
            icon: AssetsStore.Icon('service.four'),
            base: 50,
            carnet: {
                small: { price: 225, hourly: 45, hours: 5, validity: 2 },
                medium: { price: 425, hourly: 42.5, hours: 10, validity: 4 },
                large: { price: 1600, hourly: 40, hours: 40, validity: 9 },
                xxl: null,
            },
          serviceType: 'standard',
            notes: []
        },
        [SERVICES.GINNASTICAPOSTURALE]: {
            service: Services.Label(SERVICES.GINNASTICAPOSTURALE),
            icon: AssetsStore.Icon('service.four'),
            base: 50,
            carnet: {
                small: { price: 225, hourly: 45, hours: 5, validity: 2 },
                medium: { price: 425, hourly: 42.5, hours: 10, validity: 4 },
                large: { price: 1600, hourly: 40, hours: 40, validity: 9 },
                xxl: null,
            },
          serviceType: 'standard',
            notes: []
        },
        [SERVICES.YOGA]: {
            service: Services.Label(SERVICES.YOGA),
            icon: AssetsStore.Icon('service.four'),
            base: 80,
            carnet: {
                small: { price: 360, hourly: 72, hours: 7.5, validity: 2 },
                medium: { price: 680, hourly: 68, hours: 15, validity: 4 },
                large: { price: 2560, hourly: 64, hours: 60, validity: 9 },
                xxl: null,
            },
            serviceType: 'hourAndHalf',
            notes: []
        },
        [SERVICES.PILATES]: {
            service: Services.Label(SERVICES.PILATES),
            icon: AssetsStore.Icon('service.four'),
            base: 80,
            carnet: {
                small: { price: 360, hourly: 72, hours: 5, validity: 2 },
                medium: { price: 680, hourly: 68, hours: 10, validity: 4 },
                large: { price: 2560, hourly: 64, hours: 40, validity: 9 },
                xxl: null,
            },
          serviceType: 'standard',
            notes: []
        },
        [SERVICES.CORSA]: {
            service: Services.Label(SERVICES.CORSA),
            icon: AssetsStore.Icon('service.four'),
            base: 50,
            carnet: {
                small: { price: 225, hourly: 45, hours: 5, validity: 2 },
                medium: { price: 425, hourly: 42.5, hours: 10, validity: 4 },
                large: { price: 1600, hourly: 40, hours: 40, validity: 9 },
                xxl: null,
            },
          serviceType: 'standard',
            notes: []
        },
        [SERVICES.DIFESAPERSONALE]: {
            service: Services.Label(SERVICES.DIFESAPERSONALE),
            icon: AssetsStore.Icon('service.four'),
            base: 50,
            carnet: {
                small: { price: 225, hourly: 45, hours: 5, validity: 2 },
                medium: { price: 425, hourly: 42.5, hours: 10, validity: 4 },
                large: { price: 1600, hourly: 40, hours: 40, validity: 9 },
                xxl: null,
            },
            serviceType: 'standard',
            notes: []
        },
        [SERVICES.CICLISMO]: {
            service: Services.Label(SERVICES.CICLISMO),
            icon: AssetsStore.Icon('service.four'),
            base: 50,
            carnet: {
                small: { price: 225, hourly: 45, hours: 5, validity: 2 },
                medium: { price: 425, hourly: 42.5, hours: 10, validity: 4 },
                large: { price: 1600, hourly: 40, hours: 40, validity: 9 },
                xxl: null,
            },
            serviceType: 'standard',
            notes: []
        },
        [SERVICES.STIRATURA]: {
            service: Services.Label(SERVICES.STIRATURA),
            icon: AssetsStore.Icon('service.four'),
            base: 12.5,
            carnet: {
                small: { price: 230, hourly: 11.5, hours: 20, validity: 2 },
                medium: { price: 525, hourly: 10.5, hours: 50, validity: 4 },
                large: { price: 950, hourly: 9.5, hours: 100, validity: 7 },
                xxl: null
            },
            serviceType: 'standard',
            notes: ['Fascia oraria 21.00 – 07.00: + 20% sulla normale tariffa'],
        },       
        [SERVICES.VALUTAZIONE_FUNZIONALE]: {
            service: Services.Label(SERVICES.VALUTAZIONE_FUNZIONALE),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: null,
                medium: null,
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.FISIO_ORTOPEDICA]: {
            service: Services.Label(SERVICES.FISIO_ORTOPEDICA),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: { price: 300, hourly: 60, hours: 5, validity: 3 },
                medium: { price: 550, hourly: 55, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.FISIO_NEUROLOGICA]: {
            service: Services.Label(SERVICES.FISIO_NEUROLOGICA),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: { price: 300, hourly: 60, hours: 5, validity: 3 },
                medium: { price: 550, hourly: 55, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.FISIO_RESPIRATORIA]: {
            service: Services.Label(SERVICES.FISIO_RESPIRATORIA),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: { price: 300, hourly: 60, hours: 5, validity: 3 },
                medium: { price: 550, hourly: 55, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.FISIO_CARDIOLOGICA]: {
            service: Services.Label(SERVICES.FISIO_CARDIOLOGICA),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: { price: 300, hourly: 60, hours: 5, validity: 3 },
                medium: { price: 550, hourly: 55, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.GINNASTICA_POSTURALE]: {
            service: Services.Label(SERVICES.GINNASTICA_POSTURALE),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: { price: 300, hourly: 60, hours: 5, validity: 3 },
                medium: { price: 550, hourly: 55, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.LINFODRENAGGIO]: {
            service: Services.Label(SERVICES.LINFODRENAGGIO),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: { price: 300, hourly: 60, hours: 5, validity: 3 },
                medium: { price: 550, hourly: 55, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.MASSOTERAPIA_MEZZA]: {
            service: Services.Label(SERVICES.MASSOTERAPIA_MEZZA),
            icon: AssetsStore.Icon('service.four'),
            base: 45,
            carnet: {
                small: { price: 210, hourly: 42, hours: 5, validity: 3 },
                medium: { price: 380, hourly: 38, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.MASSOTERAPIA_INTERA]: {
            service: Services.Label(SERVICES.MASSOTERAPIA_INTERA),
            icon: AssetsStore.Icon('service.four'),
            base: 65,
            carnet: {
                small: { price: 300, hourly: 60, hours: 5, validity: 3 },
                medium: { price: 550, hourly: 55, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.OSTEOPATIA]: {
            service: Services.Label(SERVICES.OSTEOPATIA),
            icon: AssetsStore.Icon('service.four'),
            base: 70,
            carnet: {
                small: { price: 325, hourly: 65, hours: 5, validity: 3 },
                medium: { price: 600, hourly: 60, hours: 10, validity: 6 },
                large: null,
                xxl: null
            },
            serviceType: 'prestazione',
            notes: [],
        },
        [SERVICES.TUTTOFARE]: {
            service: 'Tuttofare',
            icon: AssetsStore.Icon('service.one'),
            base: 12.5,
            carnet: {
                small: null,
                medium: null,
                large: null,
                xxl: null
            },
            serviceType: 'standard',
            notes: [
                'Fascia oraria 21.00 – 07.00: + 20% sulla normale tariffa',
                'Costo di uscita: € 9,90',
                'Trasporto attrezzi di base (es. cacciavite, martello, trapano, ecc.): € 3,90',
                'Trasporto attrezzi extra (scala): € 10,90'
            ]
        },
        [SERVICES.SERVIZI_ELETTRICI]: {
            service: 'Tuttofare',
            icon: AssetsStore.Icon('service.one'),
            base: 29.9,
            carnet: {
                small: null,
                medium: null,
                large: null,
                xxl: null
            },
            serviceType: 'standard',
            notes: [
                'Fascia oraria 21.00 – 07.00: + 20% sulla normale tariffa',
                'Costo di uscita: € 29,90',
                'Trasporto attrezzi di base (es. cacciavite, martello, trapano, ecc.): € 3,90',
                'Trasporto attrezzi extra (scala): € 10,90'
            ]
        },
        [SERVICES.SERVIZI_IDRAULICI]: {
            service: 'Tuttofare',
            icon: AssetsStore.Icon('service.one'),
            base: 29.9,
            carnet: {
                small: null,
                medium: null,
                large: null,
                xxl: null
            },
            serviceType: 'standard',
            notes: [
                'Fascia oraria 21.00 – 07.00: + 20% sulla normale tariffa',
                'Costo di uscita: € 29,90',
                'Trasporto attrezzi di base (es. cacciavite, martello, trapano, ecc.): € 3,90',
                'Trasporto attrezzi extra (scala): € 10,90'
            ]
        },
    }

    self.selectedService = SERVICES.BADANTE;
    self.selectedServiceForInfo = SERVICES.BADANTE;
    self.info = pricingInfo;

    self.icons = {
        colf: AssetsStore.Icon('service.one'),
        badante: AssetsStore.Icon('service.two'),
        babySitter: AssetsStore.Icon('service.three')
    }

    self.selectService = function(serviceId) {
        self.selectedService = serviceId; 
        this.selectedServiceForInfo = serviceId;
    }

    this.selectSubService = (parent, serviceId) => {
        this.selectedService = parent;
        this.selectedSubService = serviceId;
        this.selectedServiceForInfo = serviceId;
    }
}
