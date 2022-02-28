'use strict';

export const BookingServiceBabysitter = {
    bindings: {
        serviceId: '=',
        additionalServices: '=',
        selectedAdditionalServices: '=',
        serviceNotes: '=',
        childrenInfo: '=',
        onChildEdit: '&',
        onChildRemoved: '&',
        onChildAdded: '&',
        onClickAdditionalService: '&',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/babysitter.component.html',
    controller: function(BookingModel) {
        "ngInject";

        var ctrl = this;
        ctrl.ageOptions = BookingModel.babySitterAgeOptions;

    },
    controllerAs: 'BabySitter'
}
