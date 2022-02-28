'use strict';

export default function CcAppointmentsPageController (
      $scope, appointments, $timeout, $stateParams, $state
  ) {
      "ngInject";

  	var self = this;

    var timers = [];

    self.activeStato = $stateParams.stato;
    self.activeButton = 'main-orange white-text';
    self.inactiveButton = 'white';

    if(!self.activeStato) self.activeStato = 'DaConfermare';

    self.inactiveApps = self.activeApps = self.expiredApps = self.doneApps = self.cancelledApps = self.errorApps = false;

    // check which butotn is active
    if(self.activeStato === 'DaConfermare'){
      self.inactiveApps = true;
  } else if(self.activeStato === 'Confermati'){
      self.activeApps = true;
  } else if(self.activeStato === 'Effettuati'){
      self.doneApps = true;
  } else if(self.activeStato === 'Scaduti'){
      self.expiredApps = true;
  } else if(self.activeStato === 'Cancellati') {
      self.cancelledApps = true;
  } else if(self.activeStato === 'Errore') {
      self.errorApps = true;
    }

    // Decorate the model of appointments
    self.appointments = _.filter(appointments.data.plain(), function(a){
      return a.stato !== 'Immesso';
    });
    self.appointments = _.orderBy(self.appointments, 'dataPrenotazione',['desc']);    


    cleanData(self.appointments);

    // Appointments done filter
    self.appDone = function(app){
      return app.stato === 'Pagato';
    }

    // Appointments confirmed filter
    self.appConfirmed = function(app){
      return app.stato === 'Confermato';
    }

    // appuntamenti scaduti
    self.appExpired = function(app){
      return app.stato === 'SuperHeroNotFound';
    }

    // Appointments confirmed filter
    self.appToConfirm = function(app){
      return app.stato === 'Aperto';
    }

    // appoints cancelled filter
    self.appCancelled = function(app){
      return app.stato === 'Cancellato' || app.stato === 'CancellatoPostModifica' || app.stato === 'CancellatoAmministrativamente';
    }

    self.appError = function(app) {
      return app.stato === 'ErrorePagamento'
    }

    self.filterTable = function(app){
      if(self.activeStato && self.activeStato === 'Effettuati') return self.appDone(app);
      else if(self.activeStato && self.activeStato === 'DaConfermare') return self.appToConfirm(app);
      else if(self.activeStato && self.activeStato === 'Confermati') return self.appConfirmed(app);
      else if(self.activeStato && self.activeStato === 'Scaduti') return self.appExpired(app);
      else if(self.activeStato && self.activeStato === 'Cancellati') return self.appCancelled(app);
      else if(self.activeStato && self.activeStato === 'Errore') return self.appError(app);
    }

    function cleanData(apps){
      var now = new Date();
      apps.forEach(function(a){
        a.dataCreazione = moment(a.dataPrenotazione).format('DD/MM/YY - HH:mm');
        a.scadenza = ((a.dataPrenotazione + 4*60*60*1000) - now.getTime())/1000/60/60;
        a.scadenzaCountdown = new Countdown(((a.dataPrenotazione + 4*60*60*1000)-now.getTime())/1000, function(seconds) {
          var timer = $timeout(function(){
            var secs = parseInt(seconds);
            var mins = parseInt(secs/60);
            var hours = parseInt(mins/60);
            var string = '';
            if(hours > 0) string += hours+' h ';
            if(mins > 0) string += (mins%60)+' m';
            a.scadenzaLabel = string; //log the number of seconds that have passed
          });
        }, function(){});

        timers.push(a.scadenzaCountdown);

          //=> '30 years, 10 months, 14 days, 1 hour, 8 minutes, and 14 seconds'
// moment().to(a.dataCreazione + 4*60*60*1000);
        a.dettagli = ''+moment(a.dataInizio).format('DD/MM/YY | HH:mm')+' -> '+moment(a.dataFine).format('HH:mm');

        a.statoLabel = a.stato;
        if(a.stato === 'CancellatoAmministrativamente') a.statoLabel = "Cancellato (AMM)"
        if(a.stato === 'CancellatoPostModifica') a.statoLabel = "Cancellato (mod)"
        if(a.stato === 'SuperHeroNotFound') a.statoLabel = "SH non trovato"
      });
    }
  }
