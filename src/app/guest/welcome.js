'use strict';

export default function GuestWelcomeController (
    $scope, $rootScope, $stateParams, $state, $timeout, AssetsStore, LoginService, uiGmapGoogleMapApi, SERVICES
){
    "ngInject";

    var ctrl = this,
        serviceToShow,
        subServiceToShow,
        autocompletes = {},
        selectedService = 0,
        loggedUser = 0,
        codiceSconto,
        isTecma,
        isSky;


    // check if is logged
    if($rootScope.logged){
      ctrl.loggedUser = 1;
    } else {
      ctrl.loggedUser = 0;
    }

    ctrl.isBnb = _.includes($state.current.url, 'BNB');

    // check if user comes from different origin
    if ($stateParams.ref === 'adword') {
        ctrl.codiceSconto = 'PA1';
    } else if ($stateParams.ref === 'banner') {
        ctrl.codiceSconto = 'PB1';
    } else if ($stateParams.ref === 'remarketing') {
        ctrl.codiceSconto = 'PR1';
    } else if ($stateParams.ref === 'facebook') {
        ctrl.codiceSconto = 'PF1';
    } else {
        ctrl.codiceSconto = false;
    }

    ctrl.gotoHeroSelection = function(){
      if (ctrl.isBnb) {
        $state.go('booking.bnbHerosearch');
      } else {
        $state.go('booking.herosearch');
      }
    }



    // action for logging
    if($stateParams.azione === 'connetti'){
      $timeout(function(){
        LoginService.showLogin();
      }, 100);
    }

    // landing servizio specifico
    if($stateParams.servizio){
      serviceToShow = $stateParams.servizio;
      if ($stateParams.sottoServizio) {
        subServiceToShow = $stateParams.sottoServizio;
      }
      ctrl.landingService = serviceToShow;
      ctrl.landingSubService = subServiceToShow;
      if(serviceToShow === 'colf')
        selectedService = 1;
      else if(serviceToShow === 'badante')
        selectedService = 2;
      else if(serviceToShow === 'baby-sitter')
        selectedService = 3;
      else if(serviceToShow === 'personal-trainer')
        selectedService = 4;
      else if(serviceToShow === 'stiro')
        selectedService = 5;
      else if(serviceToShow === 'fisioterapista')
        selectedService = 6;
      else if(serviceToShow === 'tuttofare')
        selectedService = 7;
      else if(serviceToShow === 'tecma') {
        selectedService = null;
        ctrl.isTecma = true;
      }
      else if(serviceToShow === 'sky') {
        if (ctrl.loggedUser === 1 && $rootScope.company === 'SKY') {
          $state.go('main.guest.skylanding');
        }
      }
      else if(serviceToShow === 'carnet-estivo') {
        selectedService = null;
      }
      else
        $state.go('main.guest.welcome');
    }

    let disabledServices = [SERVICES.CHECKIN_CHECKOUT, SERVICES.COLF_BNB];

    if (ctrl.isBnb) {
      disabledServices = [
        SERVICES.COLF,
        SERVICES.PERSONALTRAINER,
        SERVICES.FISIOTERAPISTA,
        SERVICES.BADANTE,
        SERVICES.GINNASTICAPOSTURALE,
        SERVICES.BABYSITTER,
        SERVICES.STIRATURA,
      ];
    }

    ctrl.disabledServices = disabledServices;

    ctrl.isHome = selectedService === 0;

    ctrl.myInterval = 3000;

    ctrl.specificContent = {
      specs: false
    };


    ctrl.homeContent = {
      sliderTop: [
        { main: "Rilassati, riprenditi il tuo tempo", secondary: "Non hai tempo per lo yoga? Le pulizie lasciale a noi", image: '' }
      ],
      // landing section content
      mainTaglineOne: "Rilassati, riprenditi il tuo tempo",
      secondaryTaglineOne: "Non hai tempo per lo yoga? Le pulizie lasciale a noi",
      mainTaglineTwo: "Rilassati, riprenditi il tuo tempo",
      secondaryTaglineTwo: "Gita fuori città con i piccoli? Il nonno resta in buona compagnia",
      mainTaglineThree: "Rilassati, riprenditi il tuo tempo",
      secondaryTaglineThree: "Weekend romantico solo tu e lei? I tuoi bimbi affidali a noi",
      // divider slider section content
      sliderSectionTagline: "I nostri supereroi sono persone...",
      secondaryQuoteOne: "Con la PASSIONE per il proprio lavoro",
      secondaryQuoteTwo: "Con la SENSIBILITA’ per interpretare fino in fondo i tuoi bisogni",
      secondaryQuoteThree: "Con l’ESPERIENZA per soddisfare al meglio ogni tua richiesta",
      secondaryQuoteFour: "Con il SORRISO per affrontare con energia le sfide di ogni giorno",
      // service-box section data
      serviceBoxTitle: "Come funziona?",
      serviceBoxSubtitle: "Clicca per scegliere quello che fa per te",
      becomeHeroTitle: 'Vuoi diventare un supereroe?',
      carnetBadge: AssetsStore.Icon('badge.carnet'),

      serviceBoxList: [
        {
          id: 1,
          title: "Scegli il servizio",
          icon : AssetsStore.Icon('serviceBox.search'),
          content: "Seleziona il servizio che ti è necessario, indicandoci le tue esigenze specifiche! Sapremo selezionare tra i nostri Supereroi la persona più adatta a te!"
        },
        {
          id: 1,
          title: "Prenota il tuo supereroe",
          icon : AssetsStore.Icon('serviceBox.book'),
          content: "Decidi tu come e quando hai bisogno del tuo Supereroe. Puoi contattarlo per un’emergenza o affidarti a lui per i bisogni di ogni giorno. \n Prenota online in pochi minuti!"
        },
        {
          id: 1,
          title: "Riprenditi il tuo tempo!",
          icon : AssetsStore.Icon('serviceBox.relax'),
          content: "Cos’hai in programma? Una cena romantica, un weekend fuori porta o un pomeriggio di shopping? \n Rilassati, a tutto il resto ci pensa il tuo supereroe!"
        }
      ],
      // heroes-box section data
      ourStoriesTitle: "Conosci i nostri supereroi",
      heroesBoxList: [
        {
          id: 1,
          title: "Colf",
          image: AssetsStore.Image('home.heroBox.one'),
          icon: AssetsStore.Icon('service.one'),
          competenza: 'ATT-00000000-0000-0000-0001-000000000003',
          content:"Le nostre Colf sono specializzate per svolgere tutte le mansioni domestiche e per tenere la tua casa o l’ufficio sempre puliti e in ordine. Puoi prenotarle per le pulizie di casa o di uffici."
        },
        {
          id: 2,
          title: "Badanti",
          image: AssetsStore.Image('home.heroBox.two'),
          icon: AssetsStore.Icon('service.two'),
          competenza: 'ATT-00000000-0000-0000-0001-000000000001',
          content:"L’assistenza alle persone anziane è un lavoro delicato: ci vuole la giusta sensibilità per interpretare al meglio i bisogni dei nostri cari che hanno bisogno di cure o di compagnia."
        },
        {
          id: 3,
          title: "Baby sitter",
          image: AssetsStore.Image('home.heroBox.three'),
          icon: AssetsStore.Icon('service.three'),
          competenza: 'ATT-00000000-0000-0000-0001-000000000002',
          content:"Sappiamo cosa vuol dire essere genitori. Per questo su ilmioSupereroe.it troverai solo Baby Sitter referenziate e con esperienza, in grado di accompagnare e curare i tuoi bimbi in ogni passo."
        },
        {
          id: 4,
          title: "Nuovi servizi",
          image: AssetsStore.Image('home.heroBox.four'),
          icon: AssetsStore.Icon('badge.comingsoon'),
          content:"Presto in arrivo nuovi servizi che arricchiranno l’offerta de ilmioSupereroe.it, per consentirti di rilassarti sempre di più, riprendendo il tuo tempo!"
        }
      ],
      qualityBoxTitle: 'Standard di qualità e sicurezza',
      qualityBoxText: 'Con i nostri Supereroi vogliamo offrirti i migliori servizi per la cura della casa e della famiglia, per permetterti di riprenderti il tuo tempo in totale sicurezza',
      qualityBoxList: [
        {
          id: 1,
          title: 'Selezione dei Supereroi',
          icon : AssetsStore.Icon('qualityServices.selection'),
        },
        {
          id: 2,
          title: 'Piattaforma sicura',
          icon : AssetsStore.Icon('qualityServices.secure'),
        },
        {
          id: 3,
          title: 'Trasparenza',
          icon : AssetsStore.Icon('qualityServices.certificate'),
        }
      ],
      homeImg: {
        one: AssetsStore.Image('home.sliderImages.one'),
        two: AssetsStore.Image('home.sliderImages.two'),
        three: AssetsStore.Image('home.sliderImages.three'),
        four: AssetsStore.Image('home.sliderImages.four'),
        five: AssetsStore.Image('home.sliderImages.five'),
        six: AssetsStore.Image('home.sliderImages.six')
      },
      bnbBackgroundUrl: AssetsStore.Image('home.sliderImages.one'),
      dividerSliderCarnet: AssetsStore.Image('home.carnetDividerImage'),
      dividerSliderImg: {
        one: AssetsStore.Image('home.dividerImages.one'),
        two: AssetsStore.Image('home.dividerImages.two'),
        three: AssetsStore.Image('home.dividerImages.three'),
        four: AssetsStore.Image('home.dividerImages.four')
      }
    };

    if (ctrl.isTecma) {
      ctrl.homeContent.dividerSliderCarnet = AssetsStore.Image('tecma.one');
      ctrl.homeContent.tecmaLogo = AssetsStore.Image('tecma.label');
    }


    ctrl.startNewHeroSelectionOrder = function(competenza){
      if (ctrl.isBnb) {
        $state.go('booking.bnbHerosearch');
      } else {
        $state.go('booking.herosearch');
      }
    }

    // SLIDER
    // activate owl carousel
    var sliderTwo;

    $timeout(bootstrapCarousel, 100);

    $scope.$on('$destroy', function(){
        if (typeof sliderTwo !== 'undefined') sliderTwo.trigger('destroy.owl.carousel');
    });

    function bootstrapCarousel ()
    {
        var options = {
            singleItem: true,
            items: 1,
            autoplay: true,
            loop: true,
            autoplayHoverPause: true
        }

        sliderTwo = angular.element('#home-slider-two');
        sliderTwo.owlCarousel(options);
    }

}
