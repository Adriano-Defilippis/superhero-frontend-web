/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function UserCalendarService (
    $rootScope, $filter, RestService, NotifyService, $timeout, $q, Services
){
    "ngInject";

    var self = this,
        userCal,
        eventsFromServer;

    // Events model
    self.appointments = [];

    self.injectData = function(events){
      pushEventsInModel(events);
      eventsFromServer = events;
    }

    self.getData = function(){
      if(eventsFromServer) return eventsFromServer;
      else return [];
    }

    self.cancelEvent = function(userId, id){
      cancelEvent(userId, id);
    }

    self.setCalInstance = function(cal){
        userCal = cal;
    }

    function cancelEvent(userId, eventId){
      var ev = _.find(self.appointments, function(e){
        return e.id == eventId;
      });
      ev.stato = 'Cancellato';
      refreshCalendar();
    }

    function pushEventsInModel(events){
      if(events && _.isArray(events)){
        self.appointments.length = 0;
        events.forEach(function(event){
          self.appointments.push(formatEvent(event));
        });
        if(userCal)
        userCal.fullCalendar('refetchEvents');
      }
    };

    function reloadEvents(userId){
      var filters = {  dataInizioMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataInizioMax: moment().add(12, 'months').format('DDMMYYYY') };
      var dataP = RestService.getCustomerAppointments(userId, filters);
      dataP.then(function(data){
        eventsFromServer = data.data.plain();
        self.injectData(eventsFromServer);
      });
    }

    function formatEvent(event){
      if(event !== undefined){
        var formatted = {
          start: new Date(event.dataInizio),
          end: new Date(event.dataFine),
          type: Services.NumberById(event.tipoServizioId),
          id: event.id,
          stato: event.stato
        };
        return formatted;
      }
    };

    function refreshCalendar(){
      if(userCal) userCal.fullCalendar('refetchEvents');
    }

}
