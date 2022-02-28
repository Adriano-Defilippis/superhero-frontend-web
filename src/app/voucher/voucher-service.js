/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function VoucherService (
    ngDialog
){
    "ngInject";

    var self = this;

    self.accepted = function(originalPrice, discountPrice, voucherCode){
      ngDialog.closeAll();
      return ngDialog.openConfirm({
        template: 'app/booking/modals/voucher-accepted.html',
        controller: 'VoucherAcceptedCtrl',
        data: {
          voucherCode: voucherCode,
          originalPrice: originalPrice,
          discountPrice: discountPrice,
        }
      });
    }

    self.denied = function (errore){
      ngDialog.closeAll();
      return ngDialog.openConfirm({
        template: 'app/booking/modals/voucher-denied.html',
        controller: 'VoucherDeniedCtrl',
        data: {
            error: errore !== null ? errore : 'Codice voucher non valido: lo sconto non verrà applicato (possibili motivazioni: codice scaduto, durata prenotazione inferiore al minimo richiesto, utente già registrato, primo Carnet già acquistato)'
        }
      });
    }

    self.deniedRedeemCode = function (){
      ngDialog.closeAll();
      return ngDialog.openConfirm({
        template: 'app/booking/modals/voucher-denied-redeem.html',
        controller: 'VoucherDeniedCtrl'
      });
    }

    self.acceptedRedeemCode = function (){
      ngDialog.closeAll();
      return ngDialog.openConfirm({
        template: 'app/booking/modals/voucher-accepted-redeem.html',
        controller: 'VoucherDeniedCtrl'
      });
    }

}
