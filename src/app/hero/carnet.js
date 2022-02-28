'use strict';


export default function HeroCarnetController (
    $scope, Services, AssetsStore, carnetList, Carnet
) {
    "ngInject";

    var self = this;

    self.carnetList = [];

    var carnets = carnetList.data.plain();
    if(carnets.length > 0){
      carnets.forEach(function(c){
        var carnetInfo = Carnet.byId(c.idTipoCarnet);
        c.carnetIcon = carnetInfo.icon;
        c.oreResidue = Math.round(c.minutiResidui / 60  * 100) / 100;
        c.dataAcquisto = moment(c.dataAcquisto).format('DD/MM/YYYY');
        c.scadenza = moment(c.dataScadenza).format('DD/MM/YYYY');
        c.prestazione = carnetInfo.prestazione;
        c.label = carnetInfo.prestazioneLabel;
        c.oreTotali = carnetInfo.hours;
        c.carnetTipo = carnetInfo.type;
        c.clientePhotoUrl = c.clientePhotoUrl ? c.clientePhotoUrl : AssetsStore.Image('user.placeholder');
        if(carnetInfo.state != 'Immesso' && carnetInfo.state != 'ErrorePagamento') self.carnetList.push(c);
      });
    }

  }
