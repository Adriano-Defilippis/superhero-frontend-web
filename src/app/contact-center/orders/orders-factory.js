/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function OrdersUtilitiesFactory (

    $log,
    RestService,
    NotifyService

){
    "ngInject";

    // check order state
    function isState (order, state)
    {
        return order.stato == state;
    }

    // check order type
    function isType (order, type)
    {
        return order.tipo == type;
    }

    function countByState (orders, state)
    {
        var counter = 0;

        orders.forEach(function (order) {
            if (isState(order, state)) counter++;
        });

        return counter;
    }

    function countByStateType (orders, state, type)
    {
        var counter = 0;

        orders.forEach(function (order) {
            var isGivenState, isGivenType;
            isGivenState = isState(order, state);

            if (type == 'Ordini') isGivenType = (isType(order, 'Carnet') || isType(order, 'CarnetAppuntamentiMisto') || isType(order, 'Appuntamenti') || isType(order, 'AppuntamentiNominale') || isType(order, 'NominaleMultiplo') || isType(order, 'AppuntamentiCarnet') || isType(order, 'ModificaAppuntamento') || isType(order, 'ModificaAppuntamentoCarnet') || isType(order, 'ModificaAppuntamentoNominale') || isType(order, 'ModificaAmministrativaAppuntamento') || isType(order, 'ModificaAmministrativaAppuntamentoNominale') || isType(order, 'ModificaAmministrativaAppuntamentoCarnet'));
            if (type == 'Pagamenti') isGivenType = (isType(order, 'Carnet') || isType(order, 'CarnetAppuntamentiMisto') || isType(order, 'Appuntamenti') || isType(order, 'AppuntamentiNominale') || isType(order, 'NominaleMultiplo') || isType(order, 'ModificaAppuntamento') || isType(order, 'ModificaAppuntamentoCarnet') || isType(order, 'ModificaAppuntamentoNominale'));
            if (type == 'ModificheAmministrative') isGivenType = (isType(order, 'ModificaAmministrativaAppuntamento') || isType(order, 'ModificaAmministrativaAppuntamentoNominale') || isType(order, 'ModificaAmministrativaAppuntamentoCarnet'));
            if (type == 'Carnet') isGivenType = isType(order, 'Carnet');

            if (isGivenState && isGivenType) counter++;
        });

        return counter;
    }

    function getTypeLabel (type)
    {
        switch (type) {
            case 'Appuntamenti': return 'App. standard'; break;
            case 'AppuntamentiNominale': return 'App. nominale'; break;
            case 'AppuntamentiCarnet': return 'App. su base Carnet'; break;
            case 'NominaleMultiplo': return 'App. nominale multiplo'; break;
            case 'Carnet': return 'Acquisto Carnet'; break;
            case 'CarnetAppuntamentiMisto': return 'Acquisto contestuale Carnet/App.'; break;
            case 'ModificaAppuntamento': return 'App. standard (mod. Utente)'; break;
            case 'ModificaAppuntamentoCarnet': return 'App. su base Carnet (mod. Utente)'; break;
            case 'ModificaAppuntamentoNominale': return 'App. nominale (mod. Utente)'; break;
            case 'ModificaAmministrativaAppuntamento': return 'App. standard (mod. Amm.)'; break;
            case 'ModificaAmministrativaAppuntamentoNominale': return 'App. nominale (mod. Amm.)'; break;
            case 'ModificaAmministrativaAppuntamentoCarnet': return 'App. su base Carnet (mod. Amm.)'; break;
            default: return ''; break;
        }
    }

    return {
        isState: isState,
        isType: isType,
        countByState: countByState,
        countByStateType: countByStateType,
        getTypeLabel: getTypeLabel
    }

}
