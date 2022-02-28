'use strict';

export default function RecruiterEditHeroController (
    $scope, $state, $timeout, $window, ApplicationForm, hero, ngDialog, HeroUtilities, NotifyService, RestService, RecruiterService, attributes
) {
    "ngInject";

  	var self = this,
        options = _.clone(ApplicationForm.options),
        stati = _.clone(ApplicationForm.stati),
        provincie = _.clone(ApplicationForm.provincie),
        heroId = hero.data.id;

    self.formDisabled = false;
    self.alreadyHero = true;
    self.enabledHero = hero.data.plain().stato !== 'Disattivo';
    console.log(self.enabledHero);
    self.isLoading = false;
    self.heroApplication = ApplicationForm.createFormModel(hero.data.plain(), attributes.data.plain());
    if(self.heroApplication.stato === "DaAttivare")
      self.alreadyHero = false;


    self.isNew = !hero.data.plain().presoInCarico && !self.alreadyHero;

    self.uploaderFileUrl = "app/form/uploader-edit.html";
    self.moreInfo = "app/form/additional.html";
    self.zonesPanel = "app/form/zones.html";
    self.additionalVatInfo = "app/form/additional-vat-info.html";
    self.formTitle = self.formDisabled ? "Visualizza profilo" : "Modifica profilo";
    self.submitButton = "Crea nuova candidatura";

    self.showRequiredError = false;


    self.labels = _.clone(ApplicationForm.labels);

    // Datepicker options
    self.datePicker = {
      visible: false,
      options: { showWeeks: false,
        startingDay: 1,
        maxMode: 'year',
        minMode: 'day'
      },
      show: function(){
        $timeout(function(){
          self.datePicker.visible = true;
        });
      },
      hide: function(){
        $timeout(function(){
          self.datePicker.visible = false;
        });
      }
    };

    self.options = {
      smartPhone : options.smartphone,
      accessoInternetDettaglio: options.internetAccess,
      conoscenzaItaliano : options.languageKnowledgeItalian,
      conoscenzaInglese : options.languageKnowledgeEnglish,
      conoscenzaFrancese : options.languageKnowledgeFrench,
      titoloStudio : options.studyDegree,
      esperienzaPregressa : options.experience,
      oreSettimanaliDisponibili: options.availability,
      partitaIvaTipo: options.partitaIva,
      parlareDiNoi: options.aboutUs,
      tipoImpiego: options.hired,
      provincie: provincie,
      stati: stati,
      autoMunitoDettaglio: options.autoMunito,
      altreLingueDettaglio : options.otherLanguages,
      maxDistanzaPercorribile: options.maxDistance,
      modalitaOperativa: options.modalitaOperativa,
      opzioniAliquota: options.opzioniAliquota,
      opzioniRitenuta: options.opzioniRitenuta
    };


    self.uploadPhoto = function(){
      ApplicationForm.getModalPicture(heroId, function(newUrl){
        $timeout(function(){
          self.heroApplication.photoUrl = newUrl;
        });
      });
    };

    self.uploadCv = function(){
      ApplicationForm.getModalCv(heroId, function(newUrl){
        $timeout(function(){
          self.heroApplication.cvUrl = newUrl;
        });
      });
    };

    self.checkIfStiro = function(value) {
      if(value.sottocompetenza.id === "ATT-00000000-0000-0000-0002-000000000006") {
        const index = _.findIndex(self.heroApplication._attributes, {id: "ATT-00000000-0000-0000-0001-000000000013"});
        self.heroApplication._attributes[index].selected = value.sottocompetenza.selected;
      }
    }

    self.copyPasteError = function(e) {
      e.preventDefault();
      NotifyService.modal({ title: "Copia incolla non consentito", content: "" });
    }

    self.submitForm = function(isValid){
      self.heroApplication.codiceFiscale = self.heroApplication.codiceFiscale.toUpperCase().trim();
      self.heroApplication.confermaCodiceFiscale = self.heroApplication.confermaCodiceFiscale.toUpperCase().trim();

      if (self.heroApplication.codiceFiscale !== self.heroApplication.confermaCodiceFiscale) {
        NotifyService.modal({ title: "Codice fiscale non valido", content: "I codici fiscali inseriti non corrispondo. Prego ricontrollare." });
        isValid = false;
        self.isLoading = false;
      } 

      if (isValid) {
        self.isLoading = true;
        self.heroApplication.zone = HeroUtilities.getZonesFullStructure(self.selectedZones);
        var p = ApplicationForm.updateApplication(heroId, self.heroApplication);
        p.then(function(data){
          ApplicationForm.modalResponse(data.status);
          self.isLoading = false;
        });
      } else {
        self.showRequiredError = true;
        self.isLoading = false;
        NotifyService.modal({ title: 'Ricontrollare i campi inseriti', content: 'Impossibile procedere con la candidatura: alcuni campi contengono valori errati oppure sono incompleti.' });
        $timeout(function(){
          $(window).scrollTop(0);
        });
      }
    };

    // init selected zones
    self.selectedZones = HeroUtilities.getZonesArray(hero.data.plain().zone);

    self.approveHero = function(){
      var heroData = hero.data.plain();
      if(self.heroApplication.photoUrl) heroData.photoUrl = self.heroApplication.photoUrl;
      if(self.heroApplication.photoUrl) heroData.cvUrl = self.heroApplication.cvUrl;
      ApplicationForm.approveHero(heroData);
    }

    self.prendiInCarico = function(){
      var heroData = hero.data.plain();
      var p = RestService.prendiInCarico(heroData.id);
      p.then(function(){
        $state.reload('main');
      }, function(){

      });
    }


    self.aliquotaChanged = function (aliquotaOption) {
        if (aliquotaOption === 'RegimeMinimi') {
            self.heroApplication.opzioniRitenuta = "No";
        }
    }

    self.disableHero = function ()
    {
        RecruiterService.disableHero(heroId);
    }

    self.reenableHero = function ()
    {
        RecruiterService.reenableHero(heroId);
    }

}
