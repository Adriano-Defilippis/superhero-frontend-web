'use strict';

export const ServiceDetails = {
    bindings: {
        service: '=',
        additionalServices: '=',
        serviceInfo: '=',
    },
    controller: function(SERVICES, BookingModel) {
        "ngInject";
        var ctrl = this;
        ctrl.SERVICES = SERVICES;
        
        ctrl.getAdditionalServices = () => {
            let label = '';
            ctrl.additionalServices.forEach((_selected, index) => {
                BookingModel.additional[ctrl.service].forEach(_additional => {
                    let last = (ctrl.additionalServices.length - 1) === index;
                    if (_additional.id === _selected) label += _additional.label + (last ? '' : ', ');
                });
            });
            return label;
        }

        ctrl.getAdditionalService = (id) => {
            const additionalService = _.find(BookingModel.additional[ctrl.service], { id });
            return additionalService;
        }

        ctrl.getService = () => {
            const service = _.find(BookingModel.services, {id: ctrl.service});
            if (service) {
                return service.label;
            }
            return '';
        }

        ctrl.getSubService = () => {
            let subservice = _.find(BookingModel.subServices[ctrl.service], { id: ctrl.serviceInfo.subService });
            return subservice ? subservice.label : '';
        }

        ctrl.getSubServiceSuggestedTime = () => {
            let subservice = _.find(BookingModel.subServices[ctrl.service], { id: ctrl.serviceInfo.subService });
            return subservice.time;
        }

        ctrl.getGuestLabel = function (guest) {
            let eta = _.find(BookingModel.personalTrainerAgeOptions, { id: guest.eta });
            if (typeof eta !== 'undefined') return guest.nome + ' ' + guest.cognome + ', eta: ' + eta.value + '<br>';
            else return guest.nome + ' ' + guest.cognome;
        }
    },
    controllerAs: 'ServiceDetails',
    templateUrl: 'app/booking/components/service-details/service-details.component.html'
}
