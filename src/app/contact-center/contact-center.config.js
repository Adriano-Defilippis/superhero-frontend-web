'use strict';

export default function ContactCenterConfig (
    stateHelperProvider,
    RestangularProvider
) {
    "ngInject";


    stateHelperProvider.setNestedState({
        name: 'support',
        parent: 'main',
        abstract: true,
        url: '/contact-center',
        templateUrl: 'app/contact-center/base.html',
        controller: 'ContactCenterBaseCtrl as ctrl',
        children: [
            {
                name: 'feedback',
                url: '/recensioni',
                templateUrl: 'app/contact-center/feedback.html',
                controller: 'ContactCenterFeedbackCtrl as ctrl',
                data : { pageTitle: 'Recensioni' },
                resolve: {
                    feedbacks: ['RestService', function(RestService){
                        return RestService.getFeebackByState('Immessa');
                    }]
                }
            }
            ,{
                name: 'report-referral',
                url: '/report-referral',
                controller: 'ContactCenterReportReferralController as ctrl',
                resolve: {
                    report: ['RestService', function(RestService){
                        return RestService.downloadReferral();
                    }]
                }
            }
            ,{
                name: 'voucher-generator',
                url: '/voucher-generator',
                templateUrl: 'app/contact-center/voucher-generator.html',
                controller: 'ContactCenterVoucherGeneratorCtrl as ctrl',
            }
            ,{
                name: 'clienti',
                url: '/clienti',
                templateUrl: 'app/contact-center/archivio-clienti.html',
                controller: 'ContactCenterClientiCtrl as ctrl',
                data : { pageTitle: 'Clienti' },
                resolve: {
                    clienti: ['RestService', function(RestService){
                        return RestService.getCustomers();
                    }]
                }
            },{
                name: 'clienti-dettaglio',
                url: '/clienti/:id',
                templateUrl: 'app/contact-center/clienti-dettaglio.html',
                controller: 'ContactCenterClientiDettaglioCtrl as ctrl',
                data : { pageTitle: 'Dettaglio cliente' },
                resolve: {
                    cliente: ['RestService', '$stateParams', function(RestService, $stateParams){
                        return RestService.getCustomer($stateParams.id);
                    }]
                }
            },{
                name: 'heroes',
                url: '/eroi',
                templateUrl: 'app/contact-center/archivio-heroes.html',
                controller: 'ContactCenterHeroesCtrl as ctrl',
                data : { pageTitle: 'Collaboratori' },
                resolve: {
                    heroes: ['RestService', function(RestService){
                        return RestService.getHeroesByState('Attivo');
                    }]
                }
            },{
                name: 'eroe-dettaglio',
                url: '/eroi/:id',
                templateUrl: 'app/contact-center/hero-dettaglio.html',
                controller: 'ContactCenterHeroesDettaglioCtrl as ctrl',
                data : { pageTitle: 'Dettaglio collaboratore' },
                resolve: {
                    hero: ['RestService', '$stateParams', function(RestService, $stateParams){
                        return RestService.getHero($stateParams.id);
                    }]
                }
            },{
                name: 'edit-hero',
                url: '/eroi/:id/modifica',
                templateUrl: 'app/form/base.html',
                controller: 'RecruiterEditHeroCtrl as ctrl',
                data : { pageTitle: 'Modifica collaboratore' },
                resolve: {
                    hero: ['RestService', '$stateParams', function(RestService, $stateParams){
                        return RestService.getHero($stateParams.id);
                    }]
                }
            },{
                name: 'heroes-agenda',
                url: '/agenda-collaboratori',
                templateUrl: 'app/contact-center/heroes-agenda.html',
                controller: 'ContactCenterHeroesAgendaCtrl as ctrl',
                data : { pageTitle: 'Aggiornamento agenda collaboratori' },
                resolve: {
                    heroesAgenda: ['RestService', function(RestService){
                        return RestService.getHeroesAgendas();
                    }]
                }
            },{
                name: 'orders',
                url: '/ordini?stato&tipo',
                templateUrl: 'app/contact-center/orders/orders-page.tmpl.html',
                controller: 'CcOrdersPageCtrl as ctrl',
                data : { pageTitle: 'Elenco ordini' },
                resolve: {
                    orders: ['RestService', function(RestService){
                        return RestService.getOrders();
                    }]
                }
            },{
                name: 'payments',
                url: '/pagamenti',
                templateUrl: 'app/contact-center/payments-tmpl.html',
                controller: 'ContactCenterPaymentsCtrl as ctrl',
                data : { pageTitle: 'Elenco pagamenti' },
                resolve: {
                    payments: ['RestService', function(RestService){
                        return RestService.getPayments();
                    }]
                }
            },{
                name: 'paymentsDetailed',
                url: '/pagamenti-dettagliati',
                templateUrl: 'app/contact-center/payments-detailed-tmpl.html',
                controller: 'ContactCenterPaymentsDetailedCtrl as ctrl',
                data : { pageTitle: 'Elenco pagamenti' },
                resolve: {
                    appointments: ['RestService', function(RestService){
                        return RestService.getAppointments();
                    }],
                    orders: ['RestService', function(RestService){
                        return RestService.getOrders({ onlyCarnet: true });
                    }]
                }
            },
            {
                name: 'market-pay',
                url: '/market-pay?stato',
                templateUrl: 'app/contact-center/market-pay-dashboard.html',
                controller: 'ContactCenterMarketPayDashboardCtrl as ctrl',
                data : { pageTitle: 'Market Pay' },
                resolve: {
                    payments: function(RestService, $stateParams){
                        "ngInject";
                        if ($stateParams.stato === 'DaPagare') {
                            return RestService.getMarketPayPaymentsRecords();
                        } else if ($stateParams.stato === 'Pagati') {
                            return RestService.getMarketPayPayments();
                        } else {
                            return RestService.getMarketPayPaymentsRecords();
                        }
                    }
                }
            },
            {
                name: 'edit-order',
                url: '/ordini/:idOrder',
                templateUrl: 'app/contact-center/edit-order.html',
                controller: 'ContactCenterEditOrderCtrl as ctrl',
                data : { pageTitle: 'Modifica Ordine' },
                resolve: {
                    order: ['RestService', '$stateParams', function(RestService, $stateParams){
                        return RestService.getOrder($stateParams.idOrder);
                    }]
                }
            },{
                name: 'appointments',
                url: '/appuntamenti?stato',
                templateUrl: 'app/contact-center/appointments/appointments-page.tmpl.html',
                controller: 'CcAppointmentsPageCtrl as ctrl',
                data : { pageTitle: 'Elenco appuntamenti' },
                resolve: {
                    appointments: ['RestService', function(RestService){
                        return RestService.getAppointments();
                    }]
                }
            },{
                name: 'feedbacks',
                url: '/recensioni',
                templateUrl: 'app/contact-center/feedback.html',
                controller: 'ContactCenterFeedbackCtrl as ctrl',
                data : { pageTitle: 'Recensioni' },
                resolve: {
                    feedbacks: ['RestService', function(RestService){
                        return RestService.getFeebackByState('Immessa');
                    }]
                }
            },{
                name: 'edit-appointment',
                url: '/appuntamenti/:idAppoint?idCustomer',
                templateUrl: 'app/contact-center/appointments/edit-appointment-page.tmpl.html',
                controller: 'CcEditAppointmentPageCtrl as ctrl',
                data : { pageTitle: 'Modifica Appuntamento' },
                resolve: {
                    appointment: ['RestService', '$stateParams', function(RestService, $stateParams){
                        return RestService.getAppointment($stateParams.idCustomer, $stateParams.idAppoint);
                    }]
                }
            },{
                name: 'user',
                abstract: true,
                url: '/clienti/:id',
                templateUrl: 'app/contact-center/user-base-tmpl.html',
                controller: 'UserBaseCtrl as baseCtrl',
                resolve: {
                    userInfo: ['RestService', '$stateParams', function(RestService, $stateParams){
                        return RestService.getCustomer($stateParams.id);
                    }],
                    customerAppointments: ['RestService', 'userInfo', function(RestService, userInfo){
                        var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
                        return RestService.getCustomerAppointments(userInfo.data.plain().id, filters);
                    }],
                    heroesList: ['RestService', 'userInfo', function(RestService, userInfo){
                        return RestService.getCustomerHeroes(userInfo.data.plain().id);
                    }],
                    carnetList: ['RestService', 'userInfo', function(RestService, userInfo){
                        var filters = {  dataCreazioneMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataCreazioneMax: moment().add(12, 'months').format('DDMMYYYY') };
                        return RestService.getCustomerCarnetList(userInfo.data.plain().id, filters);
                    }],
                    payments: ['RestService', 'userInfo', function (RestService, userInfo) {
                      return RestService.getCustomerPayments(userInfo.data.plain().id);
                      }],
                      feedbacks: function (RestService, userInfo) {
                          "ngInject";
                          return RestService.getCustomerFeedbackToSend(userInfo.data.plain().id);
                      }
                },
                children: [
                    {
                        name: 'dashboard',
                        url: '/bacheca',
                        templateUrl: 'app/user/index.html',
                        controller: 'UserIndexCtrl as ctrl',
                        data : { pageTitle: 'Bacheca' }
                    },
                    {
                        name: 'hero-profile',
                        url: '/miei-eroi/:idHero',
                        templateUrl: 'app/user/hero-profile.html',
                        controller: 'UserHeroProfileCtrl as ctrl',
                        resolve: {
                            heroProfileInfo: ['RestService', '$rootScope', '$stateParams', function(RestService, $rootScope, $stateParams){
                                return RestService.getHero($stateParams.idHero);
                            }]
                        }
                    },
                    {
                        name: 'carnet',
                        url: '/gestisci-carnet',
                        templateUrl: 'app/user/carnet.html',
                        controller: 'UserCarnetCtrl as ctrl',
                    },
                    {
                        name: 'carnet-edit-hero',
                        url: '/gestisci-carnet/:idCarnet/modifica-eroe',
                        templateUrl: 'app/user/carnet-hero-search.html',
                        controller: 'UserCarnetEditHeroCtrl as ctrl'
                    },
                    {
                        name: 'payments',
                        url: '/pagamenti',
                        templateUrl: 'app/user/payments-tmpl.html',
                        controller: 'UserPaymentsCtrl as ctrl'
                    },
                    {
                        name: 'history',
                        url: '/storico-prenotazioni',
                        templateUrl: 'app/user/history.html',
                        controller: 'UserHistoryCtrl as ctrl',
                    },
                    {
                      name: 'billings',
                      url: '/fatture?stato',
                      templateUrl: 'app/user/billings-page/billings-page.tmpl.html',
                      controller: 'UserBillingsPageController as UserBillings',
                      resolve: {
                        billings: function (RestService, userInfo) {
                          'ngInject';
                          return RestService.getCustomerBilling(userInfo.data.plain().id);
                        }
                      }
                    }
                ]
            }, {
                name: 'hero',
                abstract: true,
                url: "/supereroe/:id",
                resolve: {
                    heroInfo: ['RestService', '$stateParams', function(RestService, $stateParams){
                        return RestService.getHero($stateParams.id);
                    }]
                },
                onEnter: ['heroInfo', '$state', function(heroInfo, $state){
                    var stato = heroInfo.data.plain().stato;
                    if(stato != "Attivo"){
                        //$state.go('main.contract');
                    }
                }],
                templateUrl: 'app/contact-center/hero-dashboard.html',
                controller: 'HeroBaseCtrl as ctrl',
                children: [
                    {
                        name: 'index',
                        url: "",
                        templateUrl: 'app/hero/index.html',
                        controller: 'HeroIndexCtrl as ctrl'
                    },{
                        name: 'profile',
                        url: "/profilo",
                        templateUrl: 'app/hero/profile.html',
                        controller: 'HeroProfileCtrl as ctrl'
                    },{
                        name: 'zones',
                        url: "/zone-disponibilita",
                        templateUrl: 'app/hero/zones.html',
                        controller: 'HeroAvailabilityZonesCtrl as ctrl'
                    },
                    {
                        name: 'history',
                        url: "/storico",
                        templateUrl: 'app/hero/history.html',
                        controller: 'HeroHistoryCtrl as ctrl',
                        resolve: {
                            history: ['RestService', 'heroInfo', function(RestService, heroInfo){
                                return RestService.getHeroAppointments(heroInfo.data.plain().id);
                            }]
                        }
                    },{
                        name: 'carnet',
                        url: '/carnet-associati',
                        templateUrl: 'app/hero/carnet.html',
                        controller: 'HeroCarnetCtrl as ctrl',
                        resolve: {
                            carnetList: ['RestService', 'heroInfo', function(RestService, heroInfo){
                                return RestService.getHeroCarnetList(heroInfo.data.plain().id);
                            }]
                        }
                    },{
                        name: 'overview',
                        url: "/riepilogo",
                        templateUrl: 'app/hero/overview.html',
                        controller: 'HeroOverviewCtrl as ctrl',
                        resolve: {
                            heroStats: ['RestService', 'heroInfo', function(RestService, heroInfo){
                                return RestService.getHeroStats(heroInfo.data.plain().id);
                            }],
                            history: ['RestService', 'heroInfo', function(RestService, heroInfo){
                                return RestService.getHeroAppointments(heroInfo.data.plain().id);
                            }]
                        }
                    },
                  {
                    name: 'billings',
                    url: '/fatture?stato',
                    templateUrl: 'app/hero/billings-page/billings-page.tmpl.html',
                    controller: 'HeroBillingsPageController as HeroBillings',
                    resolve: {
                      billings: function (RestService, heroInfo) {
                        'ngInject';
                        return RestService.getHeroBilling(heroInfo.data.plain().id);
                      }
                    },
                    data : { pageTitle: 'Fatture' }
                  }
                ]
            }
        ]
    });


    stateHelperProvider.setNestedState({
        parent: 'main.support',
        name: 'user-book',
        url: '/clienti/:id/prenota',
        abstract: true,
        templateUrl: 'app/contact-center/user-booking-base-tmpl.html',
        controller: 'SearchBaseCtrl as baseCtrl',
        resolve: {
            userInfo: ['RestService', '$stateParams', function(RestService, $stateParams){
                return RestService.getCustomer($stateParams.id);
            }],
        },
        children: [{
            name: 'hero-search',
            url: '/cerca-supereroe',
            templateUrl: 'app/booking/hero-search.html',
            controller: 'HeroSearchCtrl as ctrl',
            onEnter: ['Booking', function(Booking){
                if(!Booking.active.hero.isHeroSelectionOrder) Booking.startNewHeroSelectionOrder();
            }],
        },{
            name: 'where',
            url: '?via&num&cap&loc&prov',
            templateUrl: 'app/search/where.html',
            controller: 'SearchWhereCtrl as ctrl'
        },{
            name: 'services',
            url: '/servizi',
            templateUrl: 'app/search/services.html',
            controller: 'SearchServicesCtrl as ctrl'
        },{
            name: 'when',
            url: '/quando',
            templateUrl: 'app/search/when.html',
            controller: 'SearchWhenCtrl as ctrl'
        },{
            name: 'data',
            url: '/dati',
            templateUrl: 'app/search/data.html',
            controller: 'SearchDataCtrl as ctrl'
        },{
            name: 'reservation-confirm',
            url: '/conferma-prenotazione',
            templateUrl : 'app/search/reservationConfirm.html',
            controller: 'SearchReservationConfirmCtrl as ctrl'
        },{
            name: 'payment-confirm',
            url: '/conferma-pagamento?merchantReference&skinCode&paymentMethod&authResult&pspReference&merchantSig&carnetOrder',
            templateUrl: 'app/contact-center/user-booking-payment-confirm-tmpl.html',
            controller: 'PaymentConfirmCtrl as ctrl',
            onEnter: ['$stateParams', '$state', 'Booking', 'CarnetBooking', 'locker', function($stateParams, $state, Booking, CarnetBooking, locker){
                if($stateParams.carnetOrder){ // user didn't go through Adyen
                    var orderID = $stateParams.carnetOrder;
                    var orderInfo = locker.namespace('ilmiosupereroe').get(orderID);
                    Booking.active.carnet.isCarnetOrder = true;
                    Booking.isPaymentPage(orderID, true);
                } else if($stateParams.merchantReference && $stateParams.skinCode && $stateParams.paymentMethod && $stateParams.authResult && $stateParams.pspReference && $stateParams.merchantSig){

                    var orderID = $stateParams.merchantReference;
                    var orderInfo = locker.namespace('ilmiosupereroe').get(orderID);
                    var orderInfoType = orderInfo.orderType;
                    //if(!orderInfoType) $state.go('main.guest.welcome');
                    if(orderInfoType == 'BASE') Booking.isPaymentPage(orderID, $stateParams.authResult == 'AUTHORISED');
                    else if (orderInfoType == 'CARNET') CarnetBooking.isPaymentPage(orderID, $stateParams.authResult == 'AUTHORISED');

                } else {
                    $state.go('main.guest.welcome');
                }
            }]
        }]
    });
}
