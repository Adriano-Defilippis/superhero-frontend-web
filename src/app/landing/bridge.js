'use strict';

export default function LandingBridgeController (
    $scope, $state, AssetsStore
){
    "ngInject";

    var self = this;

    var isLandingPage = _.startsWith($state.current.name, 'landing');
    window.scrollTo(0, 0);
    self.bridgeAssets = {
      headerImage : AssetsStore.Image('home.pageHeaders.diventaSupereroe'),
      timeIcon : AssetsStore.Icon('bridge.time'),
      moneyIcon : AssetsStore.Icon('bridge.money'),
      simplicityIcon : AssetsStore.Icon('bridge.simplicity'),
      servicesConfirmed: 3,
      targetSubmit: isLandingPage ? 'landing.signup' : 'guest.signup.hero',
    }

  }
