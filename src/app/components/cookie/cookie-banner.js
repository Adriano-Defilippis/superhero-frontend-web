 'use strict';

export default function CookieBannerController (
    $scope, AssetsStore
) {
    "ngInject";

    var ctrl = this;

    ctrl.mv = {
    logo: AssetsStore.Image('logo.small')
    }
}
