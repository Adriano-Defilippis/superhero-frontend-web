'use strict';

import LandingServiceController from './landing-servizio';
import LandingSkyController from './landing-sky';
import LandingBridgeController from './bridge';

export default angular.module('ilmiosupereroe.landing', ['ilmiosupereroe.services'])

    .controller('LandingBridgeCtrl', LandingBridgeController)
    .controller('LandingServiceCtrl', LandingServiceController)
    .controller('LandingSkyCtrl', LandingSkyController);
