'use strict';

export const ChooseSuggestion = {
    bindings: {
        date: '=',
        suggestions: '=',
        onChangeDate: '&',
        onChooseSuggestion: '&',
        onDeleteSuggestion: '&'
    },
    controller: function() {
        var ctrl = this;
        ctrl.showMoreOptions = false;
        ctrl.limit = 6;
    },
    controllerAs: 'ChooseSuggestion',
    templateUrl: 'app/booking/components/choose-suggestion/choose-suggestion.component.html'
}
