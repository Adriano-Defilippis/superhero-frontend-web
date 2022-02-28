'use strict';

export default function BookingStepDatesController (
    $scope, $ngRedux, BookingModel, BookingActions, SERVICES
){
    "ngInject";

    var ctrl = this;

    ctrl.SERVICES = SERVICES;

    ctrl.minimumSelectableDate = new Date();
    ctrl.maximumSelectableDate = moment().add(27,'day').toDate();
    
    console.log(ctrl);

    // initialize dates to pick
    $ngRedux.dispatch(BookingActions.setStartingPickedDates());

}
