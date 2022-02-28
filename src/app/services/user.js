/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function UserService (
    ngDialog, RestService, AssetsStore, $state, $filter, Services, UserCalendarService, HeroProfile, Carnet, BookingModel
){
    "ngInject";

  	var self = this,
        firstLoad = true,
		userInfo = {},
        appointments = [],
        carnet = [],
        heroes = [];

    // data model, called in all controllers of user
    self.appointments = [];
    self.payments = [];
    self.appointmentsInFuture = [];
    self.appointmentsOfTheDay = [];
    self.carnet = [];
    self.carnetActive = [];
    self.heroes = [];
    self.feedbacksRequests = [];
    self.feedbacks = [];

	self.info = function(info){
	       if(info !== undefined && _.isObject(info)) {
				userInfo = _.cloneDeep(info);
        userInfo.photoUrl = userInfo.photoUrl ? userInfo.photoUrl : AssetsStore.Image('user.placeholder');
      } else if(!_.isEmpty(userInfo)){
        return _.cloneDeep(userInfo);
      } else {
        return null;
      }
	}

    self.showAppointmentDetail = function(id, revert){
      appointmentDetailModal(id, userInfo.id, revert);
    }

    self.showHeroProfile = function(_heroId, revert){
        let heroId = _heroId;
        // patch legacy calls
        if (_.isObject(_heroId) && _.isString(_heroId.id) && _heroId.id !== '') heroId = _heroId.id;
        if($state.includes('main.support')){
            // redirect on hero profile CC page
            $state.go('main.support.eroe-dettaglio', { id: heroId });
        } else { // if is user
            let heroInfo, feedbacks;
            RestService.getHero(heroId, { public: true }).then(data => {
                heroInfo = data.data.plain();
                return RestService.getHeroFeedbacks(heroId);
            }).then(data => {
                feedbacks = data.data.plain();
                openHeroProfile(heroInfo, feedbacks, revert);
            });

        }
    }

    function openHeroProfile (heroInfo, feedbacks, revert) {
        ngDialog.closeAll();
        ngDialog.open({
            plain: true,
            template: `
                <hero-profile
                    info="HeroProfile.info"
                    feedbacks="HeroProfile.feedbacks"
                    init-tab="info"
                    is-selectable="false"
                    disable-actions="HeroProfile.disabled === true">
                </hero-profile>
            `,
            className: 'ngdialog-theme-default ngdialog-hero-profile',
            preCloseCallback : function(){
                if(revert && _.isFunction(revert)){
                    revert();
                }
            },
            controller: function($scope, HeroProfile){
                "ngInject";
                $scope.HeroProfile = this;
                const self = this;

                self.info = HeroProfile.patchLegacyData(heroInfo);
                self.feedbacks = feedbacks;
                self.startNewBooking = HeroProfile.startNewBooking;
                self.startCarnetBooking = HeroProfile.startCarnetBooking;
                if (revert) self.disabled = true;
                console.debug(revert, self.disabled);
            }
        });
    }

    self.injectEvents = function(events){
      self.appointments.length = 0;
      self.appointments.push.apply(self.appointments, events);
      decorateAppointments();
      calculateFeedbacks();
    }

    self.injectHeroes = function(heroesList){
      self.heroes.length = 0;
      self.heroes.push.apply(self.heroes, heroesList);
    }

    self.injectCarnetList = function(carnetList){
      self.carnet.length = 0;
      self.carnet.push.apply(self.carnet, carnetList);
      calculateActiveCarnet();
    }

    self.injectPayments = function (paymentsList)
    {
        self.payments.length = 0;
        self.payments.push.apply(self.payments, paymentsList);
        decoratePayments();
    }

    self.injectFeedback = function (heroesToFeedback) {
        self.feedbacks.length = 0;
        self.feedbacks.push.apply(self.feedbacks, decorateFeedbacks(heroesToFeedback));
    }

    self.setAppointmentRecensito = function(id){
      var found = _.remove(self.feedbacks, function(feedback){
        return feedback.appointment == id;
      });
    }

    self.sendUserReferrals = sendUserReferrals;

    function sendUserReferrals (tipoServizio, emails) {
        return RestService.sendReferrals(userInfo.id, { id: tipoServizio }, emails);
    }

    // calculate active carnet
    function calculateActiveCarnet(){
      var carnetList = [];
      self.carnet.forEach(function(c){
        var carnetInfo = Carnet.byId(c.idTipoCarnet);
        let carnetType = carnetInfo.type;
        c.sottoCompetenza = carnetInfo.subCompetence;
        c.oreResidue = carnetType.indexOf("sed") > -1 ? c.minutiResidui : c.minutiResidui / 60;
        c.dataAcquisto = moment(c.dataAcquisto).format('DD/MM/YYYY');
        c.scadenza = c.maiUtilizzato ? 'Carnet non ancora utilizzato' : moment(c.dataScadenza).format('DD/MM/YYYY');
        c.prestazione = carnetInfo.prestazione;
        c.label = carnetInfo.prestazioneLabel;
        c.oreTotali = carnetInfo.hours;
        c.isPrestazione = carnetType.indexOf("sed") > -1;

        if (carnetType === '5sed') carnetType = 'Small';
        if (carnetType === '10sed') carnetType = 'Medium';
        c.carnetIcon = AssetsStore.Icon('badge.carnet'+carnetType);

        c.superHeroPhotoUrl = c.superHeroPhotoUrl ? c.superHeroPhotoUrl : AssetsStore.Image('user.placeholder');
        if(c.stato != 'Immesso' && c.stato != 'ErrorePagamento') carnetList.push(c);
      });
      self.carnetActive.length = 0;
      self.carnetActive.push.apply(self.carnetActive, carnetList);
    }

    // decorate appointment model
    function decorateAppointments(){
      self.appointmentsInFuture.length = 0;
      self.appointmentsOfTheDay.length = 0;

      self.appointments.forEach(function(app){
        var now = new Date();
        if (app.dataInizio <= now.getTime()) app.isPast = true;
        else app.isPast = false;

        // labels
        app.labels = {
          dataInizio: moment(app.dataInizio).format('DD/MM/YYYY'),
          oraInizio: moment(app.dataInizio).format('HH:mm'),
          oraFine: moment(app.dataFine).format('HH:mm'),
        };
        app.labels.inizio = app.labels.dataInizio + ' | ' +app.labels.oraInizio +' - '+app.labels.oraFine;

        // is positive
        app.isPositive = (app.stato == 'Aperto' || app.stato == 'Confermato' || app.stato == 'Pagato');

        // if is 'Aperto' must add SH name
        if(app.stato == 'Aperto')
          app.superHeroNomeCompleto = 'In lavorazione...';

        // status
        if(app.stato == 'Confermato') {
          app.labels.stato = 'L\'appuntamento è stato confermato';
          app.labels.statoIcon = 'glyphicon glyphicon-ok';
        }

        // status
        if(app.stato == 'Aperto' || app.stato == 'Pagato') {
          app.labels.stato = 'L\'appuntamento è in attesa di conferma';
          app.labels.statoIcon = 'glyphicon glyphicon-time';
        }

        if(!app.superHeroPhotoUrl)
          app.superHeroPhotoUrl = AssetsStore.Image('user.placeholder');

        // Service label
        app.labels.servizio = Services.Label(app.tipoServizioId);

        // push in appointments in future
        if(!app.isPast && app.isPositive)
          self.appointmentsInFuture.push(app);

        // push in appointments of the day
        if(moment(app.dataInizio).format('DDMMYYYY') == moment().format('DDMMYYYY') && app.stato == "Confermato")
          self.appointmentsOfTheDay.push(app);

      });
    }

    function decoratePayments ()
    {
        self.payments.forEach( function (p) {
            p.dataCreazioneFormatted = moment(p.dataCreazione).format('DD/MM/YY - HH:mm');
            var idPrefix = p.reference.split('-')[0];
            if (idPrefix == 'CN') {
                p.referenceLabel = 'Carnet';
                p.isCarnet = true;
            } else {
                p.referenceLabel = 'Appuntamento';
                p.isCarnet = false;
            }
        });
    }

    function decorateFeedbacks (heroes) {
        return heroes.map(feedb => {
            const hero = feedb.superHero;
            return {
                hero: hero.id,
                photoUrl: hero.photoUrl ? hero.photoUrl : AssetsStore.Image('user.placeholder'),
                nome: hero.nome,
                cognome: hero.cognome,
                heroInfo: hero,
                appointment: feedb.idAppuntamento
            }
        });
    }


    // calculate when appointment need feedback review
    function calculateFeedbacks(){
      var feedbacksToLeaveFor = [];
      var isContactCenter = $state.includes('main.support');
      var daySpan = isContactCenter ? 30 : 7;
      var now = new Date().getTime();
      if(self.appointments.length > 0){
        self.appointments.forEach(function(a){
          if(!a.recensito && now >= (a.dataFine + 1000*60*60) && now <= (a.dataFine + 1000*60*60*24*daySpan)) {
          //if(!a.recensito) {
            a.label = 'Appuntamento del '+moment(a.dataInizio).format('DD/MM/YYYY')+' dalle '+moment(a.dataInizio).format('HH:mm')+' alle '+moment(a.dataFine).format('HH:mm');
            if(a.stato == 'Confermato' || a.stato == 'Pagato') feedbacksToLeaveFor.push(a);
          }
        });
      }
      self.feedbacksRequests.length = 0;
      self.feedbacksRequests.push.apply(self.feedbacksRequests, feedbacksToLeaveFor);
    }

    function appointmentDetailModal(idAppoint, idCliente, revert){
      // Appointment info
      var p = RestService.getCustomerAppointmentInfo(idCliente, idAppoint);
      p.then(function(data){
        var isContactCenter = $state.includes('main.support');
        var info = data.data.plain();
        var isCarnet = info.tipo == 'AppuntamentiCarnet' || info.tipo == 'ModificaAppuntamentoCarnet';
        var dateCircle = moment(info.dataInizio).format('DD[<br><span>]MMM[</span>]');
        var dateExtended = '<span class="capitalize"><b>'+moment(info.dataInizio).format('dddd D MMMM')+'</b></span><br>dalle '+moment(info.dataInizio).format('HH:mm')+' alle '+moment(info.dataFine).format('HH:mm')
        if(info.stato == 'Aperto'){
          var clientInfo = '<b>In lavorazione...</b>';
        } else {
          var clientInfo = '<b>'+info.superHero.nome + ' ' + info.superHero.cognome + '</b>';
        }

        var iconPath = Services.Icon(info.tipoServizio.id);
        var costToCalculate = info.costoPrestazioneScontata && info.costoPrestazioneScontata > 0 ? info.costoPrestazioneScontata : info.costoPrestazione;
        var realCost = $filter('number')(costToCalculate, 2);
        var detailCost = '<b>'+(info.durataMinuti/60) + 'H - ' + realCost + '€</b>';
        var fullAddress = '<b>'+info.indirizzoPrestazione.via + ' ' + info.indirizzoPrestazione.numeroCivico +', '+ info.indirizzoPrestazione.cap +' '+info.indirizzoPrestazione.citta+'</b><br>'+
                          '<span>citofono: '+info.indirizzoPrestazione.nomeCitofono+(info.indirizzoPrestazione.scala ? ', scala: '+info.indirizzoPrestazione.scala : '')+', piano: '+info.indirizzoPrestazione.piano +
                          ((info.tipoIngresso !== null &&  info.tipoIngresso !== "") ? '<br>'+info.tipoIngresso : '')+'</span>';
        var heroPhotoUrl = (info.superHero && info.superHero.photoUrl) ? info.superHero.photoUrl : AssetsStore.Image('user.placeholder');

        // Dettagli servizio
        if(info.jsonDettagliServizio == 'Dettaglio serzio') info.jsonDettagliServizio = '{}';
        var dettagliServizio = JSON.parse(info.jsonDettagliServizio);

        // Servizi aggiuntivi
        var serviziAggiuntivi = '';
        var hasServiziAggiuntivi = false;
        if(info.tipoServizio && info.tipoServizio.prestazione == 'Colf'){
          var additional = dettagliServizio.specifiche;
          if(!additional || additional.length < 1){
            serviziAggiuntivi = '<p class="no-margin all left-align"><i>Nessun servizio aggiuntivo</i></p>';
          } else {
              hasServiziAggiuntivi = true;
            serviziAggiuntivi = '<ul>';
            additional.forEach(function(single){
              serviziAggiuntivi += '<li><md-icon md-svg-src="'+Services.detail.colf.Icon(single)+'" title="'+single+'"></md-icon><p>'+single+'</p></li>';
            });
            serviziAggiuntivi += '</ul>';
          }
        } else {
          if(info.sottoCompetenze.length < 1){
            serviziAggiuntivi = '<p class="no-margin all left-align"><i>Nessun servizio aggiuntivo</i></p>';
          } else {
              hasServiziAggiuntivi = true;
              if (typeof info.sottoCompetenze[0] !== 'undefined' && Services.detail.Icon(info.sottoCompetenze[0].id) === false) serviziAggiuntivi = '<ul class="no-icon-list list">';
              else serviziAggiuntivi = '<ul>';
            info.sottoCompetenze.forEach(function(single){
              serviziAggiuntivi += '<li>' + (Services.detail.Icon(single.id) ? '<md-icon md-svg-src="'+Services.detail.Icon(single.id)+'" title="'+Services.detail.Label(single.id)+'"></md-icon>' : '') + '<p>'+Services.detail.Label(single.id)+'</p></li>';
            });
            serviziAggiuntivi += '</ul>';
          }
        }

        let dettagliAppuntamento = '';
        let hasDettagliAppuntamento = false;
        if (dettagliServizio.infoPersone && dettagliServizio.infoPersone.length > 0) {
            let infoPersone = dettagliServizio.infoPersone;
            hasDettagliAppuntamento = true;
            dettagliAppuntamento = '<p class="no-margin top">Informazioni partecipanti:<br>';
            infoPersone.forEach(persona => {
                let eta = _.find(BookingModel.personalTrainerAgeOptions, { id: persona.eta });
                dettagliAppuntamento += persona.nome + ' ' + persona.cognome + ', eta: ' + eta.value + '<br>';
            });
            dettagliAppuntamento += '</p>';
        }

        let additionalServicesBox = '';
        if (!hasServiziAggiuntivi && !hasDettagliAppuntamento) additionalServicesBox = serviziAggiuntivi;
        else if (hasServiziAggiuntivi && !hasDettagliAppuntamento) additionalServicesBox = serviziAggiuntivi;
        else if (!hasServiziAggiuntivi && hasDettagliAppuntamento) additionalServicesBox = dettagliAppuntamento;
        else if (hasDettagliAppuntamento && hasDettagliAppuntamento) additionalServicesBox = serviziAggiuntivi + '<br>' + dettagliAppuntamento;

        // Note utente
        if(info.note) {
          var noteServizio = '<div class="service">'+
                              '<p>'+info.note+'</p>'+
                            '</div>';
        } else {
          noteServizio = '';
        }

        var now = new Date();
        info.isPast = false;
        if(info.dataInizio < now.getTime()) info.isPast = true;
        var difference = 0;
        if(!info.isPast){
          difference = (info.dataInizio - now.getTime())/1000/60/60;
        }
        var actions = '';
        if(!info.isPast) {
          var edit = '<a class="btn btn-small waves-effect waves-light btn-margin main-orange" ng-click="editAppointment()">Modifica appuntamento</a>';
          var del = '<a class="btn btn-small waves-effect waves-light btn-margin main-orange" ng-click="cancelAppointment()">Cancella appuntamento</a>';
          // Se l'appuntamento non è il contact center
          if((info.dataInizio <= now.getTime() || (info.dataInizio - now.getTime())/1000/60/60 < 24) && !isContactCenter) edit = '';

          if(!isContactCenter && isCarnet) {
            edit = '';
            del = '';
          }

          actions = '<div class="actions">'+
                      '<p class="no-margin all center">'+ edit + '' + del +
                      '</p>'+
                    '</div>';
        }
        ngDialog.closeAll();
        ngDialog.open({
          template:
          '<div class="detail-box">'+
            '<div row column-sm fill>'+
              '<div class="date top" row>'+
                '<div class="short center width-100"><p class="no-margin all">'+dateCircle+'</p></div>'+
                '<div class="extended center" fill><p class="no-margin all left-align">'+dateExtended+'</p></div>'+
              '</div>'+
              '<div class="client top" row '+(!revert ? 'ng-click="showHeroProfile()"' : '')+'>'+
                '<div class="center width-100"><div class="picture" style="background-image:url(\''+heroPhotoUrl+'\')"></div></div>'+
                '<div class="info center" fill><p class="no-margin all left-align">'+clientInfo+'</p></div>'+
              '</div>'+
            '</div>'+
            '<div class="service" row fill>'+
              /*'<div row fill>'+

                  '<div class="icon center width-100"><md-icon md-svg-src="'+iconPath+'" alt="'+Services.Label(info.tipoServizio.id)+'"></md-icon></div>'+
                  '<div class="detail center left-align">'+
                  '<p class="no-margin all left-align"><b>'+Services.Label(info.tipoServizio.id)+'</b><br>'+detailCost+'</p>'+
                  '</div>'+

              '</div>'+*/

              '<service-price-detail row appointment-info="appointmentInfo"></service-price-detail>'+

              '<div class="additional-services center left-align">'+
                additionalServicesBox +
              '</div>'+
            '</div>'+
            '<div class="address" layout="row" layout-fill layout-align="center center">'+
              '<p>'+fullAddress+'</p>'+
            '</div>'+
            noteServizio+
            actions+
          '</div>',
          className: 'ngdialog-theme-default ngdialog-appointment-detail service-'+Services.Number(info.tipoServizio.prestazione),
          plain: true,
          //showClose: false,
          preCloseCallback : function(){
            if(revert && _.isFunction(revert)){
              revert();
            }
          },
          controller: ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'AssetsStore', '$ngRedux', 'BookingActions', function($scope, uiGmapGoogleMapApi, uiGmapIsReady, AssetsStore, $ngRedux, BookingActions){
            var styles = JSON.parse('[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]');

            $scope.appointmentInfo = info;

            $scope.map = {
              center: { latitude: 45.465422, longitude: 9.164658 },
              zoom: 16,
              control: {}
            }

            $scope.mapOptions = {
              styles: styles,
              disableDoubleClickZoom: false,
              scrollwheel: true,
              disableDefaultUI: true,
              minZoom : 10
            };

            $scope.marker = {
              id: '1',
              coords: { latitude: 45.465422, longitude: 9.164658 },
              options: { draggable: false  }
            };

            $scope.showHeroProfile = function(){
              self.showHeroProfile(info.superHero);
            }

            $scope.editAppointment = function(){
              if($state.includes('main.support')){
                $state.go('main.support.edit-appointment', { idAppoint: info.id });
              } else {
                if((info.tipo == 'AppuntamentiCarnet' || info.tipo == 'ModificaAppuntamentoCarnet') && info.idCarnet){
                  var found = _.find(self.carnet, function(c){
                    return c.id == info.idCarnet;
                  });
                  if(found){
                    info.carnet = _.clone(found);
                    $ngRedux.dispatch(BookingActions.startBookingEditingAppointment(info));
                  }
                } else {
                    console.log(info);
                    if (typeof info.superHero !== 'undefined' && info.superHero !== null) {
                        info.superHero.photoUrl = info.superHero.photoUrl ? info.superHero.photoUrl : AssetsStore.Image('user.placeholder');
                    }
                    $ngRedux.dispatch(BookingActions.startBookingEditingAppointment(info));
                }
              }
            }

            $scope.cancelAppointment = function(){
              $scope.closeThisDialog();
              cancelAppointment(idAppoint, difference, isCarnet);
            }

          }]
        });
      }, function(data){
        //self.modal({ title: 'Errore', content: 'Impossibile trovare la informazioni dell\' appuntamento richiesto. Assicurati che l\'appuntamento non sia stato cancellato.' });
        return;
      });
    }

    function cancelAppointment (idAppoint, difference, isCarnet){
      // if is contact center
      if($state.includes('main.support')){
        cancelAppointmentModalContactCenter(idAppoint, difference, isCarnet);
      } else {
        cancelAppointmentModal(idAppoint, difference, isCarnet);
      }
    }

    function cancelAppointmentModalContactCenter(idAppoint, difference, isCarnet){
      ngDialog.open({
        template:
        '<div class="cancel-appointment center">'+
          '<h3 class="center uppercase">Cancella appuntamento</h3>'+
         '<p class="center">Sei sicuro di voler cancellare l\'appuntamento? Questa operazione non può essere annullata.</p>'+
          '<div class="actions">'+
            '<p class="no-margin all center"><a class="btn btn-small waves-effect waves-light main-orang" ng-disabled="isLoading" ng-click="goBack()">Annulla</a>&nbsp;<a class="btn btn-small waves-effect waves-light main-orang" ng-disabled="isLoading" ng-click="cancelAppointment()">{{ isLoading ? \'Caricamento...\' : \'Conferma cancellazione\' }}</a></p>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default ngdialog-appointment-detail',
        plain: true,
        controller: ['$scope', function($scope){
          $scope.isLoading = false;
          $scope.goBack = function(){
            $scope.closeThisDialog();
            self.showAppointmentDetail(idAppoint);
          }
          $scope.cancelAppointment = function(){
            $scope.isLoading = true;
            var deleteP = RestService.deleteCustomerAppointmentContactCenter(userInfo.id, idAppoint);
            deleteP.then(function(data){
              UserCalendarService.cancelEvent(userInfo.id, idAppoint);
              $scope.closeThisDialog();
              self.modal({title:'Appuntamento cancellato', content:'L\'appuntamento è stato cancellato con successo'});
            }, function(){
              $scope.closeThisDialog();
              self.modal({title:'Errore nella cancellazione dell\'appuntamento', content:'C\'è stato un errore nella cancellazione dell\'appuntamento. Se il problema persiste contatta il Contact Center.'});
            });
          }
        }]
      });
    }

    function cancelAppointmentModal(idAppoint, difference, isCarnet){
      var costo = difference >= 24 ? 4 : 10;
      if(isCarnet) costo = difference >= 24 ? 3 : 5;
      ngDialog.open({
        template:
        '<div class="cancel-appointment center">'+
          '<h3 class="center uppercase">Cancella appuntamento</h3>'+
          '<h4 class="center">Costo cancellazione: &euro;'+costo+'</h4>'+
          (isCarnet ? '<p class="center">Attenzione: le commissioni di cancellazione non sono incluse nel prezzo del carnet e verranno addebitate separatamente sulla tua carta di credito.</p>' : '')+
          (!isCarnet ? '<p class="center">Attenzione: l\'importo dovuto per la cancellazione dell\'appuntamento verrà addebitato senza bisogno di una nuova transazione di pagamento in quanto inferiore all\'importo già autorizzato in fase di prenotazione. Nessun altro addebito verrà effettuato per questo appuntamento.</p>' : '')+
          '<h4>Info costi cancellazione'+(isCarnet ? ' appuntamento Carnet' : '')+'</h4>'+
          '<table class="costs">'+
            '<tbody>'+
              '<tr>'+
                '<td class="condizione">a più di 24 ore dalla prenotazione:</td><td class="prezzo">&euro;'+(isCarnet ? '3' : '4')+'</td>'+
              '</tr><tr>'+
                '<td class="condizione">a meno di 24 ore dalla prenotazione:</td><td class="prezzo">&euro;'+(isCarnet ? '5' : '10')+'</td>'+
              '</tr>'+
            '</tbody>'+
          '</table>'+
          '<div class="actions">'+
            '<p class="no-margin all center"><a class="btn btn-small waves-effect waves-light main-orang" ng-disabled="isLoading" ng-click="goBack()">Annulla</a>&nbsp;<a class="btn btn-small waves-effect waves-light main-orang" ng-disabled="isLoading" ng-click="cancelAppointment()">{{ isLoading ? \'Caricamento...\' : \'Conferma cancellazione\' }}</a></p>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default ngdialog-appointment-detail',
        plain: true,
        controller: ['$scope', function($scope){
          $scope.isLoading = false;
          $scope.goBack = function(){
            $scope.closeThisDialog();
            self.showAppointmentDetail(idAppoint);
          }
          $scope.cancelAppointment = function(){
            $scope.isLoading = true;
            var deleteP = RestService.deleteCustomerAppointment(userInfo.id, idAppoint);
            deleteP.then(function(data){
              UserCalendarService.cancelEvent(userInfo.id, idAppoint);
              $scope.closeThisDialog();
              self.modal({title:'Appuntamento cancellato', content:'L\'appuntamento è stato cancellato con successo'});
            }, function(){
              $scope.closeThisDialog();
              self.modal({title:'Errore nella cancellazione dell\'appuntamento', content:'C\'è stato un errore nella cancellazione dell\'appuntamento. Se il problema persiste contatta il Contact Center.'});
            });
          }
        }]
      });
    }

    // General modals
    self.modal = function(obj){
      ngDialog.open({
        template:
        '<div class="general-modal">'+
          '<h3>'+obj.title+'</h3><p>'+obj.content+'</p>'+
          '<div class="actions">'+
            '<a class="btn btn-small waves-effect waves-light main-orang" ng-click="closeThisDialog()">Chiudi</a>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default',
        plain: true
      });
    };


}
