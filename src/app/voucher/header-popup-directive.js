'use strict';

export default function HeaderPopupDirective (

    $rootScope,
    $log,
    $timeout,
    $state

) {
    "ngInject";

    return {
        restrict: 'AE',
        scope: {
            code: '@'
        },
        templateUrl: 'app/voucher/header-popup-directive.html',
        link: linkFunction
    }

    function linkFunction (scope, elem, attrs) {

        $timeout(function(){
            var logoContainer = angular.element('#logo-container').find('img');
            var offsetLeft = logoContainer.position().left + logoContainer.width();

            $log.debug('[HEADER_POPUP_DIRECTIVE] Loaded with code:', scope.code, offsetLeft);
        }, 100);

        var expireOctober = '23 Ottobre';
        var expireNovember = '8 Novembre';

        scope.expireDate = expireOctober;

        if (scope.code == 'PF1') {
            scope.expireDate = expireNovember;
        }

        scope.userIsLogged = $rootScope.logged;
        scope.codiceSconto = scope.code;

        if (scope.codiceSconto == 'false') {
            scope.disableBanner = true;
        }

        if (!_.includes($state.current.name, 'main.guest.welcome') && !_.includes($state.current.name, 'main.guest.welcome')) {
            scope.disableBanner = true;
        }

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (!_.includes(toState.name, 'main.guest.welcome') && !_.includes(toState.name, 'main.guest.welcome')) {
                scope.disableBanner = true;
            } else if (scope.codiceSconto != 'false') {
                scope.disableBanner = false;
            }
        });

        scope.open = function ()
        {
            elem.find('.card').removeClass('close');
            elem.find('.card').addClass('open');
        }

        scope.close = function ()
        {
            elem.find('.card').removeClass('open');
            elem.find('.card').addClass('close');
        }

        scope.openCarnet = function ()
        {
            $state.go('main.guest.carnet');
        }

    }

}
