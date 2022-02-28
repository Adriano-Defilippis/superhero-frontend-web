'use strict';

export default function ServiceChoiceDirective (

    $log

) {
    "ngInject";

    return {
        restrict: 'AE',
        scope: {
            services: '=',
            selected: '=',
            disabled: '=',
            onServiceClick: '='
        },
        templateUrl: 'app/booking/step-service/service-choice.directive.html',
        controllerAs: 'ServiceChoice',
        bindToController: true,
        controller: function (){
            var ctrl = this;
            ctrl.isDisabled = function (serviceId) {
                return _.includes(ctrl.disabled, serviceId)
            }
        }
    }
}
