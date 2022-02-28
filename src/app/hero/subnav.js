'use strict';

export default function HeroSubBarController (
    $scope
) {
    "ngInject";

  	var self = this;

    self.items = [{
      icon: '/assets/icons/calendar-small.svg',
      label: 'Agenda',
      target: 'main.hero.index'
    },{
      icon: '/assets/icons/pinpoint.svg',
      label: 'Zone disponibilità',
      target: 'main.hero.zones'
    },{
      icon: '/assets/icons/history.svg',
      label: 'Storico prenotazioni',
      target: 'main.hero.history'
    },{
      icon: '/assets/icons/bill.svg',
      label: 'Riepilogo',
      target: 'main.hero.overview'
    },{
      icon: '/assets/icons/profile.svg',
      label: 'Profilo',
      target: 'main.hero.profile'
    },{
      //icon: 'mdi-action-assignment',
      iconClass: 'fa fa-file-text-o icon-center',
      label: 'Fatture',
      target: 'main.hero.billings',
    },{
      icon: '/assets/icons/badge-icon.svg',
      label: 'Carnet Associati',
      target: 'main.hero.carnet'
    }];

  }
