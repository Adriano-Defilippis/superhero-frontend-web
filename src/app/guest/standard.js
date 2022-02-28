'use strict';

export default function StandardController (
    $scope, AssetsStore
){
    "ngInject";

    var self = this;
    self.headerImage = AssetsStore.Image('home.pageHeaders.standardQualita');
    self.model = {
      qualityBoxText: 'Con i nostri Supereroi vogliamo offrirti i migliori servizi per la cura della casa e della famiglia, per permetterti di riprenderti il tuo tempo in totale sicurezza',
      qualityBoxList: [
        {
          id: 1,
          title: 'Selezione dei Supereroi',
          icon: AssetsStore.Icon('qualityServices.selection'),
          description: "Tutti i nostri Supereroi passano attraverso un rigoroso percorso di selezione, per verificare che le loro competenze ed esperienze siano quelle che fanno per te"
        },
        {
          id: 2,
          title: 'Piattaforma sicura',
          icon: AssetsStore.Icon('qualityServices.secure'),
          description: "La sicurezza di ogni transazione effettuata sulla nostra piattaforma è tutelata dall’utilizzo dei più recenti sistemi di crittografia"
        },
        {
          id: 3,
          title: 'Trasparenza',
          icon: AssetsStore.Icon('qualityServices.certificate'),
          description: "I nostri Supereroi sono liberi professionisti in possesso delle necessarie certificazioni e ogni loro prestazione viene regolarmente fatturata"
        }
      ],
    }
  }
