'use strict';

export default function UserPaymentsController (

    $scope,
    $state,
    $log,
    User

) {
    "ngInject";

    $log.log('[USER_PAYMENTS_PAGE] Initialized');
    var ctrl = this;

    // bind model to controller
    ctrl.payments = User.payments;

    // helpers
    ctrl.showInfo = function (appointmentId)
    {
        User.showAppointmentDetail(appointmentId);
    }

    ctrl.gotoCarnetAndHightlight = function (idCarnet)
    {
        $state.go('main.user.carnet', {evidenzia: idCarnet});
    }

}
