'use strict';

export default function AvailabilityInputTriggerDirective (

    $log,
    $timeout,
    ngDialog,
    CalendarService

) {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            disabled: '='
        },
        templateUrl: 'app/hero/availability-input-modal/availability-input-trigger.directive.html',
        link: linkFunction
    }

    function linkFunction (scope, elem, attrs)
    {

        // Button icon
        scope.iconClass = 'mdi-av-playlist-add icon-center';

        // helpers
        scope.openAvailabilityInputModal = openAvailabilityInputModal;

        function openAvailabilityInputModal ()
        {
            if (!scope.disabled) {
                CalendarService.triggerMobileAvailabilityModal();
            }
        }

    }

}
