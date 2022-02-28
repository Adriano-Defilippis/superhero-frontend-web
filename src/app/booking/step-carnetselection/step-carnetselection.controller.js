'use strict';

import { ATTRIBUTES } from '../booking.config';

export default function BookingStepHeroSearchController (
    ngDialog, SERVICES
){
    "ngInject";

    var ctrl = this;

    ctrl.getActiveSearch = (attribute) => {
        if (attribute === ATTRIBUTES[SERVICES.COLF])  return 'Colf';
        if (attribute === ATTRIBUTES[SERVICES.COLF_BNB])  return 'Colf';
        if (attribute === ATTRIBUTES[SERVICES.BADANTE])  return 'Badante';
        if (attribute === ATTRIBUTES[SERVICES.BABYSITTER])  return 'Baby Sitter';
        if (attribute === ATTRIBUTES[SERVICES.GINNASTICAPOSTURALE])  return 'Trainer: Ginnastica Posturale';
        if (attribute === ATTRIBUTES[SERVICES.DIMAGRIMENTO])  return 'Trainer: Dimagrimento';
        if (attribute === ATTRIBUTES[SERVICES.ALLENAMENTOFUNZIONALE])  return 'Trainer: Allenamento Funzionale';
        if (attribute === ATTRIBUTES[SERVICES.CICLISMO]) return 'Trainer: Ciclismo';
        if (attribute === ATTRIBUTES[SERVICES.YOGA]) return 'Trainer: Yoga';
        if (attribute === ATTRIBUTES[SERVICES.DIFESAPERSONALE]) return 'Trainer: Difesa Personale';
        if (attribute === ATTRIBUTES[SERVICES.CORSA]) return 'Trainer: Corsa';
        if (attribute === ATTRIBUTES[SERVICES.PILATES]) return 'Trainer: Pilates';
        if (attribute === ATTRIBUTES[SERVICES.VALUTAZIONE_FUNZIONALE]) return 'Valutazione Funzionale';
        if (attribute === ATTRIBUTES[SERVICES.FISIO_ORTOPEDICA]) return 'Fisioterapia Ortopedica';
        if (attribute === ATTRIBUTES[SERVICES.FISIO_NEUROLOGICA]) return 'Fisioterapia Neurologica';
        if (attribute === ATTRIBUTES[SERVICES.FISIO_RESPIRATORIA]) return 'Fisioterapia Respiratoria';
        if (attribute === ATTRIBUTES[SERVICES.FISIO_CARDIOLOGICA]) return 'Fisioterapia Cardiologica';
        if (attribute === ATTRIBUTES[SERVICES.GINNASTICA_POSTURALE]) return 'Ginnastica Posturale';
        if (attribute === ATTRIBUTES[SERVICES.LINFODRENAGGIO]) return 'Linfodrenaggio';
        if (attribute === ATTRIBUTES[SERVICES.MASSOTERAPIA_MEZZA]) return 'Massoterapia Gambe o Schiena (30 min)';
        if (attribute === ATTRIBUTES[SERVICES.MASSOTERAPIA_INTERA]) return 'Massoterapia Gambe e Schiena (60 min)';
        if (attribute === ATTRIBUTES[SERVICES.OSTEOPATIA]) return 'Osteopatia';
        if (attribute === ATTRIBUTES[SERVICES.STIRATURA]) return 'Stiratura';
        return '';
    }

    ctrl.showHeroProfile = (hero, preselectedTab) => {
        ngDialog.open({
            template: 'app/user/hero-profile.html',
            className: 'ngdialog-theme-default ngdialog-hero-profile',
            controller: ['$scope', 'HeroProfile', function($scope, HeroProfile){
                var data = HeroProfile.getFormattedData(hero.asMutable({deep:true}), preselectedTab);
                data.then(function(d){
                    $scope.ctrl = {
                        hero: d
                    }
                });
                $scope.disableActions = false;
            }]
        });
    }

}
