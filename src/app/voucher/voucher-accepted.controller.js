'use strict';

export default function VoucherAcceptedController (
    $scope, $state, AssetsStore, Services
){
    "ngInject";

    var ctrl = this;
    $scope.ctrl = ctrl;

    //ctrl.booking = CarnetBooking.booking;

    ctrl.voucher = $scope.ngDialogData.voucherCode;
    ctrl.originalPrice = $scope.ngDialogData.originalPrice;
    ctrl.discountPrice = $scope.ngDialogData.discountPrice;
    ctrl.discount = $scope.ngDialogData.originalPrice - $scope.ngDialogData.discountPrice;

}
