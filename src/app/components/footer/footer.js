 'use strict';

export default function FooterController (
    $scope, $rootScope, AssetsStore, $state, $timeout
) {
    "ngInject";

    var ctrl = this;

    ctrl.isApp = false;
    ctrl.isBnb = _.includes($state.current.url, 'BNB');


    if ($rootScope.isApp) {
    	ctrl.isApp = $rootScope.isApp;
	}

    ctrl.mv = {
      mainLogo : AssetsStore.Icon('badge.mainLogo'),
      condizioniFornitura: AssetsStore.PDF('cliente.condizioniFornitura'),
      condizioniUtilizzo: AssetsStore.PDF('cliente.condizioniUtilizzo'),
      informazioniPrivacy: AssetsStore.PDF('cliente.informazioniPrivacy')
    }

    function goToBNBPage() {
        $state.go('main.guest.bnb', {}, {reload: true});
    }

    ctrl.goToBNBPage = goToBNBPage;
}
