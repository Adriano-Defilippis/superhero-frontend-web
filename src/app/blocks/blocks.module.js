'use strict';

import ServicePriceDetailDirective from './appointment-detail/service-price-detail.directive';
import ButtonTabsDirective from './button-tabs/button-tabs.directive';

export default angular.module('ilmiosupereroe.blocks', ['ilmiosupereroe.services'])
    .directive('servicePriceDetail', ServicePriceDetailDirective)
    .directive('buttonTabs', ButtonTabsDirective);
