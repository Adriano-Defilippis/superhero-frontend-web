/* globals jsPDF: true */

'use strict';

export default function BillingController (
      $scope, $log, billingInfo, servicesList, $rootScope, $timeout, LoginService, Services
  ){
      "ngInject";

      $log.debug('[BILLING_CTRL] Initilize');

      var ctrl = this;

      ctrl.isApp = $rootScope.isApp;

      if (!_.isEmpty(servicesList)) {

        Services.loadData(servicesList);
      }

      if(!$rootScope.logged){
        $timeout(function(){
          LoginService.showLogin();
        }, 100);
      }
      else {
        ctrl.billingInfo = billingInfo.data.plain();
        ctrl.billingInfo.importoVoucher = 0;

        $log.debug('[BILLING_PAGE] Billing info is:', billingInfo.data.plain());

        // calcolo importo finale scontato, sommando gli sconti delle voci in fattura
        var importoVoucherFinale = 0;
        ctrl.billingInfo.vociInFattura.forEach(function (v) {
          // se importo finale scontato è maggiore di importo finale allora c'è una maggiorazione
          if (v.costoFinaleScontato > v.costoFinale) v.costoFinale = v.costoFinaleScontato;
          // calcolo sconto per ogni voce fattura
          importoVoucherFinale += (v.costoFinale - v.costoFinaleScontato);
          // trim del idAppuntamento della voce in fattura
          if (typeof v.idAppuntamento !== 'undefined' && v.idAppuntamento !== null) {
            v.idAppuntamentoShort = v.idAppuntamento.slice(-6);
          }
        });
        ctrl.billingInfo.vociInFattura = _.orderBy(ctrl.billingInfo.vociInFattura, voce => voce.durataMinuti).reverse();
        ctrl.billingInfo.importoVoucher = importoVoucherFinale;
        console.log('[BILLING_INFO]', ctrl.billingInfo, importoVoucherFinale);

        // trim dei codici ordine e cliente
        ctrl.billingInfo.idOrdineShort = (typeof ctrl.billingInfo.idOrdine === 'undefined' || ctrl.billingInfo.idOrdine === null) ? '' : ctrl.billingInfo.idOrdine.slice(-6);
        ctrl.billingInfo.destinatario.codiceIdShort = (typeof ctrl.billingInfo.destinatario.codiceId === 'undefined' || ctrl.billingInfo.destinatario.codiceId === null) ? '' : ctrl.billingInfo.destinatario.codiceId.slice(-6);
      }

      // prezzo finale da pagare, applica il voucher se è presente
      ctrl.prezzoDaPagare = function (conVoucher)
      {

          if (typeof conVoucher === 'undefined') conVoucher = true;

          var finalCost = 0;

          if ( !_.isNumber(ctrl.billingInfo.importoVoucher) || ctrl.billingInfo.importoVoucher < 0.1 ) ctrl.billingInfo.importoVoucher = 0;

          ctrl.billingInfo.vociInFattura.forEach(function (voce) {
              finalCost += voce.costoFinale;
          });

          if (conVoucher) return finalCost - ctrl.billingInfo.importoVoucher;
          return finalCost;
      }

      ctrl.ivaApplicata = function (conVoucher)
      {
          var prezzoFinale = ctrl.prezzoDaPagare(conVoucher);
          var percentualeIva = ctrl.billingInfo.intestatario.aliquotaIva;

          if (!ctrl.isCarnetInvoice() && prezzoFinale && percentualeIva) {
              var valoreIvaApplicata = prezzoFinale / (100 + percentualeIva) * percentualeIva;
              return valoreIvaApplicata;
          } else {
              return 0;
          }
      }

      ctrl.subtotalePreIva = function (conVoucher)
      {
          var prezzoDaPagare = ctrl.prezzoDaPagare(conVoucher);
          var ivaApplicata = ctrl.ivaApplicata(conVoucher);
          return prezzoDaPagare - ivaApplicata;
      }

      ctrl.rivalsaApplicata = function (conVoucher)
      {
          var subtotalePreIva = ctrl.subtotalePreIva(conVoucher);
          var percentualeRivalsa = ctrl.billingInfo.intestatario.rivalsa;

          if (subtotalePreIva && percentualeRivalsa > 0) {
              var valoreRivalsaApplicata = subtotalePreIva / (100 + percentualeRivalsa) * percentualeRivalsa;
              return valoreRivalsaApplicata;
          } else {
              return 0;
          }
      }

      ctrl.imponibile = function (conVoucher)
      {
          var subtotalePreIva = ctrl.subtotalePreIva(conVoucher);
          var rivalsaApplicata = ctrl.rivalsaApplicata(conVoucher);

          return subtotalePreIva - rivalsaApplicata;

      }

      ctrl.valoreVoucherSenzaTasse = function ()
      {
          var imponibileSenzaVoucher = ctrl.imponibile(false);
          var imponibileConVoucher = ctrl.imponibile(true);

          return imponibileSenzaVoucher - imponibileConVoucher;
      }

      ctrl.costoSingolaVoce = function (prezzo)
      {
          var imponibileSenzaVoucher = ctrl.imponibile(false);
          var prezzoDaPagareSenzaVoucher = ctrl.prezzoDaPagare(false);

          var ratio = imponibileSenzaVoucher / prezzoDaPagareSenzaVoucher;

          return prezzo * ratio;
      }


      ctrl.getFinalPrice = function ()
      {
          var finalCost = 0;

          ctrl.billingInfo.vociInFattura.forEach(function (voce) {
              finalCost += voce.costoFinale;
          });

          return finalCost;
      }

      ctrl.getVatAmount = function ()
      {
          var costoFinale = ctrl.getFinalPrice();
          var vatPerc = ctrl.billingInfo.intestatario.aliquotaIva;
          if (costoFinale && vatPerc && !ctrl.isCarnetInvoice()) {
              var vatAmount = costoFinale / (100 + vatPerc) * vatPerc;
              return vatAmount;
          } else {
              return 0;
          }

      }

      ctrl.getPreVat = function ()
      {
          var costoFinale = ctrl.getFinalPrice();
          var vatValue = ctrl.getVatAmount();
          if (costoFinale) {
              return costoFinale - vatValue;
          } else {
              return 0;
          }

      }

      ctrl.getDutyAmount = function ()
      {
          var dutyPerc = ctrl.billingInfo.intestatario.rivalsa;
          var preVat = ctrl.getPreVat();
          if(dutyPerc && preVat > 0) {
              return preVat / (100 + dutyPerc) * dutyPerc;
          } else {
              return 0;
          }
      }

      ctrl.getInitial = function ()
      {
          var preVat = ctrl.getPreVat();
          var dutyAmount = ctrl.getDutyAmount();
          return preVat - dutyAmount;
      }

      ctrl.getServiceName = function () {
        return Services.Label(ctrl.billingInfo.idTipoServizio);
      }

      ctrl.showVat = function ()
      {
          return ctrl.getVatAmount() > 0;
      }

      ctrl.showDuty = function ()
      {
          return ctrl.getDutyAmount() > 0;
      }

      ctrl.showSubtotal = function ()
      {
          return ctrl.showDuty() && ctrl.showVat();
      }

      ctrl.getSingleCost = function (price)
      {
          var finalPrice = ctrl.getFinalPrice();
          var preTaxPrice = ctrl.getInitial();
          var ratio = finalPrice / preTaxPrice;
          return price / ratio;
      }

      ctrl.showReverseCharge = function ()
      {
          var isColfService = ctrl.billingInfo.idTipoServizio === 'TS-0000-0000-0000-0003';
          var isVatClient = !ctrl.billingInfo.destinatario.privato;
          var isCompany = _.includes(['ImpresaIndividuale', 'Societa'], ctrl.billingInfo.intestatario.modalitaOperativa);
          return  isCompany && isColfService && isVatClient;
      }

      ctrl.showExcludeVat = function ()
      {
          return ctrl.billingInfo.intestatario.aliquotaIva === 0 && ctrl.billingInfo.intestatario.esenteIva;
      }

      ctrl.showExcludeVatFisio = function ()
      {
          return ctrl.billingInfo.intestatario.aliquotaIva === 0 && ctrl.billingInfo.intestatario.esenteIvaFisioterapista;
      }

      ctrl.isNewTemplate = function () 
      {
        const invoiceDate = moment(ctrl.billingInfo.dataFattura);
        const hardcodedProdDate = moment("2016-11-07");

        return invoiceDate.isAfter(hardcodedProdDate) && ctrl.billingInfo.idTipoServizio;
      }

      ctrl.showDuration = function ()
      {
          var mustShow = false;
          ctrl.billingInfo.vociInFattura.forEach(function (voce) {
              if (voce.durataMinuti && voce.durataMinuti > 0) mustShow = true;
          });
          if (isFatturaCancellazione() || isFatturaModifica()) mustShow = false;
          return mustShow;
      }

      ctrl.showIdCode = function () {
          return !isFatturaModifica();
      }

      ctrl.tableColumns = function () {
          var baseColumns = 2;
          if (ctrl.showDuration()) baseColumns++;
          if (ctrl.showIdCode()) baseColumns++;
          if (ctrl.isNewTemplate()) baseColumns ++;
          return baseColumns;
      }

      ctrl.showVoucherBlock = function ()
      {
          if (ctrl.billingInfo.importoVoucher && ctrl.billingInfo.importoVoucher > 0) return true;
          else return false;
      }

      ctrl.getVoucherPreTax = function ()
      {
          var voucherApplied = calculatePreTaxVoucherApplied(ctrl.getFinalPrice(), ctrl.billingInfo.importoVoucher, ctrl.getPreVat() - ctrl.getDutyAmount());
          return ctrl.getPreVat() - voucherApplied;
      }

      ctrl.getVoucherAppliedPreTax = function ()
      {
          return ctrl.getInitial() - ctrl.getVoucherPreTax();
      }

      ctrl.getVoucherAppliedPostTax = function ()
      {
          return ctrl.getFinalPrice() - ctrl.billingInfo.importoVoucher;
      }

      ctrl.getVoucherAppliedVatAmount = function ()
      {
          var costoFinale = ctrl.getVoucherAppliedPreTax();
          var vatPerc = ctrl.billingInfo.intestatario.aliquotaIva;
          if (costoFinale && vatPerc) {
              var vatAmount = costoFinale * (vatPerc/100)
              return vatAmount;
          } else {
              return 0;
          }
      }

      ctrl.getVoucherAppliedPreVat = function ()
      {
          var costoFinale = ctrl.getVoucherAppliedPostTax();
          var vatValue = ctrl.getVoucherAppliedVatAmount();
          if (costoFinale) {
              return costoFinale - vatValue;
          } else {
              return 0;
          }

      }

      ctrl.getDutyAmountWithVoucher = function ()
      {
          var dutyPerc = ctrl.billingInfo.intestatario.rivalsa;
          var preVat = ctrl.getVoucherAppliedPreTax();
          if(dutyPerc && preVat > 0) {
              return preVat / (100 + dutyPerc) * dutyPerc;
          } else {
              return 0;
          }
      }

      ctrl.getTipoOperazione = function(tipo) {
          if(tipo === 'Appuntamenti') return 'prenotazione semplice';
          if(tipo === 'AppuntamentiCarnet') return 'prenotazione su base carnet';
          if(tipo === 'AppuntamentiNominale') return 'prenotazione nominale';
          if(tipo === 'ModificaAppuntamento') return 'modifica prenotazione semplice';
          if(tipo === 'ModificaAppuntamentoCarnet') return 'modifica prenotazione su base carnet';
          if(tipo === 'ModificaAppuntamentoNominale') return 'modifica prenotazione nominale';
          if(tipo === 'Cancellato') return 'cancellazione';
      }

      ctrl.isSocieta = function (attore) {
          if (attore.modalitaOperativa === 'Societa' || attore.modalitaOperativa === 'EnteAssociazione') return true;
          return false;
      }

      ctrl.isImpresaIndividuale = function (attore) {
          if (attore.modalitaOperativa === 'ImpresaIndividuale') return true;
          return false;
      }

      ctrl.isThirdPartyAddress = function (attore) {
          return attore.modalitaOperativa === 'TerzeParti';
      }

      ctrl.isCarnetInvoice = function () {
        return ctrl.billingInfo.tipoFattura === 'Carnet';
      }

      ctrl.isOccasionalInvoice = function () {
        return ctrl.billingInfo.codiceFatturaCompleto && ctrl.billingInfo.codiceFatturaCompleto.indexOf('DHN') > -1;
      }

      ctrl.printOrSave = function() {
          window.print();
      }

      function isFatturaCancellazione (){
          return ctrl.billingInfo.tipologiaOperazione === 'Cancellato';
      }

      function isFatturaModifica () {
          return ctrl.billingInfo.tipologiaOperazione === 'ModificaAppuntamento' || ctrl.billingInfo.tipologiaOperazione === 'ModificaAppuntamentoCarnet' ||ctrl.billingInfo.tipologiaOperazione === 'ModificaAppuntamentoNominale';
      }

      $scope.letterHead = 'Milano';
      $scope.regimeMinimi = 'Operazione senza applicazione dell\'Iva ai sensi dell\'articolo 27, commi 1 e 2, D.L. n. 98 del 6 luglio 2011 e successive modificazioni.<br>'+
          'Regime fiscale di vantaggio per l\'imprenditoria giovanile e per i lavoratori autonomi in mobilità previsto dall\'art. 27 commi 1 e 2 del D.L. 6 luglio 2011 n. 98.<br>'+
          'Non soggetta a ritenuta d\'acconto ai sensi dell\'art. 27 del D.L. del 6 luglio 2011 n. 98.<br>'+
          'Provvedimento dell\'Agenzia delle Entrate N. 185820/2011.';
      $scope.regimeForfettario = 'Operazione effettuata ai sensi dell’art. 1, commi da 54 a 89 della Legge n. 190/2014 – Regime forfettario';
      $scope.reverseCharge = 'Reverse charge ai sensi dell’art. 17 comma 6 lettera a) –ter, DPR n.633/72';
      $scope.excludeVat = 'Fattura esente IVA ai sensi dell\'art.10 dpr 633/72';
      $scope.excludeVatFisio = 'Fattura esente IVA ai sensi dell\'art.10, comma 1 n. 18), D.P.R. 633/1972';
      $scope.noVATZone = 'Operazione fuori campo IVA ex Art. 2, DPR 633/72';
      $scope.occasionalInvoice = 'La prestazione é di natura occasionale ed é esclusa dall’applicazione dell’IVA (art. 5 del D.P.R. n. 633 del 26 ottobre 1972).<br>'+
          'Con riferimento ai redditi percepiti nel ' + moment(ctrl.billingInfo.dataFattura).format('YYYY') + ', il prestatore d’opera dichiara di non aver superato il limite di reddito di 5.000 euro che, ai sensi dell’articolo 44 della legge 326/2003, comporta l’iscrizione alla gestione separata Inps';

      if (ctrl.isNewTemplate()) {
        $scope.voucherIntro = 'L’importo imponibile, dedotto da valore del voucher concesso da Digital Heroes SrL, è pari al totale pagato dal Cliente, come indicato di seguito:';
      } else {
        $scope.voucherIntro = 'L’importo imponibile, dedotto da valore del voucher concesso da Digital Heroes SrL a titolo gratuito, è pari al totale pagato dal Cliente, come indicato di seguito:';
      }

      if (ctrl.isOccasionalInvoice()) {
        $scope.paymentNote = 'Il corrispettivo sarà addebitato secondo il metodo di pagamento selezionato. Non è necessario effettuare alcun pagamento in seguito a questa nota.';
      } else {
        $scope.paymentNote = 'Il corrispettivo sarà addebitato secondo il metodo di pagamento selezionato. Non è necessario effettuare alcun pagamento in seguito a questa fattura.';
      }

      // FAKE DATA


      function calculatePreTaxVoucherApplied (finalPrice, voucherAmount, finalPricePreTax)
      {
          var preTaxVoucherApplied = finalPricePreTax * (finalPrice - voucherAmount) / finalPrice;
          return preTaxVoucherApplied;
      }

  }
