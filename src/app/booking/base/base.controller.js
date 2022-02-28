'use strict';

import TYPES from '../_config/types';
import { CARNET_STEPS } from '../booking.config';

export default function BookingBaseController (
    $scope, $rootScope, $state, $stateParams, $ngRedux, AssetsStore, BookingActions, HerosearchActions, CarnetActions, userInfo, User, STEPS, SERVICES, UserInfo, carnetTypes, Carnet
){
    "ngInject";

    let ctrl = this,
        info = null;

    if(!_.isEmpty(userInfo)){
      // USER IS LOGGED IN!
      info = userInfo.data.plain();
      UserInfo.setInfo(userInfo.data.plain());
    }
    Carnet.loadData(carnetTypes);

    ctrl.STEPS = STEPS;
    ctrl.CARNET_STEPS = CARNET_STEPS;
    ctrl.TYPES = TYPES;
    ctrl.SERVICES = SERVICES;
    ctrl.isHeroSearchPage = isHeroSearchPage;
    ctrl.mustShowSteps = mustShowSteps;
    ctrl.imageHeader = AssetsStore.Image('findSuperhero.header');
    ctrl.isApp = $rootScope.isApp;

    // redux setup for container components
    let unsubscribeFromState = $ngRedux.connect(mapStateToThis, _.merge({}, BookingActions, HerosearchActions, CarnetActions))(ctrl);
    $scope.$on('$destroy', unsubscribeFromState);

    if (info !== null) {
        // initialize dates to pick
        $ngRedux.dispatch(BookingActions.setUserInfo(info));
    }

    function mapStateToThis(state) {
        return {
            state: state.booking,
            herosearch: state.herosearch,
            common: state.common,
            carnet: state.carnet
        }
    }

    function isHeroSearchPage () {
        return _.includes($state.current.name, 'herosearch') || _.includes($state.current.name, 'heroprofile');
    }

    function mustShowSteps () {
        let mustShow = true;
        if ((_.includes($state.current.name, 'herosearch') || _.includes($state.current.name, 'heroprofile')) && ctrl.common.type === TYPES.SERVICE) mustShow = false;
        return mustShow;
    }

}
