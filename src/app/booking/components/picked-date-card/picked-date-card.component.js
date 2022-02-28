'use strict';

export const PickedDateCard = {
    bindings: {
        date: '=',
        onCreateRecurrance: '&',
        onDeletePickedDate: '&'
    },
    controller: function(BookingModel) {
        "ngInject";
        var ctrl = this;
        ctrl.isShowingRecurrence = false;
        ctrl.recurrency = BookingModel.recurrency;
    },
    controllerAs: 'PickedDateCard',
    templateUrl: 'app/booking/components/picked-date-card/picked-date-card.component.html'
}
