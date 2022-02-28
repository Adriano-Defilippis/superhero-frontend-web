'use strict';

export default function UserHistoryController (
    $scope, customerAppointments, CalendarService, Services, User
){
    "ngInject";

    var self = this;


    var now = new Date().getTime();
    self.isInPast = function(ev){
      if(ev.stato == 'Confermato' ||  ev.stato == 'Pagato' || ev.stato == 'ErrorePagamento')
        return ev.dataInizio < now;
      else if(ev.stato == 'Cancellato' || ev.stato == 'CancellatoPostModifica')
        return true;
      else return false;
    }

    self.prenotazioniCounter = 0;

    var cleanData = [];
    customerAppointments.data.plain().forEach(function(ev){
      ev.dataFormatted = moment(ev.dataInizio).format('DD/MM/YYYY');
      ev.dataInizioFormatted = moment(ev.dataInizio).format('HH:mm');
      ev.dataFineFormatted = moment(ev.dataFine).format('HH:mm');
      ev.importo = ev.importo ? ev.importo : 0;
      ev.servizioLabel = Services.Label(ev.tipoServizioId);

      ev.statoIcon = 'mdi-action-done-all';
      ev.spesaFinale = ev.costoPrestazioneScontata ? ev.costoPrestazioneScontata : ev.costoPrestazione;
      ev.statoLabel = 'Eseguito e Pagato';

      if(ev.stato == 'Confermato'){
        ev.statoLabel = 'In attesa di esecuzione e pagamento';
        ev.statoIcon = 'mdi-navigation-check';
      }

      if(ev.stato == 'CancellatoPostModifica'){
        ev.statoIcon = 'mdi-action-schedule';
        ev.spesaFinale = ev.costoPenaleModifica;
        ev.statoLabel = 'Modificato';
      } else if(ev.stato == 'Cancellato'){
        ev.statoIcon = 'mdi-navigation-cancel';
        ev.spesaFinale = ev.costoPenaleCancellazione;
        ev.statoLabel = 'Cancellato';
      } else if(ev.stato == 'ErrorePagamento'){
        ev.statoIcon = 'mdi-action-report-problem';
        ev.statoLabel = 'Errore Pagamento';
      }

      ev.hasInfo = false;
      if(ev.stato == 'Pagato' || ev.stato == 'Confermato' || ev.stato == 'ErrorePagamento'){
        ev.hasInfo = true;
      }

      if(self.isInPast(ev) && (ev.stato == 'Pagato' || ev.stato == 'Cancellato' || ev.stato == 'CancellatoPostModifica' || ev.stato == 'ErrorePagamento')){
        cleanData.push(ev);
        self.prenotazioniCounter += 1;
      }
    });

    self.appuntamenti = [];
    self.appuntamenti.push.apply(self.appuntamenti, cleanData);

    self.showInfo = function(id){
      User.showAppointmentDetail(id);
    }

}
