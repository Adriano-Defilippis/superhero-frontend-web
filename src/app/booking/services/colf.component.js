'use strict';

export const BookingServiceColf = {
    bindings: {
        serviceId: '=',
        squareMeters: '=',
        additionalServices: '=',
        selectedAdditionalServices: '=',
        serviceNotes: '=',
        onChangeSquareMeters: '&',
        onClickAdditionalService: '&',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/colf.component.html',
    controller: function() { },
    controllerAs: 'Colf'
}
