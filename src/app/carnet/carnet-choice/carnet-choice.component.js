'use strict';

export const CarnetChoice = {
    bindings: {
        enabledServices: '=',
        disabledCarnet: '=',
        showDiscount: '=',
        hidePaymentData: '=',
        skyCarnet: '=',
        preselect: '=',
        disabled: '=',
        discountTips: '=',
        heroInfo: '=',
    },
    controller: function($scope, SERVICES, Services, Carnet, $ngRedux, CarnetActions, BookingModel, AssetsStore) {
        "ngInject";
        var ctrl = this;

        let enableAll = false;


        let yogaSmallPriceMultiplied = false;
        let yogaMediumPriceMultiplied = false;
        let yogaLargePriceMultiplied = false;

        ctrl.selectedService = ctrl.preselect ? ctrl.preselect : '';
        ctrl.selectedSubService = '';
        console.log(ctrl.heroInfo);

        ctrl.selectService = (serviceId, willProceedSubService) => {
            if (willProceedSubService !== true) {
                console.debug('Selected service', serviceId);
                ctrl.selectedService = serviceId;
                ctrl.selectedSubService = ''; 
                ctrl.selectedCarnet = [];
                _.forEach(Carnet.byParent(serviceId), carnet => {
                    if (!carnet.isHidden && !ctrl.skyCarnet) {
                        if (ctrl.heroInfo && !ctrl.heroInfo.partitaIva) {
                            if (carnet.type === 'Small' || carnet.type === 'Medium' || carnet.type === '5sed' || carnet.type === '10sed') {
                                ctrl.selectedCarnet.push(carnet);
                            }
                        }
                        else {
                            ctrl.selectedCarnet.push(carnet);
                        }
                    }
                    if (ctrl.skyCarnet && _.startsWith(carnet.id, 'TC-0000-0001')) {
                        ctrl.selectedCarnet.push(carnet);
                    }
                });
            }
        }

        ctrl.selectSubService = (parent, serviceId, willProceedSubService) => {
            console.debug('Selected subservice', parent, serviceId);
            ctrl.selectedService = parent;
            ctrl.selectedSubService = serviceId;
            ctrl.selectedCarnet = [];
            _.forEach(Carnet.byParent(serviceId), carnet => {
                //if yoga
                if (carnet.competenza === 'ATT-00000000-0000-0000-0001-000000000008') {

                    if (carnet.id === "TC-0000-0000-0001-0008" && yogaSmallPriceMultiplied == false)
                    {
                        carnet.priceHour = Math.round(carnet.priceHour * 1.5);
                        yogaSmallPriceMultiplied = true;
                    }

                  if (carnet.id === "TC-0000-0000-0002-0008" && yogaMediumPriceMultiplied == false)
                  {
                    carnet.priceHour = Math.round(carnet.priceHour * 1.5);
                    yogaMediumPriceMultiplied = true;
                  }

                  if (carnet.id === "TC-0000-0000-0003-0008" && yogaLargePriceMultiplied == false)
                  {
                    carnet.priceHour = Math.round(carnet.priceHour * 1.5);
                    yogaLargePriceMultiplied = true;
                  }


                  carnet.priceHourAndHalf = true;
                }
                if (!carnet.isHidden) {
                    if (ctrl.heroInfo && !ctrl.heroInfo.partitaIva) {
                        if (carnet.type === 'Small' || carnet.type === 'Medium' || carnet.type === '5sed' || carnet.type === '10sed') {
                            ctrl.selectedCarnet.push(carnet);
                        }
                    }
                    else {
                        ctrl.selectedCarnet.push(carnet);
                    }
                }
            });
            
        }

        ctrl.showDiscountTips = () => {
            if (ctrl.discountTips === false) return false;
            if (ctrl.hidePaymentData === true) return false;
            return ctrl.selectedService === SERVICES.BADANTE || ctrl.selectedService === SERVICES.BABYSITTER;
        }

        ctrl.buyCarnet = (carnet) => {
            if (typeof ctrl.heroInfo !== 'undefined') $ngRedux.dispatch(CarnetActions.startCarnetBookingSelectingHero(carnet, ctrl.heroInfo));
            else $ngRedux.dispatch(CarnetActions.startBookingAndSelectCarnet(carnet));
        }

        if (ctrl.preselect) {
            if (Services.isSubService(ctrl.preselect)) {
                ctrl.selectSubService("", ctrl.preselect, false);
            }
            else {
                ctrl.selectService(ctrl.preselect, false);
            }
        }

        ctrl.model = {
            textContainer: AssetsStore.Image('carnet.textContainer'),
            info: AssetsStore.Image('carnet.carnetInfo')
        } 

    },
    controllerAs: 'CarnetChoice',
    templateUrl: 'app/carnet/carnet-choice/carnet-choice.component.html'
}
