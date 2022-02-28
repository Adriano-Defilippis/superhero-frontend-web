'use strict';

export const AssistedInfo =  {
    bindings: {
        nome: '=',
        cognome: '=',
        sesso: '=',
        eta: '=',
        onAssistedChanged: '&'
    },
    controller: function(BookingModel) {
        "ngInject";

        var ctrl = this;
        console.log(BookingModel);
        ctrl.ageOptions = BookingModel.badanteAgeOptions;
        ctrl.assistedChanged = function () {
            ctrl.onAssistedChanged({ info: { nome: ctrl.nome, cognome: ctrl.cognome, sesso: ctrl.sesso, eta: ctrl.eta } });
        }
    },
    controllerAs: 'AssistedInfo',
    templateUrl: 'app/booking/components/assisted-info/assisted-info.component.html'
}
