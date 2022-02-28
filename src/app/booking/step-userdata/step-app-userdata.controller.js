'use strict';

import TYPES from '../_config/types';

export default function BookingStepAppUserDataController (
    $stateParams, $ngRedux, BookingModel, SERVICES, ERRORS, PATTERNS, CommonActions, CarnetActions, Carnet
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

    if ($stateParams.data) {
        const data = JSON.parse($stateParams.data);
        $ngRedux.dispatch(CommonActions.setBookingType(TYPES.CARNET));
        $ngRedux.dispatch(CarnetActions.setHeroInfo(data.superhero));
        $ngRedux.dispatch(CarnetActions.selectedCarnet(data.idCarnet));
        $ngRedux.dispatch(CarnetActions.setCarnetInfo(Carnet.byId(data.idCarnet)));

    }

}