'use strict';

export const BookingServiceBadante = {
    bindings: {
        serviceId: '=',
        additionalServices: '=',
        selectedAdditionalServices: '=',
        serviceNotes: '=',
        assistedInfo: '=',
        onAssistedChanged: '&',
        onClickAdditionalService: '&',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/badante.component.html',
    controller: function() {
        var ctrl = this;

        ctrl.assitedChanged = function (info) {
            ctrl.onAssistedChanged({info: {asd:'asd'}});
        }
    },
    controllerAs: 'Badante'
}
