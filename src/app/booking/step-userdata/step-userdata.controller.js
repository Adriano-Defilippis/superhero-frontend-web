'use strict';

import TYPES from '../_config/types';

export default function BookingStepUserDataController (
    $scope, $stateParams, $ngRedux, BookingModel, SERVICES, ERRORS, PATTERNS, BookingActions, CommonActions, CarnetActions
){
    "ngInject";

    var ctrl = this;

    ctrl.services = BookingModel.services;
    ctrl.additional = BookingModel.additional;
    ctrl.SERVICES = SERVICES;
    ctrl.ERRORS = ERRORS;
    ctrl.PATTERNS = PATTERNS;
    ctrl.TYPES = TYPES;

    ctrl.isAddressTypeExternal = BookingModel.isAddressTypeExternal;

    const state = $ngRedux.getState();

    if (state.booking.steps.userData.billingAddresses && state.booking.steps.userData.billingAddresses.length === 1) {
      $ngRedux.dispatch(BookingActions.userSelectedBillingAddress(state.booking.steps.userData.billingAddresses[0].id))
    }

}
