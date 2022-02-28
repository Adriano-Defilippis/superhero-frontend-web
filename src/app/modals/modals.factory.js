/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function ModalsFactory (
    $log
){
    "ngInject";

    function openBottomSheet (modalSelector)
    {
        var newZones = [];
        zones.forEach(function(area){
            newZones.push({id:area});
        });
        return newZones;
    }

    return {
        openBottomSheet: openBottomSheet
    }

}
