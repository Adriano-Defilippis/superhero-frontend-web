'use strict';

export const PersonInfo = {
    bindings: {
        index: '=',
        nome: '=',
        cognome: '=',
        eta: '=',
        sesso: '=',
        ageOptions: '=',
        onPersonRemove: '&',
        onPersonEdit: '&'
    },
    controller: function() {
        "ngInject";
        var ctrl = this;
        ctrl.changedPerson = function (key) {
            ctrl.onPersonEdit({ index: ctrl.index, info: { nome: ctrl.nome, cognome: ctrl.cognome, sesso: ctrl.sesso, eta: ctrl.eta } });
        }
    },
    controllerAs: 'PersonInfo',
    templateUrl: 'app/booking/components/person-info/person-info.component.html'
}
