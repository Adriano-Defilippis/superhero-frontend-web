'use strict';

export const BookingServicePersonalTrainer = {
    bindings: {
        serviceId: '=',
        subServices: '=',
        subServiceSelected: '=',
        serviceNotes: '=',
        guestsInfo: '=',
        hideGuestsInfo: '=',
        onGuestEdit: '&',
        onGuestRemoved: '&',
        onGuestAdded: '&',
        onClickSubService: '&',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/personaltrainer.component.html',
    controller: function(BookingModel) {
        "ngInject";
        let ctrl = this;
        ctrl.ageOptions = BookingModel.personalTrainerAgeOptions;
        ctrl.maxDiscount = _.last(BookingModel.personalTrainerDiscounts);
        ctrl.discounts = BookingModel.personalTrainerDiscounts;
    },
    controllerAs: 'PersonalTrainer'
}
