'use strict';

export default function NavbarController (
    $scope, $state, $window, $rootScope, $stateParams, UserInfo, LoginService, AssetsStore
) {
    "ngInject";

    var self = this;

    $scope.navbarDynamicStyle = 'transparent';
    $scope.hiddenIfTop = '';

    var bnbMenuItems = [{
      state: 'main.guest.vantaggi',
      params: '',
      label: 'Vantaggi',
      style: 'underlined'
    },{
      state: 'booking.bnbHerosearch',
      params: '',
      label: 'I Nostri Supereroi'
    },{
      state: 'main.guest.welcome',
      params: '',
      class: 'hiddenTop',
      label: 'Servizi Privati'
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
      label: 'I Nostri Supereroi'
    }];

    self.isBnb = _.includes($state.current.url, 'BNB');

    self.menu = {}

    self.menu.items = standardMenuItems;

    if (self.isBnb) {
      self.menu.items = bnbMenuItems;
    }

    self.activeItem = function(item){
      if (item.item.state === 'main.guest.welcome' || item.item.state === 'main.guest.bnb') {
        $state.go(item.item.state, item.item.params, {reload: true});
      } else {
        $state.go(item.item.state, item.item.params);
      }
    };

    angular.element($window).bind("scroll", function(e) {
      if ($window.pageYOffset > 0) {
        $scope.navbarDynamicStyle = 'darken';
        $scope.hiddenIfTop = 'hiddenTop';
      }
      else {
        $scope.navbarDynamicStyle = 'transparent';
        $scope.hiddenIfTop = '';
      }
      $scope.visible = false;
      $scope.$apply();
    })

    self.isApp = false;

    if ($rootScope.isApp) {
      self.isApp = $rootScope.isApp;
    }

    // check if user comes from different origin
    if ($stateParams.ref === 'adword') {
        self.codiceSconto = 'PA1';
    } else if ($stateParams.ref === 'banner') {
        self.codiceSconto = 'PB1';
    } else if ($stateParams.ref === 'remarketing') {
        self.codiceSconto = 'PR1';
    } else if ($stateParams.ref === 'facebook') {
        self.codiceSconto = 'PF1';
    } else {
        self.codiceSconto = false;
    }

    var logout = {
      state: 'logout',
      params: '',
      label: 'Logout'
    }

    self.logo = {
      mainLogo : AssetsStore.Icon('badge.mainLogoWhite')
    };

    var userSubMenu = [{
      state: 'main.guest.static.about',
      params: '',
      label: 'Profilo'
    }];

    var heroSubMenu = [{
      state: 'main.hero.profile',
      params: '',
      label: 'Profilo'
    },{
      state: 'main.hero.index',
      params: '',
      label: 'Agenda'
    },{
      state: 'main.hero.zones',
      params: '',
      label: 'Zone disponibilità'
    },{
      state: 'main.hero.history',
      params: '',
      label: 'Storico Prenotazioni'
    },{
      state: 'main.hero.overview',
      params: '',
      label: 'Riepilogo'
    },{
      state: 'main.hero.carnet',
      params: '',
      label: 'Carnet associati'
    }];

    var clienteSubMenu = [{
      state: self.isBnb ? 'main.user.bnbIndex' : 'main.user.index',
      params: '',
      label: 'Bacheca'
    },{
      state: 'main.user.carnet',
      params: '',
      label: 'I miei Carnet'
    },{
      state: 'main.user.history',
      params: '',
      label: 'Storico appuntamenti'
    },{
      state: 'main.user.payments',
      params: '',
      label: 'Storico pagamenti'
  },{
    state: 'main.user.billings',
    params: '',
    label: 'Fatture'
  }];

    var adminSubMenu = [{
      state: 'main.hero.index',
      params: '',
      label: 'Agenda Supereroe'
    },{
      state: 'main.user.index',
      params: '',
      label: 'Bacheca Cliente'
    },{
      state: 'main.support.clienti',
      params: '',
      label: 'Contact Center'
    },{
      state: 'main.recruiter.applications',
      params: '',
      label: 'Recruiter'
    }];

    self.menu.servicesItems = [{
      state: 'main.guest.welcomeService',
      params: { servizio: 'colf' },
      label: 'Colf'
    },{
      state: 'main.guest.welcomeService',
      params: { servizio: 'badante' },
      label: 'Badante'
    },{
      state: 'main.guest.welcomeService',
      params: { servizio: 'baby-sitter' },
      label: 'Baby Sitter'
    }];

    self.subMenu = {
      active: false,
      items: [],
      userName: '',
      userPic: ''
    };

    self.goToHomePage = function () {
      $state.go('main.guest.welcome', {}, {reload: true});
    }

    var role = $rootScope.userRole;
    /*if(role === "recruiter") {
      self.menuItems.length = 0;
      self.menuItems.push({ state: 'recruiter.applications', params: '', label: 'Recruiter' });
    }

    if(role === "admin") {
      self.menuItems.push({ state: 'recruiter.applications', params: '', label: 'Area Recruiter' });
      self.menuItems.push({ state: 'hero.index', params: '', label: 'Area Hero' });
    }

    if(role === "superhero") {
      self.menuItems.length = 0;
      self.menuItems.push({ state: 'hero.index', params: '', label: 'Supereroe' });
    }*/

    if(role !== undefined && role !== "") {
        if(role === 'admin'){
          self.subMenu.active = true;
          self.subMenu.userName = 'Admin';
          self.subMenu.userPic = '';
          self.subMenu.items = adminSubMenu;
        }

      var userInfo = UserInfo.getInfo();
      if(userInfo !== null){
        self.subMenu.active = true;
        self.subMenu.userName = userInfo.nome; //+ ' ' + userInfo.cognome;
        self.subMenu.userPic = userInfo.photoUrl;
        if(role === 'superhero'){
          self.subMenu.items = heroSubMenu;
        } else if(role === 'cliente') {
          self.subMenu.items = clienteSubMenu;
        }
      }

      if(role === "recruiter") {
        self.menu.items.length = 0;
        self.menu.items.push({ state: 'main.recruiter.applications', params: '', label: 'Recruiter' });
      }

      if(role === "backoffice") {
        self.menu.items.length = 0;
        self.menu.items.push({ state: 'main.support.clienti', params: '', label: 'Contact Center' });
      }

      self.subMenu.items.push(logout)

    }

    self.isUser = $rootScope.userRole === 'cliente';
    self.isHero = $rootScope.userRole === 'superhero';
    self.isSpecial = $rootScope.userRole === 'recruiter' || $rootScope.userRole === 'backoffice';

    if(_.isArray(self.subMenu.items) && self.subMenu.items.length > 0)
      self.subMenu.active = true;
    else
      self.subMenu.active = false;

    self.showLoginForm = function(){
      LoginService.showLogin();
    }

  }
