'use strict';

export default function AboutPageController (
    $scope, AssetsStore
) {
    "ngInject";

  	var self = this;

    self.model = {
      headerImage: AssetsStore.Image('home.pageHeaders.about')
    };

}
