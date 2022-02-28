'use strict';

import BillingAppointmentDirective from './billing-appointment-directive';
import BillingFromDirective from './billing-from-directive';
import BillingHeaderDirective from './billing-header';
import BillingLogoDirective from './billing-logo';
import BillingToDirective from './billing-to-directive';

import BillingController from './billing.controller';

export default angular.module('ilmiosupereroe.billing', ['ilmiosupereroe.services'])
    .directive('billingAppointment', BillingAppointmentDirective)
    .directive('billingFrom', BillingFromDirective)
    .directive('billingHeader', BillingHeaderDirective)
    .directive('billingLogo', BillingLogoDirective)
    .directive('billingTo', BillingToDirective)
    .directive('billingAppointment', BillingHeaderDirective)

    .controller('BillingCtrl', BillingController);
