'use strict';

export const CarnetBlockPrices = {
    bindings: {
        columns: '=',
        carnet: '=',
        showDiscount: '=',
        heroInfo: '=',
        hidePaymentData: '=',
        isGiftCard: '=',
        onBuyCarnet: '&'
    },
    controller: function($rootScope, $log, User) {
        "ngInject";
        var ctrl = this;

        ctrl.userIsLogged = $rootScope.logged;
        ctrl.userHasCarnet = User.carnet.length >= 1;
        var isGiftCard = ctrl.isGiftCard === true || ctrl.isGiftCard === 'true';

        ctrl.isPrestazione = ctrl.carnet.type.indexOf("sed") > -1;

        ctrl.buyCarnet = function () {
            ctrl.onBuyCarnet({ carnet: ctrl.carnet });
        }

    },
    controllerAs: 'CarnetBlockPrices',
    templateUrl: 'app/carnet/carnet-block-prices/carnet-block-prices.component.html',
}
