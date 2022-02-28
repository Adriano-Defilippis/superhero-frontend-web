'use strict';

export default function ButtonTabsDirective (

        $log

    ) {
        "ngInject";

        return {
            restrict: 'EA',
            scope: {
                buttons: '='
            },
            templateUrl: 'app/blocks/button-tabs/button-tabs.directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs)
        {

        }

    }
