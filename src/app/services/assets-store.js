'use strict';

export default function AssetsStoreService (
    $rootScope
){
    "ngInject";

    var self = this,
        iconPath = 'assets/icons/',
        pressPath = 'assets/press-review/',
        imagePath = 'assets/images/',
        audioPath = 'assets/press-review/',
        pdfPath = 'assets/pdf/';

    self.icons = {
      badge: {
        carnet: 'carnet.png',
        carnetOver: 'carnet2.png',
        check: 'check.svg',
        cancel: 'cancel.svg',
        comingsoon: 'coming-soon-icon.svg',
        carnetSmall: 'carnet-small.svg',
        carnetMedium: 'carnet-medium.svg',
        carnetLarge: 'carnet-large.svg',
        carnetXXL: 'carnet-XXL.svg',
        carnetS: 'carnet-S.svg',
        carnetM: 'carnet-M.svg',
        carnetL: 'carnet-L.svg',
        carnetXL: 'carnet-XL.svg',
        carnetEstivo: 'carnet-estate.svg',
        carnetMammaInCarriera: 'carnet-mamma-in-carriera.svg',
        carnetNonniInCompagnia: 'carnet-nonni-in-compagnia.svg',
        carnetGiftCard: 'carnet-gift-card.svg',
        carnetNew: '',
        mainLogo: 'il-mio-supereroe-logo-white.svg',
        mainLogoWhite: 'il-mio-supereroe-logo-white.svg',
        mainLogoBk: 'il-mio-supereroe-logo-white.svg',
        mainLogoPayoff: 'il-mio-supereroe-logo-white.svg',
        mainLogoPayoffBk: 'il-mio-supereroe-logo-white.svg'
      },
      service: {
        one: 'colf.svg',
        oneSmall: 'sm-colf2.svg',
        twoSmall: 'sm-rocking_chair2.svg',
        two: 'rocking_chair.svg',
        three: 'babysitter.svg',
        threeSmall: 'sm-babysitter2.svg',
        four: 'personaltrainer2.svg',
        fourSmall: 'sm-personaltrainer.svg',
        five: 'sm-fisioterapista.svg',
        fiveSmall: 'sm-fisioterapista.svg',
        six: 'sm-stiratura.svg',
        stiraturaSmall: 'sm-stiratura.svg',
        seven: 'sm-tuttofare.svg',
        eight: 'sm-servizi-elettrici.svg',
        nine: 'sm-servizi-idraulici.svg',
        ten: 'checkin-checkout.svg',
        tuttofareSmall: 'sm-tuttofare.svg',
        tuttofareLanding: 'sm-tuttofare-landing.svg',
        commissioniLanding: 'sm-commissioni-landing.svg'
      },
      personalTrainer: {
          dimagrimento: 'pt-dimagrimento.svg',
          allenamentoFunzionale: 'pt-allenamento-funzionale.svg',
          bodyBuilding: 'pt-body-building.svg',
          ginnasticaPosturale: 'pt-body-building.svg',
          ciclismo: 'pt-ciclismo.svg',
          yoga: 'pt-yoga.svg',
          difesaPersonale: 'pt-difesa-personale.svg',
          corsa: 'sm-personaltrainer.svg',
          pilates: 'pt-pilates.svg',
      },
      fisioterapista: {
          valutazioneFunzionale: 'ft-valutazione-funzionale.svg',
          fisioterapiaCardiologica: 'ft-fisioterapia-cardiologica.svg',
          fisioterapiaOrtopedica: 'ft-fisioterapia-ortopedica.svg',
          fisioterapiaNeurologica: 'ft-fisioterapia-neurologica.svg',
          fisioterapiaRespiratoria: 'ft-fisioterapia-respiratoria.svg',
          ginnasticaPosturale: 'ft-ginnastica-posturale.svg',
          linfodrenaggio: 'ft-linfodrenaggio.svg',
          massoterapiaMezza: 'ft-massoterapia-gambe schiena-30min.svg',
          massoterapiaIntera: 'ft-massoterapia-gambe schiena-60min.svg',
          osteopatia: 'ft-osteopatia.svg'
      },
      fisioterapistaLanding: {
          valutazioneFunzionale: 'ft-valutazione-funzionale-landing.svg',
          fisioterapiaCardiologica: 'ft-fisioterapia-cardiologica-landing.svg',
          fisioterapiaOrtopedica: 'ft-fisioterapia-ortopedica-landing.svg',
          fisioterapiaNeurologica: 'ft-fisioterapia-neurologica-landing.svg',
          fisioterapiaRespiratoria: 'ft-fisioterapia-respiratoria-landing.svg',
          ginnasticaPosturale: 'ft-ginnastica-posturale-landing.svg',
          linfodrenaggio: 'ft-linfodrenaggio-landing.svg',
          massoterapia: 'ft-massoterapia-gambe schiena-landing.svg',
          osteopatia: 'ft-osteopatia-landing.svg'
      },
      tuttofareServices: {
          montaggio: 'tf-montaggio-mobili.svg',
          spostamento: 'tf-spostamento.svg',
          trasloco: 'tf-trasloco.svg',
          scaricoMerci: 'tf-scarico-merci.svg',
          giardinaggio: 'tf-giardinaggio.svg',
          lavoriDomestici: 'tf-lavori-domestici.svg',
          legna: 'tf-legna.svg',
          stuccatura: 'tf-stuccatura.svg',
          attrezziExtra: 'tf-attrezzi-extra.svg',
      },
      idraulico: {
        rubinettoGocciolante: 'si-rubinetti.svg',
        installazioneRubinetto: 'si-rubinetterie.svg',
        disotturazioneScarico: 'si-disotturazione-scarichi.svg',
        riparazioneScarico: 'si-riparazione-scarichi.svg',
        sanitari: 'si-sanitari.svg',
        boilerElettrico: 'se-altro.svg',
        boilerGas: 'si-boiler-gas.svg',
        piattoDoccia: 'si-piatto-doccia.svg',
        colonnaDoccia: 'si-colonna-doccia.svg',
        pompaAcqua: 'si-pompa-acqua.svg',
      },
      elettricista: {
        lampadario: 'se-lampadari.svg',
        lampadina: 'se-lampadine.svg',
        presaElettrica: 'se-prese-elettriche.svg',
        televisore: 'se-televisore.svg',
        allacciamentoImpianto: 'se-altro.svg',
      },
      bridge: {
        time: 'savetime.svg',
        money: 'money.svg',
        simplicity: 'simplicity.svg',
      },
      serviceBox: {
        search: 'cerca.svg',
        book: 'scegli.svg',
        relax: 'relax.svg'
      },
      overviewBox : {
        customers: 'check.svg',
        money: 'money.svg',
        time: 'savetime.svg'
      },
      colfServices : {
        fridge: "fridge.svg",
        oven: "oven.svg",
        windows: "windows.svg",
        closet: "closet.svg",
        chandelier: "chandelier.svg",
        washing: "washing.svg",
        iron: "iron.svg",
        terrace: "terrace.svg",
        stairs: "stairs.svg",
        garage: "garage.svg"
      },
      badanteServices : {
        personalHygene: "personal_hygene.svg",
        pan: "pan.svg",
        cleaning: "house-cleaning.svg",
        bandAid: "bandaid.svg",
        mobility: "mobility.svg",
        shoppingCart: "shoppingcart.svg",
        cross: "cross.svg",
        car: 'car.svg'
      },
      babySitterServices : {
        study: "study.svg",
        houseCleaning: "house-cleaning.svg",
        pan: "pan.svg",
        shoppingCart: "shoppingcart.svg",
        car: 'car.svg'
      },
      qualityServices : {
        selection: "selection.svg",
        secure: "secure.svg",
        certificate: "certificate.svg"
      },
      noVat: {
        document: "vat-sh-icon.svg"
      }
    };
    self.images = {
      logo : {
          small:  'supereroe-logo-small.png'
      },
      carnet: {
        textContainer: 'carnet-fumetto.png',
        carnetInfo: 'carnet-info.png',
        shareCarnet: 'shareCarnet.png',
        ticketOrange: 'carnet-ticket-orange.png',
        ticketWhite: 'carnet-ticket-white.png'
      },
      landing: {
          colfIcon: 'colf.png',
          badanteIcon: 'badante.png',
          babysitterIcon: 'baby.png',
          personalTrainerIcon: 'personalTrainer.png',
          colf: 'landing-colf.jpg',
          badante: 'landing-badante.jpg',
          personalTrainer: 'landing-personal-trainer.jpg',
          personalTrainerAllenamentoFunzionale: 'landing-personal-trainer-allenamento-funzionale.jpg',
          personalTrainerGinnasticaPosturale: 'landing-personal-trainer-ginnastica-posturale.jpg',
          personalTrainerCiclismo: 'landing-personal-trainer-ciclismo.jpg',
          personalTrainerDifesaPersonale: 'landing-personal-trainer-difesa-personale.jpg',
          personalTrainerCorsa: 'landing-personal-trainer-corsa.jpg',
          personalTrainerPilates: 'landing-personal-trainer-pilates.jpg',
          personalTrainerYoga: 'landing-personal-trainer-yoga.jpg',
          personalTrainerDimagrimento: 'landing-personal-trainer-dimagrimento.jpg',
          stiro: 'landing-stiro.jpg',
          fisioterapista: 'landing-fisioterapista.png',
          tuttofare: 'landing-tuttofare.png',
          carnetEstivo: 'landing-carnet-estate.jpg',
          sky: 'landing-sky.png',
          bnb: 'bnb-background.jpg'
      },
      home: {
        heroBox: {
          one: 'colf-3.jpg',
          two: 'badante-home.jpg',
          three: 'baby-home-1.jpg',
          four: 'coming-soon-home.jpg'
        },
        sliderImages: {
          one: 'slide-home-1.png',
          two: 'slide-home-2.png',
          three: 'slide-home-3.png',
          four: 'slide-home-4.png',
          five: 'slide-home-5.png',
          six: 'slide-home-6.png'
        },
        dividerImages: {
          one: 'divider-sitter-1.jpg',
          two: 'divider-badante.jpg',
          three: 'divider-baby.jpg',
          four: 'divider-colf.jpg'
        },
        carnetDividerImage: 'home-carnet-image.jpg',
        pageHeaders : {
          about: 'about-header.jpg',
          howIt: 'how-it-works-header.jpg',
          faq: 'faq-header.jpg',
          prices: 'prices-header.jpg',
          becomeHero: 'diventa-supereroe-header.jpg',
          carnet: 'carnet-header.png',
          assurance: 'assurance.jpg',
          diventaSupereroe: 'diventa-supereroe.jpg',
          vantaggi: 'vantaggi.jpg',
          tecma: '',
          contacts: 'contacts.jpg',
          standardQualita : 'standard.jpg',
          standardQualitaOne: 'standard-1.jpg',
          pressReview: 'press-review-bg2.jpg',
          useGiftCard: 'usa-gift-card.jpg',
          regalaGiftCard: 'regala-gift-card.jpg',
          regalaGiftCardClienti: 'regala-gift-card-clienti.jpg'
        }
      },
      assurance: {
        label: 'assurance-label.png',
        imageOne: 'assurance-image-1.jpg',
        imageTwo: 'assurance-image-2.png',
        imageThree: 'assurance-image-3.jpg',
        logoOne: 'assurance-logo-1.png',
        logoTwo: 'assurance-logo-2.png',
        logoThree: 'assurance-logo-3.png',
      },
      tecma: {
        label: 'gioia-101-logo.png',
        one: 'tecma-image-1.jpg',
      },
      findSuperhero: {
        header: 'find_superhero.png'
      },
      hero: {
        profilePic: 'user-profile.png',
        nico: 'nico.jpg'
      },
      convenience: {
        header: 'header_vantaggi.jpg',
        numbers: {
          1: 'numero1.png',
          2: 'numero2.png',
          3: 'numero3.png',
          4: 'numero4.png',
          5: 'numero5.png',
          6: 'numero6.png',
          7: 'numero7.png',
          8: 'numero8.png',
          9: 'numero9.png'
        },
        image1: 'foto1_vantaggi.png',
        image2: 'foto2_vantaggi.png',
        image3: 'foto3_vantaggi.png'
      },
      user: {
        placeholder : 'user-placeholder.png'
      }

    };

    self.pdfs = {
      cliente: {
        condizioniFornitura: 'cliente/condizioni-generali-fornitura.pdf',
        condizioniUtilizzo: 'cliente/condizioni-generali-utilizzo.pdf',
        informazioniPrivacy: 'cliente/informativa-privacy-dh-utente.pdf',
        condizioniUtilizzoGiftCard: 'cliente/termini_e_condizioni_di_utilizzo_gift_card.pdf',
        quadraAssicurazioni: 'cliente/assicurazione.pdf'
      },
      eroe: {
        condizioniGenerali : 'collaboratore-old/condizioni-generali-utilizzo.pdf',
        informazioniPrivacy: 'collaboratore-old/informativa-privacy-collaboratore.pdf',
        tariffarioCorrispettivi: 'collaboratore-old/tariffario-corrispettivi.pdf'
      },
      collaboratore: {
        condizioniGenerali: 'collaboratore/Condizioni_generali_di_utilizzo_di_DIGITAL_HEROES.pdf',
        informazioniPrivacy: 'collaboratore/Allegato_-_Informativa_sulla_privacy_registrazione.pdf',
        tariffarioServiziCasa: 'collaboratore/Allegato_-_Tariffario_e_Corrispettivi_Colf_Badante_BabySitter_Stiro.pdf',
        tariffarioServiziPersonalTrainer: 'collaboratore/Allegato_-_Tariffario_e_Corrispettivi_PersonalTrainer.pdf',
        tariffarioServiziFisioterapista: 'collaboratore/Allegato_-_Tariffario_e_Corrispettivi_Fisio.pdf',
        tariffarioServiziTuttofare: 'collaboratore/Allegato_-_Tariffario_e_Corrispettivi_Tuttofare.pdf',
        tariffarioServiziColfCheckinBNB: 'collaboratore/Allegato_-_Tariffario_e_Corrispettivi_Colf_Check-in_BNB.pdf',
      }
    }

    self.press = {
        rds: 'rds-logo.png',
        rds_color: 'rds-logo-c.png',
        radioCapital: 'radio-capital-logo.png',
        radioCapital_color: 'radio-capital-logo-c.png',
        yahoo: 'yahoo-logo.png',
        yahoo_color: 'yahoo-logo-c.png',
        magazineDelleDonne: 'magazine-delle-donne-logo.png',
        magazineDelleDonne_color: 'magazine-delle-donne-logo-c.png',
        adn: 'adnkronos-logo.png',
        adn_color: 'adnkronos-logo-c.png',
        fashionblabla_color: 'fashionblabla-logo-c.png',
        vanityFair: 'vanity.png',
        vanityFair_color: 'vanity_c.png',
        tgcom24: 'tgcom.png',
        tgcom24_color: 'tgcom_c.png',
        oggi: 'oggi.png',
        oggi_color: 'oggi_c.png',
        corriereInnovazione: 'corriere_innovazione.png',
        corriereInnovazione_color: 'corriere_innovazione_c.png',
    }

    self.audio = {
        rds: 'rds-intervista.mp3',
        radioCapital: 'radio-capital-intervista.mp3'
    }

    self.get = function(asset, modelPath){
      var pre = "";
      var current =  self[asset];

      // If asset is undefined return empty string
      if(current === undefined)
        return '';

      modelPath.forEach(function(path){
        if(current[path] !== undefined)
          current = current[path];
        else
          return;
      });

      if(!_.isString(current))
        return '';

      if(asset === 'icon')
        pre = iconPath;

      if(asset === 'image')
        pre = imagePath;

      return pre + current;
    }


    self.Icon = function(path){
      var icon = getProp( self.icons, path );
      if(icon !== undefined && _.isString(icon))
        return iconPath + icon;
      else
        return "";
    }

    self.Image = function(path){
      var image = getProp( self.images, path );
      if(image !== undefined && _.isString(image))
        return imagePath + image;
      else
        return "";
    }

    self.PDF = function(path){
      var pdf = getProp( self.pdfs, path );
      if(pdf !== undefined && _.isString(pdf))
        return pdfPath + pdf;
      else
        return "";
    }

    self.Press = function(path){
      var press = getProp( self.press, path );
      if(press !== undefined && _.isString(press))
        return pressPath + press;
      else
        return "";
    }

    self.Audio = function(path){
      var audio = getProp( self.audio, path );
      if(audio !== undefined && _.isString(audio))
        return audioPath + audio;
      else
        return "";
    }


    function getProp( obj, path ){
      function index( robj,i ) {
        return robj[i];
      }
      return path.split('.').reduce( index, obj );
    }

}
