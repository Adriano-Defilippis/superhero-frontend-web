'use strict';

import { PRICING } from '../booking.config';

export default function CarnetSidebarDirective (
    Services
) {
    "ngInject";

    return {
        restrict: 'AE',
        templateUrl: 'app/booking/sidebar-carnet/sidebar-carnet.directive.html',
        bindToController: true,
        controller: function(Carnet) {
            "ngInject";

            let ctrl = this;
            ctrl.getCarnetLabel = (carnetId) => {
                let info = Carnet.byId(carnetId);
                let prestazione = _(info.prestazione).chain().lowerCase().capitalize().value();
                return 'Carnet ' + prestazione + ' ' + info.type;
            }

            ctrl.getExpiryLabel = (duration) => {
                let expireDate = moment().add(duration, 'months');
                return '' + expireDate.format('DD/MM/YYYY') + ' (' + duration + ' mesi)';
            }

            ctrl.mustShowFinalPrice = (carnetPrice, finalPrice) => {
                return finalPrice > -1 && finalPrice < carnetPrice;
            }

        },
        controllerAs: 'CarnetSidebar'
    }
}
