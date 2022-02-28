'use strict';

export default function CarnetDiscountInfoController (
        $scope,
        $stateParams,
        $state
    ) {
        "ngInject";

        var expireOctober = '23 Ottobre';
        var expireNovember = '8 Novembre';

        $scope.expireDate = expireOctober;

        // Expire date for facebook is in November
        if ($stateParams.ref === 'facebook') {
            $scope.expireDate = expireNovember;
        }

    }
