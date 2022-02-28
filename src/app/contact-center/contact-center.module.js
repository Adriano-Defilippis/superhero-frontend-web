'use strict';

import ContactCenterConfig from './contact-center.config';

import AppointmentsUtilityFactory from './appointments/appointments-factory';
import OrdersUtilitiesFactory from './orders/orders-factory';

import CCHeroNotesDirective from './hero-notes-directive';
import CCHeroSMSPlanDirective from './hero-sms-plan-directive';

import CcAppointmentsPageController from './appointments/appointments-page.controller';
import CcEditAppointmentPageController from './appointments/edit-appointment-page.controller';
import AppointmentRequestDetailController from './appointments/request-detail.controller';
import CcOrdersPageController from './orders/orders-page.controller';
import ContactCenterClientiController from './archivio-clienti';
import ContactCenterHeroesController from './archivio-heroes';
import ContactCenterBaseController from './base';
import ContactCenterClientiDettaglioController from './clienti-dettaglio';
import ContactCenterEditOrderController from './edit-order';
import ContactCenterFeedbackController from './feedback';
import ContactCenterHeroesDettaglioController from './hero-dettaglio';
import ContactCenterHeroesAgendaController from './heroes-agenda';
import ContactCenterReportReferralController from './report-referral';
import ContactCenterPaymentsController from './payments-controller';
import ContactCenterPaymentsDetailedController from './payments-detailed-controller';
import ContactCenterMarketPayDashboardController from './market-pay-dashboard';
import ContactCenterVoucherGeneratorController from './voucher-generator';
import ContactCenterSubBarController from './subnav';

export default angular.module('ilmiosupereroe.contact-center', ['ilmiosupereroe.services'])
    .config(ContactCenterConfig)

    .factory('AppointmentsUtility', AppointmentsUtilityFactory)
    .factory('OrdersUtilities', OrdersUtilitiesFactory)

    .directive('heroNotes', CCHeroNotesDirective)
    .directive('heroSmsPlan', CCHeroSMSPlanDirective)

    .controller('CcAppointmentsPageCtrl', CcAppointmentsPageController)
    .controller('CcEditAppointmentPageCtrl', CcEditAppointmentPageController)
    .controller('CcAppointmentRequestDetailCtrl', AppointmentRequestDetailController)
    .controller('CcOrdersPageCtrl', CcOrdersPageController)
    .controller('ContactCenterClientiCtrl', ContactCenterClientiController)
    .controller('ContactCenterHeroesCtrl', ContactCenterHeroesController)
    .controller('ContactCenterBaseCtrl', ContactCenterBaseController)
    .controller('ContactCenterClientiDettaglioCtrl', ContactCenterClientiDettaglioController)
    .controller('ContactCenterEditOrderCtrl', ContactCenterEditOrderController)
    .controller('ContactCenterFeedbackCtrl', ContactCenterFeedbackController)
    .controller('ContactCenterReportReferralController', ContactCenterReportReferralController)
    .controller('ContactCenterHeroesDettaglioCtrl', ContactCenterHeroesDettaglioController)
    .controller('ContactCenterHeroesAgendaCtrl', ContactCenterHeroesAgendaController)
    .controller('ContactCenterPaymentsCtrl', ContactCenterPaymentsController)
    .controller('ContactCenterPaymentsDetailedCtrl', ContactCenterPaymentsDetailedController)
    .controller('ContactCenterMarketPayDashboardCtrl', ContactCenterMarketPayDashboardController)
    .controller('ContactCenterSubBarCtrl', ContactCenterSubBarController)
    .controller('ContactCenterVoucherGeneratorCtrl', ContactCenterVoucherGeneratorController);
