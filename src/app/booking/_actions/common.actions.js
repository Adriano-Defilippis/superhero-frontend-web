/* globals RestService: true, SERVICES: true, ERRORS: true */
'use strict';

export default function CommonActionsFactory () {
    "ngInject";

    function setBookingType (bookingType) {
        return { type: 'SET_BOOKING_TYPE', bookingType };
    }

    return {
        setBookingType
    }
}
