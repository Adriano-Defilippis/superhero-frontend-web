'use strict';

export default function CityAdminZonesDirective (

    $log,
    $timeout,
    uiGmapIsReady,
    $rootScope,
    $http

) {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            data: '=',
            adminAreaSelected: '=selectedZones'
        },
        templateUrl: 'app/availability-zones/city-admin-zones-directive.html',
        link: linkFunction
    }

    function linkFunction (scope, elem, attrs)
    {
        $log.debug('[CITY_ADMIN_ZONES_DIRECTIVE] Initialized');
        $log.debug('[CITY_ADMIN_ZONES_DIRECTIVE] Data loaded:', scope.data);

        // Set labels
        /*
        scope.cityMapTitle = scope.data.cityMapTitle;
        scope.zonesListTitle = scope.data.zonesListTitle;
        scope.cityMapUrl = scope.data.cityMapUrl;
        */

        // Clone options to scope
        _.assign(scope, scope.data);

        // config
        var styles = JSON.parse('[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]');

        // init values
        scope.selectedArea = null;
        var map = null, gmapZones;

        if (scope.map) {
            gmapZones = getGeoJsonFeatures(scope.map.geoJson);

            scope.map.options = {
                styles: styles,
                disableDoubleClickZoom: Modernizr.touch ? true : false,
                scrollwheel: false,
                maxZoom : 15,
                minZoom : Modernizr.touch ? 10 : 11
            }
        }

        // helpers
        scope.mustShowGmap = function ()
        {
            if (scope.cityMapUrl) return false;
            else return true;
        }

        scope.isAreaSelected = function (area)
        {
            var found = _.find(scope.adminAreaSelected, function (zone) {
                return zone == area;
            });

            //$log.debug('[CITY_ADMIN_ZONES_DIRECTIVE] [isAreaSelected]', found);
            return found != undefined;
        }

        scope.isGmapZone = function (area)
        {
            if (!gmapZones) return false;

            if (_.isString(area)) {
                var found = _.find(gmapZones, function (zone) {
                    return zone == area;
                });

                return found != undefined;
            } else if (_.isObject(area)) {
                var found = _.find(gmapZones, function (zone) {
                    return zone == area.id;
                });

                return found != undefined;
            }

        }


        scope.addAdminArea = function (area)
        {
            $log.debug('[CITY_ADMIN_ZONES_DIRECTIVE] Selected zone', area);

            if (!scope.isAreaSelected(area)) {
                $timeout(function(){
                    scope.adminAreaSelected.push(area);
                    scope.selectedArea = null;
                });
            }
        }

        scope.removeAdminArea = function (areaToRemove)
        {
            $timeout(function(){
                var removed = _.remove(scope.adminAreaSelected, function (area) {
                    return area == areaToRemove;
                });
            });
        }



        scope.getAreaDescription = function (areaId)
        {
            var found = _.find(scope.adminAreaList, function (area) {
                return area.id == areaId;
            });

            if (found) return found.description;
            else return "";
        }

        scope.isCurrentAdministrationArea = function (area)
        {
            if (scope.getAreaDescription(area) == '') return false;
            else return true;
        }

        scope.getGmapsSelectedZones = function ()
        {
            var selectedZones = 0;
            scope.adminAreaSelected.forEach(function(selectedArea){
                if (scope.isGmapZone(selectedArea)) selectedZones++;
            });
            return selectedZones;
        }

        // When GMAPS is loaded
        if (scope.mustShowGmap()) {
            uiGmapIsReady.promise(1).then(function(instances) {
                instances.forEach(function(inst) {
                    map = inst.map;
                    var uuid = map.uiGmap_id;
                    var mapInstanceNumber = inst.instance; // Starts at 1.
                    var idleStyle = {
                        fillColor: "#fff",
                        fillOpacity: 0,
                        strokeWeight: 3,
                        strokeColor: "#EE693C"
                    };
                    var activeStyle = {
                        fillColor: '#EE693C',
                        fillOpacity: 0.5,
                        strokeWeight: 3,
                        strokeColor: "#EE693C"
                    };

                    map.data.addGeoJson(scope.map.geoJson);

                    $log.debug('[CITY_ADMIN_ZONES_DIRECTIVE]', map.data, self.zonesJson);

                    // preselect zones
                    map.data.setStyle(function(feature) {
                        var zonaId = feature.getProperty('id');
                        gmapZones.push(zonaId);

                        var found = _.find(scope.adminAreaSelected, function(area){
                            return area == zonaId;
                        });
                        if(found) return (activeStyle);
                        else return (idleStyle);
                    });

                    //map.data.revertStyle();

                    // Set click/touch event for each area.
                    map.data.addListener('click', function(event) {

                        var zonaId = event.feature.getProperty('id');
                        toggleArea(zonaId);

                        if(!Modernizr.touch){
                            map.data.overrideStyle(event.feature, activeStyle);
                        } else {
                            var found = _.find(scope.adminAreaSelected, function(area){
                              return area == zonaId;
                            });
                            if(found) map.data.overrideStyle(event.feature, activeStyle);
                            else map.data.overrideStyle(event.feature, idleStyle);
                        }
                    });

                    if(!Modernizr.touch){
                        map.data.addListener('mouseover', function(event) {
                            var zonaId = event.feature.getProperty('id');
                            var found = _.find(scope.adminAreaSelected, function(area){
                                return area == zonaId;
                            });
                            if(!found)  {
                                map.data.overrideStyle(event.feature, activeStyle);
                            }
                        });

                        map.data.addListener('mouseout', function(event) {
                            var zonaId = event.feature.getProperty('id');
                            var found = _.find(scope.adminAreaSelected, function(area){
                                return area == zonaId;
                            });
                            if(!found){
                                map.data.overrideStyle(event.feature, idleStyle);
                            }
                        });
                    }

                });
            });
        }

        function toggleArea (area)
        {
            if (!scope.isAreaSelected(area)) {
                $log.debug('[CITY_ADMIN_ZONES_DIRECTIVE] Area was not found. Adding');
                scope.addAdminArea(area);
            } else {
                $log.debug('[CITY_ADMIN_ZONES_DIRECTIVE] Area was not found. Removing');
                scope.removeAdminArea(area);
            }
        }

        function getGeoJsonFeatures (geoJson)
        {
            if (geoJson) {
                var zones = [];
                geoJson.features.forEach(function (feature) {
                    zones.push(feature.properties.id);
                });
                return zones;
            }
        }

        scope.not = $rootScope.not;

    }


}
