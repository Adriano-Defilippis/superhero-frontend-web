'use strict';

export default function ContactCenterClientiController (
    $scope, clienti
) {
    "ngInject";

    var self = this;

    self.clienti = [];

    clienti.data.plain().forEach(function(c){

        c.dataRegistrazioneFormatted = moment(c.dataRegistrazione).format('DD/MM/YYYY[<br>]HH:mm');
        c.getDeviceStatus = function() {
          return c.device ? '<i class="glyphicon glyphicon-ok green-text text-darken-1" title="Loggato con device"></i>' : '<i class="glyphicon glyphicon-remove red-text text-darken-4" title="Non loggato con device"></i>';
        }

        self.clienti.push(c);
    });
    self.clienti = _.orderBy(self.clienti, 'dataRegistrazione',['desc']);    

}
