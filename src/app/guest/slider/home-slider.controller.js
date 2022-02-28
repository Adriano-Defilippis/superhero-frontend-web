'use strict';

export default function HomeSliderController (
    $log,
    $timeout,
    $state,
    uiGmapGoogleMapApi,
    StaticPage,
    $ngRedux,
    BookingActions
){
    "ngInject";

    var autocompletes = {};

    uiGmapGoogleMapApi.then(function(maps) {
        //StaticPage.setupGoogleAutocomplete(maps, 'address-home-input');
    });

    this.selectedService = '';
    this.selectedSubService = '';

    this.selectService = (serviceId, willProceedSubService) => {
        if (willProceedSubService !== true) {
            console.debug('Selected service', serviceId);
            this.selectedService = serviceId;
            this.selectedSubService = '';
            const isBnb = _.includes($state.current.url, 'BNB');
            this.startBooking(isBnb);
        }
    }

    this.selectSubService = (parent, serviceId, willProceedSubService) => {
        console.debug('Selected subservice', parent, serviceId);
        this.selectedService = parent;
        this.selectedSubService = serviceId;
        this.startBooking();
    }

    this.startBooking = function (isBnb) {
        //console.debug('Starting booking with service preselected: ', ctrl.selectedService[index]);
        let service = this.selectedService;
        if (this.selectedSubService !== '') service = this.selectedSubService;
        if (isBnb) {
            $ngRedux.dispatch(BookingActions.startBookingBNBPreselectingService(service));
        } else {
            $ngRedux.dispatch(BookingActions.startBookingPreselectingService(service));
        }
    }

}
