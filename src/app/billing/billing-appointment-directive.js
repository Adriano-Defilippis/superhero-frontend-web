'use strict';

export default function BillingAppointmentDirective(

) {

return {
  restrict: 'EA',
  scope: {
      appointment: '='
  },
  templateUrl: 'app/billing/billing-appointment-directive.html',
  link: linkFunction
}

    function linkFunction (scope, elem, attrs)
    {
        scope.options = {
            tipoFattura: [
                { id: 'Prestazione', label: 'Prestazione' },
                { id: 'Piattaforma', label: 'Piattaforma' },
                { id: 'Voucher', label: 'Voucher' },
                { id: 'ResiduoVoucher', label: 'Residuo Voucher' }
            ],
            tipoOperazione: [
                { id: 'Appuntamenti', label: 'Prenotazione semplice' },
                { id: 'AppuntamentiCarnet', label: 'Prenotazione su base carnet' },
                { id: 'AppuntamentiNominale', label: 'Prenotazione nominale' },
                { id: 'ModificaAppuntamento', label: 'Modifica prenotazione semplice' },
                { id: 'ModificaAppuntamentoCarnet', label: 'Modifica prenotazione su base carnet' },
                { id: 'ModificaAppuntamentoNominale', label: 'Modifica prenotazione nominale' }
            ],
            idTipoServizio: [
                { id: 'TS-0000-0000-0000-0003', label: 'Colf' },
                { id: 'TS-0000-0000-0000-0001', label: 'Badante' },
                { id: 'TS-0000-0000-0000-0002', label: 'Baby Sitter' }
            ]
        }

    scope.setAppointmentExample = function ()
    {

          var example = {
            dataFattura: new Date(),
            dataOperazione: new Date(),
            codiceFattura: '0001/DH',
            id: '8dm37b',
            tipoOperazione: 'Semplice',
            idTipoServizio: 'TS-0000-0000-0000-0001',
            importoVoucher: 0,
          }

          var exampleVoce = {
            data: new Date(),
            descrizione: 'Prenotazione semplice',
            idAppuntamento: '4gh21m',
            durataMinuti: 60,
            costo: 100
          }

      _.assign( scope.appointment, example );
      _.assign( scope.appointment.vociInFattura[0], exampleVoce );

    }
}


}
