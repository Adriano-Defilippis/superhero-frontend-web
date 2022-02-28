'use strict';

export const BookingServiceStiratura = {
    bindings: {
        serviceId: '=',
        serviceNotes: '=',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/stiratura.component.html',
    controller: function() { },
    controllerAs: 'Stiratura'
}
