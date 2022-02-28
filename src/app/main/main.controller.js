'use strict';

export class MainController {
    constructor ($scope, accountInfo, UserInfo, servicesList, carnetTypes, Services, Carnet) {
        'ngInject';
        Services.loadData(servicesList);
        Carnet.loadData(carnetTypes);
        if(!_.isEmpty(accountInfo)){
          // USER IS LOGGED IN!
          UserInfo.setInfo(accountInfo.data.plain());
        }

    }
}
