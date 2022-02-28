'use strict';

export const ServiceTips = {
    bindings: {
        serviceStep: '=',
    },
    controller: function(SERVICES, BookingModals, BookingModel) {
        "ngInject";
        var ctrl = this;
        ctrl.SERVICES = SERVICES
        ctrl.getProducts = function () {
            BookingModals.products(ctrl.serviceStep.selectedService);
        }
        ctrl.getSatisfaction = function () {
            BookingModals.satisfaction(ctrl.serviceStep.selectedService);
        }
    },
    controllerAs: 'ServiceTips',
    templateUrl: 'app/booking/components/service-tips/service-tips.component.html'
}
