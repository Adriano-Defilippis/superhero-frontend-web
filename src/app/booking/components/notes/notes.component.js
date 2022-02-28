'use strict';

export const Notes =  {
    bindings: {
        notes: '=',
        required: '=',
        placeholder: '@',
        label: '@',
        title: '@',
        length: '@',
        showError: '=',
        errors: '=',
        onNotesChanged: '&',
    },
    controller: function() {
        var ctrl = this;
    },
    controllerAs: 'Notes',
    templateUrl: 'app/booking/components/notes/notes.component.html'
}
