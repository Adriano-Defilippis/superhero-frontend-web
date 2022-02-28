'use strict';

export default function ContactCenterHeroesAgendaController (
    $scope, heroesAgenda
) {
    "ngInject";

  	var self = this;

    self.agendas = heroesAgenda.data.plain();

    self.agendas.forEach(function(a){
      cleanAgenda(a);
    });

    self.getAgendaIcon = function(hero, week){
      if(hero['disponibilitaSettimana'+week]) return '<i class="glyphicon glyphicon-ok green-text text-lighten-1" title="Settimana con disponibilità"></i>';
      else if (hero['aggiornamentoSettimana'+week]) return '<i class="glyphicon glyphicon-ok amber-text text-darken-1" title="Settimana confermata ma senza disponibilità"></i>';
      else return '<i class="glyphicon glyphicon-remove red-text text-darken-4" title="Settimana non ancora confermata"></i>';
    }

    function cleanAgenda(a){
      if(a.disponibilitaSettimana1) a.disp1 = 1;
      if(!a.disponibilitaSettimana1 && a.aggiornamentoSettimana1) a.disp1 = 0;
      if(!a.disponibilitaSettimana1 && !a.aggiornamentoSettimana1) a.disp1 = -1;

      if(a.disponibilitaSettimana2) a.disp2 = 1;
      if(!a.disponibilitaSettimana2 && a.aggiornamentoSettimana2) a.disp2 = 0;
      if(!a.disponibilitaSettimana2 && !a.aggiornamentoSettimana2) a.disp2 = -1;

      if(a.disponibilitaSettimana3) a.disp3 = 1;
      if(!a.disponibilitaSettimana3 && a.aggiornamentoSettimana3) a.disp3 = 0;
      if(!a.disponibilitaSettimana3 && !a.aggiornamentoSettimana3) a.disp3 = -1;

      if(a.disponibilitaSettimana4) a.disp4 = 1;
      if(!a.disponibilitaSettimana4 && a.aggiornamentoSettimana4) a.disp4 = 0;
      if(!a.disponibilitaSettimana4 && !a.aggiornamentoSettimana4) a.disp4 = -1;
    }

  }
