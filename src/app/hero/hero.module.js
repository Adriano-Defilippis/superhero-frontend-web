'use strict';

import HeroUtilitiesFactory from './hero-utilities';

import AvailabilityInputTriggerDirective from './availability-input-modal/availability-input-trigger.directive';

import HeroBaseController from './base';
import CalendarAppoinmentsController from './calendar.appointments';
import HeroCarnetController from './carnet';
import ContractController from './contract';
import HeroHistoryController from './history';
import HeroIndexController from './index';
import HeroOverviewController from './overview';
import HeroProfileController from './profile';
import HeroSidebarController from './sidebar';
import HeroSubBarController from './subnav';
import HeroAvailabilityZonesController from './zones';
import HeroBillingsPageController from './billings-page/billings-page.controller';

export default angular.module('ilmiosupereroe.hero', ['ilmiosupereroe.services'])

    .factory('HeroUtilities', HeroUtilitiesFactory)

    .directive('availabilityInputTrigger', AvailabilityInputTriggerDirective)

    .controller('HeroBaseCtrl', HeroBaseController)
    .controller('CalendarAppoinmentsCtrl', CalendarAppoinmentsController)
    .controller('HeroCarnetCtrl', HeroCarnetController)
    .controller('ContractCtrl', ContractController)
    .controller('HeroHistoryCtrl', HeroHistoryController)
    .controller('HeroIndexCtrl', HeroIndexController)
    .controller('HeroOverviewCtrl', HeroOverviewController)
    .controller('HeroProfileCtrl', HeroProfileController)
    .controller('HeroSidebarCtrl', HeroSidebarController)
    .controller('HeroSubBarCtrl', HeroSubBarController)
    .controller('HeroAvailabilityZonesCtrl', HeroAvailabilityZonesController)
    .controller('HeroBillingsPageController', HeroBillingsPageController);
