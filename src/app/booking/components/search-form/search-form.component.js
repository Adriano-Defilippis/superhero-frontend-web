'use strict';

import { ATTRIBUTES } from '../../booking.config';
import { additional } from '../../booking.factory';

export const SearchForm =  {
    bindings: {
        filters: '=',
        disabledServiceSelection: '=',
        showAdvanced: '=',
        error: '=',
        disabledServices: '=',
        onToggleShowAdvanced: '&',
        onChangedFilters: '&',
        onUpdateSearch: '&',
    },
    controller: function(SERVICES, $scope, BookingModel, Services) {
        "ngInject";

        var ctrl = this;

        ctrl.selectedService;
        ctrl.selectedSubService;

        if (ctrl.filters.service) {
            if (BookingModel.competences[ctrl.filters.service].parent) {
                ctrl.selectedService = BookingModel.competences[ctrl.filters.service].parent;
                ctrl.selectedSubService = BookingModel.competences[ctrl.filters.service].relatedService;   
            }
            else {
                ctrl.selectedService = BookingModel.competences[ctrl.filters.service].relatedService;   
            }
            ctrl.disabledServices = _.without(_.toArray(SERVICES), ctrl.selectedService, ctrl.selectedSubService);
        }

        ctrl.competences = BookingModel.competences;

        ctrl.servicesSpecificOptions = Services.sottoCompetenzeAttive();

        ctrl.languageOptions = {
            italian: [
                { id : 'Scarsa', label : "Italiano Scarso"},
                { id : 'Discreta', label : "Italiano Discreto"},
                { id : 'Media', label : "Italiano Medio"},
                { id : 'Buona', label : "Italiano Buono"},
                { id : 'Ottima', label : "Italiano Ottimo"},
                { id : 'Madrelingua', label : "Italiano Madrelingua"}
            ],
            english: [
                { id : 'ATT-00000000-0000-0000-0003-000000000011', label : "Inglese Scarso"},
                { id : 'ATT-00000000-0000-0000-0003-000000000012', label : "Inglese Discreto"},
                { id : 'ATT-00000000-0000-0000-0003-000000000013', label : "Inglese Medio"},
                { id : 'ATT-00000000-0000-0000-0003-000000000014', label : "Inglese Buono"},
                { id : 'ATT-00000000-0000-0000-0003-000000000015', label : "Inglese Ottimo"},
                { id : 'ATT-00000000-0000-0000-0003-000000000016', label : "Inglese Madrelingua"}
            ],
            french: [
                { id : 'ATT-00000000-0000-0000-0003-000000000001', label : "Francese Scarso"},
                { id : 'ATT-00000000-0000-0000-0003-000000000002', label : "Francese Discreto"},
                { id : 'ATT-00000000-0000-0000-0003-000000000003', label : "Francese Medio"},
                { id : 'ATT-00000000-0000-0000-0003-000000000004', label : "Francese Buono"},
                { id : 'ATT-00000000-0000-0000-0003-000000000005', label : "Francese Ottimo"},
                { id : 'ATT-00000000-0000-0000-0003-000000000006', label : "Francese Madrelingua"}
            ]
        }

        $scope.$watch(() => ctrl.filters, (newFilters, oldFilters) => {
            ctrl._filters = newFilters.asMutable({deep: true});
        });

        ctrl.selectService = function(serviceId) {
            ctrl.selectedService = serviceId;
            ctrl._filters.service = ATTRIBUTES[serviceId];
            ctrl.filtersChanged();
        }

        ctrl.selectSubService = (parent, serviceId) => {
            ctrl.selectedService = parent;
            ctrl.selectedSubService = serviceId;
            ctrl._filters.service = ATTRIBUTES[serviceId];
            ctrl.filtersChanged();
        }

        ctrl.filtersChanged = () => {
            let newFilters = _.merge({}, ctrl._filters);
            ctrl.onChangedFilters({newFilters});
        }

        ctrl.sottoCompetenzaChanged = (idSottocompetenza, selected) => {
            if (selected) ctrl._filters.additional.push(idSottocompetenza);
            else ctrl._filters.additional.pop(idSottocompetenza);
            let newFilters = _.merge({}, ctrl._filters);
            ctrl.onChangedFilters({newFilters});
        }


        ctrl.isSelected = (additionalServiceId, specific) => {
            let whichAdditional = specific === true ? ctrl.specificAdditional : ctrl.additional;
            if (_.isArray(whichAdditional)) {
                return _.includes(whichAdditional, additionalServiceId);
            } else if (_.isString(whichAdditional)) {
                return additionalServiceId === whichAdditional;
            }
        }
    },
    controllerAs: 'SearchForm',
    templateUrl: 'app/booking/components/search-form/search-form.component.html'
}
