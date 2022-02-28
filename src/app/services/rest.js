'use strict';

export default function RestService (
    $rootScope, Restangular, $http, $q
){
    "ngInject";

    var self = this,
        superheroes = Restangular.all('superheroes'),
        customers = Restangular.all('clienti');

    //
    //  Registration/login
    //
    self.login = function(loginInfo){
      return Restangular.all('login').post(loginInfo);
      //https://int.api.ilmiosupereroe.it/login
    }

    self.newPassword = function(data){
      return Restangular.all('credenziali').customPUT(data);
      //https://int.api.ilmiosupereroe.it/credenziali
    }

    self.requestResetPassword = function(userId){
      // POST /credenziali/reset
      return Restangular.all('credenziali').all('reset').post({ username: userId });
    }

    self.sendMessageToSuperheroes = function (superheroes, message) {
      return Restangular.all('sms').post({ superheroes, message });
    }

    //
    //  Super hero application utilities
    //
    self.getPhotoUploadUrl = function(id){
      return superheroes.one(id).one('foto').getRestangularUrl();
    }

    self.getCvUploadUrl = function(id){
      return superheroes.one(id).one('cv').getRestangularUrl();
    }

    self.validateCF = function(cf){
      //return Restangular.oneUrl('validateCF', 'http://webservices.dotnethell.it/codicefiscale.asmx/ControllaCodiceFiscale').get({ CodiceFiscale: cf });
      return $http({
        method: 'GET',
        url: 'http://webservices.dotnethell.it/codicefiscale.asmx/ControllaCodiceFiscale',
        params: { CodiceFiscale: cf },
      });
    }

    self.generateCF = function(data){
      //return Restangular.oneUrl('ganerateCF', 'http://webservices.dotnethell.it/codicefiscale.asmx/CalcolaCodiceFiscale').get(data);
      return $http({
        method: 'GET',
        url: 'http://webservices.dotnethell.it/codicefiscale.asmx/CalcolaCodiceFiscale',
        params: data,
      });
    }

    //
    //   superheroes methods
    //   -- base operations
    self.getHeroes = function(){ // get all heroes
      return superheroes.getList();
    }

    self.getHeroesByState = function(state){ // get heroes by state
      //return superheroes.getList({ filtro: 'Stato', stato: state+'&stato=ciao' });
      return superheroes.customGETLIST('?filtro=Stato&stato='+state); //'&stato=DaAttivare');
      //return $http({
      //  method: 'GET',
      //  url: superheroes.getRestangularUrl()+'?filtro=Stato&stato='+state+'&stato=DaAttivare',
      //});
    }

    self.getHero = function(id, _options){ // get hero by id
        let options = _.merge({
            public: false
        }, _options);
        let filters = {}
        if (options.public === true) filters.filtro = 'ProfiloPubblico';
        return superheroes.one(id).get(filters);
    }

    self.createNewHero = function(newHero){ // request creation of new hero
      return superheroes.post(newHero);
    }

    self.editHero = function(id, hero){ // request edit of hero
      return superheroes.customPUT(hero, id);
    }

    self.deleteHero = function(id){ // set hero to Inactive state
      return superheroes.one(id).all('cancellazione').post({});
    }

    //  -- Approve/Disapprove operations
    self.approveHero = function(id){
      return superheroes.one(id).post('approvazione');
    }

    self.disapproveHero = function(id){
      return superheroes.one(id).post('negazioneApprovazione');
    }

    self.acceptAgreement = function(heroId){
      // POST: /superheroes/{id_superhero}/accettazioneCondizioni
      return superheroes.one(heroId).all('accettazioneCondizioni').post({});
    }

    self.updateUserIban = function(heroId, ibanCode){
      var deferred = $q.defer();

      var heroInfo = self.getHero(heroId);
      heroInfo.then(function(data){
        var info = data.data.plain();
        info.codiceIban = ibanCode;
        info.numeroRecensioni = undefined;
        return self.editHero(heroId, info);
      }).then(function(){
        return self.acceptAgreement(heroId);
      }).then(function(){
        deferred.resolve();
      }, function(){
        deferred.reject();
      });

      return deferred.promise;
    }

    self.updateAgreement = function(heroId){
      var deferred = $q.defer();

      var heroInfo = self.getHero(heroId);
      heroInfo.then(function(data){
        var info = data.data.plain();
        info.mostraCondizioniServizio = false;
        info.numeroRecensioni = undefined;
        return self.editHero(heroId, info);
      }).then(function(){
        return self.acceptAgreement(heroId);
      }).then(function(){
        deferred.resolve();
      }, function(){
        deferred.reject();
      });

      return deferred.promise;
    }

    self.prendiInCarico = function(heroId){
      var deferred = $q.defer();

      var heroInfo = self.getHero(heroId);
      heroInfo.then(function(data){
        var info = data.data.plain();
        info.presoInCarico = true;
        info.numeroRecensioni = undefined;
        return self.editHero(heroId, info);
      }).then(function(){
        deferred.resolve();
      }, function(){
        deferred.reject();
      });

      return deferred.promise;
    }

    self.disableHero = function (heroId)
    {
        return superheroes.one(heroId).all('disattivazione').post({});
    }

    self.reenableHero = function (heroId)
    {
        return superheroes.one(heroId).all('attivazione').post({});
    }

    //  -- availability operations
    self.getHeroAvailability = function(id, filter){
      if(filter !== undefined && filter.dataInizioMin !== undefined && filter.dataInizioMax !== undefined) {
        filter.filtro = 'DataInizio';
        return superheroes.one(id).getList('disponibilita', filter);
      } else {
        return superheroes.one(id).getList('disponibilita');
      }
    }

    self.getHeroAvailabilityDetail = function(idHero, idAvail){
      return superheroes.one(idHero).one('disponibilita', idAvail).get();
    }

    self.createNewHeroAvailability = function(idHero, availObj){
      return superheroes.one(idHero).all('disponibilita').post(availObj);
    }

    self.editHeroAvailability = function(idHero, idAvail, newAvail){
      return superheroes.one(idHero).all('disponibilita').customPUT(newAvail, idAvail);
    }

    self.deleteHeroAvailability = function(idHero, idAvail){
      return superheroes.one(idHero).one('disponibilita').one(idAvail).all('cancellazione').post({});
    }

    //  -- appointments operations
    self.getHeroAppointments = function(id, filter){
      if(filter !== undefined && filter.dataInizioMin !== undefined && filter.dataInizioMax !== undefined) {
        filter.filtro = 'DataInizio';
        return superheroes.one(id).getList('appuntamenti', filter);
      } else {
        return superheroes.one(id).getList('appuntamenti');
      }
    }

    self.getHeroAppointmentDetail = function(idHero, idAppointment){
      if(idHero !== undefined && _.isString(idHero) && idAppointment !== undefined && _.isString(idAppointment))
        return superheroes.one(idHero).one('appuntamenti', idAppointment).get();
    }

    self.getHeroStats = function(idHero){
      return superheroes.one(idHero).one('statisticheAppuntamenti').get();
    }

    self.getHeroFeedbacks = function(idHero) {
      return superheroes.one(idHero).all('recensioni').getList();
    }

    self.getHeroFeedback = function(idHero, idFeedback) {
      return superheroes.one(idHero).all('recensioni').one(idFeedback).get();
    }

    // -- appoint. requests operations
    self.getHeroAppointRequests = function(id, filter){
      if(filter !== undefined && filter.dataInizioMin !== undefined && filter.dataInizioMax !== undefined) {
        filter.filtri = 'DataInizioStato';
        filter.stato = 'Attiva';
        return superheroes.one(id).getList('richiesteAppuntamento', filter);
      } else {
        return superheroes.one(id).getList('richiesteAppuntamento');
      }
    }

    self.confirmHeroRequest = function(id, idReq){
      return superheroes.one(id).all('richiesteAppuntamento').one(idReq).all('presaInCarico').customPOST({});
    }

    self.rejectHeroRequest = function(id, idReq){
      return superheroes.one(id).all('richiesteAppuntamento').one(idReq).all('rifiuto').customPOST({});
    }

    self.getHeroCarnetList = function(heroId){
      return superheroes.one(heroId).all('carnet').getList();
    }

    //
    //  USER methods
    //
    // get user location by address
    self.getAddressLatLng = function(address){
      return $http({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: { 
          address: address,
          key: 'AIzaSyB1z5C5PFD-cbMCRM_RhkYKXE5D2UtB_Ms'        
        },
      });
    }

    self.getCustomers = function(){ // get all customers
      return customers.getList();
    }

    self.getCustomer = function(idCustomer){ // get customer by id
      return customers.get(idCustomer);
    }

    self.createNewCustomer = function(newCustomer){ // request creation of new customer
      return customers.post(newCustomer);
    }

    self.editCustomer = function(idCustomer, customer){ // request edit of customer
      return customers.customPUT(customer, idCustomer);
    }

    self.deleteCustomer = function(idCustomer){ // deletes customer account
      return customers.one(idCustomer).all('cancellazione').post({});
    }

    self.getCustomerAddresses = function(idCustomer){ // get list of customer addresses
      return customers.one(idCustomer).getList('indirizzi');
    }

    self.getCustomerAddress = function(idCustomer, idAddress){ // get list of customer addresses
      return customers.one(idCustomer).one('indirizzi', idAddress).get();
    }

    self.createCustomerAddress = function(idCustomer, newAddress){ // creates new address for customer
      return customers.one(idCustomer).all('indirizzi').post(newAddress);
    }

    self.editCustomerAddress = function(idCustomer, idAddress, newAddress){ // creates new address for customer
      return customers.one(idCustomer).all('indirizzi').customPUT(newAddress, idAddress);
    }

    self.deleteCustomerAddress = function(idCustomer){ // deletes customer account
      //return customers.one(idCustomer).all('cancellazione').post({});
    }

    self.getCustomerPhotoUploadUrl = function(id){
      return customers.one(id).one('foto').getRestangularUrl();
    }

    self.getCustomerOrders = function(customerId, filter){
       if(filter !== undefined && filter.dataCreazioneMin !== undefined && filter.dataCreazioneMax !== undefined) {
        filter.filtro = 'DataCreazione';
        return customers.one(customerId).getList('ordini', filter);
      } else {
        return customers.one(customerId).getList('ordini');
      }
    }

    self.getCustomerOrderInfo = function(customerId, orderId){
      return customers.one(customerId).one('ordini', orderId).get();
    }

    self.getCustomerOrderExpirationDate = function(customerId, orderId){
      return customers.one(customerId).one('ordini', orderId).one('tempoconferma').get();
    }

    self.createNewCustomerOrder = function(customerId, orderObj){
      return customers.one(customerId).all('ordini').post(orderObj, { tipo: 'Appuntamenti' });
    }

    self.createEditedCustomerOrder = function(customerId, orderObj){
      return customers.one(customerId).all('ordini').post(orderObj, { tipo: 'ModificaAppuntamento' });
      // /clienti/{idCliente}/ordini?tipo=ModificaAppuntamento
    }

    self.createNewCustomerCarnetOrder = function(customerId, orderObj){
      return customers.one(customerId).all('ordini').post(orderObj, { tipo: 'Carnet' });
    }

    self.createNewCustomerCarnetBasedOrder = function(customerId, orderObj){
      return customers.one(customerId).all('ordini').post(orderObj, { tipo: 'AppuntamentiSuBaseCarnet' });
    }

    self.createEditedCustomerCarnetBasedOrder = function(customerId, orderObj){
      return customers.one(customerId).all('ordini').post(orderObj, { tipo: 'ModificaAppuntamentoCarnet' });
    }

    self.createNewCustomerMultiHeroOrder = function (customerId, orderObj) {
        return customers.one(customerId).all('ordini').post(orderObj, { tipo: 'NominaleMultiplo' });
    }

    self.createNewContextualCarnetOrder = function (customerId, orderObj) {
        return customers.one(customerId).all('ordini').post(orderObj, { tipo: 'Misto' });
    }

    self.getCustomerCarnetList = function(customerId){
      return customers.one(customerId).all('carnet').getList();
    }

    self.updateCarnetHero = function(customerId, carnetId, heroId){
      return customers.one(customerId).all('carnet').one(carnetId).customPUT({ superHero: { id: heroId } });
      // /carnet/CN-27cc0f3e-a8d9-4cfd-bcda-f0d525475218 { "superHero": { "id" : "SH-266919d8-b658-4a09-9861-ca17dafd61e0" } }
    }

    self.getCarnetTypes = function(){
      return Restangular.all('tipiCarnet').getList();
    }

    self.getCustomerAppointments = function(idCustomer, filter){ // get list of customer appointments
      if(filter !== undefined && filter.dataInizioMin !== undefined && filter.dataInizioMax !== undefined && filter.stato) {
        filter.filtro = 'DataInizioStato';
        return customers.one(idCustomer).getList('appuntamenti', filter);
      } else if(filter !== undefined && filter.dataInizioMin !== undefined && filter.dataInizioMax !== undefined) {
        filter.filtro = 'DataInizio';
        return customers.one(idCustomer).getList('appuntamenti', filter);
      } else {
        return customers.one(idCustomer).getList('appuntamenti');
      }
    }

    self.getCustomerAppointmentInfo = function(customerId, appointmentId){
      return customers.one(customerId).one('appuntamenti', appointmentId).get();
    }

    self.getCustomerLastAppointmentInfo = function(customerId, attributeId){
      return customers.one(customerId).all('appuntamenti').one('infoultimo').get({attributoId: attributeId});
    }

    self.deleteCustomerAppointment = function(customerId, appointmentId){
      return customers.one(customerId).all('appuntamenti').one(appointmentId).all('cancellazione').post({});
    }



    self.getCustomerHeroes = function(customerId){
      return customers.one(customerId).getList('superHeroes');
    }

    self.updateCustomerNewsletter = function(userId){
      var deferred = $q.defer();

      var user = self.getCustomer(userId);
      user.then(function(data){
        var newUser = data.data.plain();
        newUser.newsLetter = true;
        return self.editCustomer(userId, newUser);
      }, function(){
        deferred.reject();
      }).then(function(data){
        deferred.resolve();
      }, function(){
        deferred.reject();
      });

      return deferred.promise;
    }

    self.getCustomerPayments = function (userId)
    {
        return customers.one(userId).getList('pagamenti');
    }

    self.sendNewFeedback = function(idCliente, recensione){
      return customers.one(idCliente).all('recensioni').post(recensione);
    }

    self.getCustomerFeedbackToSend = function (idCliente) {
        return customers.one(idCliente).getList('recensioni', {
            filtro: 'SuperHeroNonRecensiti'
        });
    }

    self.sendReferrals = function (idCliente, tipoServizio, emails) {
        return customers.one(idCliente).all('invita').post({
            tipoServizio: tipoServizio,
            emails: emails
        });
    }

    //
    //  HEROES SEARCH
    //
    self.searchSuperheroes = function(filters){
      if(filters){
        console.debug('Called ricercaSuperheroes with filters', filters);
        return Restangular.all('ricercaSuperheroes').post(filters, { filtro: 'Parametri' });
      } else {
        return Restangular.all('ricercaSuperheroes').post({});
      }
    }

    //
    //  CONTACT CENTER
    //
    self.getFeebackByState = function(state){
      return Restangular.all('recensioni').getList({ filtro: 'Stato', stato: state });
      //filtro=Stato&stato={stato}   (Stati possibili: Immessa,Approvata,NonApprovata,Cancellata)
    }

    self.downloadReferral = function(){ 
      return Restangular.all('reports').one('referral').get();
    }

    self.getFeedback = function(feedId){
      // GET /recensioni/{id_recensione}
      return Restangular.all('recensioni').one(feedId).get();
    }

    self.approveFeedback = function(feedId){
      // POST /recensioni/{id_recensione}/approvazione
      return Restangular.all('recensioni').one(feedId).all('approvazione').customPOST({});
    }

    self.disapproveFeedback = function(feedId){
      // POST /recensioni/{id_recensione}/bocciatura
      return Restangular.all('recensioni').one(feedId).all('bocciatura').customPOST({});
    }

    self.deleteCustomerAppointmentContactCenter = function(customerId, appointmentId){
      // POST /appuntamenti/{idAppuntamento}/cancellazioneAmministrativa
      return Restangular.all('appuntamenti').one(appointmentId).all('cancellazioneAmministrativa').post({});
    }

    self.createEditedAppointmentContactCenter = function(appointmentId, appointObj){
      // POST /appuntamenti/{idAppuntamento}/modificaAmministrativa
      return Restangular.all('appuntamenti').one(appointmentId).all('modificaAmministrativa').post(appointObj);
    }

    self.editPastAppointmentContactCenter = function(appointmentId, appointObj){
      // PUT /appuntamenti/{idAppuntamento}
      return Restangular.all('appuntamenti').customPUT(appointObj, appointmentId);
    }

    self.getHeroesAgendas = function(){
      // GET /aggiornamentoAgende
      return Restangular.all('aggiornamentoAgende').getList();
    }

    self.getAppointments = function(){
      return Restangular.all('appuntamenti').getList();
    }

    self.getAppointment = function(idCustomer, idAppointment){
      return Restangular.all('appuntamenti').one(idAppointment).get();
    }

    self.createVouchers = function(voucherData) {
      return Restangular.all('voucher').all('genera').post(voucherData);
    }

    self.getOrders = function(filters){
      if (filters) {
        return Restangular.all('ordini').getList(filters);
      }
      return Restangular.all('ordini').getList();
    }

    self.getOrder = function(idOrder){
      return Restangular.all('ordini').one(idOrder).get();
    }

    self.getPayments = function () {
      return Restangular.all('pagamenti').getList();
    }

    self.getMarketPayPaymentsRecords = function (paymentId) {
      if (paymentId) {
        return Restangular.all('pagamenti').one('marketpayPaymentRecords').get({paymentId: paymentId});
      } else {
        return Restangular.all('pagamenti').one('marketpayPaymentRecords').get();
      }
    }

    self.getMarketPayPayments = function () {
      return Restangular.all('pagamenti').one('marketpayPayments').get();
    }

    self.searchForNewHero = function(specs){
      // POST: /superheroes/ricercaDisponibilitaAmministrativa
      return superheroes.all('ricercaDisponibilitaAmministrativa').post(specs);
    }

    self.CCSaveHeroNotes = function (heroId, notesToSave, noteType)
    {
        var deferred = $q.defer();

        self.getHero(heroId).then(function(data){

          var info = data.data.plain();
          info[noteType] = notesToSave;
          info.numeroRecensioni = undefined;
          return self.editHero(heroId, info);

        }).then(function(){
          deferred.resolve();
        }, function(){
          deferred.reject();
        });

        return deferred.promise;
    }

    self.CC__getAppointmentRequests = function (idAppointment)
    {
        // /appuntamenti/{idAppuntamento}/richiesteAppuntamento
        return Restangular.all('appuntamenti').one(idAppointment).getList('richiesteAppuntamento');
    }

    self.CC__getRequestDetail = function (idRequest)
    {
        // /richiesteAppuntamento/{idRichiesta}
        return Restangular.all('richiesteAppuntamento').one(idRequest).get();
    }

    self.CC_getSmsError = function (fromMoment)
    {
        var filter = {
            filtro: 'ValiditaAndData',
            valido: 'false',
            data: fromMoment
        }
        return Restangular.all('sms').getList(filter);
    }


    //
    //  FATTURAZIONE
    //
    self.getBillings = function (dateMin, dateMax) {
        return Restangular.all('fatture').getList({ filtro: 'DataFattura', dataFatturaMin: dateMin, dataFatturaMax: dateMax });
    }

    self.getBillingDetail = function (billingId) {
        return Restangular.all('fatture').one(billingId).get();
    }

    self.getBillingFor = function (idActor) {
        return Restangular.all('fatture').geList({ filtro: 'Attore', idAttore: idActor });
    }

    self.getCustomerBilling = function (idCustomer) {
        return customers.one(idCustomer).all('fatture').getList();
    }

    self.getHeroBilling = function (idHero) {
        return superheroes.one(idHero).all('fatture').getList();
    }

    self.getSuperHeroBillingDetail = function (idHero, billingId) {
      return superheroes.one(idHero).all('fatture').one(billingId).get();
    }

    self.getCustomerBillingDetail = function (idCustomer, billingId) {
      return customers.one(idCustomer).all('fatture').one(billingId).get();
    }

    //
    //  BOOKING SERVICES
    //
    self.getAvailabilityByPostalCode = function(competenza, postalCode){
      return Restangular.all('disponibilita').getList({ filtro: 'FiltroCompetenzaCap', competenza: competenza, cap: postalCode });
    }

    self.getDatesSuggestion = function(dates, heroId){
      var obj = { appuntamenti: dates };
      if(heroId) obj.idSuperHero = heroId;
      return Restangular.all('suggerimentiDisponibilita').post(obj);
    }

    self.getDatesSuggestionWithHero = function(dates, heroId, appointmentToEditId){
    var obj = { appuntamenti: dates, idAppuntamentoDaModificare: appointmentToEditId };
    if(heroId) obj.idSuperHero = heroId;
    return Restangular.all('suggerimentiDisponibilita').all('dettaglio').post(obj);
    }

    self.getDatesSuggestionWithHeroes = (dates, appointmentToEditId) => {
        let req = { appuntamenti: dates, idAppuntamentoDaModificare: appointmentToEditId };
        return Restangular.all('suggerimentiDisponibilita').all('dettaglio').post(req);
    }

    self.getAttributes = function(){
      return Restangular.all('attributi').getList();
    }

    self.getServizi = function(cap){
      if(cap)
        return Restangular.all('tipiServizio').getList({ filtro: 'FiltroCap', cap: cap });
      else
        return Restangular.all('tipiServizio').getList();
    }


    self.getSignedUrl = function(type, filename){
      if((type != "cv" && type != "img") || filename === undefined)
        return;
      return Restangular.all('urlFirmati').get("", { tipo: type, nomeFile: filename });
    }

}
