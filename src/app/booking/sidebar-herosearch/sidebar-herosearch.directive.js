'use strict';

import { PRICING } from '../booking.config';

export default function HerosearchSidebarDirective (
    Services
) {
    "ngInject";

    return {
        restrict: 'AE',
        templateUrl: 'app/booking/sidebar-herosearch/sidebar-herosearch.directive.html',
        bindToController: true,
        controller: function(AssetsStore, BookingModals, BookingModel, Services, SERVICES) {
            "ngInject";

            var ctrl = this;

            ctrl.SERVICES = SERVICES;
            ctrl.PRICING = PRICING;

            ctrl.getFormattedFilters = (filters) => {
                let labels = [];
                if (filters.postalCode !== '') labels.push('Cap: ' + filters.postalCode);
                if (filters.misc.amanteAnimali === true) labels.push('Amante degli animali');
                if (filters.misc.disponibilitaWeekend === true) labels.push('Disponibilità nel week end');
                if (filters.misc.disponibilitaNotturna === true) labels.push('Disponibilità notturna');
                // sottocompetenze
                filters.additional.forEach(_additional => {
                    labels.push(Services.detail.Label(_additional));
                });
                if (filters.languages.italian !== '') labels.push('Conoscenza Italiano: ' + filters.languages.italian);
                if (filters.languages.french !== '') labels.push('Conoscenza Francese: ' + Services.detail.Label(filters.languages.french));
                if (filters.languages.english !== '') labels.push('Conoscenza Inglese: ' + Services.detail.Label(filters.languages.english));
                return labels;
            }

            ctrl.getServiceLabel = (attrId) => {
                return Services.Competenze.Label(attrId);
            }

        },
        controllerAs: 'HerosearchSidebar'
    }
}
