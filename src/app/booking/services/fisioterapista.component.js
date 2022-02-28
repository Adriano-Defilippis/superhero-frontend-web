'use strict';

export const BookingServiceFisioterapista = {
    bindings: {
        serviceId: '=',
        additionalServices: '=',
        selectedAdditionalServices: '=',
        serviceNotes: '=',
        onClickAdditionalService: '&',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/fisioterapista.component.html',
    controller: function() {
        "ngInject";
        let ctrl = this;
    },
    controllerAs: 'Fisioterapista'
}
