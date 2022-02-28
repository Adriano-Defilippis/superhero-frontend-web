'use strict';

export default function PageImageHeaderDirective (

        $log,
        AssetsStore

    ) {
        "ngInject";

        return {
            restrict: 'EA',
            scope: {
                image: '@',
                title: '@',
                overlay: '='
            },
            controller: function () {},
            controllerAs: 'ctrl',
            templateUrl: 'app/guest/page-image-header/page-image-header.directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {
            // bind image & title
            ctrl.headerImage = scope.image;
            ctrl.title = scope.title;

            if(scope.overlay === true || scope.overlay === false) ctrl.overlay = scope.overlay;
            else ctrl.overlay = false;

        }


    }
