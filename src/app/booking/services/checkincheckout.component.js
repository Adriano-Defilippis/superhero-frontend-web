'use strict';

export const BookingServiceCheckinCheckout = {
    bindings: {
        serviceId: '=',
        serviceNotes: '=',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/checkincheckout.component.html',
    controller: function() { },
    controllerAs: 'CheckinCheckout'
}
