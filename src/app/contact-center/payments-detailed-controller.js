'use strict';

export default function ContactCenterPaymentsController (
        $scope,
        appointments,
        orders,
    ) {
        "ngInject";

        // self bind
        var ctrl = this;

        var today = new Date();
        var currentMonth = {
            y: today.getFullYear(),
            m: today.getMonth()
        }

        ctrl.appointments = _.filter(appointments.data.plain(),
            (a) => !_.contains(['CancellatoAmministrativamente', 'SuperHeroNotFound', 'Immesso'], a.stato) &&
            !_.contains(['AppuntamentiCarnet', 'ModificaAmministrativaAppuntamentoCarnet'], a.tipo));

        ctrl.carnetOrders = _.filter(orders.data.plain(),
            (a) => a.stato === 'Chiuso' && a.tipo !== 'AppuntamentiCarnet');

        ctrl.paymentsAmount = { total: 0, thisMonth: 0 };

        var firstDayOfMonth = moment([currentMonth.y, currentMonth.m]).toDate().valueOf();
        var lastDayOfMonth = moment(firstDayOfMonth).endOf('month').toDate().valueOf();

        cleanData(ctrl.appointments, ctrl.carnetOrders);

        ctrl.appointments = _.merge(ctrl.appointments, ctrl.carnetOrders);

        function cleanData (appointments, carnetOrders)
        {
            appointments.forEach(function (p) {
                p.typeLabel = getTypeLabel(p.tipo);
                p.costoTotale = p.costoPrestazioneScontata;
                if (_.contains(['CancellatoPostModifica', 'Cancellato'], p.stato) || p.tipo === 'ModificaAppuntamentoCarnet') {
                    p.costoTotale = p.costoPenaleCancellazione + p.costoPenaleModifica;
                    p.typeLabel = 'Penale ' + (p.stato === 'Cancellato' ? 'cancellazione ' : 'modifica ') + p.typeLabel;
                }

                ctrl.paymentsAmount.total += p.costoTotale;
                if (p.dataPrenotazione > firstDayOfMonth && p.dataPrenotazione < lastDayOfMonth) {
                    ctrl.paymentsAmount.thisMonth += p.costoTotale;
                }
                p.dataCreazioneLabel = moment(p.dataPrenotazione).format('DD/MM/YYYY[<br>]HH:mm');
                p.cliente = p.clienteNomeCompleto;
                p.amountLabel = p.costoTotale + ' €';
            });

            carnetOrders.forEach(function (p) {
                p.dataPrenotazione = p.dataCreazione;
                ctrl.paymentsAmount.total += p.costoPrestazioni;
                if (p.dataPrenotazione > firstDayOfMonth && p.dataPrenotazione < lastDayOfMonth) {
                    ctrl.paymentsAmount.thisMonth += p.costoPrestazioni;
                }
                p.typeLabel = getTypeLabel(p.tipo);
                p.dataCreazioneLabel = moment(p.dataPrenotazione).format('DD/MM/YYYY[<br>]HH:mm');
                p.amountLabel = p.costoPrestazioni + ' €';
                p.isCarnet = true;
            });
        }

        function getTypeLabel (type)
        {
            switch (type) {
                case 'Appuntamenti': return 'App. standard'; break;
                case 'AppuntamentiNominale': return 'App. nominale'; break;
                case 'AppuntamentiCarnet': return 'App. su base Carnet'; break;
                case 'NominaleMultiplo': return 'App. nominale multiplo'; break;
                case 'Carnet': return 'Acquisto Carnet'; break;
                case 'CarnetAppuntamentiMisto': return 'Acquisto contestuale Carnet/App.'; break;
                case 'ModificaAppuntamento': return 'App. standard (mod. Utente)'; break;
                case 'ModificaAppuntamentoCarnet': return 'App. su base Carnet (mod. Utente)'; break;
                case 'ModificaAppuntamentoNominale': return 'App. nominale (mod. Utente)'; break;
                case 'ModificaAmministrativaAppuntamento': return 'App. standard (mod. Amm.)'; break;
                case 'ModificaAmministrativaAppuntamentoNominale': return 'App. nominale (mod. Amm.)'; break;
                case 'ModificaAmministrativaAppuntamentoCarnet': return 'App. su base Carnet (mod. Amm.)'; break;
                default: return ''; break;
            }
        }
    }
