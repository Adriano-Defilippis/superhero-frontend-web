'use strict';

export default function ContactCenterHeroesDettaglioController (
    $scope, hero, AssetsStore
) {
    "ngInject";

  	var self = this;

    // hero info
    self.heroInfo = hero.data.plain();

    self.heroInfo.photoUrl = self.heroInfo.photoUrl ? self.heroInfo.photoUrl : AssetsStore.Image('user.placeholder');

  }
