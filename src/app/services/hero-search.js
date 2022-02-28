/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function HeroSearchService (
    $timeout, $state, AssetsStore, Services, RestService, ngDialog, $document, User
) {
    "ngInject";

    var self = this;

    self.getHeroSearchOptions = function(options){
      /*
       *  options: preselect (String)         : Id competenza da preselezionare
       *           disableSelection (Bool)    : Disable service selection
       *           resetHeroesFunction (Bool) : Enables reset function for heroes
       *           bookingType (String)       : Specify the type of booking (Carnet/Standard)
       */
      var data = {}

      // Opzioni per i filtri di ricerca
      data.opzioni = {
        servizi: [
          { id: 'ATT-00000000-0000-0000-0001-000000000001', label: Services.Label('TS-0000-0000-0000-0001') }, // badante
          { id: 'ATT-00000000-0000-0000-0001-000000000002', label: Services.Label('TS-0000-0000-0000-0002') }, // baby sitter
          { id: 'ATT-00000000-0000-0000-0001-000000000003', label: Services.Label('TS-0000-0000-0000-0003') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000004', label: Services.Label('TS-0000-0000-0000-0004') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000005', label: Services.Label('TS-0000-0000-0000-0005') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000006', label: Services.Label('TS-0000-0000-0000-0006') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000007', label: Services.Label('TS-0000-0000-0000-0007') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000008', label: Services.Label('TS-0000-0000-0000-0008') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000009', label: Services.Label('TS-0000-0000-0000-0009') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000010', label: Services.Label('TS-0000-0000-0000-0010') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000011', label: Services.Label('TS-0000-0000-0000-0011') }, // colf
          { id: 'ATT-00000000-0000-0000-0001-000000000012', label: Services.Label('TS-0000-0000-0000-0012') }, // fisioterapia
          { id: 'ATT-00000000-0000-0000-0001-000000000013', label: Services.Label('TS-0000-0000-0000-0013') }, // fisioterapia
          { id: 'ATT-00000000-0000-0000-0001-000000000027', label: Services.Label('TS-0000-0000-0000-0027') }, // fisioterapia
          { id: 'ATT-00000000-0000-0000-0001-000000000003A', label: Services.Label('TS-0000-0000-0000-0003A') }  // fisioterapia
        ],
        conoscenzaItaliano: [
          { id : 'Scarsa', label : "Italiano Scarso"},
          { id : 'Discreta', label : "Italiano Discreto"},
          { id : 'Media', label : "Italiano Medio"},
          { id : 'Buona', label : "Italiano Buono"},
          { id : 'Ottima', label : "Italiano Ottimo"},
          { id : 'Madrelingua', label : "Italiano Madrelingua"}
        ],
        conoscenzaInglese: [
          { id : 'ATT-00000000-0000-0000-0003-000000000011', label : "Inglese Scarso"},
          { id : 'ATT-00000000-0000-0000-0003-000000000012', label : "Inglese Discreto"},
          { id : 'ATT-00000000-0000-0000-0003-000000000013', label : "Inglese Medio"},
          { id : 'ATT-00000000-0000-0000-0003-000000000014', label : "Inglese Buono"},
          { id : 'ATT-00000000-0000-0000-0003-000000000015', label : "Inglese Ottimo"},
          { id : 'ATT-00000000-0000-0000-0003-000000000016', label : "Inglese Madrelingua"}
        ],
        conoscenzaFrancese: [
          { id : 'ATT-00000000-0000-0000-0003-000000000001', label : "Francese Scarso"},
          { id : 'ATT-00000000-0000-0000-0003-000000000002', label : "Francese Discreto"},
          { id : 'ATT-00000000-0000-0000-0003-000000000003', label : "Francese Medio"},
          { id : 'ATT-00000000-0000-0000-0003-000000000004', label : "Francese Buono"},
          { id : 'ATT-00000000-0000-0000-0003-000000000005', label : "Francese Ottimo"},
          { id : 'ATT-00000000-0000-0000-0003-000000000006', label : "Francese Madrelingua"}
        ],
      }

      // sottocompetenze
      data.sottocompetenze = {
        'ATT-00000000-0000-0000-0001-000000000003': [{
          id: 'ATT-00000000-0000-0000-0002-000000000006',
          label: "Stirare",
          parent: 'ATT-00000000-0000-0000-0001-000000000003',
          icon: false
        }], //Services.Details('ATT-00000000-0000-0000-0001-000000000003'),
        'ATT-00000000-0000-0000-0001-000000000001': Services.ActiveDetails('ATT-00000000-0000-0000-0001-000000000001'),
        'ATT-00000000-0000-0000-0001-000000000002': Services.ActiveDetails('ATT-00000000-0000-0000-0001-000000000002'),
      }

      // error
      data.error = {
        shown: false,
        message: ''
      }

      data.showFilters = true;
      data.showResults = false;
      data.activeSearch = "";

      // Risultati ricerca: supereroi
      data.results = [];

      // View/model per i filtri
      data.filtri = {}

      // Preselect filters if necessary
      if(options.preselect) data.filtri.idCompetenza = options.preselect;

      // Disable selection when necessary
      if(options.disableSelection) data.preSelection = options.disableSelection;

      if(options.disableHeroProfile) data.disableHeroProfile = true;

      data.updateFilters = function(){
        var filters = {
          idCompetenza: '',
          labels: []
        };

        if(options.bookingType == 'carnet'){
          filters.idCarnet = options.idTipoCarnet;
        }

        // cap
        if(data.filtri.cap){
          filters.cap = data.filtri.cap;
          filters.labels.push('Cap: '+data.filtri.cap);
        }

        // amante animali
        if(data.filtri.amanteAnimali) {
          filters.amanteAnimali = data.filtri.amanteAnimali;
          filters.labels.push('Amante degli animali');
        }

        // disponibilita WE
        if(data.filtri.disponibilitaWeekEnd) {
          filters.disponibilitaWeekEnd = data.filtri.disponibilitaWeekEnd;
          filters.labels.push('Disponibilità nel week end');
        }

        // disponibilità notturna
        if(data.filtri.disponibilitaNotturna) {
          filters.disponibilitaNotturna = data.filtri.disponibilitaNotturna;
          filters.labels.push('Disponibilità notturna');
        }

        // competenza principale
        if(data.filtri.idCompetenza) {
          filters.idCompetenza = data.filtri.idCompetenza;
          $timeout(function(){
            data.activeSearch = Services.Competenze.Label(data.filtri.idCompetenza);
          });
          filters.competenza = Services.Competenze.Label(data.filtri.idCompetenza);

        }

        // sottocompetenze
        if(data.filtri.idCompetenza && data.filtri.sottocompetenze){
          filters.idSottoCompetenze = [];
          for(var key in data.filtri.sottocompetenze[data.filtri.idCompetenza]){
            if ( hasOwnProperty.call( data.filtri.sottocompetenze[data.filtri.idCompetenza],  key ) ) {
              if(data.filtri.sottocompetenze[data.filtri.idCompetenza][key]){
                 filters.idSottoCompetenze.push(key);
                 filters.labels.push(Services.detail.Label(key));
               }
            }
          }
          if(filters.idSottoCompetenze.length == 0) filters.idSottoCompetenze = undefined;
          //filters.idSottoCompetenze = data.filtri.idCompetenza;
        }

        // Lingua Italiano
        if(data.filtri.conoscenzaItaliano) {
          filters.conoscenzaItaliano = data.filtri.conoscenzaItaliano;
          filters.labels.push('Conoscenza Italiano: '+data.filtri.conoscenzaItaliano);
        }

        // Lingue straniere
        if(data.filtri.conoscenzaFrancese || data.filtri.conoscenzaInglese){
          filters.idLingue = [];
          if(data.filtri.conoscenzaFrancese) {
            filters.idLingue.push(data.filtri.conoscenzaFrancese);
            var linguaFrancese = _.find(data.opzioni.conoscenzaFrancese, function(f){
              return f.id == data.filtri.conoscenzaFrancese
            });
            filters.labels.push(linguaFrancese.label);
          }
          if(data.filtri.conoscenzaInglese) {
            filters.idLingue.push(data.filtri.conoscenzaInglese);
            var linguaInglese = _.find(data.opzioni.conoscenzaInglese, function(i){
              return i.id == data.filtri.conoscenzaInglese
            });
            filters.labels.push(linguaInglese.label);
          }
        }

        if(!filters.cap){
          data.showError('Devi specificare il CAP.');
        } else if(!filters.idCompetenza){
          data.showError('Devi specificare la competenza richiesta.');
        } else {
          data.resetError();
          data.performSearch(_.clone(filters));
        }

      }

      data.selectHero = function(hero, $event){
        $event.stopPropagation();
        data.results.forEach(function(h){
          h.selected = false;
        });
        hero.selected = true;
        if(!options.carnetIdToChange) {
          hero.capInput = data.filtri.cap;
          console.debug('Selected hero', hero);
        } else {
          $timeout(function(){
            data.resultSelected = hero;
          });

        }
      }

      data.resetHeroes = function(resetFilt){
        data.results.length = 0;
        data.showFilters = true;
        data.showResults = false;
        //Scroll to the exact position
        $document.scrollTop(0, 300);
        if(resetFilt) data.resetFilters();
      }


      // Set up reset function
      if(options.resetHeroesFunction && options.bookingType != "carnet") {
        //bookingService.setResetHeroFunction(data.resetHeroes);
      }

      data.resetFilters = function(){
        $timeout(function(){
          $state.reload($state.current.name);
        });
      }

      data.performSearch = function(fil){
        var filts = _.clone(fil);
        fil.competenza = undefined;
        fil.labels = undefined;
        var searchP = RestService.searchSuperheroes(fil);
        searchP.then(function(heroesSearch){
          data.results.length = 0;
          var heroes = heroesSearch.data.plain();
          heroes.forEach(function(hero){
            data.results.push(data.cleanHero(hero));
          });
          shuffle(data.results);
          if(data.results.length > 0) {
            data.showFilters = false;
          }
          data.showResults = true;
        });
      }

      data.cleanHero = function(hero){
        // set placeholder if image is not defined
        if(!hero.photoUrl)
          hero.photoUrl = AssetsStore.Image('user.placeholder');

        return hero;
      }

      data.showError = function(error){
        data.error.shown = true;
        data.error.message = error;
      }

      data.resetError = function(){
        data.error.shown = false;
        data.error.message = '';
      }

      data.showHeroReferences = function(hero, $event){
        $event.stopPropagation();
        data.showHeroProfile(hero, 'recensioni');
      }

      data.newSearch = function(){
        data.showResults = false;
      }

      data.saveChanges = function(){
        if(data.resultSelected && options.userId && options.carnetIdToChange){
          var updated = RestService.updateCarnetHero(options.userId, options.carnetIdToChange, data.resultSelected.id);
          updated.then(function(data){
            if(_.includes($state.current.name, 'support')) {
              $state.go('main.support.user.carnet');
            } else {
              $state.go('main.user.carnet');
            }

            $timeout(function(){
              $state.reload('main');
            });

            //
          }, function(){
            data.showError('Spiacenti, non è stato possibile effettuare l\'operazione richiesta. Riprovare in seguito.');
          });
        }
      }

      data.showHeroProfile = function(heroData, preselectedTab){
        if(!options.disableHeroProfile) {
            User.showHeroProfile(heroData, () => {  });
            /**
          ngDialog.open({
            template: 'app/user/hero-profile.html',
            className: 'ngdialog-theme-default ngdialog-hero-profile',
            controller: ['$scope', 'HeroProfile', function($scope, HeroProfile){
              var data = HeroProfile.getFormattedData(heroData, preselectedTab);
              data.then(function(d){
                $scope.ctrl = {
                  hero: d
                }
              });
              $scope.disableActions = options.disableActions ? options.disableActions : false;
            }]
          });
          **/
        }
      }

      return data;
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

}
