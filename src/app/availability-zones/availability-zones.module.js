'use strict';

import CityAdminZonesDirective from './city-admin-zones.directive';
import SelectCityZonesDirective from './select-city-zones.directive';

export default angular.module('ilmiosupereroe.availability-zones', ['ilmiosupereroe.services'])
    .directive('cityAdminZones', CityAdminZonesDirective)
    .directive('selectCityZones', SelectCityZonesDirective);
