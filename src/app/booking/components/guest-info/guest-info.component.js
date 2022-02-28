'use strict';

export const GuestInfo = {
    bindings: {
        index: '=',
        nome: '=',
        cognome: '=',
        eta: '=',
        ageOptions: '=',
        onGuestRemove: '&',
        onGuestEdit: '&'
    },
    controller: function() {
        "ngInject";
        var ctrl = this;
        ctrl.changedGuest = function (key) {
            ctrl.onGuestEdit({ index: ctrl.index, info: { nome: ctrl.nome, cognome: ctrl.cognome, eta: ctrl.eta } });
        }
    },
    controllerAs: 'GuestInfo',
    templateUrl: 'app/booking/components/guest-info/guest-info.component.html'
}
