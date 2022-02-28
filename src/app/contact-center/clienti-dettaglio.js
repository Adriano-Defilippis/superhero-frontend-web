'use strict';

export default function ContactCenterClientiDettaglioController (
    $scope, cliente, AssetsStore
) {
    "ngInject";

  	var self = this;

    // indirizzi cliente
    self.addressesResidence = [];
    self.addressesBilling = [];
    self.userInfo = cliente.data.plain();

    // loop through addresses
    self.userInfo.indirizzi.forEach(function(i){
      // decoro il label dell'indirizzo
      i.label = i.via + ' ' + i.numeroCivico + ', '+i.citta+', '+i.cap;
      if(i.tipo == "Residenza") self.addressesResidence.push(i);
      else self.addressesBilling.push(i);
    });

    self.userInfo.photoUrl = self.userInfo.photoUrl ? self.userInfo.photoUrl : AssetsStore.Image('user.placeholder');

  }
