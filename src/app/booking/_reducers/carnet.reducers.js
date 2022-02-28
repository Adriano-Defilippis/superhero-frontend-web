"use strict";

import { SERVICES } from '../booking.config';
import ORDERS from '../_config/orders';

var initialState = Immutable({
    completed: {
        carnetSelection: false,
        herosearch: false,
        userData: false
    },
    router: '',
    selectedCarnet: '',
    selectedHero: '',
    carnetInfo: {},
    guestsInfo: [],
    heroInfo: {},
    error: null
});

function carnet (state = initialState, action) {
    switch (action.type) {

        case 'SET_ERROR':
            return state.set('error', action.error);

        case 'RESET_ERROR':
            return state.set('error', null);

        case 'CHANGE_ROUTER_STATE':
            return state.set('router', action.name);

        case 'SET_STEP_COMPLETED':
            return state.setIn(['completed', action.step], true);

        case 'SET_SELECTED_CARNET':
            return state.setIn(['selectedCarnet'], action.carnetId)
                .setIn(
                ['completed', 'carnetSelection'],
                true
            );

        case 'SET_CARNET_INFO':
            return state.setIn(
                ['carnetInfo'],
                action.carnetInfo
            );

        case 'ADD_NEW_GUEST':
            if (state.guestsInfo.length < 5) {
                return state.setIn(
                    ['steps','guestsInfo'],
                    state.guestsInfo.concat([{ nome: '', cognome: '', eta: ''}])
                );
            }
            return state;

        case 'REMOVE_GUEST':
            if (typeof state.guestsInfo[action.index] === 'object') {
                console.log(state.guestsInfo);
                return state.setIn(
                    ['steps','guestsInfo'],
                    state.guestsInfo.filter(function(guest, index){
                        return action.index !== index;
                    })
                );
            }
            return state;

        case 'SET_SELECTED_HERO':
            if (_.isObject(action.heroInfo)) {
                return state.setIn(
                    ['heroInfo'],
                    state.heroInfo.merge(action.heroInfo, { deep: true })
                ).setIn(
                    ['completed', 'herosearch'],
                    true
                );
            }
            return state;

        case 'EDIT_GUEST':
            if (typeof state.guestsInfo[action.index] === 'object') {
                return state.setIn(
                    ['steps','guestsInfo', action.index],
                    state.guestsInfo[action.index].merge(action.guestInfo)
                );
            }
            return state;

        case 'RESET_STATE':
            return initialState;

        // set state
        case 'SET_BOOKING_STATE':
            return state.merge(action.state.carnet, {deep: true});

        default:
            return state;
    }
}

export default carnet;
