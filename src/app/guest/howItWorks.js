'use strict';

export default function GuestHowItWorksController (
    $scope, AssetsStore
){
    "ngInject";

    var self = this;

    self.model = {
      sectionTagline: "Trova un Supereroe e riprenditi il tuo tempo: è più facile di quanto credi!",
      headerImage: AssetsStore.Image('home.pageHeaders.howIt'),
      singleBoxes : [
      {
        icon: AssetsStore.Icon('serviceBox.search'),
        title: "Scegli il servizio",
        description: "Di cosa hai bisogno? Tanti professionisti sono al tuo servizio. Affidati a noi per la scelta o consulta i profili e scegli quello che fa per te."
      },
        {
          icon : AssetsStore.Icon('serviceBox.book'),
          title: "Prenota il tuo supereroe",
          description: "Decidi tu come e quando hai bisogno del tuo Supereroe. Puoi contattarlo per un’emergenza o affidarti a lui per i bisogni di ogni giorno. Prenota online in pochi minuti!"
        },
        {
          icon : AssetsStore.Icon('serviceBox.relax'),
          title: "Riprenditi il tuo tempo",
          description: "Cos’hai in programma? Una cena romantica, un weekend fuori porta o un pomeriggio di shopping? Rilassati, a tutto il resto ci pensa il tuo supereroe!"
        }
      ]
    };
  }
