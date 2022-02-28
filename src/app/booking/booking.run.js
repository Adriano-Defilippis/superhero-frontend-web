'use strict';

import TYPES from './_config/types';
import { CARNET_STEPS } from './booking.config';

export default function BookingModuleRun (
    $rootScope,
    $ngRedux,
    $state,
    $log,
    BookingActions,
    HerosearchActions,
    STEPS
) {
    "ngInject";

    $rootScope.$on('$stateChangeStart', (ev, toState, toParams, fromState, fromParams) => {
        if (_.includes(toState.name, 'booking') && !_.includes(toState.name, 'confirm')) {
            $log.debug('[STATE_CHANGE_START] User trying to navigate to', toState.name);
            let state = $ngRedux.getState();
            let bookingType = state.common.type;
            let stepsToFollow = bookingType === TYPES.CARNET ? CARNET_STEPS : STEPS;
            let completed = bookingType === TYPES.CARNET ? state.carnet.completed : state.booking.completed;
            let target = _.last(stepsToFollow).state;
            let allowed = ['booking.herosearch', 'booking.bnbService', 'booking.bnbHerosearch', 'booking.heroprofile', 'booking.bnbHeroprofile', 'booking.appOrderCreation', 'booking.appUserData'];
            _.forEachRight(stepsToFollow, (_step) => {
                if (typeof completed[_step.name] === 'undefined' || completed[_step.name] !== true) target = _step.state;
                if (completed[_step.name] === true) allowed.push(_step.state);
            });
            if (!_.includes(allowed, toState.name) && toState.name !== target) {
                $log.debug('[STATE_CHANGE_START] User cannot go to target state, booking must follow default order, redirecting to', target);
                ev.preventDefault();
                $state.go(target);
                return;
            }
        }
    });

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
        if (_.includes(toState.name, 'booking')) {
            $ngRedux.dispatch({ type: 'CHANGE_ROUTER_STATE', name: toState.name });
        } else if (_.includes(fromState.name, 'booking')) {
            $ngRedux.dispatch(BookingActions.resetState());
            $ngRedux.dispatch(HerosearchActions.resetSearch(true));
        }
    });
}
