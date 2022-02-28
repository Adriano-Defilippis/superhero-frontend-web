'use strict';

export default function ContactCenterHeroesController (
    $scope, heroes, ngDialog, RestService
) {
    "ngInject";

    var self = this;

    self.heroes = [];

    if(heroes.data.plain().length > 0){
      var tempHeroes = [];
      heroes.data.plain().forEach(function(hero){
        hero.dataFormattedRegistrazione = moment(hero.dataRegistrazione).format('DD/MM/YYYY');

        hero.formattedEta = moment(hero.dataNascita).fromNow(true);
        if(hero.referenzeBabySitter || hero.referenzeBadante || hero.referenzeColf){
          hero.referenze = "Si"
        } else {
          hero.referenze = "No"
        }

        if(hero.competenze){
          var competenze = hero.competenze.split(',');
          var index = 0;
          var newCompetenze = '';
          competenze.forEach(function(c){
            newCompetenze += c
            if(index < competenze.length-1){
              newCompetenze += '<br>';
            }
            index += 1;
          });

          if (hero.autoMotoMunito) {
            hero.autoMotoMunito = 'Si';
          } else {
            hero.autoMotoMunito = 'No';
          }

          hero.indirizzo = hero.indirizzoDomicilio ? `${hero.indirizzoDomicilio.via} ${hero.indirizzoDomicilio.numeroCivico}, ${hero.indirizzoDomicilio.citta}, ${hero.indirizzoDomicilio.cap} (${hero.indirizzoDomicilio.provincia})` : '';

          hero.searchField1 = hero.nome + hero.cognome + hero.competenze + hero.cellulare + `${hero.indirizzoDomicilio.via} ${hero.indirizzoDomicilio.numeroCivico}, ${hero.indirizzoDomicilio.citta}, ${hero.indirizzoDomicilio.cap} (${hero.indirizzoDomicilio.provincia})`;
          hero.searchField2 = hero.nome + hero.cognome + hero.competenze + hero.cellulare + `${hero.indirizzoDomicilio.via} ${hero.indirizzoDomicilio.numeroCivico}, ${hero.indirizzoDomicilio.citta}, ${hero.indirizzoDomicilio.cap} (${hero.indirizzoDomicilio.provincia})`;

          hero.competenze = newCompetenze;
        } else {
          hero.competenze = '<i>nessuna</i>';
        }

        tempHeroes.push(hero);
      });

      self.openMessageModal = () => {
        const heroes = self.heroes;
        const superheroes = _.filter(heroes, { selected: true });
        if (superheroes && superheroes.length) {
          ngDialog.open({
              template: `
                <div>
                  <div class="row margin-top-small">
                    <h4 class="center">Inserisci un messaggio da inviare ai Supereroi selezionati</h4>
                    <div class="col s12">
                        <div input-field=""><div class="input-field">
                            <textarea class="materialize-textarea ng-valid ng-dirty ng-valid-parse ng-touched" ng-model="ctrl.message"></textarea>
                            <label class="">Messaggio</label>
                        </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col s12">
                      <a
                        class="waves-effect waves-light main-orange btn margin-top-small"
                        style="float: right;"
                        ng-click="ctrl.sendMessage()"
                      >
                        Invia
                      </a>
                    </div>
                  </div>
                </div>
              `,
              plain: true,
              controller: ['$scope', function($scope) {
                  this.message = '';
                  this.sendMessage = () => {
                    RestService.sendMessageToSuperheroes(_.map(superheroes, sh => sh.id), this.message)
                    .then(() => {
                      $scope.closeThisDialog();
                      ngDialog.open({
                        template: `
                          <div>
                            <div class="row margin-top-small">
                              <h4 class="center">Messaggio inviato con successo</h4>
                            </div>
                          </div>
                        `,
                        plain: true,
                        controller: function() {},
                        });
                    })
                    .catch(() => {
                      ngDialog.open({
                        template: `
                          <div>
                            <div class="row margin-top-small">
                              <h4 class="center">Errore nell'invio del messaggio</h4>
                            </div>
                          </div>
                        `,
                        plain: true,
                        controller: function() {},
                        });
                    });
                  }
              }],
              controllerAs: 'ctrl'
          });
        } else {
          ngDialog.open({
            template: `
              <div>
                <div class="row margin-top-small">
                  <h4 class="center">Seleziona almeno un Supereroe a cui inviare il messaggio</h4>
                </div>
              </div>
            `,
            plain: true,
            controller: function() {},
            });
        }
      }

      self.allSHSelected = false;

      self.toggleAllSHSelected = () => {
        angular.forEach(self.heroes, (sh) => {
          sh.selected = self.allSHSelected;
        });
      }

      self.heroes.length = 0;
      self.heroes.push.apply(self.heroes, tempHeroes);
    }
  }
