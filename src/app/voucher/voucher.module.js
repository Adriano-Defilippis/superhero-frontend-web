'use strict';

import { BOOKING } from './voucher.config';

import VoucherService from './voucher-service';

import FirstCarnetDirective from './first-carnet-directive';
import HeaderPopupDirective from './header-popup-directive';
import VoucherBannerLandingDirective from './landing-banner-directive';

import VoucherAcceptedController from './voucher-accepted.controller';
import VoucherDeniedController from './voucher-denied.controller';

export default angular.module('ilmiosupereroe.voucher', [ 'ilmiosupereroe.services' ])
    .constant('BOOKING', BOOKING)

    .service('Voucher', VoucherService)

    .directive('firstCarnet', FirstCarnetDirective)
    .directive('headerPopup', HeaderPopupDirective)
    .directive('voucherBannerLanding', VoucherBannerLandingDirective)

    .controller('VoucherAcceptedCtrl', VoucherAcceptedController)
    .controller('VoucherDeniedCtrl', VoucherDeniedController);
