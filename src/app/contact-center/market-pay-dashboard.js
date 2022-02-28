'use strict';

export default function ContactCenterMarketPayDashboardController (
        $scope,
        $stateParams,
        payments,
        ngDialog,
        RestService
    ) {
        "ngInject";

        // self bind
        var ctrl = this;

        ctrl.activeButton = 'main-orange white-text';
        ctrl.inactiveButton = 'white';

        if(!$stateParams.stato) {
            ctrl.stato = 'DaPagare';
        } else {
            ctrl.stato = $stateParams.stato;
        }

        ctrl.billed = false;

        // check which butotn is active
        if(ctrl.stato === 'DaPagare'){
            ctrl.toBeBilled = true;
        } else if(ctrl.stato === 'Pagati'){
            ctrl.billed = true;
        }

        // bind data and clean
        ctrl.payments = payments.data.data;
        ctrl.paymentsSize = payments.data.sizePayment;
        ctrl.paymentsRecordsSize = payments.data.sizePaymentRecord;
        ctrl.paymentsAmount = { total: 0, thisMonth: 0 };

        var today = new Date();
        var currentMonth = {
            y: today.getFullYear(),
            m: today.getMonth()
        }

        var firstDayOfMonth = moment([currentMonth.y, currentMonth.m]).toDate().valueOf();
        var lastDayOfMonth = moment(firstDayOfMonth).endOf('month').toDate().valueOf();


        cleanData(ctrl.payments);

        // functions
        function cleanData (payments)
        {
            payments.forEach(function (p) {
                ctrl.paymentsAmount.total += p.amount;
                if (p.date > firstDayOfMonth && p.date < lastDayOfMonth) {
                    ctrl.paymentsAmount.thisMonth += p.amount;
                }
                p.shopperLabel = p.shopperEmail === 'admin@ilmiosupereroe.it' ? 'Digital Heroes' : p.shopperEmail;
                p.formattedReference = p.psp ? `${p.reference} (${p.psp})` : p.reference;
                p.dataCreazioneLabel = p.date ? moment(p.date).format('DD/MM/YYYY') : moment(p.creationDate).format('DD/MM/YYYY');
                p.stateLabel = p.status ? p.status : 'Non pagato';
                p.amountLabel = Math.round(p.amount * 100) / 100;
            });
        }

        ctrl.showMarketPayPaymentModal = (paymentId) => {
            RestService.getMarketPayPaymentsRecords(paymentId)
            .then((response) => {
                let paymentDetails = response.data.data;
                cleanData(paymentDetails);
                ngDialog.open({
                    template: 'app/contact-center/market-pay-payments-details.html',
                    className: 'ngdialog-theme-default',
                    controller: ['$scope', function($scope){
                      $scope.payments = paymentDetails;
                    }],
                });
            })
        }
    }
