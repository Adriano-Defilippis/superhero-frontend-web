'use strict';

export default function LandingSkyController (
    $scope,$rootScope, ngDialog, User,  $state, $stateParams, AssetsStore, Carnet, RestService, SERVICES, Services, servicesList
){
    "ngInject";

    var self = this;
    let firstLoad = true;
    $scope.ctrl = self;
    let disableServices = _.map(Services.allServices(), (service) => service.id);

    _.remove(disableServices, (value) => value === 'TS-0000-0000-0000-0002');
    disableServices.push('FISIOTERAPISTA');
    disableServices.push('PERSONALTRAINER');

    self.disabled = disableServices;
    self.title = "un supereroe per Sky";
    self.headerSubTitle = "";
    self.headerImage = AssetsStore.Image('landing.sky');
    self.loggedUser = 0;
    self.carnetAllList = User.carnetActive;
    self.preselectedService = 'TS-0000-0000-0000-0002';
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

    self.model = {
      headerImage : AssetsStore.Image('home.heroBox.one'),
      carnet_how_it_works_icon: AssetsStore.Image('carnet.ticketWhite'),
      carnet_what_is: AssetsStore.Image('carnet.ticketOrange'),
    };
}
