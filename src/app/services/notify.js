/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function NotifyService (
    $filter, $rootScope, $state, ngDialog, RestService, AssetsStore, Services, BookingModel
){
    "ngInject";

    var self = this;

    var errors = {
    	hero: {
    		availability: {
    			sendNew: "Impossibile creare una nuova/modificare una disponibilità. Errore 400/404",
          get: "Impossibile ottenere le disponibilità dal server. Errore 400/404"
    		}
    	}
    };

    self.error = function(path) {
    	var current = self.errors;

      if(path === undefined || path.length < 1)
        return '';

      path.forEach(function(singlePath){
      if(current[singlePath] !== undefined)
        current = current[singlePath];
      else return;
      });

      if(!_.isString(current)) return '';

    };


    // General modals
    self.modal = function(obj){
      return ngDialog.open({
        template:
        '<div layout="column">'+
          '<div><h3>'+obj.title+'</h3><p>'+obj.content+'</p></div>'+
          '<div class="section center">'+
            '<a type="button" ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Chiudi</a>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default',
        plain: true
      });
    };

    self.modalRefresh = function(obj){
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div><h3>'+obj.title+'</h3><p>'+obj.content+'</p></div>'+
          '<div class="section center">'+
            '<a type="button" ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Chiudi</a>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default',
        closeByEscape: false,
        closeByDocument: false,
        showClose: false,
        plain: true,
        controller: ['$scope', '$state', function($scope, $state){
          $scope.close = function(){
            $scope.closeThisDialog();
            var t = $state.current;
            if(obj.target !== undefined && _.isString(obj.target))
              t = obj.target;
            $state.go(t, {}, {reload: true});
          }
        }]
      });
    }

    self.saveConfirmed = function(error, validation){
      var content = '<div><h3>Modifiche salvate!</h3><p>Modifiche salvate con successo.</p></div>';
      if(error)
        content = '<div><h3>Errore!</h3><p>C\'è stato un errore inaspettato.</p></div>';
      if(error && validation)
        content = '<div><h3>Errore validazione!</h3><p>Errore nella validazione dei dati. Ricontrolla i dati e riprova.</p></div>';

      ngDialog.open({
        template:
        '<div layout="column">'+
          content+
          '<div class="section center">'+
            '<a type="button" ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Chiudi</a>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default',
        plain: true,
      });
    };

    // confirm request
    self.confirmRequest = function(data, callback){
        console.debug(data);
      var serviceLabel = Services.PrestazioneById(data.tipoServizioId);
      var appInfo = '<ul class="center padding-top dialog-info"><li><b>'+serviceLabel+'</b></li><li>'+data.model.day+'</li><li>'+data.model.time+'</li><li>'+data.model.where+'</li></ul>';
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div><h3>Conferma appuntamento</h3><p>Vorresti confermare la richiesta del seguente appuntamento?<br>'+appInfo+'</p></div>'+
          '<div class="row">'+
            '<div class="col s4">'+
              '<a class="btn btn-small waves-effect waves-light main-orange" fill ng-click="confirm()">Conferma</a>'+
            '</div>'+
            '<div class="col s4">'+
              '<a class="btn btn-small waves-effect waves-light main-orange" fill ng-click="closeThisDialog()">Annulla</a>'+
            '</div>'+
            '<div class="col s4">'+
              '<a class="btn btn-small waves-effect waves-light main-orange" fill ng-click="reject()">Rifiuta</a>'+
            '</div>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default',
        plain: true,
        controller: ['$scope', function($scope){
          $scope.confirm = function(){
            callback();
            $scope.closeThisDialog();
          }
          $scope.reject = function(){
            callback(true);
            $scope.closeThisDialog();
          }
        }]
      });
    }

    self.showUserProfile = function(heroData, revert){
      $state.go('main.support.clienti-dettaglio', { id: heroData.id });
    }

    // Appointment info
    self.showAppointmentDetail = function(idHero, idAppoint){
      var p = RestService.getHeroAppointmentDetail(idHero, idAppoint);
      p.then(function(data){
        var info = data.data.plain();
        var dateCircle = moment(info.dataInizio).format('DD[<br><span>]MMM[</span>]');
        var dateExtended = '<span class="capitalize"><b>'+moment(info.dataInizio).format('dddd D MMMM')+'</b></span><br>dalle '+moment(info.dataInizio).format('HH:mm')+' alle '+moment(info.dataFine).format('HH:mm')
        var clientInfo = '<b>'+info.cliente.nome + ' ' + info.cliente.cognome + '</b>';
        var iconPath = Services.Icon(info.tipoServizio.id); //
        var costToCalculate = info.costoPrestazioneScontata && info.costoPrestazioneScontata > 0 ? info.costoPrestazioneScontata : info.costoPrestazione;
        var realCost = $filter('number')(costToCalculate, 2);
        var detailCost = '<b>'+(info.durataMinuti/60) + 'H - ' + (realCost) + '€</b>';
        var fullAddress = '<b>'+info.indirizzoPrestazione.via + ' ' + info.indirizzoPrestazione.numeroCivico +', '+ info.indirizzoPrestazione.cap +' '+info.indirizzoPrestazione.citta+'</b><br>'+
                          '<span>citofono: '+info.indirizzoPrestazione.nomeCitofono+', scala: '+info.indirizzoPrestazione.scala+', piano: '+info.indirizzoPrestazione.piano +
                          ((info.tipoIngresso !== null &&  info.tipoIngresso !== "") ? '<br>'+info.tipoIngresso : '')+'</span>';

        // Dettagli servizio
        if(info.jsonDettagliServizio == 'Dettaglio serzio') info.jsonDettagliServizio = '{}';
        var dettagliServizio = JSON.parse(info.jsonDettagliServizio);

        // dettagli appuntamento
        var dettagliAppuntamento = '';
        if(dettagliServizio.squareMeters && dettagliServizio.suggestedHours){
          dettagliAppuntamento += '<p>Dettagli abitazione: <b>'+dettagliServizio.squareMeters+' M2</b>, ore suggerite: <b>'+dettagliServizio.suggestedHours/60+'</b></p>';
        } else if(dettagliServizio.infoPersona){
          var infoAssistito = dettagliServizio.infoPersona;
          dettagliAppuntamento = '<p>Informazioni assistito: '+infoAssistito.nome+' '+infoAssistito.cognome+', '+infoAssistito.eta+', '+infoAssistito.sesso+'</p>';
        } else if(dettagliServizio.infoBambini){
          var infoBambini = dettagliServizio.infoBambini;
          dettagliAppuntamento = '<p>Informazioni bambini:<br>';
          infoBambini.forEach(function(b){
            let eta = b.eta;
            const etaArray = _.filter(BookingModel.babySitterAgeOptions, option => option.id === b.eta);
            if (etaArray && etaArray.length > 0) eta = etaArray[0].value;
            dettagliAppuntamento += b.nome+' '+b.cognome+', '+eta+', '+b.sesso+'<br>';
          });
          dettagliAppuntamento += '</p>';
      } else if (dettagliServizio.infoPersone && dettagliServizio.infoPersone.length > 0) {
          let infoPersone = dettagliServizio.infoPersone;
          dettagliAppuntamento = '<p class="no-margin top">Informazioni partecipanti:<br>';
          infoPersone.forEach(persona => {
              let eta = _.find(BookingModel.personalTrainerAgeOptions, { id: persona.eta });
              dettagliAppuntamento += persona.nome + ' ' + persona.cognome + ', eta: ' + eta.value + '<br>';
          });
          dettagliAppuntamento += '</p>';
      }

        // Servizi aggiuntivi
        var serviziAggiuntivi = '<ul>';
        if(info.tipoServizio && _.contains(['Colf', 'TuttofareServiziElettrici', 'TuttofareServiziIdraulici'], info.tipoServizio.prestazione)) {
          let additional = dettagliServizio.specifiche;
          if(additional && additional.length >= 1){
            //serviziAggiuntivi = '<p class="no-margin all left-align"><i>Nessun servizio aggiuntivo</i></p>';
          //} else {
            additional.forEach(function(single){
              serviziAggiuntivi += '<li><md-icon md-svg-src="'+Services.detail.colf.Icon(single.replace(/\/ /g, '/'))+'" title="'+single+'"></md-icon>' + '<p>' + single.replace(/\//g, '/ ') + '</p>' + '</li>';
            });
          }
        }

        if(info.sottoCompetenze.length < 1){
          //serviziAggiuntivi = '<p class="no-margin all left-align"><i>Nessun servizio aggiuntivo</i></p>';
        } else {
          info.sottoCompetenze.forEach(function(single){
            serviziAggiuntivi += '<li><md-icon md-svg-src="'+Services.detail.Icon(single.id)+'" title="'+Services.detail.Label(single.id)+'"></md-icon>' + '<p>' + Services.detail.Label(single.id) + '</p>' + '</li>';
          });
        }
        serviziAggiuntivi += '</ul>';
        
        // Note utente
        if(info.note) {
          var noteServizio = '<div class="service">'+
                              '<p>'+info.note+'</p>'+
                            '</div>';
        } else {
          noteServizio = '';
        }

        var isContactCenter = false;
        var actions = '';
        if($state.includes('main.support')){
          isContactCenter = true;
          //$state.go('main.support.eroe-dettaglio', { id: heroData.id });

          var edit = '<a class="btn btn-small waves-effect waves-light btn-margin main-orange" ng-click="editAppointment()">Modifica appuntamento</a>';
          actions = '<div class="actions">'+
            '<p class="no-margin all center">'+edit+
            '<a class="btn btn-small waves-effect waves-light btn-margin main-orange" ng-click="cancelAppointment()">Cancella appuntamento</a></p>'+
            '</div>';
        }

        var clientePhoto = info.cliente.photoUrl ? info.cliente.photoUrl : AssetsStore.Image('user.placeholder');
        ngDialog.open({
          template:
          '<div class="detail-box">'+
            '<div row column-sm fill>'+
              '<div class="date top" row>'+
                '<div class="short center width-100"><p class="no-margin all">'+dateCircle+'</p></div>'+
                '<div class="extended center" fill><p class="no-margin all left-align">'+dateExtended+'</p></div>'+
              '</div>'+
              '<div class="client top" row '+(isContactCenter ? 'ng-click="showUserProfile()"' : '')+'>'+
                '<div class="center width-100"><div class="picture" style="background-image:url(\''+clientePhoto+'\')"></div></div>'+
                '<div class="info center" fill><p class="no-margin all left-align">'+clientInfo+'</p></div>'+
              '</div>'+
            '</div>'+
            '<div class="service" row fill>'+
              /*
              '<div class="icon center width-100"><md-icon md-svg-src="'+iconPath+'" alt="Successivo"></md-icon></div>'+
              '<div class="detail center left-align">'+
                '<p class="no-margin all left-align"><b>'+Services.Label(info.tipoServizio.id)+'</b><br>'+detailCost+'</p>'+
              '</div>'+
              */
              '<service-price-detail row appointment-info="appointmentInfo"></service-price-detail>'+
              '<div class="additional-services center left-align">'+
                (serviziAggiuntivi ? serviziAggiuntivi : dettagliAppuntamento)+
              '</div>'+
            '</div>'+
            (serviziAggiuntivi ? '<div class="dettagli-appuntamento actions">'+dettagliAppuntamento+'</div>' : '')+
            '<div class="address" layout="row" layout-fill layout-align="center center">'+
              '<p>'+fullAddress+'</p>'+
            '</div>'+
            '<div class="detail-map">'+
              '<ui-gmap-google-map center="map.center" zoom="map.zoom" options="mapOptions" control="map.control">'+
                '<ui-gmap-marker coords="marker.coords" options="marker.options" events="marker.events" idkey="marker.id"></ui-gmap-marker>'+
              '</ui-gmap-google-map>'+
            '</div>'+
            noteServizio +
            (isContactCenter ? actions : '') +
          '</div>',
          className: 'ngdialog-theme-default ngdialog-appointment-detail service-'+serviceNumber(info.tipoServizio.prestazione),
          plain: true,
          //showClose: false,
          controller: ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', function($scope, uiGmapGoogleMapApi, uiGmapIsReady){
            var styles = JSON.parse('[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]');

            $scope.appointmentInfo = info;

            $scope.map = {
              center: { latitude: parseFloat(info.indirizzoPrestazione.latitudine), longitude: parseFloat(info.indirizzoPrestazione.longitudine) },
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
              coords: { latitude: parseFloat(info.indirizzoPrestazione.latitudine), longitude: parseFloat(info.indirizzoPrestazione.longitudine) },
              options: { draggable: false  }
            };

            $scope.showUserProfile = function(){
              self.showUserProfile(info.cliente);
            }

            $scope.cancelAppointment = function(){
              $scope.closeThisDialog();
              cancelAppointment(info.cliente.id, idAppoint);
            }

            $scope.editAppointment = function(id){
              if($state.includes('main.support')){
                $scope.closeThisDialog();
                editAppointmentContactCenter(info.cliente.id, idAppoint);
              }
            }


          }]
        });
      }, function(data){
        self.modal({ title: 'Errore', content: 'Impossibile trovare la informazioni dell\' appuntamento richiesto. Assicurati che l\'appuntamento non sia stato cancellato.' });
        return;
      });
    }

    self.editProfile = function(id){
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div><h3>Modifica informazioni profilo</h3><p>Puoi modificare le seguenti informazioni:</p></div>'+
          '<div layout="column" layout-fill layout-margin layout-align="space-around center" class="padding-top big">'+
            '<div layout="row" layout-fill><md-checkbox flex ng-model="amanteAnimali" aria-label="Amante animali" class="md-default-theme">Amante animali</md-checkbox></div>'+
            '<div layout="row" layout-fill>'+
              '<md-checkbox ng-model="smartPhone" aria-label="Possessore smartphone" class="md-default-theme checkbox-select"></md-checkbox>'+
              '<md-select ng-disabled="!smartPhone" flex placeholder="Possessore smartphone" class="md-default-theme" ng-model="smartPhoneDettaglio">'+
                '<md-option ng-repeat="option in ::options.smartPhone" value="{{::option.value}}">{{::option.name}}</md-option>'+
              '</md-select>'+
            '</div>'+
            '<div layout="row" layout-fill>'+
              '<md-checkbox ng-model="accessoInternet" aria-label="Accesso ad internet" class="md-default-theme checkbox-select"></md-checkbox>'+
              '<md-select ng-disabled="!accessoInternet" flex placeholder="Accesso a internet" class="md-default-theme" ng-model="accessoInternetDettaglio">'+
                '<md-option ng-repeat="option in ::options.accessoInternetDettaglio" value="{{::option.value}}">{{::option.name}}</md-option>'+
              '</md-select>'+
            '</div>'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default',
        plain: true,
        controller: ['$scope', function($scope){
          $scope.confirm = function(){
            callback();
            $scope.closeThisDialog();
          }
          $scope.reject = function(){
            callback(true);
            $scope.closeThisDialog();
          }
        }]
      });
    }

    function cancelAppointment(idCustomer, idAppoint){
      // if is contact center
      if($state.includes('main.support')){
        cancelAppointmentModalContactCenter(idCustomer, idAppoint);
      }
    }

    function editAppointmentContactCenter(idCustomer, idAppoint){
      $state.go('main.support.edit-appointment', { idAppoint: idAppoint, idCustomer: idCustomer });
    }

    function cancelAppointmentModalContactCenter(idCustomer, idAppoint){
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
            var deleteP = RestService.deleteCustomerAppointmentContactCenter(idCustomer, idAppoint);
            deleteP.then(function(data){
              //CalendarService.cancelEvent(idAppoint);
              $rootScope.$broadcast("ContactCenterDeletedAppointment", idAppoint);
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

    function serviceNumber(service){
      var serviceMap = {
          Colf: 1,
          Badante: 2,
          BabySitter: 3
      }
      if(serviceMap[service] !== undefined)
        return serviceMap[service]
      else
        return 0;
    }

    function serviceName(service){
      var serviceMap = {
          Colf: 'Colf',
          Badante: 'Badante',
          BabySitter: 'Baby Sitter'
      }
      if(serviceMap[service] !== undefined)
        return serviceMap[service]
      else
        return "";
    }

}
