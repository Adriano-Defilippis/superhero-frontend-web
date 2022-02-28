'use strict';

export default function HeroBaseController (
    $scope, $state, $rootScope, $timeout, heroInfo, HeroInfoService, RestService, AssetsStore, CalendarService, LoginService
) {
    "ngInject";


    if(!$rootScope.logged){
        $timeout(function(){
          LoginService.showLogin();
        }, 100);
      }

  	var self = this;
    var infoClean = _.cloneDeep(heroInfo.data.plain());

    if(infoClean.photoUrl === null)
      infoClean.photoUrl = AssetsStore.Image('user.placeholder');

  	HeroInfoService.setInfo(infoClean);
    CalendarService.setHeroId(heroInfo.data.id);
    CalendarService.getSidebarData();

    CalendarService.startPoll(true);

    $scope.$on("$destroy", function() {
      CalendarService.pausePoll();
    });

  	//var p = RestService.getHero(heroInfo.data.id);
    //p.then(function(heroData){
    //  var hero = heroData.data;
    //  hero.photoUrl = "https://openmerchantaccount.com/img/nico.jpg";
    //  RestService.editHero(heroInfo.data.id, hero);
    //});

    // dati per il contact center
    if($state.includes('main.support')){
      self.heroInfo = infoClean;
    }

  }
