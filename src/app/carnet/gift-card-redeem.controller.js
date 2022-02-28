'use strict';

export default function RedeemGiftCardController (
    $scope, $rootScope, ngDialog, User,  $state, $stateParams, AssetsStore, Carnet, RestService, $ngRedux, CarnetActions
){
    "ngInject";

    var self = this;
    $scope.ctrl = self;

    self.title = "acquisto carnet";
    self.subTitle = "Hai ricevuto una Gift Card? Puoi riscattarla in un qualsiasi momento per ottenere un carnet a tua scelta!";
    self.selectedService = 1;
    self.selectedCarnet = "";
    self.headerImage = AssetsStore.Image('home.pageHeaders.useGiftCard');
    self.loggedUser = 0;
    self.carnetAllList = User.carnetActive;


    // If user is logged try to load carnet list from server
    if ($rootScope.logged) {
        var filters = {  dataCreazioneMin: moment().subtract(24, 'months').format('DDMMYYYY'), dataCreazioneMax: moment().add(12, 'months').format('DDMMYYYY') };
        RestService.getCustomerCarnetList($rootScope.userId, filters).then(function (data) {
            var userCarnetList = data.data.plain();
            User.injectCarnetList(userCarnetList);
        });
    }

    // check if is logged
    if($rootScope.logged){
      self.loggedUser = 1;
    } else {
      self.loggedUser = 0;
    }

    self.model = {
      headerImage : AssetsStore.Image('home.heroBox.one'),
      carnetList : Carnet.getGiftCardCarnets(),
      panes : [{
        header : "Cos'è un carnet",
        content : "Il Carnet de ilmioSupereroe.it è uno strumento estremamente vantaggioso e flessibile per usufruire dei servizi offerti. Il Carnet ti permette di acquistare un numero di ore minimo (diverso a seconda della tipologia di Carnet) ad una tariffa oraria più bassa e con una maggiore flessibilità gestionale."
      },
      {
      header : "Come funziona il Carnet",
      content : 'La stipula del Carnet prevede l\'identificazione di uno specifico Supereroe che ti supporterà in modo dedicato e che dovrai selezionare al momento dell\'attivazione. Una volta attivato, il tuo Carnet, non solo ti consentirà di spendere meno, ma ti permetterà anche di godere della massima flessibilità e semplicità nella sua gestione ed utilizzo, attraverso funzionalità e regole dedicate:'+
                '<ul class="list">'+
                '<li>Potrai effettuare la prenotazione dei servizi in pochi istanti, usando le ore che hai già acquistato;</li>'+
                '<li>In caso di necessità, potrai cancellare o modificare ad un costo inferiore i tuoi appuntamenti;</li>'+
                '<li>Se lo desideri, potrai cambiare in qualunque momento il Supereroe da te prescelto;</li>'+
                '<li>Le prenotazioni in fascia oraria notturna o l\'assistenza di più di 1 bambino dal servizio Baby Sitter, non avranno alcun sovrapprezzo per te.</li></ul>'+
                'Importante: ogni Carnet ha un periodo di validità entro il quale dovranno ricadere le date delle prenotazioni effettuate ed entro il quale dovrà essere completamente utilizzato. Eventuali ore non consumate verranno fatturate alla scadenza.',
      }
      ],
    };

    let watcher = $scope.$watch(() => Carnet.getGiftCardCarnets(), (newV, oldV) => {
        if (newV.length > 0) {
            self.model.carnetList = newV;
            watcher();
        }
    });

    self.showDiscount = function ()
    {
        var userIsLogged = $rootScope.logged;
        var userHasCarnet = self.carnetAllList.length >= 1;
        return false;
    }

    self.changeService = function (service)
    {
        if (service === 1) self.selectedCarnet = self.model.carnetColf;
        else if (service === 2) self.selectedCarnet = self.model.carnetBadante;
        else if (service === 3) self.selectedCarnet = self.model.carnetBabySitter;
    };

    self.buyCarnet = (carnet) => {
        $ngRedux.dispatch(CarnetActions.startBookingAndSelectCarnet(carnet));
    }

  }
