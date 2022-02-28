/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function ContactCenterService (
    $q, RestService, NotifyService, $state, ngDialog, AssetsStore
){
    "ngInject";

    var self = this;

    // FEEDBACK HANDLING
    self.approveFeedback = function(feedback){
      var confirmed = ngDialog.openConfirm({
        template: 'app/modals/confirm.html',
        controller: ['$scope', function($scope){
          var self = this; $scope.ctrl = self;
          self.title = "Approva recensione";
          self.content = "Sei sicuro di voler approvare la recensione?";
        }]
      });
      confirmed.then(function(){
        var approved = RestService.approveFeedback(feedback.id);
        approved.then(function(){
          $state.reload('main');
        });
      });
    }

    self.disapproveFeedback = function(feedback){
      var confirmed = ngDialog.openConfirm({
        template: 'app/modals/confirm.html',
        controller: ['$scope', function($scope){
          var self = this; $scope.ctrl = self;
          self.title = "Archivia recensione";
          self.content = "Sei sicuro di voler archiviare la recensione?";
        }]
      });
      confirmed.then(function(){
        var disapproved = RestService.disapproveFeedback(feedback.id);
        disapproved.then(function(){
          $state.reload('main');
        });
      });
    }

    self.changePrice = function(appointment, originalPrice){
      var confirmed = ngDialog.open({
        template: 'app/modals/change-price.html',
        className: 'ngdialog-theme-default ngdialog-login',
        controller: ['$scope', 'ContactCenter', function($scope, ContactCenter){
          $scope.ctrl = this;

          this.originalPrice = originalPrice;
          this.newPrice = originalPrice;
          this.saveNewPrice = function(){
            $scope.closeThisDialog();
            ContactCenter.saveNewPrice(appointment, this.newPrice);
          }
        }]
      });
    }

    self.changePriceModel = function(appointment){
      return {
        originalPrice: appointment.costoPrestazione,
        newPrice: appointment.costoPrestazione
      }
    }

    self.changeTimeModel = function(appointment){
      return {
        oldStart: new Date(appointment.dataInizio),
        oldEnd: new Date(appointment.dataFine),
        newStart: new Date(appointment.dataInizio),
        newEnd: new Date(appointment.dataFine),
      }
    }

    self.changeHeroModel = function(appointment){
      var deferred = $q.defer();

      var appointDetails = createAppointmentModel(appointment, false);
      var newHeroQuery = RestService.searchForNewHero(appointDetails);
      newHeroQuery.then(function(searchResults){
        deferred.resolve(cleanHeroes(searchResults.data.plain()));
      }, function(){
        deferred.reject();
      });

      return deferred.promise;
    }

    self.changeHero = function(appointment){
      var appointDetails = createAppointmentModel(appointment, false);
      var newHeroQuery = RestService.searchForNewHero(appointDetails);
      newHeroQuery.then(function(searchResults){
        changeHeroModal(appointment, cleanHeroes(searchResults.data.plain()));
      });
    }

    self.changeStartEnd = function(appointment){
      var confirmed = ngDialog.open({
        template: 'app/modals/change-start-end.html',
        className: 'ngdialog-theme-default',
        controller: ['$scope', 'ContactCenter', function($scope, ContactCenter){
          $scope.ctrl = this;

          this.oldStart = new Date(appointment.dataInizio);
          this.oldEnd = new Date(appointment.dataFine);
          this.newStart = new Date(appointment.dataInizio);
          this.newEnd = new Date(appointment.dataFine);

          this.hasChanged = function(){
            return !(this.oldStart.getTime() == this.newStart.getTime() && this.oldEnd.getTime() == this.newEnd.getTime());
          }

          this.saveNewStartEnd = function(){
            $scope.closeThisDialog();
            ContactCenter.saveNewStartEnd(appointment, this.newStart.getTime(), this.newEnd.getTime());
          }
        }]
      });
    }

    self.saveNewStartEnd = function(appointment, newStart, newEnd){
      var newAppoint = createAppointmentModel(appointment, true);
      newAppoint.appuntamenti[0].dataInizio = newStart;
      newAppoint.appuntamenti[0].dataFine = newEnd;
      var saved = RestService.createEditedAppointmentContactCenter(appointment.id, newAppoint);
      saved.then(function(){
        NotifyService.modal({title: 'Modifiche salvate', content: 'Hai la data di inizio/fine con successo.'});
      }, function(){
        NotifyService.modal({title: 'Errore durante il salvataggio', content: 'È stato riscontrato un errore durante il savataggio. Riprova più tardi.'});
      });
    }

    self.saveNewPrice = function(appointment, newPrice){
      var newAppoint = createAppointmentModel(appointment, true);
      newAppoint.costoPrestazioni = newPrice;
      var saved = RestService.createEditedAppointmentContactCenter(appointment.id, newAppoint);
      saved.then(function(){
        NotifyService.modal({title: 'Modifiche salvate', content: 'Hai modificato il prezzo con successo.'});
      }, function(){
        NotifyService.modal({title: 'Errore durante il salvataggio', content: 'È stato riscontrato un errore durante il savataggio. Riprova più tardi.'});
      });
    }

    self.saveNewHero = function(appointment, heroId){
      var newAppointment = createAppointmentModel(appointment, true);
      newAppointment.idSuperHero = heroId;
      var saved = RestService.createEditedAppointmentContactCenter(appointment.id, newAppointment);
      saved.then(function(){
        NotifyService.modal({title: 'Modifiche salvate', content: 'Hai modificato il supereroe con successo.'});
      }, function(){
        NotifyService.modal({title: 'Errore durante il salvataggio', content: 'È stato riscontrato un errore durante il savataggio. Riprova più tardi.'});
      });
    }

    self.saveEditFutureAppointment = function(appointment, newPrice, newTime, newHero){
        const deferred = $q.defer();
        var newAppointment = createAppointmentModel(appointment, true);
        // set new price if defined
        if(newPrice && _.isNumber(newPrice)) {
            newAppointment.costoPrestazioni = newPrice;
        }
        // set new start/end if defined
        if(newTime && newTime.start && newTime.end) {
            newAppointment.appuntamenti[0].dataInizio = newTime.start;
            newAppointment.appuntamenti[0].dataFine = newTime.end;
        }
        // set new hero if defined
        if(newHero && newHero.id) {
            newAppointment.idSuperHero = newHero.id;
        }

        newAppointment.tipo = 'Appuntamenti';
        var saved = RestService.createEditedAppointmentContactCenter(appointment.id, newAppointment);
        saved.then(function(){
            let modal = NotifyService.modal({title: 'Modifiche salvate', content: 'Hai modificato l\'appuntamento con successo.'});
            return modal.closePromise;
        }, function(){
            let modal = NotifyService.modal({title: 'Errore durante il salvataggio', content: 'È stato riscontrato un errore durante il savataggio. Riprova più tardi.'});
            return modal.closePromise;
        }).then(() => {
            deferred.resolve();
        });

        return deferred.promise;
    }

    self.saveEditPastAppointment = function(appointment, newPrice, newTime){
      // var newAppointment = createAppointmentModel(appointment, true);
      var newAppointment = {};

      // set new price if defined
      if(newPrice && _.isNumber(newPrice) && newTime && newTime.start && newTime.end) {

        newAppointment.costoPrestazione = newPrice;

        newAppointment.dataInizio = newTime.start;
        newAppointment.dataFine = newTime.end;

        var saved = RestService.editPastAppointmentContactCenter(appointment.id, newAppointment);
        saved.then(function(){
          NotifyService.modal({title: 'Modifiche salvate', content: 'Hai modificato l\'appuntamento con successo.'});
        }, function(){
          NotifyService.modal({title: 'Errore durante il salvataggio', content: 'È stato riscontrato un errore durante il savataggio. Riprova più tardi.'});
        });

      }
    }

    self.cancelAppointmentModal = function(appointment){
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
            //self.showAppointmentDetail(idAppoint);
          }
          $scope.cancelAppointment = function(){
            $scope.isLoading = true;
            var deleteP = RestService.deleteCustomerAppointmentContactCenter(appointment.cliente.id, appointment.id);
            deleteP.then(function(data){
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

    function changeHeroModal(appointment, heroes){
      var confirmed = ngDialog.open({
        template: 'app/modals/change-hero.html',
        className: 'ngdialog-theme-default ngdialog-login ngdialog-contct-center',
        controller: ['$scope', 'ContactCenter', function($scope, ContactCenter){
          $scope.ctrl = this;
          this.heroesResults = heroes;
          this.newHeroId = '';
          this.selectHero = function(hero){
            this.heroesResults.forEach(function(h){ h.selected = false; });
            hero.selected = true;
            this.newHeroId = hero.id;
          }
          this.saveNewHero = function(){
            $scope.closeThisDialog();
            ContactCenter.saveNewHero(appointment, this.newHeroId);
          }
        }]
      });
    }

    function createAppointmentModel(order, toEdit){
      var appointment = {
        costoPrestazioni: toEdit ? order.costo : undefined,
        idCarnet: order.idCarnet ? order.idCarnet : undefined,
        idAppuntamentoDaModificare: toEdit ? order.id : undefined,
        idSuperHero: order.superHero ? order.superHero.id : undefined,
        indirizzoFatturazione: {
          id: order.indirizzoFatturazione.id
        },
        appuntamenti: [{
          dataInizio: order.dataInizio,
          dataFine: order.dataFine,
          cellulare: order.cliente.cellulare,
          email: order.cliente.email,
          nome: order.cliente.nome ? order.cliente.nome : order.cliente.nomeCompleto,
          cognome: order.cliente.cognome ? order.cliente.cognome : order.cliente.nomeCompleto,
          jsonDettagliServizio: order.jsonDettagliServizio,
          note: order.note ? order.note : '',
          tipoIngresso: order.tipoIngresso ? order.tipoIngresso : '',
          sottoCompetenze: order.sottoCompetenze ? order.sottoCompetenze : [],
          tipoServizio: {
            id: order.tipoServizio.id
          },
          indirizzoPrestazione: {
            id: order.indirizzoPrestazione.id,
          }
        }],
      }
      return appointment;
    }

    function cleanHeroes(heroes){

      heroes.forEach(function(h){
        if(!h.photoUrl) h.photoUrl = AssetsStore.Image('user.placeholder');
        h.nomeCompleto = h.nome + ' ' + h.cognome;
      });

      return heroes;
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
