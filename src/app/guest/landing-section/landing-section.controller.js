'use strict';

export default function LandingSectionController (
    $ngRedux,
    AssetsStore,
    BookingActions,
    SERVICES
){
    "ngInject";

    var autocompletes = {};
    var ctrl = this;

    this.services = [];
    this.subServices = [];

    let colf = [
        { label: 'Colf', id: SERVICES.COLF, image: AssetsStore.Icon('service.oneSmall'), },
    ];

    let stiro = [
        { label: 'Stiratura', id: SERVICES.STIRATURA, image: AssetsStore.Icon('service.oneSmall'), },
    ];

    let badante = [
        { label: 'Badante', id: SERVICES.BADANTE, image: AssetsStore.Icon('service.twoSmall'), },
    ];

    let babySitter = [
        { label: 'Baby Sitter', id: SERVICES.BABYSITTER, image: AssetsStore.Icon('service.threeSmall'), },
    ];

    let personalTrainerSubServices = {
        'allenamento-funzionale': [{ id: SERVICES.ALLENAMENTOFUNZIONALE,   label: 'Allenamento Funzionale',            image: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'),    time: 60, price: 50 }],
        dimagrimento: [{ id: SERVICES.DIMAGRIMENTO,            label: 'Dimagrimento',                      image: AssetsStore.Icon('personalTrainer.dimagrimento'),             time: 60, price: 50 }],
        'ginnastica-posturale': [{ id: SERVICES.GINNASTICAPOSTURALE,     label: 'Ginnastica Posturale',              image: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),      time: 60, price: 50 }],
        ciclismo: [{ id: SERVICES.CICLISMO,                label: 'Ciclismo',                          image: AssetsStore.Icon('personalTrainer.ciclismo'),                 time: 60, price: 50 }],
        yoga: [{ id: SERVICES.YOGA,                    label: 'Yoga',                              image: AssetsStore.Icon('personalTrainer.yoga'),                     time: 90, price: 80 }],
        'difesa-personale': [{ id: SERVICES.DIFESAPERSONALE,         label: 'Difesa Personale',                  image: AssetsStore.Icon('personalTrainer.difesaPersonale'),          time: 60, price: 50 }],
        corsa: [{ id: SERVICES.CORSA,                   label: 'Corsa',                             image: AssetsStore.Icon('personalTrainer.corsa'),                    time: 60, price: 50 }],
        pilates: [{ id: SERVICES.PILATES,                 label: 'Pilates',                           image: AssetsStore.Icon('personalTrainer.pilates'),                  time: 60, price: 80 }],
    };

    let personalTrainer = [
        { id: SERVICES.ALLENAMENTOFUNZIONALE,   label: 'Allenamento Funzionale',            image: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'),    time: 60, price: 50 },
        { id: SERVICES.DIMAGRIMENTO,            label: 'Dimagrimento',                      image: AssetsStore.Icon('personalTrainer.dimagrimento'),             time: 60, price: 50 },
        { id: SERVICES.GINNASTICAPOSTURALE,     label: 'Ginnastica Posturale',              image: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),      time: 60, price: 50 },
        { id: SERVICES.CICLISMO,                label: 'Ciclismo',                          image: AssetsStore.Icon('personalTrainer.ciclismo'),                 time: 60, price: 50 },
        { id: SERVICES.YOGA,                    label: 'Yoga',                              image: AssetsStore.Icon('personalTrainer.yoga'),                     time: 90, price: 80 },
        { id: SERVICES.DIFESAPERSONALE,         label: 'Difesa Personale',                  image: AssetsStore.Icon('personalTrainer.difesaPersonale'),          time: 60, price: 50 },
        { id: SERVICES.CORSA,                   label: 'Corsa',                             image: AssetsStore.Icon('personalTrainer.corsa'),                    time: 60, price: 50 },
        { id: SERVICES.PILATES,                 label: 'Pilates',                           image: AssetsStore.Icon('personalTrainer.pilates'),                  time: 60, price: 80 },
    ];

    let tuttofare = [
        { label: 'Tuttofare', id: SERVICES.TUTTOFARE, image: AssetsStore.Icon('service.oneSmall'), },
    ];

    // bind service data
    if (ctrl.serviceToShow === 'colf') ctrl.services.push.apply(ctrl.services, colf);
    else if (ctrl.serviceToShow === 'badante') ctrl.services.push.apply(ctrl.services, badante);
    else if (ctrl.serviceToShow === 'baby-sitter') ctrl.services.push.apply(ctrl.services, babySitter);
    else if (ctrl.serviceToShow === 'personal-trainer') {
        if (ctrl.subServiceToShow){
            ctrl.services.push.apply(ctrl.services, [{id: SERVICES.PERSONALTRAINER}]);
            ctrl.subServices.push.apply(ctrl.subServices, personalTrainerSubServices[ctrl.subServiceToShow]);
        }
        else {
            ctrl.services.push.apply(ctrl.services, [{id: SERVICES.PERSONALTRAINER}]);
        }
    }
    else if (ctrl.serviceToShow === 'stiro') ctrl.services.push.apply(ctrl.services, stiro);
    else if (ctrl.serviceToShow === 'tuttofare') ctrl.services.push.apply(ctrl.services, tuttofare);
    else if (ctrl.serviceToShow === 'fisioterapista') {
        if (ctrl.subServiceToShow){
            ctrl.services.push.apply(ctrl.services, [{id: SERVICES.FISIOTERAPISTA}]);
            ctrl.subServices.push.apply(ctrl.subServices, personalTrainerSubServices[ctrl.subServiceToShow]);
        }
        else {
            ctrl.services.push.apply(ctrl.services, [{id: SERVICES.FISIOTERAPISTA}]);
        }
    }

    // rpeselect if only 1 service
    if (ctrl.services.length === 1) {
        ctrl.selectedService = ctrl.services[0].id;
        if (ctrl.subServices.length === 1) {
            ctrl.selectedSubService = ctrl.subServices[0].id;
        }
    }

    this.startBooking = function (index) {
        $ngRedux.dispatch(BookingActions.startBookingPreselectingService(ctrl.selectedService, ctrl.selectedSubService));
    }
}
