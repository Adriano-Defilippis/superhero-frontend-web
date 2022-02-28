'use strict';

import { PRICING } from '../../booking.config';

export const PricingOverview = {
    bindings: {
        confirmedDates: '=',
        orderInfo: '=',
        carnetInfo: '=',
        isCarnet: '=',
        isEditing: '=',
        isHeroSelection: '=',
        isContextualCarnet: '=',
        isConfirmPage: '=',
        contextualCarnet: '=',
        showContextualCarnet: '=',
        onBuyCarnet: '&'
    },
    controller: function() {
        "ngInject";

        //ths.PRICING = PRICING;

        this.getSumCost = () => {
            let sum = 0;
            this.confirmedDates.forEach(function(_date){
                sum += _date.prezzoEuro;
            });

            if (this.isEditing === true) {
                sum += this.isCarnet === true ? PRICING.edit.carnet : PRICING.edit.standard;
            }

            return sum;
        }

        this.getSumTime = () => {
            let sum = 0;
            this.confirmedDates.forEach(function(_date){
                let time = (_date.end - _date.start)/1000/60/60;
                sum += time;
            });
            return sum;
        }

        this.finalPrice = () => {
            return this.orderInfo.finalPrice;
        }

        this.mustShowFinalPrice = () => {
            return this.finalPrice() >= 0 && this.finalPrice() < this.getSumCost()
        }

    },
    controllerAs: 'PricingOverview',
    templateUrl: 'app/booking/components/pricing-overview/pricing-overview.component.html'
}

export default PricingOverview;
