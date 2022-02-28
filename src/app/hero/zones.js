'use strict';

export default function HeroAvailabilityZonesController (
    $timeout, heroInfo, HeroUtilities
) {
    "ngInject";

    var ctrl = this;

    ctrl.selectedZones = HeroUtilities.getZonesArray(heroInfo.data.zone);

    // Helpers
    ctrl.sendZones = function ()
    {
        HeroUtilities.saveNewZones(heroInfo.data, ctrl.selectedZones);
        heroInfo.data.zone = HeroUtilities.getZonesFullStructure(ctrl.selectedZones);
    }


}
