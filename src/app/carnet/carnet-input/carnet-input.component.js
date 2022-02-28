'use strict';

export const CarnetInput = {
    bindings: {
        selected: '=',
        selectedSubService: '=',
        placeholder: '@',
        alwaysOpen: '=',
        disabled: '=',
        onServiceSelected: '&',
        onSubServiceSelected: '&'
    },
    controller: function($scope, $document, $element, $timeout, SERVICES, Services, Carnet, $ngRedux, CarnetActions, AssetsStore) {
        "ngInject";
        var ctrl = this;

        const services = [
            { label: 'Colf', id: SERVICES.COLF_BNB, image: AssetsStore.Icon('service.oneSmall'), },
            { label: 'Colf', id: SERVICES.COLF, image: AssetsStore.Icon('service.oneSmall'), },
            { label: 'Badante', id: SERVICES.BADANTE, image: AssetsStore.Icon('service.twoSmall'), },
            { label: 'Baby Sitter', id: SERVICES.BABYSITTER, image: AssetsStore.Icon('service.threeSmall'), },
            { label: 'Personal Trainer', id: SERVICES.PERSONALTRAINER, image: AssetsStore.Icon('service.fourSmall'), },
            { label: 'Fisioterapista/Osteopata', id: SERVICES.FISIOTERAPISTA, image: AssetsStore.Icon('service.fiveSmall'), },
            { label: 'Stiratura', id: SERVICES.STIRATURA, image: AssetsStore.Icon('service.stiraturaSmall'), },
            { label: 'Check-in/check-out', id: SERVICES.CHECKIN_CHECKOUT, image: AssetsStore.Icon('service.ten'), },
        ].filter(service => !_.includes(ctrl.disabled, service.id));

        const subServices = {
            [SERVICES.PERSONALTRAINER] : [
                { label: 'Allenamento Funzionale', id: SERVICES.ALLENAMENTOFUNZIONALE, image: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), },
                { label: 'Dimagrimento', id: SERVICES.DIMAGRIMENTO, image: AssetsStore.Icon('personalTrainer.dimagrimento'), },
                { label: 'Ginnastica Posturale', id: SERVICES.GINNASTICAPOSTURALE, image: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'), },
                { label: 'Ciclismo', id: SERVICES.CICLISMO, image: AssetsStore.Icon('personalTrainer.ciclismo'), },
                { label: 'Yoga', id: SERVICES.YOGA, image: AssetsStore.Icon('personalTrainer.yoga'), },
                { label: 'Difesa Personale', id: SERVICES.DIFESAPERSONALE, image: AssetsStore.Icon('personalTrainer.difesaPersonale'), },
                { label: 'Corsa', id: SERVICES.CORSA, image: AssetsStore.Icon('personalTrainer.corsa'), },
                { label: 'Pilates', id: SERVICES.PILATES, image: AssetsStore.Icon('personalTrainer.pilates'), },
            ].filter(service => !_.includes(ctrl.disabled, service.id)),
            [SERVICES.FISIOTERAPISTA] : [
                { id: SERVICES.FISIO_ORTOPEDICA, label: 'Fisioterapia Ortopedica',                  image: AssetsStore.Icon('fisioterapista.fisioterapiaOrtopedica'), },
                { id: SERVICES.FISIO_NEUROLOGICA, label: 'Fisioterapia Neurologica',                image: AssetsStore.Icon('fisioterapista.fisioterapiaNeurologica'), },
                { id: SERVICES.FISIO_RESPIRATORIA, label: 'Fisioterapia Respiratoria',              image: AssetsStore.Icon('fisioterapista.fisioterapiaRespiratoria'), },
                { id: SERVICES.FISIO_CARDIOLOGICA, label: 'Fisioterapia Cardiologica',              image: AssetsStore.Icon('fisioterapista.fisioterapiaCardiologica'), },
                { id: SERVICES.GINNASTICA_POSTURALE, label: 'Ginnastica Posturale',                 image: AssetsStore.Icon('fisioterapista.ginnasticaPosturale'), },
                { id: SERVICES.LINFODRENAGGIO, label: 'Linfodrenaggio',                             image: AssetsStore.Icon('fisioterapista.linfodrenaggio'),},
                { id: SERVICES.MASSOTERAPIA_MEZZA, label: 'Massoterapia Gambe o Schiena (30 min)',  image: AssetsStore.Icon('fisioterapista.massoterapiaMezza'), },
                { id: SERVICES.MASSOTERAPIA_INTERA, label: 'Massoterapia Gambe e Schiena (60 min)', image: AssetsStore.Icon('fisioterapista.massoterapiaIntera'),},
                { id: SERVICES.OSTEOPATIA, label: 'Osteopatia',                                     image: AssetsStore.Icon('fisioterapista.osteopatia'),},
            ].filter(service => !_.includes(ctrl.disabled, service.id))
        }


        $document.on('click', clickHandler);
        $scope.$on('$destroy', function(){
            $document.off('click', clickHandler);
        });
        
        let enableAll = false;
        const wrapper = $element[0];

        const defaultPlaceholder = ctrl.placeholder ? ctrl.placeholder : 'Seleziona un servizio';

        if (!_.isArray(ctrl.enabledServices) || ctrl.enabledServices.length < 1) enableAll = true;

        ctrl.getServiceLabel = getServiceLabel;
        ctrl.placeholder = defaultPlaceholder;
        ctrl.onClickInput = onClickInput;
        ctrl.selectService = selectService;
        ctrl.getResults = getResults;
        ctrl.options = {
            showResults: false,
            parentSelected: null
        }

        function clickHandler (e) {
            e.stopPropagation();
            let contains = wrapper.contains(e.target);
            if (contains !== true) {
                $timeout(onBlur);
            }
        }

        function getResults () {
            if (ctrl.options.parentSelected !== null) {
                return subServices[ctrl.options.parentSelected];
            } else {
                return services;
            }
        }

        function selectService (serviceId) {
            if (ctrl.options.parentSelected !== null) {
                ctrl.onServiceSelected({ serviceId: ctrl.options.parentSelected, willProceedSubService: true });
                ctrl.onSubServiceSelected({ parentServiceId: ctrl.options.parentSelected, subServiceId: serviceId });
                $timeout(resetSelect);
            } else if (typeof subServices[serviceId] === 'undefined') {
                ctrl.onServiceSelected({ serviceId });
                $timeout(resetSelect);
            } else {
                $timeout(() => {
                    ctrl.options.parentSelected = serviceId;
                });
            }
        }

        function onBlur () {
            $timeout(resetSelect);
        }

        function resetSelect () {
            ctrl.options.showResults = false;
            ctrl.options.parentSelected = null;
        }

        function onClickInput () {
            ctrl.options.showResults = !ctrl.options.showResults;
        }

        function findParentService (serviceId) {
            let parent = null;
            _.forEach(subServices, _services => {
                let found = _.find(_services, { id: serviceId });
                if (typeof found !== 'undefined') parent = found.id;
            });
            return parent;
        }

        function getServiceLabel () {
            if (ctrl.selectedSubService && ctrl.selected) {
                let found = _.find(subServices[ctrl.selected], { id: ctrl.selectedSubService });
                if (typeof found !== 'undefined') {
                    return found.label;
                }
            } else {
                let found = _.find(services, { id: ctrl.selected });
                if (typeof found !== 'undefined') {
                    return found.label;
                }
            }
            return '';
        }

    },
    controllerAs: 'CarnetInput',
    templateUrl: 'app/carnet/carnet-input/carnet-input.component.html'
}
