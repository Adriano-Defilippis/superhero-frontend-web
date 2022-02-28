'use strict';

export default function HeroSidebarController (
    $scope, $timeout, CalendarService
) {
    "ngInject";

  	var self = this;

    self.requests = CalendarService.events.sidebar.req;
    self.confirmed = CalendarService.events.sidebar.res;

    self.counters = {
      req: 0,
      conf: 0
    }

    self.confirmRequest = function(id){
      CalendarService.confirmRequest(id, true);
    }

    self.showInfo = function(id){
      CalendarService.showAppointmentDetail(id);
    }

    self.requestFilter = function(request) {
      return request.dataInizio >= new Date().getTime() && request.stato === "Confermato";
    }

    $scope.$watch(function() { return self.requests.length; },
      function() {
        $timeout(function(){
          calculateCounters();
        });
      });

    $scope.$watch(function() { return self.confirmed.length; },
      function() {
        $timeout(function(){
          calculateCounters();
        });
      });

    function calculateCounters(){
      var counter = 0;
      self.requests.forEach(function(single){
        if(single.dataInizio >= new Date().getTime())
          counter += 1;
      });
      self.counters.req = counter;

      var counterConfirmed = 0;
      self.confirmed.forEach(function(single){
        if(single.dataInizio >= new Date().getTime() && single.stato == "Confermato")
          counterConfirmed += 1;
      });
      self.counters.conf = counterConfirmed;
    }


  }
