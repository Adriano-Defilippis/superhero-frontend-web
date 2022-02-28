'use strict';

export default function LandingServiceController (
    $scope,$timeout, AssetsStore
) {
    "ngInject";

  	var self = this;

    self.selectedService = 1 ;


    self.model = {
        one: {
         mainTagline: 'Per le tue pulizie affidati ad un supereroe',
         secondaryTagline: 'Lavoro e palestra non ti lasciano il tempo per le pulizie? \n Rilassati, c’è il Supereroe che fa per te!',
         backgroundImage: AssetsStore.Image('home.dividerImages.four'),
         serviceId: 1
        },
        two: {
          mainTagline: 'Per i tuoi cari affidati ad un supereroe',
          secondaryTagline: 'I bimbi vogliono andare al mare e cerchi aiuto per i nonni?\nRilassati, c’è il Supereroe che fa per te!',
          backgroundImage: AssetsStore.Image('home.dividerImages.two'),
          serviceId: 2
        },
        three: {
          mainTagline: 'Per i tuoi bimbi affidati ad un supereroe',
          secondaryTagline: 'Fai tardi al lavoro e non sai con chi far giocare i bimbi?\nRilassati, c’è il Supereroe che fa per te!',
          backgroundImage: AssetsStore.Image('home.dividerImages.three'),
          serviceId: 3
        }
    };

    if(self.selectedService === 1){
      self.mainTagline = self.model.one.mainTagline;
      self.secondaryTagline = self.model.one.secondaryTagline;
      self.backgroundImage = self.model.one.backgroundImage;
    } if(self.selectedService === 2){
      self.mainTagline = self.model.two.mainTagline;
      self.secondaryTagline = self.model.two.secondaryTagline;
      self.backgroundImage = self.model.two.backgroundImage;
    } if(self.selectedService === 3){
      self.mainTagline = self.model.two.mainTagline;
      self.secondaryTagline = self.model.three.secondaryTagline;
      self.backgroundImage = self.model.three.backgroundImage;
    } if(self.selectedService === 4){
      self.mainTagline = self.model.two.mainTagline;
      self.secondaryTagline = self.model.four.secondaryTagline;
      self.backgroundImage = self.model.four.backgroundImage;
    }



    self.landingContent = {
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
          content: "Di cosa hai bisogno? Colf, Badanti e Baby Sitter sono al tuo servizio. \n Affidati a noi per la scelta o consulta i profili e scegli quello che fa per te."
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
        three: AssetsStore.Image('home.sliderImages.three')
      },
      dividerSliderImg: {
        one: AssetsStore.Image('home.dividerImages.one'),
        two: AssetsStore.Image('home.dividerImages.two'),
        three: AssetsStore.Image('home.dividerImages.three'),
        four: AssetsStore.Image('home.dividerImages.four')
      }
    };


    // content of specific service block
    self.SpecificServiceContent = {
        sectionTitle: 'Cosa possono fare i nostri supereroi per te',

        one: {
         sectionSubtitle : 'Le nostre Colf sono specializzate per svolgere tutte le mansioni domestiche. Affidati a loro  per tenere la tua casa sempre in ordine',
         mainTagline: 'Per le tue pulizie affidati ad un supereroe',
         secondaryTagline: 'Lavoro e palestra non ti lasciano il tempo per le pulizie? <br>Rilassati, c’è il Supereroe che fa per te! A partire da 10,50 €/ora',
         backgroundImage: AssetsStore.Image('home.dividerImages.four'),
         serviceId: 1,
         specificServices: [
          { id: 1, title: "Frigorifero", icon: AssetsStore.Icon('colfServices.fridge'), description: 'Pulizia elettrodomestici (es. forno, frigorifero)'},
          { id: 3, title: "Vetri interni", icon: AssetsStore.Icon('colfServices.windows'), description: 'Pulizia vetri e terrazze'},
          { id: 4, title: "Armadi", icon: AssetsStore.Icon('babySitterServices.houseCleaning'), description: 'Pulizia di base'},
          { id: 5, title: "Lampadari", icon: AssetsStore.Icon('colfServices.chandelier'), description: 'Pulizia arredamento (es. armadi, lampadari)'},
          { id: 6, title: "Lavaggio capi", icon: AssetsStore.Icon('colfServices.washing'), description: "Lavaggio capi d\'abbigliamento"},
          { id: 7, title: "Stiratura", icon: AssetsStore.Icon('colfServices.iron'), description: 'Stiratura'}]
        },
        two: {
          sectionSubtitle : 'L’assistenza alle persone anziane è un lavoro delicato. Per questo le nostre Badanti hanno la giusta sensibilità per capire al meglio i bisogni dei tuoi cari',
          mainTagline: 'Per i tuoi cari affidati ad un supereroe',
          secondaryTagline: 'I bimbi vogliono andare al mare e cerchi aiuto per i nonni? <br>Rilassati, c’è il Supereroe che fa per te! A partire da 7,50 €/ora',
          backgroundImage: AssetsStore.Image('home.dividerImages.two'),
          serviceId: 2,
          specificServices: [
          {title: "Assistenza di base", icon: AssetsStore.Icon('service.two'), description: 'Assistenza di base (es. compagnia, tempo libero)'},
          {title: "Igiene personale", icon: AssetsStore.Icon('badanteServices.personalHygene'), description: 'Assistenza alla cura dell’igiene personale'},
          {title: "Cucina", icon: AssetsStore.Icon('badanteServices.pan'), description: 'Supporto allo svolgimento delle attività domestiche (es. pulizie, cucinare)'},
          {title: "Mobilizzazione domestica", icon: AssetsStore.Icon('badanteServices.mobility'), description: 'Assistenza mobilizzazione domestica'},
          {title: "Commissioni varie", icon: AssetsStore.Icon('badanteServices.shoppingCart'), description: 'Assistenza nello svolgimento delle commissioni quotidiane'}]
        },
        three: {
          sectionSubtitle : 'Vorresti essere ogni ora a fianco dei tuoi bimbi, ma i tanti impegni non sempre te lo consentono. Le nostre Baby Sitter sanno cosa vuol dire essere genitori, e sono in grado di accompagnare e curare i tuoi bimbi in ogni passo della loro crescita',
          mainTagline: 'Per i tuoi bimbi affidati ad un supereroe',
          secondaryTagline: 'Fai tardi al lavoro e non sai con chi far giocare i bimbi? <br>Rilassati, c’è il Supereroe che fa per te! A partire da 7,50 €/ora',
          backgroundImage: AssetsStore.Image('home.dividerImages.three'),
          serviceId: 3,
          specificServices: [
          {title: "Assistenza di base", icon: AssetsStore.Icon('service.three'), description: 'Assistenza di base (es. Controllarli e seguirli nelle ore di gioco)'},
          {title: "Compiti", icon: AssetsStore.Icon('babySitterServices.study'), description: 'Seguirli nei compiti'},
          {title: "Igiene personale", icon: AssetsStore.Icon('badanteServices.personalHygene'), description: 'Curare la loro igiene personale (per i bimbi più piccoli)'},
          {title: "Spostamenti", icon: AssetsStore.Icon('babySitterServices.car'), description: 'Accompagnarli nei loro spostamenti con mezzi pubblici (es. a scuola)'},
          {title: "Cucina", icon: AssetsStore.Icon('babySitterServices.pan'), description: 'Svolgere alcune attività domestiche (es. pulizie, cucinare)'}]
        }
    };


    $scope.$on('$destroy', function(){
      $("#home-slider-two").trigger('destroy.owl.carousel');
    });

    $timeout(function() {
      $("#home-slider-two").owlCarousel({
        singleItem: true,
        items: 1,
        autoPlay: true
      });
    }, 100);


}
