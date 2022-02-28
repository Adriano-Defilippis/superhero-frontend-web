'use strict';

export default function HeroProfileDirective (
    User, AssetsStore, RestService, $ngRedux, BookingActions
) {
    "ngInject";

  return {
    restrict: 'A',
    scope: {
      hero: '='
    },
    template:
      '<div row column-sm fill class="my-heroes-single">'+
        '<div row fill>'+
          '<div class="width-45 center-sm">'+
            '<div class="profile-pic my-heroes-pic" fill style="background-image:url({{hero.image}})"></div>'+
          '</div>'+
          '<div class="center"><p class="no-margin all left-align center-sm hero-name">{{hero.nome}}<br>{{hero.cognome}}</p></div>'+
        '</div>'+
        '<div row fill>'+
          '<div class="center right-align width-60"><a class="waves-effect waves-light grey-text text-darken-3 white btn btn-small btn-flat" ng-click="showHeroProfile()">Scheda</a></div>'+
          '<div class="center right-align width-100"><a class="waves-effect waves-light grey-text text-darken-3 white btn btn-small btn-flat" ng-click="recall()">Richiama</a></div>'+
        '</div>'+
      '</div>',
    link: function(scope, element, attrs) {
      var width;

      scope.hero.image = scope.hero.photoUrl ? scope.hero.photoUrl : AssetsStore.Image('user.placeholder');

      scope.showHeroProfile = function(){
        User.showHeroProfile(scope.hero);
      }

      scope.recall = function(){
        var heroInfo = RestService.getHero(scope.hero.id);
        heroInfo.then(function(info){
          $ngRedux.dispatch(BookingActions.startBookingAndSelectHero(info.data.plain()));
        });

      }

      function updateHeight(width){
        element.find('.profile-pic').css({height: width});
      }
    }
  }
}
