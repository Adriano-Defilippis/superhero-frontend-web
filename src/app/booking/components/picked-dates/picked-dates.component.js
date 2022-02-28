'use strict';

export const PickedDates =  {
    bindings: {
        dates: '=',
        suggestions: '=',
        heroesSuggestions: '=',
        confirmed: '=',
        requestedSuggestions: '=',
        requestedHeroesSuggestions: '=',
        pickingMode: '=',
        onAddNewDate: '&',
        onChangeDate: '&',
        onCreateRecurrance: '&',
        onDeletePickedDate: '&',
        onDeleteConfirmedDate: '&',
        onChooseSuggestion: '&',
        onAddNewSuperhero: '&',
        canBookMultipleSuperheroes: '&',
    },
    controller: function() {
        var ctrl = this;
    },
    controllerAs: 'PickedDates',
    templateUrl: 'app/booking/components/picked-dates/picked-dates.component.html'
}
