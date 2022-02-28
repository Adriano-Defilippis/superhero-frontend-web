'use strict';

export const ConfirmedDateCard =  {
    bindings: {
        date: '=',
        showHero: '=',
        onDeleteConfirmedDate: '&'
    },
    controller: function() {
        var ctrl = this;
    },
    controllerAs: 'ConfirmedDateCard',
    templateUrl: 'app/booking/components/confirmed-date-card/confirmed-date-card.component.html'
}
