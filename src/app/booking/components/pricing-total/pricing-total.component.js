'use strict';

import { PRICING } from '../../booking.config';

export const PricingTotal = {
    bindings: {
        confirmedDates: '=',
        selectedService: '=',
        servicesInfo: '=',
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
    controller: function (Carnet, SERVICES, BookingModel) {
        "ngInject";

        //ths.PRICING = PRICING;
        var ctrl = this;

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
                if (ctrl.carnetInfo.isPrestazione) {
                    time = 1;
                }
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

        let yogaSmallPriceMultiplied = false;
        let yogaMediumPriceMultiplied = false;
        let yogaLargePriceMultiplied = false;
        this.getHighestDiscount = () => {
            let heroInfo = ctrl.confirmedDates[0].hero,
                service = null;
            service = BookingModel.getFinalService(ctrl.servicesInfo);
            let serviceCarnet = Carnet.byParent(service);
            if (!heroInfo.hasVat) {
                serviceCarnet = serviceCarnet.filter(_carnet => 
                    _carnet.type === 'Small' || _carnet.type === 'Medium' || _carnet.type === '5sed' || _carnet.type === '10sed');
            }
            let lowestPrice = null;
            let competenzaCarnetFound = null;
            serviceCarnet.forEach(carnet => {
              if (lowestPrice === null) lowestPrice = carnet;
              if (carnet.competenza === 'ATT-00000000-0000-0000-0001-000000000008') {
                if (carnet.id === "TC-0000-0000-0001-0008" && !yogaSmallPriceMultiplied)
                {
                  carnet.priceHour = 72;
                  yogaSmallPriceMultiplied = true;
                }

                if (carnet.id === "TC-0000-0000-0002-0008" && !yogaMediumPriceMultiplied)
                {
                  //carnet.priceHour = Math.round(carnet.priceHour * 1.5);
                  carnet.priceHour = 68;
                  yogaMediumPriceMultiplied = true;
                }

                if (carnet.id === "TC-0000-0000-0003-0008" && !yogaLargePriceMultiplied)
                {
                  carnet.priceHour = 64;
                  yogaLargePriceMultiplied = true;
                }
                carnet.priceHourAndHalf = true;
              }

                if (carnet.priceHour < lowestPrice.priceHour && carnet.isHidden === false) lowestPrice = carnet;
                competenzaCarnetFound = carnet.competenza;
            });

            let originalPrice = _.find(BookingModel.services, { id: service });
            if (typeof originalPrice === 'undefined') {
                _.forEach(BookingModel.subServices, _subservices => {
                    let found = _.find(_subservices, { id: service });
                    if (typeof found !== 'undefined') originalPrice = found;
                });
            }
            let hourlyDiscount = originalPrice.price - lowestPrice.priceHour;
            let totalDiscount = 0;

            if (competenzaCarnetFound === 'ATT-00000000-0000-0000-0001-000000000008') {
              totalDiscount = Math.round(hourlyDiscount * ctrl.getSumTime()  * 100 / 1.5) / 100;
            }
            else {
              totalDiscount = Math.round(hourlyDiscount * ctrl.getSumTime()  * 100 ) / 100;
            }

            return totalDiscount;
        }

        this.showCarnetDiscount = () => {
            let showDiscount = true;
            const service = BookingModel.getFinalService(ctrl.servicesInfo);
            let serviceCarnet = Carnet.byParent(service);

            serviceCarnet = _.filter(serviceCarnet, carnet => !carnet.isHidden);

            if (ctrl.selectedService === SERVICES.PERSONALTRAINER && ctrl.servicesInfo.personalTrainer.guestsInfo.length > 0) showDiscount = false;
            if (ctrl.selectedService === SERVICES.FISIOTERAPISTA) showDiscount = false;
            return showDiscount && ctrl.isContextualCarnet === false &&
                ctrl.isEditing === false &&
                ctrl.isHeroSelection === true &&
                ctrl.showContextualCarnet === true &&
                ctrl.isConfirmPage === false && serviceCarnet.length > 0;
        }

    },
    controllerAs: 'PricingTotal',
    templateUrl: 'app/booking/components/pricing-total/pricing-total.component.html'
}

export default PricingTotal;
