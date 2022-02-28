'use strict';

export default function GuestBaseController (
    $scope, $stateParams, $log, $rootScope
) {
    "ngInject";

  	var self = this;

    self.isApp = $rootScope.isApp;

    // check if user comes from different origin
    if ($stateParams.ref === 'adword') {
        self.codiceSconto = 'PA1';
    } else if ($stateParams.ref === 'banner') {
        self.codiceSconto = 'PB1';
    } else if ($stateParams.ref === 'remarketing') {
        self.codiceSconto = 'PR1';
    } else if ($stateParams.ref === 'facebook') {
        self.codiceSconto = 'PF1';
    } else {
        self.codiceSconto = false;
    }

  }
