"use strict";

import { SERVICES } from '../booking.config';
import ORDERS from '../_config/orders';

var initialState = Immutable({
    completed: {
        address: false,
        dates: false,
        service: false,
        userData: false
    },
    authorisation: null,
    paymentMethod: null,
    type: ORDERS.STANDARD_FAST,
    router: '',
    error: null,
    isProcessing: false,
    showInputError: false,
    userInfo: {
        isLogged: false,
        info: {}
    },
    carnet: {
        isCarnetOrder: false,
        info: {}
    },
    heroSelection: {
        isHeroSelectionOrder: false,
        heroId: ''
    },
    orderInfo: {
        finalPrice: -1,
        confirmed: false,
        id: '',
    },
    general: {
        privacyContract: false,
        newsletter: false,
        genericWithPreference: true,
        voucher: '',
        voucherEnabled: true,
        recall: false,
    },
    edit: {
        isEditing: false,
        id: '',
        info: {}
    },
    steps: {
        service: {
            selectedService: '',
            disabledServices: [],
            disabledAdditionalServices: [],
            isMultipleSuperheroes: false,
            colf: {
                squareMeters: 15,
                estimatedTime: 120,
                selectedAdditionalServices: [],
                notes: ''
            },
            badante: {
                assistedInfo: { nome: '', cognome: '', eta: '', sesso: '' },
                selectedAdditionalServices: [],
                notes: ''
            },
            babySitter: {
                selectedAdditionalServices: [],
                notes: '',
                childrenInfo: [
                    { nome: '', cognome: '', sesso: '', eta: '' }
                ]
            },
            personalTrainer: {
                subService: '',
                notes: '',
                guestsInfo: []
            },
            fisioterapista: {
                subService: '',
                notes: '',
            },
            tuttofare: {
                subService: '',
                selectedAdditionalServices: [],
                selectedAdditionalTools: [],
                notes: '',
            },
            idraulico: {
                selectedAdditionalServices: [],
                selectedAdditionalTools: [],
                notes: '',
            },
            elettricista: {
                selectedAdditionalServices: [],
                selectedAdditionalTools: [],
                notes: '',
            },
            stiratura: {
                notes: '',
            },
            checkincheckout: {
                notes: '',
            },
        },
        address: {
            userAddresses: [],
            selectedUserAddress: '',
            showAddressInput: false,
            showFullAddressInput: false,
            isNewAddress: true,
            confirmed: false,
            input: {
                info: {
                    administrative_area_level_2: '',
                    citofono: '',
                    locality: '',
                    piano: '',
                    postal_code: '',
                    route: '',
                    scala: '',
                    street_number: '',
                    type: ''
                },
            }
        },
        dates: {
            pickingMode: 1,
            startPicker: {
                date: null,
                time: null,
            },
            endPicker: {
                date: null,
                time: null
            },
            askedForSuggestions: false,
            askedForHeroesSuggestions: false,
            pickedDates: [],
            suggestions: [],
            heroesSuggested: [],
            confirmedDates: []
        },
        heroSearch: {
            selected: {
                id: '',
                name: '',
                photoUrl: ''
            },
        },
        userData: {
            billingAddresses: [],
            selectedBillingAddress: '',
            additionalNotes: '',
            newUserInfo: {
                firstName: '',
                lastName: '',
                taxCode: '',
                mobileNumber: '',
                email: '',
                confirmEmail: '',
                id: '',
                valid: false
            },
            isBillingAddressSame: true,
            showFullAddressInput: false,
            newBillingAddress: {
                locality: '',
                administrative_area_level_2: '',
                route: '',
                street_number: '',
                postal_code: '',
                valid: false
            },
            newBillingInfo: {
                nome: '',
                cognome: '',
                codiceFiscale: '',
            }
        },
        carnet: {
            userChooseCarnet: false,
            info: {
                id: '',
                price: 0,
                priceHour: 0,
                hours: 0,
                title: ''
            }
        }
    }
});

// reducer function
function booking (state = initialState, action) {
    var serviceToUpdate;

    switch (action.type) {

        case 'SET_BOOKING_LOADING':
            return state.set('isProcessing', true);

        case 'SET_BOOKING_LOADED':
            return state.set('isProcessing', false);

        case 'SET_ORDER_TYPE':
            return state.setIn(['type'], action.orderType);

        case 'CHANGE_ROUTER_STATE':
            return state.set('router', action.name);

        case 'ADD_USER_ADDRESS':
            return state.setIn(
                ['steps','address','userAddresses'],
                state.steps.address.userAddresses.concat([action.userAddress])
            );

        // set user data
        case 'SET_USER_INFO':
            if (state.userInfo.isLogged === false) {
                return state.setIn(
                    ['userInfo', 'isLogged'], true
                ).setIn(
                    ['userInfo', 'info'], action.info
                ).setIn(
                    ['steps','address','userAddresses'], action.userAddresses
                ).setIn(
                    ['steps','userData','billingAddresses'], action.billingAddresses
                ).setIn(
                    ['general', 'newsletter'],
                    action.newsletter
                );
            }
            return state;

        // set state
        case 'SET_BOOKING_STATE':
            return state.merge(action.state.booking, {deep: true});

        case 'RESET_STATE':
            return initialState;

        // Generic booking reducers
        case 'SET_STEP_COMPLETED':
            return state.setIn(['completed', action.step], true);

        case 'RESET_STEP':
            return state.setIn(['completed', action.step], false);

        case 'SET_ERROR':
            return state.set('error', action.error);

        case 'RESET_ERROR':
            return state.set('error', null);

        // steps
            // service selection
        case 'ADD_DISABLED_SERVICE':
            if (!_.includes(state.steps.service.disabledServices), action.serviceId) {
                return state.setIn(
                    ['steps', 'service', 'disabledServices'],
                    state.steps.service.disabledServices.concat([action.serviceId])
                );
            }
            return state;

        case 'ADD_DISABLED_ADDITIONAL_SERVICE':
            if (!_.includes(state.steps.service.disabledAdditionalServices), action.additionalServiceId) {
                return state.setIn(
                    ['steps', 'service', 'disabledAdditionalServices'],
                    state.steps.service.disabledAdditionalServices.concat([action.additionalServiceId])
                );
            }
            return state;

        case 'REMOVE_DISABLED_SERVICE':
            if (_.includes(state.steps.service.disabledServices), action.serviceId) {
                return state.setIn(
                    ['steps', 'service', 'disabledServices'],
                    state.steps.service.disabledServices.filter(function(disabled){
                        return disabled !== action.serviceId;
                    })
                );
            }
            return state;

        case 'SELECT_SERVICE':
            if (!_.includes(state.steps.service.disabledServices, action.serviceId) && state.steps.service.selectedService !== action.serviceId) {
                return state.setIn(['steps', 'service', 'selectedService'], action.serviceId);
            }
            return state;

        case 'SELECT_SUBSERVICE':
            let serviceToUpdate = serviceToUpdate = getServiceSlug(action.serviceId);
            if (typeof state.steps.service[serviceToUpdate].subService !== 'undefined') {
                return state.setIn(
                    ['steps', 'service', serviceToUpdate, 'subService'],
                    action.subServiceId
                );
            }
            return state;

        case 'TOGGLE_ADDITIONAL_SERVICE':
            serviceToUpdate = getServiceSlug(action.serviceId);
            if (!_.isArray(action.additionalServiceId)) action.additionalServiceId = [action.additionalServiceId];

            if (serviceToUpdate !== null) {
                let _services = state.steps.service[serviceToUpdate].selectedAdditionalServices.asMutable({deep: true});
                action.additionalServiceId.forEach(_additional => {
                    if (!_.includes(_services, _additional)) {
                        console.log('Including new additional service');
                        _services = _services.concat([_additional]);
                    } else {
                        console.log('Removing additional service');
                        _services = _services.filter(function(additional){
                            return additional !== _additional;
                        });
                    }
                });
                return state.setIn(
                    ['steps', 'service', serviceToUpdate, 'selectedAdditionalServices'],
                    Immutable(_services)
                );
            }
            return state;

        case 'RESET_ADDITIONAL_SERVICES':
            serviceToUpdate = getServiceSlug(action.serviceId);

            if (serviceToUpdate !== null) {
                return state.setIn(['steps', 'service', serviceToUpdate, 'selectedAdditionalServices'], []);
            }
            return state;

        case 'TOGGLE_ADDITIONAL_TOOL':
            serviceToUpdate = getServiceSlug(action.serviceId);
            if (!_.isArray(action.additionalToolId)) action.additionalToolId = [action.additionalToolId];
            let toolsToSet = action.additionalToolId;

            if (serviceToUpdate !== null) {
                let _tools = state.steps.service[serviceToUpdate].selectedAdditionalTools.asMutable({deep: true});
                toolsToSet.forEach(_tool => {
                    if (!_.includes(_tools, _tool)) {
                        _tools = _tools.concat([_tool]);
                    }
                    else {
                        _tools = _tools.filter(function(additionalTool){
                            return additionalTool !== _tool;
                        });
                    }
                });

                return state.setIn(
                    ['steps', 'service', serviceToUpdate, 'selectedAdditionalTools'],
                    Immutable(_tools)
                );
            }
            return state;

        case 'SET_SERVICE_NOTES':
            serviceToUpdate = getServiceSlug(action.serviceId);

            if(action.serviceId !== null) {
                var notes = (typeof action.notes !== 'undefined' && action.notes !== null) ? action.notes : '';
                return state.setIn(['steps', 'service', serviceToUpdate, 'notes'], notes);
            }
            return state;

        case 'SET_ESTIMATED_TIME':
            return state.setIn(
                ['steps', 'service', action.serviceName, 'estimatedTime'],
                action.time
            );

        // steps
            // service selection
                // colf
        case 'COLF_SET_SQUARE_METERS':
            return state.setIn(['steps', 'service', 'colf', 'squareMeters'], parseInt(action.squareMeters) || 0);

        case 'COLF_SET_ESTIMATED_TIME':
            return state.setIn(
                ['steps', 'service', 'colf', 'estimatedTime'],
                action.time
            );

        // steps
            // service selection
                // bandate
        case 'BADANTE_SET_ASSISTED_INFO':
            return state.setIn(
                ['steps','service','badante','assistedInfo'],
                action.assistedInfo
            );

        // steps
            // service selection
                // baby-sitter
        case 'BABYSITTER_ADD_NEW_CHILD':
            if (state.steps.service.babySitter.childrenInfo.length < 4) {
                return state.setIn(
                    ['steps','service','babySitter','childrenInfo'],
                    state.steps.service.babySitter.childrenInfo.concat([{ nome: '', cognome: '', eta: '', sesso: ''}])
                );
            }
            return state;

        case 'BABYSITTER_REMOVE_CHILD':
            if (typeof state.steps.service.babySitter.childrenInfo[action.index] === 'object') {
                console.log(state.steps.service.babySitter.childrenInfo);
                return state.setIn(
                    ['steps','service','babySitter','childrenInfo'],
                    state.steps.service.babySitter.childrenInfo.filter(function(child, index){
                        return action.index !== index;
                    })
                );
            }
            return state;

        case 'BABYSITTER_EDIT_CHILD':
            if (typeof state.steps.service.babySitter.childrenInfo[action.index] === 'object') {
                return state.setIn(
                    ['steps','service','babySitter','childrenInfo', action.index],
                    state.steps.service.babySitter.childrenInfo[action.index].merge(action.childInfo)
                );
            }
            return state;

            // steps
                // service selection
                    // baby-sitter
            case 'PERSONALTRAINER_ADD_NEW_GUEST':
                if (state.steps.service.personalTrainer.guestsInfo.length < 5) {
                    return state.setIn(
                        ['steps','service','personalTrainer','guestsInfo'],
                        state.steps.service.personalTrainer.guestsInfo.concat([{ nome: '', cognome: '', eta: ''}])
                    );
                }
                return state;

            case 'PERSONALTRAINER_REMOVE_GUEST':
                if (typeof state.steps.service.personalTrainer.guestsInfo[action.index] === 'object') {
                    console.log(state.steps.service.personalTrainer.guestsInfo);
                    return state.setIn(
                        ['steps','service','personalTrainer','guestsInfo'],
                        state.steps.service.personalTrainer.guestsInfo.filter(function(guest, index){
                            return action.index !== index;
                        })
                    );
                }
                return state;

            case 'PERSONALTRAINER_EDIT_GUEST':
                if (typeof state.steps.service.personalTrainer.guestsInfo[action.index] === 'object') {
                    return state.setIn(
                        ['steps','service','personalTrainer','guestsInfo', action.index],
                        state.steps.service.personalTrainer.guestsInfo[action.index].merge(action.guestInfo)
                    );
                }
                return state;

        // steps
            // address input
        case 'SET_BOOKING_ADDRESS':
            if (action.addressInfo !== null && typeof action.addressInfo === 'object') {
                return state.setIn(
                    ['steps','address'],
                    state.steps.address.merge({
                        showAddressInput: true,
                        showFullAddressInput: true,
                        input: {
                            info: action.addressInfo,
                        }
                    },{deep:true})
                );
            }
            return state;

        case 'SET_BOOKING_ADDRESS_TYPE':
            return state.setIn(
                ['steps','address','input','info','type'],
                action.addressType
            );

        case 'SET_ADD_NEW_ADDRESS':
            return state.setIn(
                ['steps','address'],
                state.steps.address.merge({
                    selectedUserAddress: '',
                    showAddressInput: true,
                    showFullAddressInput: false,
                    isNewAddress: true,
                    confirmed: false,
                }, { deep:true })
            );

        case 'SELECT_ADDRESS':
            if (action.addressId === '') {
                return state.setIn(
                    ['steps', 'address', 'selectedUserAddress'],
                    ''
                );
            } else if (state.steps.address.selectedUserAddress !== action.addressId) {
                return state.setIn(
                    ['steps', 'address'],
                    state.steps.address.merge({
                        isNewAddress: false,
                        showAddressInput: false,
                        showFullAddressInput: false,
                        confirmed: true,
                        selectedUserAddress: action.addressId
                    }, { deep:true })
                );
            }
            return state;

        case 'SET_BOOKING_ADDRESS_CONFIRMED':
            return state.setIn(['steps','address','confirmed'], true);

        case 'SET_DATE_PICKERS':
            return state.setIn(
                ['steps','dates'],
                state.steps.dates.merge({
                    startPicker: {
                        time: action.pickers.startTime,
                        date: action.pickers.startDate
                    },
                    endPicker: {
                        time: action.pickers.endTime,
                        date: action.pickers.endDate
                    }
                },{deep:true})
            );

        case 'SET_TIME_PICKER_MODE':
            return state.setIn(
                ['steps','dates','pickingMode'],
                action.mode
            );

        case 'ADD_SELECTED_DATE':
            return state.setIn(
                ['steps','dates','pickedDates'],
                state.steps.dates.pickedDates.concat(_.isArray(action.selectedDate) ? action.selectedDate : [action.selectedDate])
            );

        case 'REMOVE_SELECTED_DATE':
            return state.setIn(
                ['steps','dates','pickedDates'],
                state.steps.dates.pickedDates.filter(function(picked){
                    return picked.id !== action.selectedDateId;
                })
            );

        case 'REMOVE_CONFIRMED_DATE':
            return state.setIn(
                ['steps','dates','confirmedDates'],
                state.steps.dates.confirmedDates.filter(function(confirmed){
                    return confirmed.id !== action.confirmedDateId;
                })
            );

        case 'EDIT_SELECTED_DATE':
        case 'SET_DATE_LOADING':
        case 'SET_DATE_LOADED':
            var editingIndex = null;
            _.forEach(state.steps.dates.pickedDates, function(date, index) {
                if (date.id === action.dateId) editingIndex = index;
            });
            if (editingIndex !== null) {
                return state.setIn(
                    ['steps','dates','pickedDates',editingIndex],
                    state.steps.dates.pickedDates[editingIndex].merge(action.newInfo, {deep:true})
                );
            }
            return state;

        case 'ADD_SUGGESTION':
            let suggToAdd = [];
            if (!_.isArray(action.suggestion)) action.suggestion = [action.auggestion];
            action.suggestion.forEach(function(_suggestion){
                if (!_.includes(state.steps.dates.suggestions, _suggestion)) suggToAdd.push(_suggestion);
            });
            if (suggToAdd.length > 0) {
                return state.setIn(
                    ['steps','dates','suggestions'],
                    state.steps.dates.suggestions.concat(suggToAdd)
                );
            }
            return state;

        case 'REMOVE_SUGGESTION_FOR_DATE':
            if (_.some(state.steps.dates.suggestions, { id: action.dateId })) {
                return state.setIn(
                    ['steps','dates','suggestions'],
                    state.steps.dates.suggestions.filter(function(_suggestion){
                        return _suggestion.id !== action.dateId;
                    })
                );
            }
            return state;

        case 'ADD_HERO_SUGGESTED':
            let heroesToAdd = [];
            if (!_.isArray(action.heroes)) action.heroes = [action.heroes];
            action.heroes.forEach( _hero => {
                if (!_.some(state.steps.dates.heroesSuggested, { id: _hero.id, appointment: _hero.appointment })) heroesToAdd.push(_hero);
            });
            if (heroesToAdd.length > 0) {
                return state.setIn(
                    ['steps', 'dates', 'heroesSuggested'],
                    state.steps.dates.heroesSuggested.concat(heroesToAdd)
                );
            }
            return state;

        case 'REMOVE_HEROES_SUGGESTED_FOR_DATE':
            if (_.some(state.steps.dates.heroesSuggested, { appointment: action.dateId })) {
                return state.setIn(
                    ['steps','dates','heroesSuggested'],
                    state.steps.dates.heroesSuggested.filter( _hero => {
                        return _hero.appointment !== action.dateId;
                    })
                );
            }
            return state;

        case 'SET_SUGGESTIONS_REQUESTED':
            return state.setIn(
                ['steps','dates','askedForSuggestions'],
                true
            );

        case 'SET_HERO_SUGGESTIONS_REQUESTED':
            return state.setIn(
                ['steps','dates','askedForHeroesSuggestions'],
                true
            );

        case 'SET_SUGGESTIONS_HANDLED_FOR_DATE':
            if (_.some(state.steps.dates.suggestions, { id: action.dateId })) {
                return state.setIn(
                    ['steps','dates','suggestions'],
                    state.steps.dates.suggestions.map(function(_suggestion){
                        if (_suggestion.id === action.dateId) return _suggestion.merge({ handled: true });
                        return _suggestion;
                    })
                );
            }
            return state;

        case 'SET_SUGGESTIONS_UNHANDLED_FOR_DATE':
            if (_.some(state.steps.dates.suggestions, { id: action.dateId })) {
                return state.setIn(
                    ['steps','dates','suggestions'],
                    state.steps.dates.suggestions.map(function(_suggestion){
                        if (_suggestion.id === action.dateId) return _suggestion.merge({ handled: false });
                        return _suggestion;
                    })
                );
            }
            return state;

        case 'ADD_CONFIRMED_DATE':
            if (!_.some(state.steps.dates.confirmedDates, { id: action.date.id })) {
                return state.setIn(
                    ['steps','dates','confirmedDates'],
                    state.steps.dates.confirmedDates.concat([action.date])
                );
            }
            return state;

        case 'RESET_ALL_DATES':
            return state.setIn(
                ['steps', 'dates'],
                initialState.steps.dates
            );

        case 'SELECT_BILLING_ADDRESS':
            if (_.some(state.steps.userData.billingAddresses, { id: action.addressId }) && state.steps.userData.selectedBillingAddress !== action.addressId) {
                return state.setIn(
                    ['steps', 'userData', 'selectedBillingAddress'],
                    action.addressId
                );
            }
            return state;

        case 'ADD_BILLING_ADDRESSES':
            let addressesToAdd = [];
            if (!_.isArray(action.addresses)) action.addresses = [action.addresses];
            action.addresses.forEach( (_address) => {
                if (!_.some(state.steps.userData.billingAddresses, { id: _address.id })) addressesToAdd.push(_address);
            });
            if (addressesToAdd.length > 0) {
                return state.setIn(
                    ['steps', 'userData', 'billingAddresses'],
                    state.steps.userData.billingAddresses.concat(addressesToAdd)
                );
            }
            return state;

        case 'TOGGLE_BILLING_ADDRESS_IS_SAME':
            return state.setIn(
                ['steps', 'userData', 'isBillingAddressSame'],
                !state.steps.userData.isBillingAddressSame
            );

        case 'SET_BOOKING_NOTES':
            return state.setIn(
                ['steps', 'userData', 'additionalNotes'],
                action.notes
            );

        case 'SET_NEW_USER_INFO':
            return state.setIn(
                ['steps', 'userData', 'newUserInfo'],
                state.steps.userData.newUserInfo.merge( action.info )
            );

        case 'SET_NEW_USER_INFO_VALID':
            return state.setIn(
                ['steps', 'userData', 'newUserInfo', 'valid'],
                action.valid
            );

        case 'SET_SELECTED_HERO':
            if (_.isObject(action.heroInfo)) {
                return state.setIn(
                    ['steps', 'heroSearch', 'selected'],
                    state.steps.heroSearch.selected.merge(action.heroInfo, { deep: true })
                ).setIn(
                    ['heroSelection'],
                    state.heroSelection.merge({
                        heroId: action.heroInfo.id,
                        isHeroSelectionOrder: true
                    })
                );
            }
            return state;

        case 'SET_MULTIPLE_SUPERHEROES': 
            return state.setIn(['steps', 'service', 'isMultipleSuperheroes'], action.payload);

        case 'SET_SELECTED_HERO_FILTERS':
            return state.setIn(
                ['steps', 'service', 'disabledServices'],
                action.disabledServices
            ).setIn(
                ['steps', 'service', 'disabledAdditionalServices'],
                action.disabledAdditionalServices
            );

        case 'SERVER_CONFIRMED_ORDER':
            return state.set('orderInfo', state.orderInfo.merge({
                id: action.orderId,
                finalPrice: action.finalPrice,
                confirmed: true
            },{ deep: true }));

        case 'TOGGLE_PRIVACY_CONTRACT':
            return state.setIn(
                ['general','privacyContract'],
                !state.general.privacyContract
            );

        case 'TOGGLE_NEWSLETTER':
            return state.setIn(
                ['general','newsletter'],
                !state.general.newsletter
            );

        case 'TOGGLE_GENERIC_WITH_PREFERENCE':
            return state.setIn(
                ['general','genericWithPreference'],
                !state.general.genericWithPreference
            );

        case 'CHANGE_VOUCHER':
            if (state.general.voucherEnabled === true) {
                return state.setIn(
                    ['general','voucher'],
                    action.voucher
                );
            }
            return state;

        case 'SET_ORDER_AUTHORISATION':
            return state.set('authorisation', action.authorisation);
        case 'SET_ORDER_PAYMENT_METHOD':
            return state.set('paymentMethod', action.paymentMethod);

        case 'SET_EDITING_APPOINTMENT':
            return state.set('edit',
                state.edit.merge({
                    isEditing: true,
                    id: action.id,
                    info: action.info
                })
            ).setIn(
                ['general', 'voucherEnabled'],
                false
            );

        case 'SET_CARNET_INFO':
            return state.setIn(['carnet'], state.carnet.merge({
                isCarnetOrder: true,
                info: action.info
            }));

        case 'SET_CHOSEN_CARNET':
            return state.setIn(
                ['steps', 'carnet', 'userChooseCarnet'],
                true
            ).setIn(
                ['steps', 'carnet', 'info'],
                state.steps.carnet.info.merge(action.info)
            );

        case 'TOGGLE_SAME_BILLING_ADDRESS':
            return state.setIn(
                ['steps','userData','isBillingAddressSame'],
                !state.steps.userData.isBillingAddressSame
            );

        case 'SET_BILLING_ADDRESS_INFO':
            return state.setIn(
                ['steps','userData','newBillingAddress'],
                state.steps.userData.newBillingAddress.merge( action.info )
            ).setIn(
                ['steps','userData','isBillingAddressSame'],
                false
            ).setIn(
                ['steps','userData','showFullAddressInput'],
                true
            );

        case 'SET_BILLING_USER_INFO':
            return state.setIn(
                ['steps','userData','newBillingInfo'], action.info
            );

        case 'SET_NEW_BILLING_ADDRESS_VALID':
            return state.setIn(
                ['steps','userData','newBillingAddress', 'valid'],
                action.valid
            );

        default:
            return state;
    }
}

function getServiceSlug (serviceId) {
    let serviceSlug = null;
    if (serviceId === SERVICES.COLF || serviceId === SERVICES.COLF_BNB) serviceSlug = 'colf';
    else if (serviceId === SERVICES.BADANTE) serviceSlug = 'badante';
    else if (serviceId === SERVICES.BABYSITTER) serviceSlug = 'babySitter';
    else if (serviceId === SERVICES.PERSONALTRAINER) serviceSlug = 'personalTrainer';
    else if (serviceId === SERVICES.FISIOTERAPISTA) serviceSlug = 'fisioterapista';
    else if (serviceId === SERVICES.TUTTOFARE) serviceSlug = 'tuttofare';
    else if (serviceId === SERVICES.SERVIZI_ELETTRICI) serviceSlug = 'elettricista';
    else if (serviceId === SERVICES.SERVIZI_IDRAULICI) serviceSlug = 'idraulico';
    else if (serviceId === SERVICES.CHECKIN_CHECKOUT) serviceSlug = 'checkincheckout';
    return serviceSlug;
}

export default booking;
