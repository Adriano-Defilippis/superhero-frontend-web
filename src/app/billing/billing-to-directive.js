'use strict';

export default function BillingToDirective(

  ) {

    return {
      restrict: 'EA',
      scope: {
          to: '='
      },
      templateUrl: 'app/billing/billing-to-directive.html',
      link: linkFunction
    }

    function linkFunction (scope, elem, attrs)
    {

        scope.setPrivateExample = function ()
        {
            var example = {
              privato: true,
              nomeCompleto: 'Marco Botto',
              codiceFiscale: 'BTTMRC90M13L378Q',
              indirizzo: 'Via Copernico 37, Milano, 20125',
              codiceId: 'X4556D'
            }

            _.assign( scope.to, example );
        }

    }


  }
