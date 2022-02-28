'use strict';

import BookingModuleRun from './booking.run';

import BookingModuleConfig, {
    SERVICES,
    ATTRIBUTES,
    COLF_ADDITIONAL_SERVICES,
    BADANTE_ADDITIONAL_SERVICES,
    BABYSITTER_ADDITIONAL_SERVICES,
    TUTTOFARE_ADDITIONAL_SERVICES,
    TUTTOFARE_ADDITIONAL_TOOLS,
    SERVIZI_IDRAULICI_ADDITIONAL_SERVICES,
    SERVIZI_IDRAULICI_ADDITIONAL_TOOLS,
    SERVIZI_ELETTRICI_ADDITIONAL_SERVICES,
    SERVIZI_ELETTRICI_ADDITIONAL_TOOLS,
    ERRORS,
    PATTERNS,
    STEPS,
    CONFIRM
} from './booking.config';

import BookingModelFactory from './booking.factory';
import BookingActionsFactory from './_actions/booking.actions';
import HearosearchActionsFactory from './_actions/herosearch.actions';
import CarnetActionsFactory from './_actions/carnet.actions';
import CommonActionsFactory from './_actions/common.actions';
import BookingModalsFactory from './modals/booking.modals';

import ServiceChoiceDirective from './step-service/service-choice.directive';
import BookingSidebarDirective from './sidebar/booking-sidebar.directive';
import HerosearchSidebarDirective from './sidebar-herosearch/sidebar-herosearch.directive';
import CarnetSidebarDirective from './sidebar-carnet/sidebar-carnet.directive';
import FixedSidebarDirective from './sidebar/fixed-sidebar.directive';

import BookingBaseController from './base/base.controller';
import BookingStepUserDataController from './step-userdata/step-userdata.controller';
import BookingStepServiceController from './step-service/step-service.controller';
import BookingStepDatesController from './step-dates/step-dates.controller';
import BookingStepAddressController from './step-address/step-address.controller';
import BookingStepConfirmController from './step-confirm/step-confirm.controller';
import BookingStepHeroSearchController from './step-herosearch/step-herosearch.controller';
import BookingStepCarnetSelectionController from './step-carnetselection/step-carnetselection.controller';
import AppOrderCreationController from './step-userdata/app-order-creation.controller';
import AppStepUserDataController from './step-userdata/step-app-userdata.controller';
import HeroProfileController from './step-herosearch/hero-profile.controller';

import { BookingServiceColf } from './services/colf.component';
import { BookingServiceBadante } from './services/badante.component';
import { BookingServiceBabysitter } from './services/babysitter.component';
import { BookingServicePersonalTrainer } from './services/personaltrainer.component';
import { BookingServiceFisioterapista } from './services/fisioterapista.component';
import { BookingServiceTuttofare } from './services/tuttofare.component';
import { BookingServiceIdraulico } from './services/idraulico.component';
import { BookingServiceElettricista } from './services/elettricista.component';
import { BookingServiceStiratura } from './services/stiratura.component';
import { BookingServiceCheckinCheckout } from './services/checkincheckout.component';

import { AdditionalServices } from './components/additional-services/additional-services.component';
import { AdditionalTools } from './components/additional-tools/additional-tools.component';
import { AddressInput } from './components/address-input/address-input.component';
import { AssistedInfo } from './components/assisted-info/assisted-info.component';
import { PersonInfo } from './components/person-info/person-info.component';
import { GuestInfo } from './components/guest-info/guest-info.component';
import { ChooseSuggestion } from './components/choose-suggestion/choose-suggestion.component';
import { DatePickerInline } from './components/date-picker-inline/date-picker-inline.component';
import { PickedDateCard } from './components/picked-date-card/picked-date-card.component';
import { PickedDates } from './components/picked-dates/picked-dates.component';
import { ServiceNotes } from './components/service-notes/service-notes.component';
import { TimeRangePicker } from './components/time-range-picker/time-range-picker.component';
import { ConfirmedDateCard } from './components/confirmed-date-card/confirmed-date-card.component';
import { Loader } from './components/loader/loader.component';
import { ChooseHeroSuggestion } from './components/choose-hero-suggestion/choose-hero-suggestion.component';
import { SelectAddress } from './components/select-address/select-address.component';
import { Notes } from './components/notes/notes.component';
import { UserSignup } from './components/user-signup/user-signup.component';
import { BookingSteps } from './components/booking-steps/booking-steps.component';
import { ServiceTips } from './components/service-tips/service-tips.component';
import { ServiceDetails } from './components/service-details/service-details.component';
import { ChooseCarnet } from './components/choose-carnet/choose-carnet.component';
import { CarnetBlock } from './components/carnet-block/carnet-block.component';
import { BillingAddress } from './components/billing-address/billing-address.component';
import { SearchForm } from './components/search-form/search-form.component';
import { ServiceInputAutocomplete } from './components/service-input-autocomplete/service-input-autocomplete.component';
import PrivacyContract from './components/privacy-contract/privacy-contract.component';
import VoucherInput from './components/voucher-input/voucher-input.component';
import PricingOverview from './components/pricing-overview/pricing-overview.component';
import PricingTotal from './components/pricing-total/pricing-total.component';


export default angular.module('ilmiosupereroe.booking', [ 'ilmiosupereroe.services', 'ngRedux' ])
    .config(BookingModuleConfig)
    .run(BookingModuleRun)

    .constant('SERVICES', SERVICES)
    .constant('ATTRIBUTES', ATTRIBUTES)
    .constant('COLF_ADDITIONAL_SERVICES', COLF_ADDITIONAL_SERVICES)
    .constant('BADANTE_ADDITIONAL_SERVICES', BADANTE_ADDITIONAL_SERVICES)
    .constant('BABYSITTER_ADDITIONAL_SERVICES', BABYSITTER_ADDITIONAL_SERVICES)
    .constant('TUTTOFARE_ADDITIONAL_SERVICES', TUTTOFARE_ADDITIONAL_SERVICES)
    .constant('TUTTOFARE_ADDITIONAL_TOOLS', TUTTOFARE_ADDITIONAL_TOOLS)
    .constant('SERVIZI_IDRAULICI_ADDITIONAL_TOOLS', SERVIZI_IDRAULICI_ADDITIONAL_TOOLS)
    .constant('SERVIZI_IDRAULICI_ADDITIONAL_SERVICES', SERVIZI_IDRAULICI_ADDITIONAL_SERVICES)
    .constant('SERVIZI_ELETTRICI_ADDITIONAL_TOOLS', SERVIZI_ELETTRICI_ADDITIONAL_TOOLS)
    .constant('SERVIZI_ELETTRICI_ADDITIONAL_SERVICES', SERVIZI_ELETTRICI_ADDITIONAL_SERVICES)
    .constant('ERRORS', ERRORS)
    .constant('PATTERNS', PATTERNS)
    .constant('STEPS', STEPS)
    .constant('CONFIRM', CONFIRM)

    .factory('BookingModel', BookingModelFactory)
    .factory('CommonActions', CommonActionsFactory)
    .factory('BookingActions', BookingActionsFactory)
    .factory('HerosearchActions', HearosearchActionsFactory)
    .factory('CarnetActions', CarnetActionsFactory)
    .factory('BookingModals', BookingModalsFactory)

    .directive('serviceChoice', ServiceChoiceDirective)
    .directive('herosearchSidebar', HerosearchSidebarDirective)
    .directive('bookingSidebar', BookingSidebarDirective)
    .directive('carnetSidebar', CarnetSidebarDirective)
    .directive('fixedSidebar', FixedSidebarDirective)

    .controller('BookingBaseController', BookingBaseController)
    .controller('BookingStepUserDataController', BookingStepUserDataController)
    .controller('BookingStepServiceController', BookingStepServiceController)
    .controller('BookingStepDatesController', BookingStepDatesController)
    .controller('BookingStepAddressController', BookingStepAddressController)
    .controller('BookingStepConfirmController', BookingStepConfirmController)
    .controller('BookingStepHeroSearchController', BookingStepHeroSearchController)
    .controller('BookingStepCarnetSelectionController', BookingStepCarnetSelectionController)
    .controller('AppOrderCreationController', AppOrderCreationController)
    .controller('AppStepUserDataController', AppStepUserDataController)
    .controller('HeroProfileController', HeroProfileController)

    .component('additionalServices', AdditionalServices)
    .component('additionalTools', AdditionalTools)
    .component('bookingServiceColf', BookingServiceColf)
    .component('bookingServiceBabysitter', BookingServiceBabysitter)
    .component('bookingServiceBadante', BookingServiceBadante)
    .component('bookingServicePersonalTrainer', BookingServicePersonalTrainer)
    .component('bookingServiceFisioterapista', BookingServiceFisioterapista)
    .component('bookingServiceTuttofare', BookingServiceTuttofare)
    .component('bookingServiceElettricista', BookingServiceElettricista)
    .component('bookingServiceIdraulico', BookingServiceIdraulico)
    .component('bookingServiceStiratura', BookingServiceStiratura)
    .component('bookingServiceCheckinCheckout', BookingServiceCheckinCheckout)
    .component('addressInput', AddressInput)
    .component('assistedInfo', AssistedInfo)
    .component('personInfo', PersonInfo)
    .component('guestInfo', GuestInfo)
    .component('chooseSuggestion', ChooseSuggestion)
    .component('datePickerInline', DatePickerInline)
    .component('pickedDateCard', PickedDateCard)
    .component('pickedDates', PickedDates)
    .component('serviceNotes', ServiceNotes)
    .component('timeRangePicker', TimeRangePicker)
    .component('confirmedDateCard', ConfirmedDateCard)
    .component('chooseHeroSuggestion', ChooseHeroSuggestion)
    .component('loader', Loader)
    .component('selectAddress', SelectAddress)
    .component('notes', Notes)
    .component('userSignup', UserSignup)
    .component('bookingSteps', BookingSteps)
    .component('serviceTips', ServiceTips)
    .component('serviceDetails', ServiceDetails)
    .component('privacyContract', PrivacyContract)
    .component('voucherInput', VoucherInput)
    .component('pricingOverview', PricingOverview)
    .component('pricingTotal', PricingTotal)
    .component('chooseCarnet', ChooseCarnet)
    .component('carnetBlock', CarnetBlock)
    .component('billingAddress', BillingAddress)
    .component('searchForm', SearchForm)
    .component('serviceInputAutocomplete', ServiceInputAutocomplete);
