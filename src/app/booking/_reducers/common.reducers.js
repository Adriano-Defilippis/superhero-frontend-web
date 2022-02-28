"use strict";

import TYPES from '../_config/types';

var initialState = Immutable({
    type: TYPES.SERVICE,
    router: ''
});

function common (state = initialState, action) {
    switch (action.type) {
        case 'SET_BOOKING_TYPE':
            return state.setIn(['type'], action.bookingType);

        case 'CHANGE_ROUTER_STATE':
            return state.set('router', action.name);

        case 'RESET_STATE':
            return initialState;

        // set state
        case 'SET_BOOKING_STATE':
            return state.merge(action.state.common, {deep: true});

        default:
            return state;
    }
}

export default common;
