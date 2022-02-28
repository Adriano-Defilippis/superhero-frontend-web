'use strict';

export const BookingSteps = {
    bindings: {
        steps: '=',
        completed: '=',
        current: '=',
        onChangeStep: '&',
    },
    controller: function() {
        let ctrl = this;
        ctrl.isActive = (step) => {
            return ctrl.current === step;
        }
        ctrl.isDone = (step) => {
            return ctrl.completed[step] === true;
        }
        ctrl.onClickStep = (step) => {
            if (ctrl.current !== 'booking.confirm') {
                if ((ctrl.isDone(step.name) && !ctrl.isActive(step.state)) || step.order === expected()) ctrl.onChangeStep({ step: step.name });
            }
        }

        ctrl.isExpected = (step) => {
            return step === expected();
        }

        function expected () {
            let _expected = 1;
            ctrl.steps.forEach(_step => {
                if (ctrl.isDone(_step.name)) _expected = _step.order + 1;
            });
            return _expected;
        }
    },
    controllerAs: 'BookingSteps',
    templateUrl: 'app/booking/components/booking-steps/booking-steps.component.html'
}
