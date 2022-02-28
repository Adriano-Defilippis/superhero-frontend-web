'use strict';

export default function UserCarnetCtrl (
    $scope, $state, $stateParams, Services, AssetsStore, carnetList, ngDialog, User, $ngRedux, BookingActions
) {
    "ngInject";

  	var ctrl = this;

    ctrl.carnet = [];

    //ctrl.appointmentsList = User.getAppointments();

    var carnets = _.clone(User.carnetActive);
    console.log(carnets);
    ctrl.carnet.push.apply(ctrl.carnet, carnets);

    /*
    if(carnets.length > 0){
      carnets.forEach(function(c){
        var carnetInfo = Services.Carnet(c.idTipoCarnet);
        c.carnetIcon = AssetsStore.Icon('badge.carnet'+carnetInfo.tipo);
        c.oreResidue = c.minutiResidui / 60;
        c.dataAcquisto = moment(c.dataAcquisto).format('DD/MM/YYYY');
        c.scadenza = moment(c.dataScadenza).format('DD/MM/YYYY');
        c.prestazione = carnetInfo.tipoServizio.prestazione;
        c.label = carnetInfo.tipoServizio.descrizione;
        c.oreTotali = carnetInfo.totaleOre;
        c.carnetTipo = carnetInfo.tipo;
        c.superHeroPhotoUrl = c.superHeroPhotoUrl ? c.superHeroPhotoUrl : AssetsStore.Image('user.placeholder');
        ctrl.carnet.push(c);
      });
  }*/

    if ($stateParams.evidenzia) {
        ctrl.highlightedCarnet = $stateParams.evidenzia;
    } else {
        ctrl.highlightedCarnet = '';
    }



    ctrl.openHistoryDialog = function(singleCarnetInfo){
      console.log(singleCarnetInfo);
      const filterStates = ['Pagato', 'Aperto', 'Confemato'];
      var carnetAppoints = _.filter(ctrl.appointmentsList, function(el){
        console.log(ctrl.appointmentsList);
        return el.idCarnet === singleCarnetInfo.id && _.contains(filterStates, el.stato);
      });
      ngDialog.open({
        template: 'app/user/carnet-archive.html',
        className: 'ngdialog-theme-default',
        controller: ['$scope', function($scope){
          $scope.prenotazioni = carnetAppoints;
        }]});
    };

    ctrl.newCarnetOrder = function(carnet){
        $ngRedux.dispatch(BookingActions.startBookingWithCarnet(carnet));
      //Booking.startNewCarnetOrder(carnet);
    }

    ctrl.openChangeHeroDialog = function(singleCarnetInfo){
      var competenza = Services.CompetenzaByServizio(singleCarnetInfo.idTipoServizio);
      ngDialog.open({
        template: 'app/user/carnet-hero-search.html',
        className: 'ngdialog-theme-default ngdialog-hero-profile',
        controller: ['$scope', 'HeroSearch', function($scope, HeroSearch){

          $scope.ctrl = {
            search: HeroSearch.getHeroSearchOptions({
              preselect: competenza,
              disableSelection: { competenzaDisabled: true },
              resetHeroesFunction: true,
              bookingType: 'carnet',
              disableActions: true,
              disableHeroProfile: true,
              carnetIdToChange: singleCarnetInfo.id,
              popupScope: $scope
            })
          }


        }]});
    }

    ctrl.changeHero = function(carnet){
      $state.go('main.user.carnet-edit-hero', { idCarnet: carnet.id });
    }

}
