/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function AddressesService (
    RestService, $q
){
    "ngInject";

    var self = this;

    self.parseAndAdd = function(info, userId){
      return parseAddress(info, userId);
    }

    function parseAddress(info, userId){
      var deferred = $q.defer();

      if(!info.via || !info.numeroCivico || !info.cap || !info.citta || !info.provincia || !info.tipo){
        deferred.reject();
      } else if (!(info.nome && info.cognome && info.codiceFiscale) && !info.sameUserInfo) {
        deferred.reject('Inserisci tutte le informazioni di fatturazione');
      } else {
        var addressString = info.via+' '+info.numeroCivico+', '+info.cap+' '+info.citta+' '+info.provincia;
        var parsed = RestService.getAddressLatLng(addressString);
        parsed.then(function(data){
          if(data.data.results.length == 1){
            var addr = _.clone(data.data.results[0]);
            addr.tipo = info.tipo;
            addr.piano = info.piano ? info.piano : '';
            addr.nomeCitofono = info.nomeCitofono ? info.nomeCitofono : '';
            addr.scala = info.scala ? info.scala : '';
            if (!info.sameUserInfo) {
              addr.nome = info.nome ? info.nome : '';
              addr.cognome = info.cognome ? info.cognome : '';
              addr.codiceFiscale = info.codiceFiscale ? info.codiceFiscale : '';
            }
            processAddress(addr, userId, deferred);
          } else if(data.data.results.length > 1) {
            deferred.reject('Spiacente ma l\'indirizzo inserito risulta troppo generico o errato, prego ricontrolla i dati e riprova');
          } else {
            deferred.reject('Spiacente ma non è stato possibile trovare l\'indirizzo specificato, prego ricontrolla i dati e riprova');
          }
        });
      }

      return deferred.promise;
    }

    function processAddress(data, userId, deferred){
      var address = createAddressObj(data);
      var addressToAdd = {
        nome: data.nome,
        cognome: data.cognome,
        codiceFiscale: data.codiceFiscale,
        cap: address.postal_code,
        citta: address.locality,
        numeroCivico: address.street_number,
        provincia: address.administrative_area_level_2,
        latitudine: address.location.lat,
        longitudine: address.location.lng,
        googleMapsId: address.googleMapsId,
        via: address.route,
        tipo: data.tipo,
        piano: data.piano,
        nomeCitofono: data.nomeCitofono,
        scala: data.scala,
      }
      var newAddress = RestService.createCustomerAddress(userId, _.clone(addressToAdd));
      newAddress.then(function(data){
        var added = addressToAdd;
        added.id = data.data.plain().id;
        deferred.resolve(added);
      }, function(){
        deferred.reject('Errore dal server. È stato impossibile aggiungere questo indirizzo.');
      });
    }

    function createAddressObj(address){
      var obj = {};
      obj.formatted = address.formatted_address;
      obj.googleMapsId = address.place_id;
      obj.location = address.geometry.location;
      address.address_components.forEach(function(comp){
        obj[comp.types[0]] = comp.short_name;
      });
      return obj;
    }

}
