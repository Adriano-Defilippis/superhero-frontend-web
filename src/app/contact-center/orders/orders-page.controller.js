'use strict';

export default function CcOrdersPageController (

    $scope,
    $stateParams,
    $state,
    orders,
    OrdersUtilities

) {
    "ngInject";

    var ctrl = this,
        activeState,
        activeType;

    // check for state param
    activeState = $stateParams.stato;
    activeType = $stateParams.tipo;
    if (!$stateParams.stato) activeState = 'Chiuso';
    if (!$stateParams.tipo) activeType = 'Ordini';

    // Decorate the model of orders
    ctrl.filterTable = filterTable;
    ctrl.getOrderType = getOrderType;
    ctrl.orders = orders.data.plain();
    cleanData(ctrl.orders);

    // tab buttons data
    ctrl.buttonsActive = [
        {
            isActive: activeState == 'Chiuso' && activeType == 'Ordini',
            state: 'main.support.orders',
            params: { stato: 'Chiuso', tipo: 'Ordini' },
            label: 'Ordini',
            counter: OrdersUtilities.countByStateType(ctrl.orders, 'Chiuso', 'Ordini')
        },
        {
            isActive: activeState == 'Chiuso' && activeType == 'ModificheAmministrative',
            state: 'main.support.orders',
            params: { stato: 'Chiuso', tipo: 'ModificheAmministrative' },
            label: 'Az. Amministrative',
            counter: OrdersUtilities.countByStateType(ctrl.orders, 'Chiuso', 'ModificheAmministrative')
        },
        {
            isActive: activeState == 'Chiuso' && activeType == 'Carnet',
            state: 'main.support.orders',
            params: { stato: 'Chiuso', tipo: 'Carnet' },
            label: 'Carnet',
            counter: OrdersUtilities.countByStateType(ctrl.orders, 'Chiuso', 'Carnet')
        }
    ];

    ctrl.buttonsInactive = [
        {
            isActive: activeState == 'Immesso',
            state: 'main.support.orders',
            params: { stato: 'Immesso' },
            label: 'Immessi',
            counter: OrdersUtilities.countByState(ctrl.orders, 'Immesso')
        },
        {
            isActive: activeState == 'NonAutorizzato',
            state: 'main.support.orders',
            params: { stato: 'NonAutorizzato' },
            label: 'Non Autorizzati',
            counter: OrdersUtilities.countByState(ctrl.orders, 'NonAutorizzato')
        }
    ];

    /*
    *       Functions
    */

    function filterTable (order)
    {
        if (activeState != 'Chiuso') {
            return OrdersUtilities.isState(order, activeState);
        } else {
            var isState, isType;
            isState = OrdersUtilities.isState(order, 'Chiuso');
            if (activeType == 'Ordini') isType = (OrdersUtilities.isType(order, 'Carnet') || OrdersUtilities.isType(order, 'CarnetAppuntamentiMisto') || OrdersUtilities.isType(order, 'Appuntamenti') || OrdersUtilities.isType(order, 'AppuntamentiNominale') || OrdersUtilities.isType(order, 'NominaleMultiplo') || OrdersUtilities.isType(order, 'AppuntamentiCarnet') || OrdersUtilities.isType(order, 'ModificaAppuntamento') || OrdersUtilities.isType(order, 'ModificaAppuntamentoCarnet') || OrdersUtilities.isType(order, 'ModificaAppuntamentoNominale') || OrdersUtilities.isType(order, 'ModificaAmministrativaAppuntamento') || OrdersUtilities.isType(order, 'ModificaAmministrativaAppuntamentoNominale') || OrdersUtilities.isType(order, 'ModificaAmministrativaAppuntamentoCarnet'));
            if (activeType == 'ModificheAmministrative') isType = (OrdersUtilities.isType(order, 'ModificaAmministrativaAppuntamento') || OrdersUtilities.isType(order, 'ModificaAmministrativaAppuntamentoNominale') || OrdersUtilities.isType(order, 'ModificaAmministrativaAppuntamentoCarnet'));
            if (activeType == 'Carnet') isType = OrdersUtilities.isType(order, 'Carnet');
            return isState && isType;
        }
    }

    function getOrderType (order)
    {
        return OrdersUtilities.getTypeLabel(order.tipo);
    }

    function cleanData (orders)
    {
        orders.forEach( function (a) {
            a.dataCreazioneFormatted = moment(a.dataCreazione).format('DD/MM/YYYY[<br>]HH:mm');
            //a.dettagli = ''+moment(a.dataInizio).format('DD/MM/YY | HH:mm')+' -> '+moment(a.dataFine).format('HH:mm');
        });
    }

}
