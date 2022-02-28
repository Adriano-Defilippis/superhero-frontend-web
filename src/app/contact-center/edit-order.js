'use strict';

export default function ContactCenterEditOrderController (
    $scope, order, AssetsStore, Services, ContactCenter, OrdersUtilities
) {
    "ngInject";

  	var self = this;

    self.order = order.data.plain();
    cleanOrderData(self.order);

    function cleanOrderData(a){
      // clean data function
      // Dati cliente
      a.cliente.photoUrl = a.cliente.photoUrl ? a.cliente.photoUrl : AssetsStore.Image('user.placeholder');
      a.cliente.nomeCompleto = a.cliente.nome + ' ' + a.cliente.cognome;
      // Dati supereroe
      if (a.superHero) {
          a.superHero.photoUrl = a.superHero.photoUrl ? a.superHero.photoUrl : AssetsStore.Image('user.placeholder');
          a.superHero.nomeCompleto = a.superHero.nome + ' ' + a.superHero.cognome;
      }

      // labels
      a.labels = {}

      // stato
      if(a.stato == 'Immesso') a.labels.stato = 'Non ancora confermato da Adyen (immesso)';
      if(a.stato == 'NonAutorizzato') a.labels.stato = 'Non autorizzato da adyen';
      if(a.stato == 'Chiuso') a.labels.stato = 'Chiuso (ordine processato correttamente)';

      // Importo ordine
      a.labels.importoOrdine = a.costo;

      // Importo fattura
      if(a.stato == 'Aperto') a.labels.importoFattura = 'Non disponibile';
      if(a.stato == 'Confermato') a.labels.importoFattura = 'Non disponibile';
      if(a.stato == 'Pagato' && a.costoPrestazioneScontata > 0) a.labels.importoFattura = a.costoPrestazioneScontata;
      if(a.stato == 'Pagato' && a.costoPrestazioneScontata <= 0) a.labels.importoFattura = a.costoPrestazione;
      if(a.stato == 'Cancellato') a.labels.importoFattura = a.costoPenaleCancellazione;
      if(a.stato == 'CancellatoPostModifica') a.labels.importoFattura = a.costoPenaleModifica;
      if(a.stato == 'CancellatoAmministrativamente') a.labels.importoFattura = 0;
      if(a.stato == 'SuperHeroNotFound') a.labels.stato = 'Non disponibile';
      if(a.stato == 'ErrorePagamento') a.labels.stato = 'Non disponibile';

      if(a.stato != 'Aperto' && a.stato != 'Confermato' && a.stato != 'SuperHeroNotFound' && a.stato != 'ErrorePagamento') a.labels.importoFattura += '€';

      if(a.costoPrestazioneScontata > 0) a.labels.importoSconto = a.importoPrestazione - a.importoPrestazioneScontata;

      if(a.costoPenaleCancellazione > 0) a.labels.penaleCanc = a.costoPenaleCancellazione;
      if(a.costoPenaleModifica > 0) a.labels.penaleMod = a.costoPenaleModifica;

      // Tipolgia
      a.labels.tipologia = OrdersUtilities.getTypeLabel(a.tipo);

      // indirizzi
      var indirizzoTemplate = _.template('<%= via %> <%= civico %>, <%= cap %>, <%= citta %> (<%= prov %>)');

      if (a.appuntamenti && a.appuntamenti.length > 0) {
          a.labels.indirizzoPrestazione = indirizzoTemplate({
            via: a.appuntamenti[0].indirizzoPrestazione.via,
            civico: a.appuntamenti[0].indirizzoPrestazione.numeroCivico,
            cap: a.appuntamenti[0].indirizzoPrestazione.cap,
            citta: a.appuntamenti[0].indirizzoPrestazione.citta,
            prov: a.appuntamenti[0].indirizzoPrestazione.provincia,
          });
      }

    }

  }
