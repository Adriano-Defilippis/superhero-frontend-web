'use strict';

export default function RecruiterApplicationsController (
    $scope, $state, RecruiterService, ApplicationForm, candidates, RecruiterUtilities, $stateParams
) {
    "ngInject";

  	var ctrl = this;

    ctrl.applications = cleanData(candidates.data.plain());
    ctrl.applications = _.orderBy(ctrl.applications, 'dataRegistrazione',['desc']);    
    ctrl.filterTable = filterTable;
    
    var activeState = $stateParams.stato;
    if (!$stateParams.stato) activeState = 'Nuove';
    ctrl.filterButtons = [
        {
            isActive: activeState === 'Nuove',
            state: $state.current.name,
            params: { stato: 'Nuove' },
            label: 'Nuove',
            counter: ctrl.applications.length - (RecruiterUtilities.countByAttribute(ctrl.applications, 'presoInCarico', true) + RecruiterUtilities.countByAttribute(ctrl.applications, 'inLavorazione', true))
        },
        {
            isActive: activeState === 'PreseInCarico',
            state: $state.current.name,
            params: { stato: 'PreseInCarico' },
            label: 'Prese in carico',
            counter: RecruiterUtilities.countByAttribute(ctrl.applications, 'presoInCarico', true)
        },
        {
            isActive: activeState === 'InLavorazione',
            state: $state.current.name,
            params: { stato: 'InLavorazione' },
            label: 'In lavorazione',
            counter: RecruiterUtilities.countByAttribute(ctrl.applications, 'inLavorazione', true)
        }
    ];

    function filterTable (superhero)
    {
        if (activeState === 'Nuove') return superhero.presoInCarico !== true && superhero.inLavorazione !== true;
        else if (activeState === 'PreseInCarico') return superhero.presoInCarico === true;
        else if (activeState === 'InLavorazione') return superhero.inLavorazione === true;
    }

    function cleanData (superhero) {
        superhero.forEach(function(_sh){
            _sh.titoloStudio = _.capitalize(_.lowerCase(_sh.titoloStudio));
            _sh.modalitaOperativaLabel = _sh.modalitaOperativa ?_.capitalize(_.lowerCase(_sh.modalitaOperativa)) : 'No';
            if(_sh.competenze) {
                _sh.competenze = _sh.competenze.replace(/\,/g, ', ');
            }
        });
        return superhero;
    }

    ctrl.archiveApplication = function(id) {
  		RecruiterService.archiveApplication(id);
    };

    ctrl.toggleShow = function(){
      //
    }

}
