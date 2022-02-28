'use strict';

export default function HeroOverviewController (
    $scope, heroStats, history, AssetsStore
){
    "ngInject";

    var self = this;

    // filter by date (only int he past)
    var now = new Date().getTime();
    self.isInPast = function(date){
      if(date.stato == 'Confermato')
        return date.dataInizio < now;
      else (date.stato == 'Cancellato' || date.stato == 'CancellatoPostModifica')
        return true;
    }

    // filters for formatting
    self.dataInizio = function(dataInizio){
      return moment(dataInizio).format('dd/MM');
    }

    // assests
    self.assets = {
      customers: AssetsStore.Icon('overviewBox.customers'),
      money: AssetsStore.Icon('overviewBox.money'),
      time : AssetsStore.Icon('overviewBox.time')
    };

    // model-view
    self.mv = {
      stats: heroStats.data.plain(),
      reservations: [],
      prenotazioniCounter: 0
    };

    // cleaning data in model
    var cleanData = [];
    history.data.plain().forEach(function(ev){
      ev.statoSigla = ev.stato.substring(0,1);

      ev.statoIcon = 'mdi-navigation-check';
      ev.statoLabel = 'Pagato';

      if(ev.stato == 'CancellatoPostModifica'){
        ev.statoIcon = 'mdi-action-schedule';
        ev.statoLabel = 'Modificato';
      } else if(ev.stato == 'Cancellato'){
        ev.statoIcon = 'mdi-notification-do-not-disturb';
        ev.statoLabel = 'Cancellato';
      } else if(ev.stato == 'ErrorePagamento'){
        ev.statoIcon = 'mdi-navigation-check';
        ev.statoLabel = 'Pagato';
      }

      if(self.isInPast(ev) && (ev.stato == 'Pagato' || ev.stato == 'Cancellato' || ev.stato == 'CancellatoPostModifica' || ev.stato == 'ErrorePagamento')) {
        cleanData.push(ev);
        self.mv.prenotazioniCounter += 1;
      }
    });
    self.mv.reservations.push.apply(self.mv.reservations, cleanData);

  }
