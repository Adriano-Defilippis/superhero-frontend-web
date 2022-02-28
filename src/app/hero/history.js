'use strict';

export default function HeroHistoryController (
    $scope, history, CalendarService
){
    "ngInject";

    var self = this;

    self.showInfo = function(id){
      CalendarService.showAppointmentDetail(id);
    }

    var now = new Date().getTime();
    self.isInPast = function(date){
      if(date.stato == 'Confermato')
        return date.dataInizio < now;
      else (date.stato == 'Cancellato' || date.stato == 'CancellatoPostModifica')
        return true;
    }

    self.prenotazioniCounter = 0;

    var cleanData = [];
    history.data.plain().forEach(function(ev){
      ev.model = {
        orarioLabel: moment(ev.dataInizio).format('DD/MM/YYYY | HH:mm')+ ' - ' + moment(ev.dataFine).format('HH:mm'),
        servizio: CalendarService.getServiceName(ev.tipoServizioId)
      }
      // tipo appuntamento // Appuntamenti|ModificaAppuntamento|AppuntamentiCarnet|Carnet|AppuntamentiNominale|ModificaAppuntamentoCarne
      var modalita = '';
      if(ev.tipo = "Appuntamenti") modalita = "Semplice";
      if(ev.tipo = "ModificaAppuntamento" || ev.tipo == 'ModificaAppuntamentoCarnet') modalita = "Modificato";
      if(ev.tipo = "AppuntamentiCarnet") modalita = "Carnet";
      if(ev.tipo = "AppuntamentiNominale") modalita = "Nominale";
      if(ev.tipo = "AppuntamentiNominale" && ev.recall) modalita = "Recall";

      ev.modalita = modalita;

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
        self.prenotazioniCounter += 1;
      }
    });

    self.prenotazioni = [];
    self.prenotazioni.push.apply(self.prenotazioni, cleanData);

  }
