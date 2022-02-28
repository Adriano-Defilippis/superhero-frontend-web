'use strict';

export const UserSignup = {
    bindings: {
        firstName: '=',
        lastName: '=',
        taxCode: '=',
        mobileNumber: '=',
        email: '=',
        confirmEmail: '=',
        showError: '=',
        errors: '=',
        patterns: '=',
        onUserInfoChanged: '&',
        onFormValid: '&',
    },
    controller: function( $scope, AssetsStore, BookingActions ) {
        "ngInject";
        let ctrl = this;
        ctrl.imgUploaderInstance = BookingActions.imgFileUploader($scope);
        ctrl.placeHolder = AssetsStore.Image('user.placeholder');
        ctrl.userChanged = function () {
            ctrl.onUserInfoChanged({
                info: {
                    firstName: ctrl.firstName,
                    lastName: ctrl.lastName,
                    taxCode: ctrl.taxCode,
                    mobileNumber: ctrl.mobileNumber,
                    email: ctrl.email,
                    confirmEmail: ctrl.confirmEmail
                }
            });
        }
        $scope.$watch(() => ctrl.Form.$valid, (valid, oldValid) => {
            if (valid !== oldValid) ctrl.onFormValid({ valid });
        });
    },
    controllerAs: 'UserSignup',
    templateUrl: 'app/booking/components/user-signup/user-signup.component.html',
}
