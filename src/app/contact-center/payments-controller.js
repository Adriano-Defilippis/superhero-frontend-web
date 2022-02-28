'use strict';

export default function ContactCenterPaymentsController (
        $scope,
        payments
    ) {
        "ngInject";

        // self bind
        var ctrl = this;

        // bind data and clean
        ctrl.payments = payments.data.plain();
        ctrl.paymentsAmount = { total: 0, thisMonth: 0 };

        var today = new Date();
        var currentMonth = {
            y: today.getFullYear(),
            m: today.getMonth()
        }

        console.log(currentMonth);

        var firstDayOfMonth = moment([currentMonth.y, currentMonth.m]).toDate().valueOf();
        var lastDayOfMonth = moment(firstDayOfMonth).endOf('month').toDate().valueOf();

        console.log(firstDayOfMonth, lastDayOfMonth);

        cleanData(ctrl.payments);

        // functions
        function cleanData (payments)
        {
            payments.forEach(function (p) {
                ctrl.paymentsAmount.total += (p.amount / 100);
                if (p.dataCreazione > firstDayOfMonth && p.dataCreazione < lastDayOfMonth) {
                    ctrl.paymentsAmount.thisMonth += (p.amount / 100);
                }
                p.dataCreazioneLabel = moment(p.dataCreazione).format('DD/MM/YYYY[<br>]HH:mm');
                p.amountLabel = p.amount / 100;
                p.isCarnet = false;
                if (p.reference.split('-')[0] == 'CN') p.isCarnet = true;
                p.sortHelper = p.isCarnet ? 'carnet' : 'appuntamento';
            });
        }
    }
