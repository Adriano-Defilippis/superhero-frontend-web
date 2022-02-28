'use strict';

import UserBaseController from './base';
import UserCalendarController from './calendar';
import UserCarnetEditHeroController from './carnet-edit-hero';
import UserCarnetController from './carnet';
import UserHeroProfileController from './hero-profile';
import UserHistoryController from './history';
import UserIndexController from './index';
import UserPaymentsController from './payments-controller';
import UserSidebarController from './sidebar';
import ReferralPageController from './referral-page/referral-page.controller';
import UserBillingsPageController from './billings-page/billings-page.controller';
import FeedbackModalController from './feedback-modal/feedback-modal.controller';

export default angular.module('ilmiosupereroe.user', [ 'ilmiosupereroe.services' ])
    .controller('UserBaseCtrl', UserBaseController)
    .controller('UserCalendarCtrl', UserCalendarController)
    .controller('UserCarnetEditHeroCtrl', UserCarnetEditHeroController)
    .controller('UserCarnetCtrl', UserCarnetController)
    .controller('UserHeroProfileCtrl', UserHeroProfileController)
    .controller('UserHistoryCtrl', UserHistoryController)
    .controller('UserIndexCtrl', UserIndexController)
    .controller('UserPaymentsCtrl', UserPaymentsController)
    .controller('UserSidebarCtrl', UserSidebarController)
    .controller('ReferralPageCtrl', ReferralPageController)
    .controller('UserBillingsPageController', UserBillingsPageController)
    .controller('FeedbackModalController', FeedbackModalController);
