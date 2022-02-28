'use strict';

import StaticPageFactory from './static-page-helper.factory';

import LandingSectionDirective from './landing-section/landing-section.directive';
import MeetOurHeroesDirective from './meet-our-heroes/meet-our-heroes.directive';
import PageImageHeaderDirective from './page-image-header/page-image-header.directive';
import PressReviewDirective from './press-review/press-review.directive';
import HomeSliderDirective from './slider/home-slider.directive';

import LandingSectionController from './landing-section/landing-section.controller';
import HomeSliderController from './slider/home-slider.controller';
import AboutPageController from './about';
import GuestActivationController from './activation';
import GuestBaseController from './base';
import CarnetPageController from './carnet';
import ContactsPageController from './contacts';
import FaqPageController from './faq';
import GuestHowItWorksController from './howItWorks';
import PressReviewController from './press-review-page.controller';
import PricingPageController from './pricing-page/pricing-page.controller';
import GuestSignupController from './signup';
import StandardController from './standard';
import GuestWelcomeController from './welcome';
import VantaggiController from './vantaggi.controller';
import AssurancePageController from './assurance';

import { PricingService } from './pricing-page/pricing-service.component';

export default angular.module('ilmiosupereroe.guest', ['ilmiosupereroe.services'])
    .factory('StaticPage', StaticPageFactory)

    .directive('landingSection', LandingSectionDirective)
    .directive('meetOurHeroes', MeetOurHeroesDirective)
    .directive('pageImageHeader', PageImageHeaderDirective)
    .directive('pressReview', PressReviewDirective)
    .directive('homeSlider', HomeSliderDirective)

    .controller('HomeSliderController', HomeSliderController)
    .controller('LandingSectionController', LandingSectionController)
    .controller('AboutCtrl', AboutPageController)
    .controller('GuestActivationCtrl', GuestActivationController)
    .controller('GuestBaseCtrl', GuestBaseController)
    .controller('CarnetCtrl', CarnetPageController)
    .controller('ContactsCtrl', ContactsPageController)
    .controller('FaqCtrl', FaqPageController)
    .controller('GuestHowItWorksCtrl', GuestHowItWorksController)
    .controller('PressReviewController', PressReviewController)
    .controller('PricingPageCtrl', PricingPageController)
    .controller('GuestSignupCtrl', GuestSignupController)
    .controller('StandardCtrl', StandardController)
    .controller('GuestWelcomeCtrl', GuestWelcomeController)
    .controller('VantaggiCtrl', VantaggiController)
    .controller('AssurancePageCtrl', AssurancePageController)

    .component('pricingService', PricingService);
