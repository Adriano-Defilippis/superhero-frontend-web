'use strict';

export default function CarnetPageController (
    $scope,$rootScope, ngDialog, User,  $state, $stateParams, AssetsStore, Carnet, RestService, SERVICES, Services, servicesList
){
    "ngInject";

    var self = this;
    let firstLoad = true;
    $scope.ctrl = self;

    self.disabled = [
      SERVICES.CHECKIN_CHECKOUT,
      SERVICES.COLF_BNB,
    ];

    if (_.includes($state.current.url, 'BNB')) {
      self.disabled = [
        SERVICES.COLF,
        SERVICES.PERSONALTRAINER,
        SERVICES.FISIOTERAPISTA,
        SERVICES.BADANTE,
        SERVICES.GINNASTICAPOSTURALE,
        SERVICES.BABYSITTER,
        SERVICES.STIRATURA,
      ];
    }

    //Services.loadData(servicesList);

    self.title = "acquisto carnet";
    self.headerSubTitle = "Vuoi spendere ancora meno, con ancora maggiore flessibilità? <br> Scegli un Supereroe e attiva il tuo Carnet!";
    self.headerImage = AssetsStore.Image('home.pageHeaders.carnet');
    self.preselectedService = null;
    self.loggedUser = 0;
    self.carnetAllList = User.carnetActive;


    // If user is logged try to load carnet list from server
    if ($rootScope.logged) {
        var filters = {  dataCreazioneMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataCreazioneMax: moment().add(24, 'months').format('DDMMYYYY') };
        RestService.getCustomerCarnetList($rootScope.userId, filters).then(function (data) {
            var userCarnetList = data.data.plain();
            User.injectCarnetList(userCarnetList);
        });
    }

    // check if is logged
    if($rootScope.logged){
      self.loggedUser = 1;
    } else {
      self.loggedUser = 0;
    }

    // preselect if stateparams if filled
    if($stateParams.servizio){
      if($stateParams.servizio === 'colf') self.preselectedService = SERVICES.COLF;
      if($stateParams.servizio === 'badante') self.preselectedService = SERVICES.BADANTE;
      if($stateParams.servizio === 'baby-sitter') self.preselectedService = SERVICES.BABYSITTER;
    }

    self.model = {
      headerImage : AssetsStore.Image('home.heroBox.one'),
      carnet_how_it_works_icon: AssetsStore.Image('carnet.ticketWhite'),
      shareCarnet: AssetsStore.Image('carnet.shareCarnet'),
      carnet_what_is: AssetsStore.Image('carnet.ticketOrange'),
    };
}
