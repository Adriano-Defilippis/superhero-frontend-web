/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function RecruiterUtilitiesFactory (

    $log,
    RestService,
    NotifyService

){
    "ngInject";

    // check order state
    function isState (superhero, state)
    {
        return superhero.stato === state;
    }


    function countByState (heroes, state)
    {
        var counter = 0;

        heroes.forEach(function (hero) {
            if (isState(hero, state)) counter++;
        });

        return counter;
    }

        function getModalitaOperativaLabel (modalita) {
            if (typeof modalita === 'undefined' || modalita === null) return '';

            if(modalita === 'ImpresaIndividuale') return 'Impresa individuale';
            if(modalita === 'ProfessionistaConCassa') return 'Professionista con cassa';
            if(modalita === 'ProfessionistaSenzaCassa') return 'Professionista senza cassa';
            if(modalita === 'Societa') return 'Società';
            if(modalita === 'EnteAssociazione') return 'Ente/Associazione';
        }

        function countByAttribute (list, attr, expected) {
            var counter = 0;

            list.forEach(function (_single) {
                if (typeof _single[attr] !== 'undefined' && _single[attr] === expected) counter ++;
            });

            return counter;
        }

        return {
            countByState: countByState,
            countByAttribute: countByAttribute,
            isState: isState,
            getModalitaOperativaLabel: getModalitaOperativaLabel
        }

}
