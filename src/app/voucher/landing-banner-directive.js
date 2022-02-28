'use strict';

export default function VoucherBannerLandingDirective(
    $rootScope
) {
    "ngInject";

    return {
        restrict: 'E',
        scope: {
            code: '@'
        },
        templateUrl: 'app/voucher/landing-banner-directive.html',
        link: linkFunction
    }

    function linkFunction (scope, elem, attrs) {

        scope.userIsLogged = $rootScope.logged;
        scope.codiceSconto = scope.code;

        if (scope.codiceSconto == 'false') {
            scope.disableBanner = true;
        }

    }

}
