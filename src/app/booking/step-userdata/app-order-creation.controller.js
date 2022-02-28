'use strict';

export default function AppOrderCreationController (
    $rootScope, BookingActions, CarnetActions, BookingModel, $ngRedux, $stateParams, Restangular, Services, AssetsStore, carnetTypes, Carnet
){
    "ngInject";

    var ctrl = this;

    if ($stateParams.ordine && $stateParams.app && $stateParams.userId && $stateParams.token) {
        const isApp = $stateParams.app.toLowerCase() === 'true';
        const isCarnetOrder = $stateParams.isCarnetOrder && $stateParams.isCarnetOrder.toLowerCase() === 'true';

        if ($stateParams.carnetInfo) {
            const carnetInfo = JSON.parse($stateParams.carnetInfo);
            const carnetType = _.find(carnetTypes.data, { id: carnetInfo.tipo });
            carnetInfo.icon = carnetType ? AssetsStore.Icon('badge.carnet'+ Carnet.getCarnetIcon(carnetType.tipo)) : '';
            if (isCarnetOrder) {
                $ngRedux.dispatch(BookingActions.setCarnetInfo(carnetInfo));
            }
        }

        const order = JSON.parse($stateParams.ordine);
        if (order.appuntamenti && order.appuntamenti.length) {
            let serviceId = order.appuntamenti[0].tipoServizio.id;
            if (isCarnetOrder) {
                serviceId = BookingActions.getCarnetParentService(serviceId);
            }
            $ngRedux.dispatch(BookingActions.setOrderType(order.type));
            if (Services.isSubService(serviceId)) {
                const parentId = _.findKey(BookingModel.subServices, service => _.findIndex(service, subService => subService.id === serviceId) > -1);
                $ngRedux.dispatch(BookingActions.selectService(parentId));
                $ngRedux.dispatch(BookingActions.selectSubService(parentId, serviceId));
            }
            else {
                $ngRedux.dispatch(BookingActions.selectService(serviceId));
            }
            $ngRedux.dispatch(BookingActions.placeOrderLogged(isApp, order, $stateParams.userId));
        } else {
            if (order.idTipoCarnet) {
                $ngRedux.dispatch(CarnetActions.placeOrderLogged(isApp, order, $stateParams.userId));
            }
        }
        
    }
    

}
