'use strict';

export default function BillingFromDirective(

  ) {

    return {
      restrict: 'EA',
      scope: {
          from: '='
      },
      templateUrl: 'app/billing/billing-from-directive.html',
      link: linkFunction
    }

    function linkFunction (scope, elem, attrs)
    {
        scope.options = {
            modalitaOperativa: [
                { id: 'ImpresaIndividuale', label: 'Impresa individuale' },
                { id: 'ProfessionistaConCassa', label: 'Professionista con cassa' },
                { id: 'ProfessionistaSenzaCassa', label: 'Professionista senza cassa' },
                { id: 'Societa', label: 'Società' },
                { id: 'EnteAssociazione', label: 'Ente/Associazione' }
            ]
        }

        scope.setDigitalHeroes = function ()
        {
            var example = {
              privato: false,
              nomeCompleto: 'Digital Heroes Srl',
              codiceFiscale: '08830360965',
              partitaIva: '08830360965',
              codiceId: '56dhh2',
              modalitaOperativa: 'Societa',
              indirizzo: 'Largo Gallarati Scotti 1, 20123, Milano',
              rivalsa: 0,
              aliquotaIva: 22,
              ritenuta: 0
            }

            _.assign( scope.from, example );
        }
    }


  }
