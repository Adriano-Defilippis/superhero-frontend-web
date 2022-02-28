'use strict';

import ORDERS from '../_config/orders';

export default function BookingStepConfirmController (
    $scope, BookingModel, AssetsStore, SERVICES, CONFIRM, expirationDate
){
    "ngInject";

    var ctrl = this;

    ctrl.CONFIRM = CONFIRM;
    ctrl.ORDERS = ORDERS;
    ctrl.getIconUrl = function (icon) {
        return AssetsStore.Icon(icon);
    }

    ctrl.parseCarnetString = (string, carnetInfo) => {
        let carnetType = carnetInfo.prestazione + ' ' + carnetInfo.type;
        return _.replace(string, '{carnetType}', carnetType);
    }

    ctrl.parseStardardOrderString = (string) => {
        if (expirationDate.status) {
            return _.replace(string, '{expirationDate}', moment(expirationDate.data).format('LLL'));
        }
        return ''; 
    }

}
