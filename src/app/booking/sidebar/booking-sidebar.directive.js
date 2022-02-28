'use strict';

import { PRICING } from '../booking.config';

export default function BookingSidebarDirective (

) {

    return {
        restrict: 'AE',
        templateUrl: 'app/booking/sidebar/booking-sidebar.directive.html',
        bindToController: true,
        controller: function(AssetsStore, BookingActions, BookingModals, BookingModel, Services, SERVICES, Carnet, $ngRedux) {
            "ngInject";

            var ctrl = this;

            ctrl.SERVICES = SERVICES;

            ctrl.PRICING = PRICING;

            ctrl.showServiceDescription = function (service) {
                BookingModals.description(service);
            }

            ctrl.getServiceLabel = function (service) {
                let _service = _.find(BookingModel.services, { id: service });
                if (typeof _service !== 'undefined') return _service.label;
                else return null;
            }

            ctrl.getSubServiceLabel = (service, subservice) => {
                let _subservice = _.find(BookingModel.subServices[service], { id: subservice });
                if (typeof _subservice !== 'undefined') return _subservice.label;
                else return null;
            }

            ctrl.getServicePrice = function (_service, guestsInfo, carnetStep) {
                let service = _.find(BookingModel.services, { id: _service });
                let carnetPriceHour = carnetStep.info.priceHour;
                if (service.id === SERVICES.PERSONALTRAINER && guestsInfo.length > 0) {
                    // guestsInfo
                    let prepend = `<span class="hyphened">`+ service.price +`</span>&nbsp;`;
                    return '' + prepend + service.price * (100 - BookingModel.personalTrainerDiscounts[guestsInfo.length + 1])/100;
                } else if (typeof service !== 'undefined') {
                    if (carnetPriceHour > 0) return `<span class="hyphened">`+ service.price +`</span>&nbsp;` + carnetPriceHour;
                    else return service.price;
                }
            }

            ctrl.getFisioterapistaPrice = function (fisioterapistaInfo) {
                let price = 0;
                let subservice = fisioterapistaInfo.subService;
                let service = _.find(BookingModel.subServices[SERVICES.FISIOTERAPISTA], { id: subservice });
                
                return service.price;
            }

            ctrl.getPersonalTrainerPrice = function (personalTrainerInfo) {
                let price = 0;
                let subservice = personalTrainerInfo.subService;
                let service = _.find(BookingModel.subServices[SERVICES.PERSONALTRAINER], { id: subservice });
                if (personalTrainerInfo.guestsInfo.length > 0) {
                    let prepend = `<span class="hyphened">`+ service.price +`</span>&nbsp;`;
                    return '' + prepend + service.price * (100 - BookingModel.personalTrainerDiscounts[personalTrainerInfo.guestsInfo.length + 1])/100;
                } else {
                    return service.price;
                }
            }

            ctrl.getFixedPrice = function (_service, _subservice) {
                let price = 0;
                let service = _.find(BookingModel.services, { id: _service });
                return service.fixedPrice;
            }

            ctrl.getAdditionalToolPrice = function (_service, info) {
                let price = 0;
                let service = _.find(BookingModel.services, { id: _service });
                const serviceSlug = BookingModel.getServiceSlug(_service);
                const additionalTools = info[serviceSlug].selectedAdditionalTools;
                _.forEach(additionalTools, additionalToolId => {
                    let additionalTool = _.find(BookingModel.tools[_service], { id: additionalToolId });
                    if (additionalTool) {
                        price += additionalTool.price;
                    }
                });
                return price;
                
            }

            ctrl.getCarnetServicePrice = (_service) => {
                let service = Carnet.byService(_service);
                return service.priceHour;
            }

            ctrl.showAddress = (completed, addressStep) => {
                if (completed !== true) return false;
                if (addressStep.isNewAddress === true) {
                    return addressStep.confirmed === true;
                } else {
                    return addressStep.selectedUserAddress !== '';
                }
            }

            ctrl.addressLabel = (addressStep) => {
                if (addressStep.isNewAddress === true) {
                    return addressStep.input.info.formatted;
                } else {
                    let address = _.find(addressStep.userAddresses, { id: addressStep.selectedUserAddress });
                    return address.formatted;
                }
            }

            ctrl.getDatesHoursSum = (dates) => {
                let hours = 0;
                dates.forEach(date => {
                    hours += (date.end - date.start)/1000/60/60;
                });
                return hours;
            }

            ctrl.getDatesPriceSum = (dates) => {
                let price = 0;
                dates.forEach(date => {
                    price += date.prezzoEuro;
                });
                return price;
            }

            ctrl.onSelectGenericWithPreference = () => {
                $ngRedux.dispatch(BookingActions.toogleGenericWithPreference());
            }

            ctrl.genericWithPreference = true;

            ctrl.contracts = {
                fornitura: AssetsStore.PDF('cliente.condizioniFornitura'),
                utilizzo: AssetsStore.PDF('cliente.condizioniUtilizzo'),
                privacy: AssetsStore.PDF('cliente.informazioniPrivacy'),
            }

        },
        controllerAs: 'BookingSidebar'
    }
}
