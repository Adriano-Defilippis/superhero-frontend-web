'use strict';

export function AppConfig (
    $urlRouterProvider, $stateProvider, $locationProvider, stateHelperProvider, RestangularProvider, cfpLoadingBarProvider, uiGmapGoogleMapApiProvider, lockerProvider, $httpProvider
) {
    "ngInject";

    _.contains = _.includes;
    _.object = _.zipObject;

    $urlRouterProvider.when('/recruiter', '/recruiter/candidature');
    $urlRouterProvider.when('/contact-center', '/contact-center/clienti');
    $urlRouterProvider.when('/attivazione', '/welcome');
    $urlRouterProvider.when('/', '/benvenuto');
    $urlRouterProvider.when('', '/benvenuto');
    // services landing redirect for new urls
    $urlRouterProvider.when('/colf', '/benvenuto/colf');
    $urlRouterProvider.when('/badante', '/benvenuto/badante');
    $urlRouterProvider.when('/baby-sitter', '/benvenuto/baby-sitter');
    $urlRouterProvider.when('/personal-trainer', '/benvenuto/personal-trainer');
    $urlRouterProvider.when('/stiro', '/benvenuto/stiro');
    $urlRouterProvider.when('/personal-trainer/dimagrimento', '/benvenuto/personal-trainer/dimagrimento');
    $urlRouterProvider.when('/personal-trainer/allenamento-funzionale', '/benvenuto/personal-trainer/allenamento-funzionale');
    $urlRouterProvider.when('/personal-trainer/ginnastica-posturale', '/benvenuto/personal-trainer/ginnastica-posturale');
    $urlRouterProvider.when('/personal-trainer/ciclismo', '/benvenuto/personal-trainer/ciclismo');
    $urlRouterProvider.when('/personal-trainer/yoga', '/benvenuto/personal-trainer/yoga');
    $urlRouterProvider.when('/personal-trainer/difesa-personale', '/benvenuto/personal-trainer/difesa-personale');
    $urlRouterProvider.when('/personal-trainer/corsa', '/benvenuto/personal-trainer/corsa');
    $urlRouterProvider.when('/personal-trainer/pilates', '/benvenuto/personal-trainer/pilates');
    $urlRouterProvider.when('/fisioterapista', '/benvenuto/fisioterapista');
    $urlRouterProvider.when('/tuttofare', '/benvenuto/tuttofare');
    $urlRouterProvider.when('/tecma', '/benvenuto/tecma');
    $urlRouterProvider.when('/carnet-estivo', '/benvenuto/carnet-estivo');

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    //
    //    ROUTING
    //
    //    landing
    //
    stateHelperProvider.setNestedState({
        name: 'landing',
        url: '',
        abstract: true,
        templateUrl: 'app/landing/base.html',
        children: [{
            name: 'index',
            url: '/landing',
            templateUrl: 'app/landing/landing.html',
        },{
            name : 'bridge',
            url: '/diventa-supereroe',
            templateUrl : 'app/landing/bridge.html',
            controller : 'LandingBridgeCtrl as ctrl'
        },{
            name: 'signup',
            url: '/candidati',
            templateUrl: 'app/landing/candidati.html',
            controller: 'SignupHeroCtrl as ctrl',
            resolve: {
                attributes: ['RestService', function(RestService){
                    return RestService.getAttributes();
                }]
            }
        }]
    });

    //
    //    Activation
    //
    stateHelperProvider.setNestedState({
        name: 'activation',
        url: '/attivazione/:userId/:email/:token',
        templateUrl: 'app/guest/activation.html',
        controller: 'GuestActivationCtrl as ctrl',
        data : { pageTitle: 'Imposta la password' },
        onEnter: ['$stateParams', '$state', function($stateParams, $state){
            if(!$stateParams.userId || !$stateParams.token || !$stateParams.email){
                $state.go('main.guest.welcome');
            }
        }]
    });

    //
    //    Change password
    //
    stateHelperProvider.setNestedState({
        name: 'reset-password',
        url: '/reset-password/:userId/:email/:token',
        templateUrl: 'app/guest/reset-password.html',
        controller: 'GuestActivationCtrl as ctrl',
        data : { pageTitle: 'Reset della password' },
        onEnter: ['$stateParams', '$state', function($stateParams, $state){
            if(!$stateParams.userId || !$stateParams.token || !$stateParams.email){
                $state.go('main.guest.welcome');
            }
        }]
    });

    //
    //    Billing
    //

    stateHelperProvider.setNestedState({
        name: 'billing',
        url: '/fattura/:idFattura',
        templateUrl: 'app/billing/billing-template.html',
        controller: 'BillingCtrl as ctrl',
        data : { pageTitle: 'Dettaglio fattura' },
        onEnter: ['$stateParams', '$state', function($stateParams, $state){
            if(!$stateParams.idFattura){
                $state.go('main.guest.welcome');
            }
        }],
        resolve: {
            billingInfo: function($stateParams, RestService, LoginService, $rootScope, Restangular) {
              "ngInject";
              if (Cookies.get('is-app')) {
                  $rootScope.userId = Cookies.get('user-id');
                  $rootScope.isApp = Cookies.get('is-app');
                  $rootScope.userRole = Cookies.get('user-role');
                  Restangular.setDefaultHeaders({'X-Auth-Token': Cookies.get('auth-token')});
              }

              if($rootScope.logged) {
                if ($rootScope.userRole == 'admin') {
                  return RestService.getBillingDetail($stateParams.idFattura);
                }
                else if ($rootScope.userRole == 'superhero') {
                  return RestService.getSuperHeroBillingDetail($rootScope.userId, $stateParams.idFattura);
                }
                else if ($rootScope.userRole == 'cliente') {
                  return RestService.getCustomerBillingDetail($rootScope.userId, $stateParams.idFattura);
                }
                else return {};
              }
              else {
                  return {};
              }
            },
            servicesList: function(Services, RestService) {
              "ngInject";
              if (!Services.allServices() || (Services.allServices() && _.isEmpty(Services.allServices()))) {
                return RestService.getServizi();
              }
              return [];
            }
        }
    });


    //
    //  Main
    //
    stateHelperProvider.setNestedState({
        name: 'main',
        url: '?app&token&userId',
        abstract: true,
        template: '<ui-view></ui-view>',
        controller: 'MainCtrl as mainCtrl',
        onEnter: function(CookiePolicy, $rootScope) {
            $rootScope.isApp = Cookies.get('is-app');
            console.log($rootScope);
            CookiePolicy.showBanner($rootScope)
        },
        resolve: {
            accountInfo: function(RestService, $rootScope, Restangular, $stateParams){
                'ngInject';
                if ($stateParams.app) {
                    const isApp = $stateParams.app.toLowerCase() === 'true';
                    Cookies.set('auth-token', $stateParams.token, { expires: (60 * 60 * 8) });
                    Cookies.set('is-app', true, { expires: (60 * 60 * 8) });
                    Cookies.set('user-id', $stateParams.userId, { expires: (60 * 60 * 8) });
                    Cookies.set('user-role', "cliente", { expires: (60 * 60 * 8) });
                    $rootScope.isApp = isApp;
                    $rootScope.userId = $stateParams.userId;
                    $rootScope.logged = true;
                    $rootScope.userRole = "cliente";
                    Cookies.set('auth-token', $stateParams.token, { expires: (60 * 60 * 8) });
                    Restangular.setDefaultHeaders({'X-Auth-Token': Cookies.get('auth-token')});
                }

                if($rootScope.logged){
                    if($rootScope.userRole == 'admin')
                    return RestService.getCustomer('CL-11111111-1111-1111-1111');
                    else if($rootScope.userRole == 'superhero')
                    return RestService.getHero($rootScope.userId);
                    else if($rootScope.userRole == 'cliente') {
                    return RestService.getCustomer($rootScope.userId);
                    }
                    else
                    return {};
                } else {
                    return {};
                }
            },
            servicesList: function(RestService){
                'ngInject';
                return RestService.getServizi();
            },
            carnetTypes: function(RestService){
                'ngInject';
                return RestService.getCarnetTypes();
            }
        },
        children: [{
            name: 'contract',
            url: '/condizioni-di-utilizzo',
            templateUrl: 'app/hero/contract.html',
            controller: 'ContractCtrl as ctrl',
            data : { pageTitle: 'Condizioni di utilizzo' },
            resolve: {
                heroInfo: function ($rootScope, RestService) {
                    "ngInject";
                    if ($rootScope.logged){
                        if($rootScope.userRole == 'admin') return RestService.getHero('SH-22222222-2222-2222-2222');
                        else return RestService.getHero($rootScope.userId);
                    }
                    else {
                        return {};
                    }
                }
            }
        },{
        name: 'guest',
        url: '/?azione&ref',
        templateUrl: 'app/guest/base.html',
        controller: 'GuestBaseCtrl as ctrl',
        children: [{
            name: 'welcome',
            url: 'benvenuto',
            templateUrl: 'app/guest/welcome.html',
            controller: 'GuestWelcomeCtrl as ctrl'
        },
        {
            name: 'bnb',
            url: 'BNB',
            templateUrl: 'app/guest/welcome.html',
            controller: 'GuestWelcomeCtrl as ctrl'
        },
        {
            name: 'bnbCarnet',
            url: 'BNB/carnet?servizio',
            templateUrl: 'app/guest/carnet.html',
            controller: 'CarnetCtrl as ctrl',
            data : { pageTitle: 'Carnet' }
        },
        {
            name: 'welcomeService',
            url: 'benvenuto/:servizio',
            templateUrl: 'app/guest/welcome.html',
            controller: 'GuestWelcomeCtrl as ctrl',
            data: { pageTitle: 'Benvenuto', imagePreview: 'http://ilmiosupereroe.it/assets/images/divider-colf.jpg' }
        },
        {
            name: 'welcomeSubService',
            url: 'benvenuto/:servizio/:sottoServizio',
            templateUrl: 'app/guest/welcome.html',
            controller: 'GuestWelcomeCtrl as ctrl',
            data: { pageTitle: 'Benvenuto', imagePreview: 'http://ilmiosupereroe.it/assets/images/divider-colf.jpg' }
        },
        {
            name: 'about',
            url: 'chi-siamo',
            templateUrl: 'app/guest/about.html',
            controller: 'AboutCtrl as ctrl',
            data : { pageTitle: 'Chi siamo' }
        },
        {
            name: 'press-review',
            url: 'parlano-di-noi',
            templateUrl: 'app/guest/press-review-page.tmpl.html',
            controller: 'PressReviewController as ctrl',
            data : { pageTitle: 'Parlano di noi' }
        },
        {
            name: 'howItWorks',
            url: 'come-funziona',
            templateUrl: 'app/guest/howItWorks.html',
            controller: 'GuestHowItWorksCtrl as ctrl',
            data : { pageTitle: 'Come funziona' }
        },
        {
            name: 'faq',
            url: 'faq',
            templateUrl: 'app/guest/faq.html',
            controller: 'FaqCtrl as ctrl',
            data : { pageTitle: 'Faq' }
        },
        {
            name: 'prices',
            url: 'tariffe',
            templateUrl: 'app/guest/pricing-page/pricing-page.tmpl.html',
            controller: 'PricingPageCtrl as ctrl',
            data : { pageTitle: 'Tariffe' }
        },
        {
            name: 'carnet',
            url: 'carnet?servizio',
            templateUrl: 'app/guest/carnet.html',
            controller: 'CarnetCtrl as ctrl',
            data : { pageTitle: 'Carnet' }
        },
        {
            name: 'assurance',
            url: 'assicurazione',
            templateUrl: 'app/guest/assurance.html',
            controller: 'AssurancePageCtrl as ctrl',
            data : { pageTitle: 'Assicurazione' },
        },
        {
            name: 'redeem-gift-card',
            url: 'usa-gift-card',
            templateUrl: 'app/carnet/gift-card-redeem.tmpl.html',
            controller: 'RedeemGiftCardCtrl as ctrl',
            data : { pageTitle: 'Usa una GiftCard' }
        },
        {
            name: 'buy-gift-card-company',
            url: 'regala-gift-card-aziende',
            templateUrl: 'app/carnet/gift-card-buy-company.tmpl.html',
            controller: 'BuyGiftCardCompanyCtrl as ctrl',
            data : { pageTitle: 'Regala una GiftCard' }
        },
        {
            name: 'buy-gift-card',
            url: 'regala-gift-card',
            templateUrl: 'app/carnet/gift-card-buy.tmpl.html',
            controller: 'BuyGiftCardCtrl as ctrl',
            data : { pageTitle: 'Regala una GiftCard' }
        },
        {
            name: 'vantaggi',
            url: 'vantaggi-supereroe',
            templateUrl : 'app/guest/vantaggi.html',
            controller: 'VantaggiCtrl as ctrl',
            data : { pageTitle: 'Vantaggi di avere un supereroe' }
        },
        {
            name: 'standard',
            url: 'standard-qualita-sicurezza',
            templateUrl : 'app/guest/standard.html',
            controller: 'StandardCtrl as ctrl',
            data : { pageTitle: 'Standard qualità e sicurezza' }
        },
        {
            name: 'contacts',
            url: 'contatti',
            templateUrl : 'app/guest/contacts.html',
            controller: 'ContactsCtrl as ctrl',
            data : { pageTitle: 'Contatti' }
        },
        {
            name: 'landingservice',
            url: 'landing-servizio',
            templateUrl: 'app/landing/landing-servizio.html',
            controller: 'LandingServiceCtrl as ctrl'
        },
        {
            name: 'skylanding',
            url: 'benvenuto/sky',
            templateUrl: 'app/landing/landing-sky.html',
            controller: 'LandingSkyCtrl as ctrl'
        },
        {
            name: 'static',
            url: '',
            abstract: true,
            template: '<div ui-view class="single-bar container white" autoscroll auto-fill-height></div>',
            children: [
                {
                    name: 'signup',
                    url: 'registrati',
                    templateUrl: 'app/guest/signup.html',
                    controller: 'GuestSignupCtrl as ctrl'
                }
            ]
        }
    ]
},{
    name: 'recruiter',
    abstract: true,
    url: "/recruiter",
    templateUrl: 'app/recruiter/base.html',
    controller: 'RecruiterBaseCtrl as ctrl',
    children: [
        {
            name: 'applications',
            url: '/candidature?stato',
            templateUrl: 'app/recruiter/applications.html',
            controller: 'RecruiterApplicationsCtrl as ctrl',
            data : { pageTitle: 'Nuove candidature' },
            resolve: {
                candidates: ['RestService', function(RestService){
                    return RestService.getHeroesByState('DaAttivare'); //DaAttivare
                }]
            }
        },{
            name: 'new',
            url: '/nuovo-profilo',
            templateUrl: 'app/form/base.html',
            data : { pageTitle: 'Crea nuova candidatura' },
            controller: 'RecruiterNewProfilesCtrl as ctrl',
            resolve: {
                attributes: ['RestService', function(RestService){
                    return RestService.getAttributes();
                }]
            }
        },{
            name: 'edit',
            url: '/profilo/:id',
            templateUrl: 'app/form/base.html',
            controller: 'RecruiterEditHeroCtrl as ctrl',
            data : { pageTitle: 'Visualizza profilo' },
            resolve: {
                hero: ['RestService', '$stateParams', function(RestService, $stateParams){
                    return RestService.getHero($stateParams.id);
                }],
                attributes: ['RestService', function(RestService){
                    return RestService.getAttributes();
                }]
            }
        },{
            name: 'profiles',
            url: '/profili?stato',
            templateUrl: 'app/recruiter/profiles.html',
            controller: 'RecruiterHeroesCtrl as ctrl',
            data : { pageTitle: 'Tutti i collaboratori' },
            resolve: {
                heroes: ['RestService', function(RestService){
                    return RestService.getHeroesByState('Attivo,Disattivo,CondizioniDaAccettare');
                }]
            }
        },{
            name: 'archive',
            url: '/archiviati',
            templateUrl: 'app/recruiter/archive.html',
            controller: 'RecruiterArchiveCtrl as ctrl',
            data : { pageTitle: 'Candidature archiviate' },
            resolve: {
                heroes: ['RestService', function(RestService){
                    return RestService.getHeroesByState('Inattivo');
                }]
            }
        },{
            name: 'feedbacks',
            url: '/recensioni',
            templateUrl: 'app/contact-center/feedback.html',
            controller: 'ContactCenterFeedbackCtrl as ctrl',
            resolve: {
                feedbacks: ['RestService', function(RestService){
                    return RestService.getFeebackByState('Immessa');
                }]
            }
        }
    ]
},{
    name: 'hero',
    abstract: true,
    url: "/supereroe",
    resolve: {
        heroInfo: function(RestService, $rootScope, $stateParams){
            'ngInject';
            if ($rootScope.logged){
                if($rootScope.userRole == "admin") return RestService.getHero('SH-77777777-7777-7777-7776');
                else return RestService.getHero($rootScope.userId);
            }
            else {
                return {};
            }
        }
    },
    onEnter: ['heroInfo', '$state', '$rootScope', function(heroInfo, $state, $rootScope){
        if ($rootScope.logged){
            var stato = heroInfo.data.plain().stato;
            if(stato != "Attivo"){
                $state.go('main.contract');
            }
        }
    }],
    templateUrl: 'app/hero/base.html',
    controller: 'HeroBaseCtrl as ctrl',
    children: [
        {
            name: 'index',
            url: "",
            templateUrl: 'app/hero/index.html',
            controller: 'HeroIndexCtrl as ctrl',
            resolve: {
                
                calendarResData: function(RestService, heroInfo, $rootScope){
                    'ngInject';
                    if ($rootScope.logged){
                        var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
                        return RestService.getHeroAppointments(heroInfo.data.plain().id, filters);
                    }
                    else {
                        return {};
                    }
                },
                calendarReqData: function(RestService, heroInfo, $rootScope){
                    'ngInject';
                    if ($rootScope.logged){
                        var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
                        return RestService.getHeroAppointRequests(heroInfo.data.plain().id, filters);
                    }
                    else {
                        return {};
                    }
                },
                calendarAvailData: function(RestService, heroInfo, $rootScope){
                    'ngInject';
                    if ($rootScope.logged) {
                        var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
                        return RestService.getHeroAvailability(heroInfo.data.plain().id, filters);
                    }
                    else {
                        return {};
                    }
                }
            }
        },{
            name: 'profile',
            url: "/profilo",
            templateUrl: 'app/hero/profile.html',
            controller: 'HeroProfileCtrl as ctrl'
        },
        {
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
        },{
            name: 'billings',
            url: '/fatture?stato',
            templateUrl: 'app/hero/billings-page/billings-page.tmpl.html',
            controller: 'HeroBillingsPageController as HeroBillings',
            resolve: {
                billings: function (RestService, heroInfo, $rootScope) {
                    'ngInject';
                    return RestService.getHeroBilling(heroInfo.data.plain().id);
                }
            },
            data : { pageTitle: 'Fatture' }
          }
        ]
    },{
        name: 'user',
        abstract: true,
        url: '/cliente?app&token&userId',
        templateUrl: 'app/user/base.html',
        controller: 'UserBaseCtrl as ctrl',
        resolve: {
            userInfo: function(RestService, Restangular, $rootScope, $stateParams){
                if ($stateParams.app) {
                    if ($stateParams.userId && $stateParams.token) {
                        const isApp = $stateParams.app.toLowerCase() === 'true';
                        Cookies.set('auth-token', $stateParams.token, { expires: (60 * 60 * 8) });
                        Cookies.set('is-app', true, { expires: (60 * 60 * 8) });
                        Cookies.set('user-id', $stateParams.userId, { expires: (60 * 60 * 8) });
                        Cookies.set('user-role', "cliente", { expires: (60 * 60 * 8) });
                        $rootScope.isApp = isApp;
                        Restangular.setDefaultHeaders({'X-Auth-Token': Cookies.get('auth-token')});
                        return RestService.getCustomer($stateParams.userId);
                    }
                }

                if($rootScope.userRole == "admin") {
                    return RestService.getCustomer('CL-11111111-1111-1111-1111');
                } else if($rootScope.logged && $rootScope.userRole == "cliente") {
                    return RestService.getCustomer($rootScope.userId);
                    //return RestService.getHero('SH-11111111-1111-1111-1111');
                } else {
                    return false;
                }
            },
            customerAppointments: function(RestService, userInfo, $rootScope){
                var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
                if($rootScope.logged) {
                    return RestService.getCustomerAppointments(userInfo.data.plain().id, filters);
                }
                else {
                    return {};
                }
            },
            heroesList:function(RestService, userInfo, $rootScope){
                if($rootScope.logged) {
                    return RestService.getCustomerHeroes(userInfo.data.plain().id);
                }
                else {
                    return {};
                }
            },
            carnetList: function(RestService, userInfo, $rootScope){
                var filters = {  dataCreazioneMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataCreazioneMax: moment().add(12, 'months').format('DDMMYYYY') };
                if($rootScope.logged) {
                    return RestService.getCustomerCarnetList(userInfo.data.plain().id, filters);
                }
                else {
                    return {};
                }
            },
            payments: function (RestService, userInfo, $rootScope) {
                if($rootScope.logged) {
                    return RestService.getCustomerPayments(userInfo.data.plain().id);
                }
                else {
                    return {};
                }
            },
            feedbacks: function (RestService, userInfo, $rootScope) {
                "ngInject";

                if($rootScope.logged) {
                    return RestService.getCustomerFeedbackToSend(userInfo.data.plain().id);
                }
                else {
                    return {};
                }
            }
        },
        children: [
            {
                name: 'index',
                url: '/bacheca',
                templateUrl: 'app/user/index.html',
                controller: 'UserIndexCtrl as ctrl',
                data : { pageTitle: 'Bacheca' }
            },
            {
                name: 'bnbIndex',
                url: '/BNB/bacheca',
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
                url: '/gestisci-carnet?evidenzia',
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
                name: 'billings',
                url: '/fatture',
                templateUrl: 'app/user/billings-page/billings-page.tmpl.html',
                controller: 'UserBillingsPageController as UserBillings',
                resolve: {
                  billings: function (RestService, userInfo) {
                      'ngInject';
                      return RestService.getCustomerBilling(userInfo.data.plain().id);
                  }
                },
                data : { pageTitle: 'Fatture' }
            },
            {
                name: 'history',
                url: '/storico-prenotazioni',
                templateUrl: 'app/user/history.html',
                controller: 'UserHistoryCtrl as ctrl',
                /*resolve: {
                    customerAppointments: ['RestService', 'userInfo', function(RestService, userInfo){
                        var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
                            return RestService.getCustomerAppointments(userInfo.data.plain().id, filters);
                    }],
                }
                */
            },
            {
                name: 'referral',
                url: '/invita',
                templateUrl: 'app/user/referral-page/referral-page.tmpl.html',
                controller: 'ReferralPageCtrl as ReferralPage',
                data : { pageTitle: 'Invita' }
            }
        ]
    }]
    });

    //
    //   Logout
    //
    stateHelperProvider.setNestedState({
        name: 'logout',
        url: '/logout',
        controller: ['$location', '$timeout', function($location, $timeout){
            Cookies.expire('username');
            Cookies.expire('user-id');
            Cookies.expire('auth-token');
            Cookies.expire('user-role');

            $location.path('/');
            $timeout(function(){
                location.reload(true);
            }, 100);
        }]
    });


    //
    //  Locker session storage
    //
    lockerProvider.setDefaultDriver('session')
    .setDefaultNamespace('ilmiosupereroe')
    .setSeparator('.')
    .setEventsEnabled(false);


    //
    //  Restangular config
    //
    //RestangularProvider.setBaseUrl('http://192.168.150.59:8080');
    RestangularProvider.setBaseUrl('https://api.ilmiosupereroe.it');
    //RestangularProvider.setBaseUrl('https://int.api.ilmiosupereroe.it');


    RestangularProvider.setFullResponse(true);
    var authToken = Cookies.get('auth-token');
    if(authToken !== null && typeof authToken !== 'undefined' && authToken !== "") {
        RestangularProvider.setDefaultHeaders({'X-Auth-Token': authToken});
    }


    //
    // loading bar settings
    //
    cfpLoadingBarProvider.includeSpinner = false;


    //
    // Google Maps settings
    //
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyB6cPhQ09Z_b3Q5oQblDMEnPAbrULhoe1w',
	    v: '3.34',
        libraries: 'geometry,visualization,places',
        language: 'it'
    });

}
