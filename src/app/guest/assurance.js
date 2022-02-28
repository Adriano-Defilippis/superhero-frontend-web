'use strict';

export default function AssurancePageController (
    $scope, AssetsStore
) {
    "ngInject";

  	var self = this;

    self.model = {
      headerImage: AssetsStore.Image('home.pageHeaders.assurance'),
      label: AssetsStore.Image('assurance.label'),
      imageOne: AssetsStore.Image('assurance.imageOne'),
      imageTwo: AssetsStore.Image('assurance.imageTwo'),
      imageThree: AssetsStore.Image('assurance.imageThree'),
      logoOne: AssetsStore.Image('assurance.logoOne'),
      logoTwo: AssetsStore.Image('assurance.logoTwo'),
      logoThree: AssetsStore.Image('assurance.logoThree'),
      quadraAssicurazioni: AssetsStore.PDF('cliente.quadraAssicurazioni')
    };

}
