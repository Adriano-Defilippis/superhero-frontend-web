'use strict';

export default function AppointmentRequestDetailController (

    $scope,
    $log,
    AssetsStore,
    AppointmentsUtility

) {
    "ngInject";

    var ctrl = this;
    ctrl.sms = [];

    // bind details
    ctrl.details = $scope.ngDialogData.details;
    ctrl.details.superHero.nomeCompleto = ctrl.details.superHero.nome + ' ' + ctrl.details.superHero.cognome;

    // photourl
    if (!ctrl.details.superHero.photoUrl || ctrl.details.superHero.photoUrl === null) {
        console.log('[REQ_DETAILS]', ctrl.details);
        ctrl.details.superHero.photoUrl = AssetsStore.Image('user.placeholder');
    }

    // process sms
    ctrl.sms.push.apply(ctrl.sms, ctrl.details.smses);
    ctrl.sms.forEach(function(sms){
        AppointmentsUtility.formatSms(sms);
    });

    $scope.ngDialogData.smsError.forEach(function(sms){
        if (sms.idSuperHero === ctrl.details.superHero.id) {
            AppointmentsUtility.formatSms(sms);
            ctrl.sms.push(sms);
        }
    });

}
