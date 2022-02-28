'use strict';

export const TimeRangePicker = {
    bindings: {
        start: '=',
        end: '=',
        onStartChange: '&',
        onEndChange: '&'
    },
    controller: function() {
        var ctrl = this;
        ctrl.changedTime = function(isStart){
            if (isStart) {
                ctrl.onStartChange({date:ctrl.start});
            } else {
                ctrl.onEndChange({date:ctrl.end});
            }
        }
    },
    controllerAs: 'TimeRangePicker',
    templateUrl: 'app/booking/components/time-range-picker/time-range-picker.component.html'
}
