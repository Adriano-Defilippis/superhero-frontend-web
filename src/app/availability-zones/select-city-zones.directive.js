'use strict';

export default function SelectCityZonesDirective (

    $log,
    $timeout,
    HeroUtilities

) {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            selectedZones: '='
        },
        templateUrl: 'app/availability-zones/select-city-zones-directive.html',
        link: linkFunction
    }

    function linkFunction (scope, elem, attrs, ctrl)
    {

        $log.debug('[SELECT_CITY_ZONES] Initialized directive');

        scope.macroAreaList = [
            { id: 'BG', description: 'Bergamo' },
            { id: 'BO', description: 'Bologna' },
            { id: 'BS', description: 'Brescia' },
            { id: 'CO', description: 'Como' },
            { id: 'FI', description: 'Firenze' },
            { id: 'GE', description: 'Genova' },
            { id: 'MI', description: 'Milano' },
            { id: 'MB', description: 'Monza e Brianza' },
            { id: 'PD', description: 'Padova' },
            { id: 'RM', description: 'Roma' },
            { id: 'TO', description: 'Torino' },
            { id: 'VA', description: 'Varese' },
            { id: 'VR', description: 'Verona' },  
        ]

        // Decorate Data
        var geoJsonMI = HeroUtilities.citiesZone.MI.geoJson;
        var gmapsZones = {
            MI: HeroUtilities.citiesZone.MI.zones,
            VA: HeroUtilities.citiesZone.VA.zones,
            MB: HeroUtilities.citiesZone.MB.zones,
            TO: HeroUtilities.citiesZone.TO.zones,
            BG: HeroUtilities.citiesZone.BG.zones,
            VR: HeroUtilities.citiesZone.VR.zones,
            BS: HeroUtilities.citiesZone.BS.zones,
            PD: HeroUtilities.citiesZone.PD.zones,
            GE: HeroUtilities.citiesZone.GE.zones,
            BO: HeroUtilities.citiesZone.BO.zones,
            FI: HeroUtilities.citiesZone.FI.zones,
            CO: HeroUtilities.citiesZone.CO.zones,
            RM: HeroUtilities.citiesZone.RM.zones,
        };

        var formattedZones = {
            MI: [],
            VA: [],
            MB: [],
            TO: [],
            BG: [],
            VR: [],
            BS: [],
            PD: [],
            GE: [],
            BO: [],
            FI: [],
            CO: [],
            RM: [],
        }

        gmapsZones['MI'].forEach(function (zona) {
            formattedZones['MI'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['VA'].forEach(function (zona) {
            formattedZones['VA'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['MB'].forEach(function (zona) {
            formattedZones['MB'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['TO'].forEach(function (zona) {
            formattedZones['TO'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['BG'].forEach(function (zona) {
            formattedZones['BG'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['VR'].forEach(function (zona) {
            formattedZones['VR'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['BS'].forEach(function (zona) {
            formattedZones['BS'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['PD'].forEach(function (zona) {
            formattedZones['PD'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['GE'].forEach(function (zona) {
            formattedZones['GE'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['BO'].forEach(function (zona) {
            formattedZones['BO'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['FI'].forEach(function (zona) {
            formattedZones['FI'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['CO'].forEach(function (zona) {
            formattedZones['CO'].push({ id: zona.id, description: zona.descrizione });
        });
        gmapsZones['RM'].forEach(function (zona) {
            formattedZones['RM'].push({ id: zona.id, description: zona.descrizione });
        });

        // Maps data
        scope.zoneSelectionData = {
            MI: {
                cityMapTitle: 'Zone di Milano',
                zonesListTitle: 'Zone in provincia',
                cityName: 'Milano',
                //cityMapUrl: 'http://www.aboutmilan.com/it/Milan-images/map_of_milan.jpg',
                map: {
                    center: { latitude: 45.465422, longitude: 9.164658 },
                    zoom: Modernizr.touch ? 10 : 11,
                    geoJson: geoJsonMI
                },
                adminAreaList: formattedZones['MI']
            },
            MB: {
                cityMapTitle: 'Monza / Brianza',
                zonesListTitle: 'Comuni',
                cityName: 'Monza e Brianza',
                cityMapUrl: '/assets/maps/MB.gif',
                adminAreaList: formattedZones['MB']
            },
            VA: {
                cityMapTitle: 'Varese',
                zonesListTitle: 'Comuni',
                cityName: 'Varese',
                cityMapUrl: '/assets/maps/VA.gif',
                adminAreaList: formattedZones['VA']
            },
            TO: {
                cityMapTitle: 'Torino',
                zonesListTitle: 'Comuni',
                cityName: 'Torino',
                cityMapUrl: '/assets/maps/TO.gif',
                adminAreaList: formattedZones['TO']
            },
            BG: {
                cityMapTitle: 'Bergamo',
                zonesListTitle: 'Comuni',
                cityName: 'Bergamo',
                cityMapUrl: '/assets/maps/BG.gif',
                adminAreaList: formattedZones['BG']
            },
            VR: {
                cityMapTitle: 'Verona',
                zonesListTitle: 'Comuni',
                cityName: 'Verona',
                cityMapUrl: '/assets/maps/VR.gif',
                adminAreaList: formattedZones['VR']
            },
            BS: {
                cityMapTitle: 'Brescia',
                zonesListTitle: 'Comuni',
                cityName: 'Brescia',
                cityMapUrl: '/assets/maps/BS.gif',
                adminAreaList: formattedZones['BS']
            },
            PD: {
                cityMapTitle: 'Padova',
                zonesListTitle: 'Comuni',
                cityName: 'Padova',
                cityMapUrl: '/assets/maps/PD.gif',
                adminAreaList: formattedZones['PD']
            },
            GE: {
                cityMapTitle: 'Genova',
                zonesListTitle: 'Comuni',
                cityName: 'Genova',
                cityMapUrl: '/assets/maps/GE.gif',
                adminAreaList: formattedZones['GE']
            },
            BO: {
                cityMapTitle: 'Bologna',
                zonesListTitle: 'Comuni',
                cityName: 'Bologna',
                cityMapUrl: '/assets/maps/BO.gif',
                adminAreaList: formattedZones['BO']
            },
            FI: {
                cityMapTitle: 'Firenze',
                zonesListTitle: 'Comuni',
                cityName: 'Firenze',
                cityMapUrl: '/assets/maps/FI.gif',
                adminAreaList: formattedZones['FI']
            },
            CO: {
                cityMapTitle: 'Como',
                zonesListTitle: 'Comuni',
                cityName: 'Como',
                cityMapUrl: '/assets/maps/CO.gif',
                adminAreaList: formattedZones['CO']
            },
            RM: {
                cityMapTitle: 'Roma',
                zonesListTitle: 'Comuni',
                cityName: 'Roma',
                cityMapUrl: '/assets/maps/RM.gif',
                adminAreaList: formattedZones['RM']
            },
        }

        // defualt deselected
        scope.zoneSelectionActiveData = null;
        scope.zoneSelectionActive = false;
        scope.selectedMacroArea = null;

        // helpers
        scope.updateMap = function (zone)
        {
            $log.log('[SELECT_CITY_ZONES] Updating map');
            $timeout(function(){
                scope.zoneSelectionActive = false;
                $timeout(function(){
                    scope.zoneSelectionActiveData = scope.zoneSelectionData[zone];
                    scope.zoneSelectionActive = true;
                });
            });
        }

        scope.countZoneForAdminArea = function (adminAreaCode)
        {
            var counter = 0;

            scope.selectedZones.forEach(function (z) {
                var found = _.find(formattedZones[adminAreaCode], function (zon) {
                    return zon.id == z;
                });
                if (found) counter ++;
            });

            return counter;
        }


    }

}
