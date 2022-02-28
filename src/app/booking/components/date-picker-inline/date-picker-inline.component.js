'use strict';

export const DatePickerInline = {
    bindings: {
        date: '=',
        minDate: '=',
        maxDate: '=',
        onDateChange: '&'
    },
    controller: function() {
       
        var ctrl = this;

        ctrl.changedDate = function(){
            ctrl.onDateChange({ date: ctrl.date});
        }
    },
    controllerAs: 'DatePickerInline',
    templateUrl: 'app/booking/components/date-picker-inline/date-picker-inline.component.html'
}
