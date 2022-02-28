"use strict";

import { SERVICES } from '../booking.config';
import ORDERS from '../_config/orders';

var initialState = Immutable({
    performedSearch: false,
    showAdvanced: false,
    disabledServiceSelection: false,
    filters: {
        postalCode: '',
        service: '',
        additional: [],
        languages: {
            italian: '',
            english: '',
            french: ''
        },
        misc: {
            amanteAnimali: false,
            disponibilitaWeekend: false,
            disponibilitaNotturna: false
        }
    },
    error: '',
    results: []
});

function herosearch (state = initialState, action) {
    switch (action.type) {
        case 'SET_FILTERS':
            return state.setIn(
                ['filters'],
                state.filters.merge(action.newFilters, { deep: true })
            );

        case 'SET_PERFORMED_SEARCH':
            if (typeof action.perfomed !== 'undefined' && action.perfomed === false) {
                return state.setIn(['performedSearch'], false);
            } else {
                return state.setIn(['performedSearch'], true);
            }
            return state;

        case 'DISABLE_SERVICE_SELECTION':
            return state.setIn(['disabledServiceSelection'], true);

        case 'RESET_SEARCH':
            const service = state.filters.service;
            return state.merge(initialState, { deep: true }).setIn(['filters', 'service'], service);

        case 'TOGGLE_ADVANCED':
            return state.setIn(['showAdvanced'], !state.showAdvanced);

        case 'SET_ERROR':
            return state.setIn(['error'], action.error);

        case 'SET_RESULTS':
            return state.setIn(['results'], action.results);

        case 'RESET_STATE':
            return initialState;

        // set state
        case 'SET_BOOKING_STATE':
            return state.merge(action.state.herosearch, {deep: true});

        default:
            return state;
    }
}

export default herosearch;
