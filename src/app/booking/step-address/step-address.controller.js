'use strict';

export default function BookingStepAddressController (
    $ngRedux, $scope, BookingModel, BookingActions, SERVICES, ERRORS
){
    "ngInject";

    var ctrl = this;

    //ctrl.services = BookingModel.services;
    //ctrl.additional = BookingModel.additional;
    ctrl.SERVICES = SERVICES;
    ctrl.ERRORS = ERRORS;
    ctrl.mustShowNotes = BookingModel.isAddressTypeExternal;
    const state = $ngRedux.getState();

    if (state.booking.steps.address.userAddresses && state.booking.steps.address.userAddresses.length === 1) {
      $ngRedux.dispatch(BookingActions.userSelectedAddress(state.booking.steps.address.userAddresses[0].id))
    }
}
