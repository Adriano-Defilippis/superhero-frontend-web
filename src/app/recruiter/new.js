'use strict';

export default function RecruiterNewProfilesController (
    $scope, $state, $timeout, $window, ApplicationForm, RestService, NotifyService, HeroUtilities, attributes
) {
    "ngInject";

  	var self = this,
        options = _.clone(ApplicationForm.options),
        stati = _.clone(ApplicationForm.stati),
        landing = $state.includes('landing'),
        provincie = _.clone(ApplicationForm.provincie);

    self.uploaderFileUrl = "app/form/uploader-new.html";
    self.moreInfo = "app/form/additional.html";
    self.zonesPanel = "app/form/zones.html";
    self.additionalVatInfo = "app/form/additional-vat-info.html";
    self.formTitle = "Crea nuova candidatura";
    self.submitButton = "Crea nuova candidatura";

    self.showRequiredError = false;
    self.formDisabled = false;
    self.isLoading = false;
    self.isNew = true;

    self.labels = _.clone(ApplicationForm.labels);

    // Datepicker options
    self.datePicker = ApplicationForm.datePickerOptions(self);

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

    //self.heroApplication = _.cloneDeep(ApplicationForm.formModel); // form model
    self.heroApplication = ApplicationForm.createNewFormModel(attributes.data.plain());

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
        var p = ApplicationForm.sendNewApplication(self.heroApplication);
        p.then(function(data){
          if(data.status === 201) {
            var newHeroId = data.data.id;

            if(self.imgUploader.queue.length > 0){
              uploadImg(newHeroId, function(){
                if(self.cvUploader.queue.length > 0){
                  uploadCv(newHeroId, function(){
                    successForm();
                  });
                } else {
                  successForm();
                }
              });
            } else {
              if(self.cvUploader.queue.length > 0){
                uploadCv(newHeroId, function(){
                  successForm();
                });
              } else {
                successForm();
              }
            }
          }
        }, function(data){
          self.isLoading = false;
          var content = ApplicationForm.getErrorContent(data.data);
          NotifyService.modal({ title: 'Errore nella validazione dei dati', content: content });
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

    self.imgUploader = ApplicationForm.imgFileUploader($scope);
    self.cvUploader = ApplicationForm.cvFileUploader($scope);

    // init selected zones
    self.selectedZones = [];

    self.aliquotaChanged = function (aliquotaOption) {
        if (aliquotaOption === 'RegimeMinimi') {
            self.heroApplication.opzioniRitenuta = "No";
        }
    }

    self.checkIfStiro = function(value) {
      if(value.sottocompetenza.id === "ATT-00000000-0000-0000-0002-000000000006") {
        const index = _.findIndex(self.heroApplication._attributes, {id: "ATT-00000000-0000-0000-0001-000000000013"});
        self.heroApplication._attributes[index].selected = value.sottocompetenza.selected;
      }
    }


    function successForm(){
      self.isLoading = false;
      NotifyService.modalRefresh({title:"Candidatura inviata!", content:"Grazie per averci inviato la tua candidatura. Sarai contattato al più presto!", target: landing ? 'main.guest.welcome' : 'main.recruiter.new'});
    }

    function uploadImg(newHeroId, callback){
      if(self.imgUploader !== undefined && self.imgUploader.queue.length > 0) {
        self.imgUploader.queue.forEach(function(item){
          item.url = RestService.getPhotoUploadUrl(newHeroId);
          item.onSuccess = function(){
            callback();
            //NotifyService.modalRefresh({title:"Nuova candidatura creata!", content:"La candidatura è stata creata con successo. È possibile modificarla nella seziona Visualizza Candidature."});
          }
          item.upload();
        });
      }
    }

    function uploadCv(newHeroId, callback){
      if(self.cvUploader !== undefined && self.cvUploader.queue.length > 0) {
        self.cvUploader.queue.forEach(function(item){
          item.url = RestService.getCvUploadUrl(newHeroId);
          item.onSuccess = function(){
            callback();
            //NotifyService.modalRefresh({title:"Nuova candidatura creata!", content:"La candidatura è stata creata con successo. È possibile modificarla nella seziona Visualizza Candidature."});
          }
          item.upload();
        });
      }
    }

}
