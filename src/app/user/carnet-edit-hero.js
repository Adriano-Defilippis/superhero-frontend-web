'use strict';

export default function UserCarnetEditHeroCtrl (
    $scope, $rootScope, HeroSearch, Services, carnetList, $stateParams
) {
    "ngInject";

  	var self = this;

    var carnets = carnetList.data.plain();

    var singleCarnetInfo = _.find(carnets, function(c){
      return c.id === $stateParams.idCarnet;
    });

    var competenza = Services.CompetenzaByServizio(singleCarnetInfo.idTipoServizio);

    self.search = HeroSearch.getHeroSearchOptions({
      preselect: competenza,
      disableSelection: { competenzaDisabled: true },
      resetHeroesFunction: true,
      bookingType: 'carnet',
      idTipoCarnet: singleCarnetInfo.idTipoCarnet,
      disableActions: true,
      disableHeroProfile: false,
      carnetIdToChange: singleCarnetInfo.id,
      userId: $rootScope.userId,
      popupScope: $scope
    });

    self.isCarnetEditHero = true;

}
