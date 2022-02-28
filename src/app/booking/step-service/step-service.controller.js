'use strict';

export default function BookingStepServiceController (
    $scope, BookingModel, SERVICES, $rootScope, RestService, $ngRedux, BookingActions, $state
){
    "ngInject";

    var ctrl = this;

    ctrl.isBnb = _.includes($state.current.url, 'BNB');
    var bnbServices = [SERVICES.TUTTOFARE, SERVICES.SERVIZI_ELETTRICI, SERVICES.SERVIZI_IDRAULICI, SERVICES.CHECKIN_CHECKOUT, SERVICES.COLF_BNB];

    if (ctrl.isBnb) {
        $ngRedux.dispatch(BookingActions.disableServices(_.without(_.toArray(SERVICES), ...bnbServices)));
    } else {
        $ngRedux.dispatch(BookingActions.disableServices([SERVICES.CHECKIN_CHECKOUT, SERVICES.COLF_BNB]));
    }

    ctrl.services = BookingModel.services;
    ctrl.additional = BookingModel.additional;
    ctrl.tools = BookingModel.tools;
    ctrl.subServices = BookingModel.subServices;
    ctrl.SERVICES = SERVICES;

    let additionalServicesToShow = [],
        subServicesToShow = [],
        specificServicesToShow = [],
        additionalToolsToShow = [];

    ctrl.filterAdditionalServices = (additional, disabled) => {
        additionalServicesToShow.length = 0;
        BookingModel.additional[additional].forEach(_additional => {
            if(!_.includes(disabled, _additional.id)) additionalServicesToShow.push(_additional);
        });
        return additionalServicesToShow;
    }

    ctrl.filterAdditionalTools = (service) => {
        additionalToolsToShow.length = 0;
        BookingModel.tools[service].forEach(_tool => {
            if(!_tool.disabled) additionalToolsToShow.push(_tool);
        });
        return additionalToolsToShow;
    }

    ctrl.onClickSpecificService = (serviceId, specificServiceId) => {
        let slug = BookingModel.getServiceSlug(serviceId);
        if ($ngRedux.getState().booking.steps.service[slug].subService === specificServiceId) {
            $ngRedux.dispatch(BookingActions.selectSubService(serviceId, ''));
        } else {
            $ngRedux.dispatch(BookingActions.selectSubService(serviceId, specificServiceId));
            $ngRedux.dispatch(BookingActions.resetAdditionalServices(serviceId));
        }
    }

    ctrl.filterSubServices = (subservice, disabled) => {
        subServicesToShow.length = 0;
        BookingModel.subServices[subservice].forEach(_subservice => {
            if(!_.includes(disabled, _subservice.id)) subServicesToShow.push(_subservice);
        });
        return subServicesToShow;
    }

    ctrl.getSelectedSubservice = function (serviceStep, selectedService) {
        if (_.isString(selectedService) && selectedService !== '') {
            const subServiceSelected = _.findKey(BookingModel.subServices, (value) => _.indexOf(value, selectedService === value.id));
            if (subServiceSelected) {
                selectedService = subServiceSelected;
            }
            let slug = BookingModel.getServiceSlug(selectedService);
            return serviceStep[slug].subService;
        } else {
            return '';
        }
    }

}
