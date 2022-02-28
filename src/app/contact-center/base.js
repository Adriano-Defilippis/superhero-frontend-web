'use strict';

export default function ContactCenterBaseController (
    $scope, $state
) {
    "ngInject";

  	var ctrl = this;

    ctrl.bgWhite = true;

    ctrl.isBgWhite = function(){
      return !$state.includes('main.support.edit-appointment') && !$state.includes('main.support.edit-order');
    }

  }
