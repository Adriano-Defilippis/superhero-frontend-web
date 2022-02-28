'use strict';

export default function ContactCenterSubBarController (
        $scope,
        $rootScope,
        $log
    ) {
        "ngInject";

        $log.log('[CONTACT_CENTER_SUBBAR] Initialized');

        var ctrl = this;

        // Sub bar menu list
        ctrl.items = [{
            //icon: '/assets/icons/calendar-small.svg',
            iconClass: 'mdi-action-account-circle icon-center',
            label: 'Clienti',
            target: 'main.support.clienti'
        },{
            //icon: '/assets/icons/pinpoint.svg',
            iconClass: 'mdi-action-wallet-travel icon-center',
            label: 'Supereroi',
            target: 'main.support.heroes'
        },{
            //icon: '/assets/icons/pinpoint.svg', mdi-action-view-list
            iconClass: 'mdi-action-view-list icon-center',
            label: 'Appuntamenti',
            target: 'main.support.appointments'
        },{
            //icon: '/assets/icons/pinpoint.svg', mdi-action-view-list
            iconClass: 'mdi-action-receipt icon-center',
            label: 'Ordini',
            target: 'main.support.orders'
        },{
            //icon: '/assets/icons/history.svg',
            iconClass: 'mdi-action-event icon-center',
            label: 'Aggiornamento agenda',
            target: 'main.support.heroes-agenda'
        },{
            //icon: '/assets/icons/bill.svg',
            iconClass: 'mdi-communication-chat icon-center',
            label: 'Recensioni',
            target: 'main.support.feedbacks'
        },
        {
            //icon: '/assets/icons/bill.svg',
            iconClass: 'mdi-maps-local-play icon-center',
            label: 'Genera Voucher',
            target: 'main.support.voucher-generator'
        },
        {
            //icon: '/assets/icons/bill.svg',
            iconClass: 'mdi-action-assessment icon-center',
            label: 'Report Referral',
            target: 'main.support.report-referral'
        },
        ];

        var payments = {
            //icon: '/assets/icons/pinpoint.svg', mdi-action-view-list
            iconClass: 'mdi-action-payment icon-center',
            label: 'Pagamenti',
            target: 'main.support.payments'
        };

        var paymentsDetailed = {
            //icon: '/assets/icons/pinpoint.svg', mdi-action-view-list
            iconClass: 'mdi-action-payment icon-center',
            label: 'Pagamenti',
            target: 'main.support.paymentsDetailed'
        };
        
        var marketPay = {
            //icon: '/assets/icons/bill.svg',
            iconClass: 'mdi-action-wallet-membership icon-center',
            label: 'Market Pay',
            target: 'main.support.market-pay'
        };

        if ($rootScope.userRole === 'admin') {
            ctrl.items.splice(4, 0, paymentsDetailed, marketPay);
        }

    }
