'use strict';

export default function UserBaseController (
    $scope,$rootScope, $state, $interval, $timeout, RestService, LoginService, userInfo, User, UserCalendarService, customerAppointments, heroesList, carnetList, payments, feedbacks
) {
    "ngInject";

  	var self = this,
        pollingTimeout,
        pollingDelay = 20;

    if(!$rootScope.logged){
        $timeout(function(){
          LoginService.showLogin();
        }, 100);
      }

    var infoClean = _.cloneDeep(userInfo.data.plain());

  	User.info(infoClean);

    // Injects user appointments into calendar service
    UserCalendarService.injectData(customerAppointments.data.plain());
    User.injectHeroes(heroesList.data.plain());
    User.injectEvents(customerAppointments.data.plain());
    User.injectCarnetList(carnetList.data.plain());
    User.injectPayments(payments.data.plain());
    User.injectFeedback(feedbacks.data.plain());

    // start polling
    startPolling();

    $scope.$on("$destroy", function() {
      pausePolling();
    });

    function startPolling(force){
      if(force){
        $timeout(function(){
          getNewDataFromServer();
        });
      }

      pollingTimeout = $interval(function(){
        //$state.reload('main.user');
        getNewDataFromServer();
      }, 1000*pollingDelay);
    }

    function pausePolling(){
      $interval.cancel(pollingTimeout);
    }

    function getNewDataFromServer(){
      // get appintments
      var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
      var appoints = RestService.getCustomerAppointments(userInfo.data.plain().id, filters);
      appoints.then(function(data){
        UserCalendarService.injectData(data.data.plain());
        User.injectEvents(data.data.plain());
        return RestService.getCustomerHeroes(userInfo.data.plain().id);
      }).then(function(data){
        User.injectHeroes(data.data.plain());
        var carnetFilters = {  dataCreazioneMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataCreazioneMax: moment().add(12, 'months').format('DDMMYYYY') };
        return RestService.getCustomerCarnetList(userInfo.data.plain().id, carnetFilters);
      }).then(function(data){
        User.injectCarnetList(data.data.plain());
        return RestService.getCustomerPayments(userInfo.data.plain().id);
    }).then(function(data){
        User.injectPayments(data.data.plain());
    });
    }

    console.log($state.current.name);

    // dati per il contact center
    if(_.includes($state.current.name, 'main.support')){
      self.userInfo = User.info();
    }

    self.isApp = $rootScope.isApp;

 }
