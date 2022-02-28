'use strict';

export default function FirstCarnetDirective (

    $rootScope,
    ngDialog,
    User

) {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            onlyInfo: '@'
        },
        transclude: true,
        templateUrl: 'app/voucher/first-carnet-directive.html',
        link: linkFunction
    }

    function linkFunction (scope, elem, attrs)
    {

        if (scope.onlyInfo) {
            scope.showModal = infoOnlyModal;
        } else {
            scope.showModal = buyCarnetModal;
        }

    }

    function buyCarnetModal ()
    {
        ngDialog.closeAll(); // close any open modal
        ngDialog.open({
            className: 'ngdialog-theme-default ngdialog-login',
            template: 'app/carnet/carnet-discount-info.html',
            controller: 'CarnetDiscountInfoCtrl',
            data: {
                callToAction: true
            }
        });
    }

    function infoOnlyModal ()
    {
        ngDialog.closeAll(); // close any open modal
        ngDialog.open({
            className: 'ngdialog-theme-default ngdialog-login',
            template: 'app/carnet/carnet-discount-info.html',
            controller: 'CarnetDiscountInfoCtrl',
            data: {
                //heroInfo: heroInfo
            }
        });
    }
}
