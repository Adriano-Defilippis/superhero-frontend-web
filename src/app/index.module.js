/*global $:false, angular:false, console:false, _:false, Cookies:false, window:false */

'use strict';

import { AppConfig } from './index.config';
import { AppRun } from './index.run';

import './misc/materialize.fix';
import './misc/fastclick.fix';

import './services/services.module';
import './components/components.module';
import './availability-zones/availability-zones.module';
import './billing/billing.module';
import './blocks/blocks.module';
import './contact-center/contact-center.module';
import './directives/directives.module';
import './form/form.module';
import './hero/hero.module';
import './landing/landing.module';
import './modals/modals.module';
import './booking/booking.module';
import './recruiter/recruiter.module';
import './user/user.module';
import './guest/guest.module';
import './carnet/carnet.module';
import './voucher/voucher.module';

import ngTagsInput from 'ng-tags-input';

import { MainController } from './main/main.controller';

angular.module('ilmiosupereroe', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngRedux', 'restangular',
    'ui.materialize', 'ui.router', 'ui.calendar', 'ui.bootstrap', 'ui.router.stateHelper', 'smart-table', 'angular-loading-bar',
    'ngImgCrop', 'uiGmapgoogle-maps', 'angularFileUpload', 'ngDialog', 'ng-fastclick', 'datePicker', 'vAccordion',
    'angular-locker', 'duScroll', 'smoothScroll', 'mediaPlayer', 'ngTagsInput', 'ngFileSaver',

    'ilmiosupereroe.services',
    'ilmiosupereroe.components',
    'ilmiosupereroe.availability-zones',
    'ilmiosupereroe.billing',
    'ilmiosupereroe.blocks',
    'ilmiosupereroe.contact-center',
    'ilmiosupereroe.directives',
    'ilmiosupereroe.form',
    'ilmiosupereroe.hero',
    'ilmiosupereroe.landing',
    'ilmiosupereroe.modals',
    'ilmiosupereroe.booking',
    'ilmiosupereroe.recruiter',
    'ilmiosupereroe.user',
    'ilmiosupereroe.guest',
    'ilmiosupereroe.carnet',
    'ilmiosupereroe.voucher'

]).config(AppConfig).config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]).run(AppRun).controller('MainCtrl', MainController);
