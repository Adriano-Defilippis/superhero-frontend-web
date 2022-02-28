'use strict';

export default function RecruiterHeroesController (
    $scope, heroes, ApplicationForm, $stateParams, RecruiterUtilities
) {
    "ngInject";

  	var ctrl = this;

  	ctrl.applications = heroes.data;
    var activeState = $stateParams.stato;
    if (!$stateParams.stato) activeState = 'Attivi';

    ctrl.applications.forEach(function(s){
      if(s.cittadinanza) s.cittadinanzaLabel = ApplicationForm.getCittadinanzaLabel(s.cittadinanza);
      s.referenze = (s.referenzeBabySitter != null || s.referenzeBadante != null || s.referenzeColf != null) ? 'Si' : 'No';

      if (s.partitaIva === true) {
          s.modalitaOperativaLabel = RecruiterUtilities.getModalitaOperativaLabel(s.modalitaOperativa);
      }
      if (s.competenze) s.competenze = s.competenze.replace(/\,/g, ', ');
  });

    ctrl.filterButtons = [
        {
            isActive: activeState === 'Attivi',
            state: 'main.recruiter.profiles',
            params: { stato: 'Attivi' },
            label: 'Attivi',
            counter: RecruiterUtilities.countByState(ctrl.applications, 'Attivo') + RecruiterUtilities.isState(ctrl.applications, 'CondizioniDaAccettare')
        },
        {
            isActive: activeState === 'Disattivi',
            state: 'main.recruiter.profiles',
            params: { stato: 'Disattivi' },
            label: 'Disattivi',
            counter: RecruiterUtilities.countByState(ctrl.applications, 'Disattivo')
        }
    ];

    ctrl.filterTable = filterTable;

    function filterTable (superhero)
    {
        if (activeState === 'Attivi') return RecruiterUtilities.isState(superhero, 'Attivo') || RecruiterUtilities.isState(superhero, 'CondizioniDaAccettare');
        else if (activeState === 'Disattivi') return RecruiterUtilities.isState(superhero, 'Disattivo');
    }

  }
