'use strict';

import MdIconProvider, { mdIconDirective } from './md-icon';

import AddressesService from './addresses';
import ApplicationFormService from './application-form';
import AssetsStoreService from './assets-store';
import AvailabilityZonesService from './availability-zones';
//import BookingService from './booking';
import CalendarService from './calendar';
//import CarnetBookingService from './carnet-booking';
import ContactCenterService from './contact-center';
import CookiePolicyService from './cookie-policy';
import FeedbacksService from './feedbacks';
import GeoUtilsService from './geo-utils';
import HeroInfoService from './hero-info';
import HeroProfileService from './hero-profile';
import HeroSearchService from './hero-search';
import LocalStorageAlertService from './local-storage-alert';
import LoginService from './login';
import NotifyService from './notify';
import RecruiterService from './recruiter';
import RestService from './rest';
import ServicesService from './services';
import UserCalendarService from './user-calendar';
import UserFormService from './user-form';
import UserInfoService from './user-info';
import UserService from './user';


export default angular.module('ilmiosupereroe.services', [ ])
    .provider('$mdIcon', MdIconProvider)
    .directive('mdIcon', mdIconDirective)
    .service('Addresses', AddressesService)
    .service('ApplicationForm', ApplicationFormService)
    .service('AssetsStore', AssetsStoreService)
    .service('AvailabilityZones', AvailabilityZonesService)
    //.service('Booking', BookingService)
    .service('CalendarService', CalendarService)
    //.service('CarnetBooking', CarnetBookingService)
    .service('ContactCenter', ContactCenterService)
    .service('CookiePolicy', CookiePolicyService)
    .service('Feedbacks', FeedbacksService)
    .service('GeoUtils', GeoUtilsService)
    .service('HeroInfoService', HeroInfoService)
    .service('HeroProfile', HeroProfileService)
    .service('HeroSearch', HeroSearchService)
    .service('LocalStorageAlert', LocalStorageAlertService)
    .service('LoginService', LoginService)
    .service('NotifyService', NotifyService)
    .service('RecruiterService', RecruiterService)
    .service('RestService', RestService)
    .service('Services', ServicesService)
    .service('UserCalendarService', UserCalendarService)
    .service('UserForm', UserFormService)
    .service('UserInfo', UserInfoService)
    .service('User', UserService);
