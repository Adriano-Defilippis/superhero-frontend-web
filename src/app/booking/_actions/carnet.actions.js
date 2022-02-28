/* globals RestService: true, SERVICES: true, ERRORS: true */
'use strict';

import { ERRORS, CARNET_STEPS } from '../booking.config';
import TYPES from '../_config/types';
//import { CARNET_SERVICES } from '../booking.config';

export default function CarnetActionsFactory (
    ERRORS, RestService, AssetsStore, $state, HerosearchActions, CommonActions, BookingActions, LoginService, Voucher, $q
) {
    "ngInject";

    let stateOrder = [''];

    const canProceedUserDataStep = BookingActions.canProceedUserDataStep;
    const checkUserDataStep = BookingActions.checkUserDataStep;

    // process booking state order
    CARNET_STEPS.forEach(_step => {
        stateOrder.push(_step.state);
    });

    function goNextStep(step) {
        return function(dispatch) {
            $state.go(stateOrder[step]);
        }
    }

    function changeStepFromState (stepName, next) {
        return (dispatch) => {
            let index = 0;
            stateOrder.forEach((_state, _index) => {
                if (_.includes(_state, stepName) || _state === stepName) index = _index;
            });
            if (next === true) index++;
            dispatch(goNextStep(index));
        }
    }

    function resetError() {
        return { type: 'SET_ERROR', error: '' };
    }

    function setError(error) {
        return function(dispatch) {
            if(_.isString(error)) dispatch({ type: 'SET_ERROR', error: error });
        }
    }

    function setStepCompleted (step) {
        return { type: 'SET_STEP_COMPLETED', step }
    }

    function selectedCarnet (carnetId) {
        return { type: 'SET_SELECTED_CARNET', carnetId };
    }

    function setCarnetInfo (carnetInfo) {
        return { type: 'SET_CARNET_INFO', carnetInfo };
    }

    function addNewGuest () {
        return { type: 'ADD_NEW_GUEST' }
    }

    function removeGuest (index) {
        return { type: 'REMOVE_GUEST', index: index }
    }

    function editGuest (index, info) {
        return { type: 'EDIT_GUEST', index: index, guestInfo: info }
    }

    function userSelectedCarnet (carnetInfo) {
        return { type: 'SET_CARNET_INFO', carnetInfo };
    }

    function startBookingAndSelectCarnet (carnetInfo) {
        return (dispatch) => {
            dispatch(goNextStep(1));
            dispatch(CommonActions.setBookingType(TYPES.CARNET));
            dispatch(selectedCarnet(carnetInfo.id));
            dispatch(userSelectedCarnet(carnetInfo));
            dispatch(HerosearchActions.setNewFilters({ idCarnet: carnetInfo.id, service: carnetInfo.competenza }));
            dispatch(HerosearchActions.disabledServiceSelection());
        }
    }

    function startCarnetBookingSelectingHero (carnetInfo, heroInfo) {
        return dispatch => {
            dispatch(CommonActions.setBookingType(TYPES.CARNET));
            dispatch(selectedCarnet(carnetInfo.id));
            dispatch(userSelectedCarnet(carnetInfo));
            console.debug('[CARNET_BOOKING] Setting hero infomartion');

            let info = {
                id: heroInfo.id,
                name: heroInfo.nome,
                photoUrl: heroInfo.photoUrl
            };
            dispatch(setHeroInfo(info));
            dispatch(setStepCompleted('herosearch'));
            dispatch(goNextStep(2));
        }
    }

    function setHeroInfo (heroInfo) {
        return { type: 'SET_SELECTED_HERO', heroInfo };
    }

    function selectHeroForCarnet (heroInfo) {
        return dispatch => {
            let info = {
                id: heroInfo.id,
                name: heroInfo.nome,
                photoUrl: heroInfo.photoUrl
            };
            dispatch(setHeroInfo(info));
            dispatch(goNextStep(1));
        }
    }

    function canProceedCarnetBooking () {
        return function (dispatch, getState) {
            const _state = getState();
            var state = _state.carnet;
            let bookingState = _state.booking;
            var canProceed;
            switch (state.router) {
                case 'booking.herosearch':
                    canProceed = canProceedHeroSelection(state);
                    break;
                case 'booking.bnbHerosearch':
                    canProceed = canProceedHeroSelection(state);
                    break;
                case 'booking.userData':
                    canProceed = canProceedUserDataStep(_state);
                    break;
                case 'booking.appUserData':
                    canProceed = canProceedUserDataStep(_state);
                    break;
            }
            if (canProceed === true) return true;
            else return false;
        }
    }

    function proceedCarnetBooking () {
        // if (_.isString(canProceed)) dispatch(setError(canProceed));
        return function (dispatch, getState) {
            const _state = getState();
            let state = _state.carnet;
            var bookingState = _state.booking;
            dispatch(resetError());
            switch (state.router) {
                case 'booking.herosearch':
                    if (canProceedHeroSelection(state) && checkHeroSelectionStep(state, dispatch)) {
                        console.debug('[PROCEED_BOOKING] Step Hero selection: everything is ok, proceeding next step');
                        dispatch(setStepCompleted('herosearch'));
                        dispatch(changeStepFromState(state.router, true));
                    } else {
                        console.debug('[PROCEED_BOOKING] Hero selection step: hero not selected');
                    }
                    break;
                case 'booking.bnbHerosearch':
                    if (canProceedHeroSelection(state) && checkHeroSelectionStep(state, dispatch)) {
                        console.debug('[PROCEED_BOOKING] Step Hero selection: everything is ok, proceeding next step');
                        dispatch(setStepCompleted('herosearch'));
                        dispatch(changeStepFromState(state.router, true));
                    } else {
                        console.debug('[PROCEED_BOOKING] Hero selection step: hero not selected');
                    }
                    break;
                case 'booking.userData':
                    if (canProceedUserDataStep(_state) && checkUserDataStep(_state, dispatch)) {
                        console.debug('[PROCEED_BOOKING] Steps User Data: everything is ok, completeing order..');
                        dispatch({ type: 'SET_RESULTS', results: [] });
                        dispatch(setStepCompleted('userData'));
                        dispatch(completeOrder());
                    }
                    break;
                case 'booking.appUserData':
                    if (canProceedUserDataStep(_state) && checkUserDataStep(_state, dispatch)) {
                        console.debug('[PROCEED_BOOKING] Steps User Data: everything is ok, completeing order..');
                        dispatch({ type: 'SET_RESULTS', results: [] });
                        dispatch(setStepCompleted('userData'));
                        dispatch(completeOrder());
                    }
                    break;
                default:
                    break;
            }
        }
    }

    function canProceedHeroSelection (state) {
        if (_.isString(state.heroInfo.id) && state.heroInfo.id !== '') return true;
        else return ERRORS.MUST_SELECT_HERO_TO_CONTINUE;
    }

    function checkHeroSelectionStep (state, dispatch) {
        var canProceed = canProceedHeroSelection(state);
        if (canProceed === true){
            return true;
        } else {
            dispatch(setError(canProceed));
            return false;
        }
        return false;
    }

    function parseGoogleAddress (addressString) {
        const deferred = $q.defer();
        RestService.getAddressLatLng(addressString)
        .then(function (data) {
            if(data.data.results.length === 0){
                deferred.reject(ERRORS.ADDRESS_NOT_FOUND);
            }
            if(data.data.results.length > 1){
                deferred.reject(ERRORS.ADDRESS_TOO_GENERIC);
            }
            if(data.data.results.length === 1){
                deferred.resolve(data.data.results[0]);
            }
        });
        return deferred.promise;
    }

    function completeOrder () {
        return (dispatch, getState) => {
            let _state = getState();
            if (_state.booking.userInfo.isLogged === true) {
                dispatch(placeOrderLogged());
            } else {
                let address = _state.booking.steps.address.input.info;
                let addressString = address.route + ' ' + address.street_number + ', ' + address.postal_code + ', ' + address.locality + ' ' + address.administrative_area_level_2;
                parseGoogleAddress(addressString).then(address => {
                    dispatch(BookingActions.setConfirmedBookingAddress(address));
                    dispatch(placeOrderNewUser());
                }, error => {
                    dispatch(setError(error));
                });
            }
        }
    }

    function placeOrderNewUser () {
        return (dispatch, getState) => {
            let _state = getState();
            let _user = BookingActions.createUserFromState(_state.booking);
            RestService.createNewCustomer(_user).then((data) => {
                let _newUser = data.data.plain();
                let addressId, billingAddressId;
                _newUser.indirizzi.forEach(_address => {
                    if (_address.tipo === 'Residenza') addressId = _address.id;
                    if (_address.tipo === 'Fatturazione') billingAddressId = _address.id;
                });
                dispatch(BookingActions.setUserInfo(_newUser, true));
                dispatch(BookingActions.userSelectedAddress(addressId, true));
                dispatch(BookingActions.userSelectedBillingAddress(billingAddressId));
                let __imgUploader = BookingActions.imgFileUploader();
                if (__imgUploader.queue.length > 0) {
                    BookingActions.uploadUserPhoto(__imgUploader, _newUser.id).then(() => {
                        dispatch(placeOrderLogged());
                    });
                } else {
                    dispatch(placeOrderLogged());
                }
            }, error => {
                if(error.status === 400 && error.data.tipo == 'Univocita'){
                    //dispatch(setBookingLoaded());
                    LoginService.showLogin(true);
                }
            });
        }
    }

    function placeOrderLogged (isApp = false, appOrder, appUserId) {
        return (dispatch, getState) => {
            let _state = getState();
            let state = _state.carnet;
            const order = isApp ? appOrder : createOrderFromState(_state);
            const userId = isApp ? appUserId : _state.booking.userInfo.info.id;
            let placed = RestService.createNewCustomerCarnetOrder(userId, order);
            console.info('Placing carnet order:', _.cloneDeep(order));
            placed.then(_data => {
                let _response = _data.data.plain();
                console.info('Server response for order:', _.cloneDeep(_response));

                // if price is zero from server no need to go to adyen
                let priceIsZero = false;
                if (typeof _response.paymentAmount !== 'undefined' && _response.paymentAmount === 0 || _response.paymentAmount === '0') priceIsZero = true;

                // show voucher modal
                if (typeof order.voucherId !== 'undefined' && order.voucherId !== '' && priceIsZero === true) {
                    Voucher.acceptedRedeemCode().then(function(){
                        dispatch(BookingActions.updateFromServerConfirm(_response));
                        dispatch(BookingActions.processPlacedOrderWithoutPayment(_response));
                    });
                } else if (typeof order.voucherId !== 'undefined' && order.voucherId !== '') {
                    Voucher.accepted(state.carnetInfo.priceTotal , _response.paymentAmount/100, order.voucherId).then(() => {
                        dispatch(BookingActions.updateFromServerConfirm(_response));
                        dispatch(BookingActions.processPlacedOrderWithPayment(_response));
                    }, () => {
                        dispatch(BookingActions.updateFromServerConfirm(_response));
                        dispatch(BookingActions.processPlacedOrderWithPayment(_response));
                    });
                } else if (priceIsZero === true) {
                    dispatch(BookingActions.updateFromServerConfirm(_response));
                    dispatch(BookingActions.processPlacedOrderWithoutPayment(_response));
                } else {
                    dispatch(BookingActions.updateFromServerConfirm(_response));
                    dispatch(BookingActions.processPlacedOrderWithPayment(_response));
                }
            }, _data => {
                let _error = _data.data;
                dispatch(BookingActions.processErrorOrder(_error));
            }).finally(() => {
                //dispatch(setBookingLoaded());
            });
        }
    }

    function createOrderFromState (_state) {
        var newOrder = {
            idSuperHero: _state.carnet.heroInfo.id,
            idTipoCarnet: _state.carnet.carnetInfo.id,
            indirizzoFatturazione: { id: _state.booking.steps.userData.selectedBillingAddress }
        }

        // apply voucher code if user has input one
        newOrder.voucherId = _state.booking.general.voucher !== '' ? _state.booking.general.voucher : '';

        return newOrder;
    }

    return {
        addNewGuest,
        removeGuest,
        selectedCarnet,
        placeOrderLogged,
        editGuest,
        setHeroInfo,
        setCarnetInfo,
        startBookingAndSelectCarnet,
        startCarnetBookingSelectingHero,
        selectHeroForCarnet,
        canProceedCarnetBooking,
        proceedCarnetBooking
    }
}
