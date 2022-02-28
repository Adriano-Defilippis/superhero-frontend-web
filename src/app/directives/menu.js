'use strict';

export default function MenuDirective (
    LoginService
) {
    "ngInject";

  return {
    restrict: 'E',
    scope: {
      items: '=items',
      userMenu: '=userMenu'
    },
    template: `
        <ul>
          <li ng-repeat="item in menuCtrl.menuItems track by item.state" id="menuItem{{this.$index}}" class={{item.style}} ng-class={{item.class}}>
            <a ng-click="menuCtrl.activeItem(this)">{{item.label}}</a>
          </li>
          <li ng-show="!menuCtrl.subMenu.active" class="center" style="display: flex;">
            <img style='margin: auto;' src='assets/images/login-icon.png'/>
            <a ng-click="menuCtrl.showLoginForm()" ng-hide="menuCtrl.isSpecial">Login</a>
          </li>
          <li ng-show="menuCtrl.subMenu.active" data-activates="userMenuDropdown" dropdown data-hover="true" class="user-menu center" constrain_width="true" data-beloworigin="true">
            <a><div class="profile-pic" ng-style="{ 'background-image': 'url(\\''+menuCtrl.subMenu.userPic+'\\')'}"></div>{{ menuCtrl.subMenu.userName }}</a>
          </li>
          <ul id="userMenuDropdown" class="dropdown-content user-menu-dropdown">
            <li ng-repeat="item in menuCtrl.subMenu.items"><a ui-sref="{{item.state}}({{item.params}})">{{item.label}}</a></li>
          </ul>
          <li class="center">
              <a ui-sref="main.guest.contacts"><img style='margin-top: 8px;' src='assets/images/header-phone.png'/></a>
          </li>
        </ul>
    `,
    controller: ['$scope', '$rootScope', '$element', '$state', '$timeout', function($scope, $rootScope, $element, $state, $timeout) {

    	var el = $element,
    		self = this,
        currentSelected = 0,
        firstRun = true,
        inkbar = angular.element($($element).find('menu-inkbar')),
        menuItemsUl = angular.element($($element).find('ul')[0]),
        menuWrapperWidth = 0;

      var bnbMenuItems = [{
        state: 'main.guest.vantaggi',
        params: '',
        label: 'Vantaggi',
        style: 'underlined'
      },{
        state: 'booking.bnbHerosearch',
        params: '',
        label: 'I Nostri Professionisti'
      },{
        state: 'main.guest.welcome',
        params: '',
        class: 'hiddenTop',
        label: 'Servizi Privati'
      },{
        state: '',
        params: '',
        class: 'hiddenTop',
        label: 'Condizioni d\'uso'
      }];

      var standardMenuItems = [{
        state: 'main.guest.vantaggi',
        params: '',
        label: 'Vantaggi',
        style: 'underlined'
      },{
        state: 'main.guest.prices',
        params: '',
        label: 'Tariffe'
      },{
        state: 'booking.herosearch',
        params: '',
        label: 'I Nostri Professionisti'
      },{
        state: '',
        params: '',
        class: 'hiddenTop',
        label: 'Condizioni d\'uso'
      }];

      self.showLoginForm = function(){
        LoginService.showLogin();
      }

      self.isUser = $rootScope.userRole === 'cliente';

      self.isSpecial = $rootScope.userRole === 'recruiter' || $rootScope.userRole === 'backoffice';

      self.menuItems = standardMenuItems;

      if (_.includes($state.current.url, 'BNB')) {
        self.menuItems = bnbMenuItems;
      }

      self.subMenu = $scope.userMenu; // binding items to controller

      if(_.isArray(self.subMenu.items) && self.subMenu.items.length > 0)
        self.subMenu.active = true;
      else
        self.subMenu.active = false;



      /*$timeout(function(){
        menuWrapperWidth = $element.width();
        getCurrent(); // finds the current element when page is loading
        activeItem(currentSelected);
        firstRun = false;
      });*/

      self.activeItem = function(item){
        if (item.item.state === 'main.guest.welcome' || item.item.state === 'main.guest.bnb') {
          $state.go(item.item.state, item.item.params, {reload: true});
        } else {
          $state.go(item.item.state, item.item.params);
        }
      };
    }],
    controllerAs: 'menuCtrl'
  };
}
