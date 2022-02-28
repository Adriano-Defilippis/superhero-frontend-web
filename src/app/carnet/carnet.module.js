'use strict';

import CarnetService from './carnet-service';

import CarnetInfoLargeDirective from './carnet-info-large-directive';

import CarnetDiscountInfoController from './carnet-discount-info';
import BuyGiftCardCompanyController from './gift-card-buy-company.controller';
import BuyGiftCardController from './gift-card-buy.controller';
import RedeemGiftCardController from './gift-card-redeem.controller';

import { CarnetChoice } from './carnet-choice/carnet-choice.component';
import { CarnetInput } from './carnet-input/carnet-input.component';
import { CarnetBlockPrices } from './carnet-block-prices/carnet-block-prices.component';
import { GiftCardPricesService } from './gift-card-prices/gift-card-prices.component';

export default angular.module('ilmiosupereroe.carnet', ['ilmiosupereroe.services'])
    .service('Carnet', CarnetService)

    .directive('carnetInfoLarge', CarnetInfoLargeDirective)

    .controller('CarnetDiscountInfoCtrl', CarnetDiscountInfoController)
    .controller('BuyGiftCardCompanyCtrl', BuyGiftCardCompanyController)
    .controller('BuyGiftCardCtrl', BuyGiftCardController)
    .controller('RedeemGiftCardCtrl', RedeemGiftCardController)

    .component('carnetChoice', CarnetChoice)
    .component('carnetInput', CarnetInput)
    .component('carnetBlockPrices', CarnetBlockPrices)
    .component('giftCardPricesService', GiftCardPricesService);
