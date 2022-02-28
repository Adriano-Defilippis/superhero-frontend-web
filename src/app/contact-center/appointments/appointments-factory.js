/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function AppointmentsUtilityFactory (

        $log,
        ngDialog,
        RestService

    ){
        "ngInject";

        // check order state
        function getSmsFromMoment (fromMoment)
        {
            var timeString = fromMoment.format('DDMMYYYYHHmmss');
            return RestService.CC_getSmsError(timeString);
        }

        function getAppointmentRequests (appointment)
        {
            return RestService.CC__getAppointmentRequests(appointment);
        }

        function showRequestDetail (reqId, startingFrom)
        {
            var detail;
            RestService.CC__getRequestDetail(reqId).then(function(data){
                detail = data.data.plain();
                startingFrom.utc();
                return getSmsFromMoment(startingFrom);
            }).then(function(sms){
                var smsError = sms.data.plain();
                ngDialog.open({
                    template: 'app/contact-center/appointments/request-details.modal.html',
                    controller: 'CcAppointmentRequestDetailCtrl as ctrl',
                    className: 'ngdialog-theme-default ngdialog-login',
                    data: {
                        smsError: smsError,
                        details: detail
                    }
                });
            });
        }

        function formatAppointmentRequests (reqs)
        {
            var now = new Date().getTime();
            var formattedReqs = [];
            reqs.forEach(function(req){
                var formatted = {
                    id: req.id,
                    superHero: {
                        id: req.superHeroId,
                        nome: req.superHeroNome + ' ' + req.superHeroCognome
                    },
                    orarioRichiesta: req.dataRichiestaAppuntamentoInizio,
                    richiestaInviata: req.dataRichiestaAppuntamentoInizio < now,
                    richiestaRifiutata: req.stato === 'Rifiutata',
                    contenutoMessaggio: '',
                    labels: {
                        orarioRichiesta: moment(req.dataRichiestaAppuntamentoInizio).format('DD/MM/YYYY[<br>]HH:mm') + moment(req.dataRichiestaAppuntamentoFine).format(' [->] HH:mm'),
                    }
                };
                formattedReqs.push(formatted);
            });
            return formattedReqs;
        }

        function formatSms (sms) {
            sms.labels = {
                date: moment(sms.data).format('DD/MM HH:mm')
            }
        }

        return {
            getAppointmentRequests: getAppointmentRequests,
            getSmsFromMoment: getSmsFromMoment,
            formatAppointmentRequests: formatAppointmentRequests,
            showRequestDetail: showRequestDetail,
            formatSms: formatSms
        }

    }
