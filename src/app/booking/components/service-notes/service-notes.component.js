'use strict';

export const ServiceNotes = {
    bindings: {
        notes: '=',
        placeholder: '@',
        onChange: '&'
    },
    controller: function() {},
    controllerAs: 'ServiceNotes',
    template: [
        '<div input-field class="service-note-input">',
            '<textarea ',
                'placeholder="{{ServiceNotes.placeholder}}"  ',
                'id="textarea" ',
                'class="materialize-textarea" ',
                'ng-model="ServiceNotes.notes" ',
                'ng-change="ServiceNotes.onChange({notes:ServiceNotes.notes})"> ',
            '</textarea>',
            '<label>Note (max 250 caratteri). Attenzione: le specifiche indicate in nota verranno riportate in fattura, ove prevista </label>',
        '</div>',
    ].join('')
}
