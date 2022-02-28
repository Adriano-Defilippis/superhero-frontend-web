/* globals RestService: true, SERVICES: true, ERRORS: true */
'use strict';

import ORDERS from '../_config/orders';
import TYPES from '../_config/types';
import { CARNET_SERVICES, PRICING, ATTRIBUTES, ERRORS } from '../booking.config';

export default function BookingActionsFactory($state, $rootScope, $timeout, $q, locker, SERVICES, ERRORS, STEPS, Services, RestService, BookingModel, BookingModals, AssetsStore, LoginService, UserForm, Carnet, Voucher) {
  "ngInject";

  let stateOrder = [''];
  let stepsOrder = [];
  let __imgUploader = null;

  // process booking state order
  STEPS.forEach(_step => {
    stateOrder.push(_step.state);
    stepsOrder.push(_step.name);
  });

  /**
   *
   *   Gestione ordine generica
   *
   */
  function setBookingLoading() {
    return {type: 'SET_BOOKING_LOADING'};
  }

  function setBookingLoaded() {
    return {type: 'SET_BOOKING_LOADED'};
  }

  function setCarnetInfo(carnetInfo) {
    return {type: 'SET_CARNET_INFO', info: carnetInfo};
  }

  function toogleGenericWithPreference(value) {
    return {
      type: 'TOGGLE_GENERIC_WITH_PREFERENCE',
    };
  }

  function setUserInfo(_info = null) {
    return (dispatch) => {
      if (_info !== null) {
        let billingAddresses = [];
        let userAddresses = [];
        let newsletter = _info.newsLetter === true ? true : false;
        _info.indirizzi.forEach((_i) => {
          if (_i.tipo === 'Fatturazione') billingAddresses.push(formatAddress(_i));
          if (_i.tipo === 'Residenza') {
            if (!_i.note) _i.note = '{ "type":"INTERNAL" }'; // fix for legacy addresses
            let addressNotes = JSON.parse(_i.note);
            _i.type = addressNotes.type;
            userAddresses.push(formatAddress(_i));
          }
        });
        dispatch({type: 'SET_USER_INFO', info: _info, billingAddresses, userAddresses, newsletter: newsletter});
        dispatch(checkForAddressAlreadySaved());
      }
    }
  }

  function checkForAddressAlreadySaved() {
    return (dispatch, getState) => {
      var state = getState().booking;
      if (state.steps.address.isNewAddress === true && state.steps.address.confirmed === true && state.steps.address.userAddresses.length > 0) {
        state.steps.address.userAddresses.forEach(address => {
          if (address.googleMapsId === state.steps.address.input.info.googleMapsId) {
            console.debug('[CHECK_FOR_ADDRESS] User has logged, address input is same as saved', address);
            dispatch(userSelectedAddress(address.id, true));
          }
        });
      }
    }
  }

  function setBookingState(state) {
    return {type: 'SET_BOOKING_STATE', state: state}
  }

  function resetState() {
    return dispatch => {
      // bla bla
      if (__imgUploader !== null && __imgUploader.queue.length > 0) {
        __imgUploader.queue.length = 0;
      }
      dispatch({type: 'RESET_STATE'});
    }
  }

  function setOrderType(orderType) {
    return {type: 'SET_ORDER_TYPE', orderType}
  }

  function nextStep() {
    return {type: 'NEXT_STEP'}
  }

  function goNextStep(step) {
    return function (dispatch) {
      $state.go(stateOrder[step]);
    }
  }

  function setStepCompleted(step) {
    return {type: 'SET_STEP_COMPLETED', step}
  }

  function setMultipleSuperheroes(value) {
    return {
      type: 'SET_MULTIPLE_SUPERHEROES',
      payload: value,
    }
  }

  function resetStep(step) {
    return {type: 'RESET_STEP', step}
  }

  function setError(error) {
    return function (dispatch) {
      if (_.isString(error)) dispatch({type: 'SET_ERROR', error: error});
    }
  }

  function resetError() {
    return function (dispatch, getState) {
      var state = getState().booking;
      if (state.error !== null) {
        dispatch({type: 'RESET_ERROR'});
      }
    }
  }

  function changeStepFromState(stepName, next) {
    return (dispatch) => {
      const formattedStepName = _.replace(stepName, 'bnb', '').toLowerCase();
      let index = 0;
      stateOrder.forEach((_state, _index) => {
        if (_.includes(_state, formattedStepName) || _state === formattedStepName) index = _index;
      });
      if (next === true) index++;
      dispatch(goNextStep(index));
    }
  }

  function getBookingType(state) {
    let orderType = ORDERS.STANDARD_FAST;
    if (state.edit.isEditing === true) {
      if (state.carnet.isCarnetOrder === true) orderType = ORDERS.EDIT_CARNET;
      else if (state.heroSelection.isHeroSelectionOrder === true) orderType = ORDERS.EDIT_HERO;
      else orderType = ORDERS.EDIT_FAST;
    } else {
      if (state.carnet.isCarnetOrder === true) orderType = ORDERS.STANDARD_CARNET;
      else if (state.steps.carnet.userChooseCarnet === true) orderType = ORDERS.CONTEXTUAL_CARNET;
      else if (state.steps.dates.askedForHeroesSuggestions === true && state.steps.dates.heroesSuggested.length > 0) orderType = ORDERS.STANDARD_HERO;
      else orderType = ORDERS.STANDARD_FAST;
    }
    return orderType;
  }

  function togglePrivacyContract() {
    console.log('[TOGGLE_PRIVACY_CONTRACT]');
    return {type: 'TOGGLE_PRIVACY_CONTRACT'};
  }

  function toggleNewsletter() {
    return {type: 'TOGGLE_NEWSLETTER'};
  }

  function userChangedVoucher(_voucher) {
    return {type: 'CHANGE_VOUCHER', voucher: _voucher};
  }

  function addUserAddress(userAddress) {
    return {type: 'ADD_USER_ADDRESS', userAddress};
  }

  function resetDependentSteps(currentStep) {
    return (dispatch, getState) => {
      console.debug('RESETTING DEPENDENT STEPS for', currentStep);
      let state = getState().booking;
      let followingSteps = _.takeRightWhile(stepsOrder, step => {
        return step !== currentStep
      });
      followingSteps.push(currentStep);
      followingSteps.forEach(step => {
        if (step === 'address') resetAddressStep(state, dispatch);
        if (step === 'dates') resetDatesStep(state, dispatch);
        if (step === 'service') resetServiceStep(state, dispatch);
      });
    }
  }

  function resetAddressStep(state, dispatch) {
    dispatch({type: 'SELECT_ADDRESS', addressId: ''});
    if (state.completed.address === true) dispatch(resetStep('address'));
  }

  function resetDatesStep(state, dispatch) {
    if (state.completed.dates === true) dispatch(resetStep('dates'));
    if (state.steps.dates.pickedDates.length > 0) dispatch({type: 'RESET_ALL_DATES'});
  }

  function resetServiceStep(state, dispatch) {
    if (state.completed.service === true) dispatch(resetStep('service'));
  }

  /**
   *
   *   Step Indirizzo
   *
   */
  function formatAddress(_a) {
    _a.formatted = _a.via + ' ' + _a.numeroCivico + ', ' + _a.cap + ' ' + _a.citta;
    return _a;
  }

  function setBookingAddress(addressInfo, type) {
    return function (dispatch) {
      dispatch({type: 'SET_BOOKING_ADDRESS', addressInfo: cleanGoogleAddress(addressInfo, type)});
    }
  }

  function setConfirmedBookingAddress(addressInfo) {
    return function (dispatch) {
      dispatch(setBookingAddress(addressInfo));
      dispatch({type: 'SET_BOOKING_ADDRESS_CONFIRMED'});
    }
  }

  function setUserInputAddress(addressInfo) {
    return {type: 'SET_BOOKING_ADDRESS', addressInfo: addressInfo};
  }

  function setUserInputAddressType(addressType) {
    return {type: 'SET_BOOKING_ADDRESS_TYPE', addressType}
  }

  function cleanGoogleAddress(googleResponse, type) {
    if (typeof googleResponse === 'object') {
      var formattedAddress = {
        formatted: googleResponse.formatted_address,
        googleMapsId: googleResponse.place_id,
        location: googleResponse.geometry.location,
      }
      googleResponse.address_components.forEach(function (component) {
        formattedAddress[component.types[0]] = component.short_name;
      });
      if (_.isString(type) && type !== '') formattedAddress.type = type;
      return formattedAddress;
    } else {
      return null;
    }
  }

  function parseGoogleAddress(addressString) {
    return function (dispatch) {
      RestService.getAddressLatLng(addressString)
          .then(function (data) {
            console.debug(data.data);
            if (data.data.results.length === 0) {
              dispatch(setError(ERRORS.ADDRESS_NOT_FOUND));
            }
            if (data.data.results.length > 1) {
              dispatch(setError(ERRORS.ADDRESS_TOO_GENERIC));
            }
            if (data.data.results.length === 1) {
              dispatch(setConfirmedBookingAddress(data.data.results[0]));
              dispatch(proceedBooking());
            }
          });
    }
  }

  function requestGoogleConfirmation(addressObj) {
    return function (dispatch) {
      var addressString = addressObj.route + ' ' + addressObj.street_number + ', ' + addressObj.postal_code + ', ' + addressObj.locality + ' ' + addressObj.administrative_area_level_2;
      console.log('[REQUEST_GOOGLE_CONFIRMATION] Requesting google confirmation for address', addressString);
      dispatch(parseGoogleAddress(addressString));
    }
  }

  function addNewAddress() {
    return {type: 'SET_ADD_NEW_ADDRESS'};
  }

  /**
   *
   *   Step Servizio
   *
   */
  function selectService(serviceId) {
    return (dispatch) => {
      dispatch(resetDependentSteps('service'));
      dispatch(resetAddressInfo(serviceId));
      dispatch({type: 'SELECT_SERVICE', serviceId: serviceId});
      if (serviceId !== SERVICES.PERSONALTRAINER && serviceId !== SERVICES.FISIOTERAPISTA)
      {
        dispatch(preloadAppointmentInfos());
      }
    }
  }

  function resetAddressInfo(serviceId) {
    return (dispatch, getState) => {
      let state = getState().booking;
      if (serviceId !== SERVICES.PERSONALTRAINER) dispatch(setUserInputAddressType('INTERNAL'));
      else dispatch(setUserInputAddressType(''));
      if (state.steps.userData.additionalNotes !== '') dispatch(setBookingNotes(''));
    }
  }

  function selectSubService(serviceId, subServiceId) {
    return dispatch => {
      dispatch(resetDependentSteps('service'));
      dispatch({type: 'SELECT_SUBSERVICE', serviceId, subServiceId});
      dispatch(preloadAppointmentInfos());
    }
  }

  function disableService(serviceId) {
    return {type: 'ADD_DISABLED_SERVICE', serviceId: serviceId}
  }

  function disableAdditionalService(serviceId) {
    return {type: 'ADD_DISABLED_ADDITIONAL_SERVICE', additionalServiceId: serviceId}
  }

  function enableService(serviceId) {
    return {type: 'REMOVE_DISABLED_SERVICE', serviceId: serviceId}
  }

  function selectAdditionalService(serviceId, additionalServiceId) {
    return dispatch => {
      if (_.isString(additionalServiceId)) dispatch(resetDependentSteps('service'));
      dispatch({type: 'TOGGLE_ADDITIONAL_SERVICE', serviceId: serviceId, additionalServiceId: additionalServiceId});
      if (serviceId === SERVICES.COLF || serviceId === SERVICES.COLF_BNB) {
        dispatch(calculateSuggestedTime());
      } else {
        dispatch(calculateGenericSuggestedTime());
      }
    }
  }

  function resetAdditionalServices(serviceId) {
    return {
      type: 'RESET_ADDITIONAL_SERVICES',
      serviceId: serviceId
    }
  }

  function selectAdditionalTool(serviceId, toolId) {
    return dispatch => {
      if (_.isString(toolId)) dispatch(resetDependentSteps('service'));
      dispatch({type: 'TOGGLE_ADDITIONAL_TOOL', serviceId: serviceId, additionalToolId: toolId});
    }
  }

  function setServiceNote(serviceId, notes) {
    return dispatch => {
      dispatch({type: 'SET_SERVICE_NOTES', serviceId: serviceId, notes: notes})
      if(notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH){
        dispatch({type: 'SET_ERROR', error: ERRORS.TOO_LONG_NOTES})
      }
    }
     
  }

  function colfSetSquareMeters(squareMeters) {
    return dispatch => {
      dispatch({type: 'COLF_SET_SQUARE_METERS', squareMeters: squareMeters});
      dispatch(calculateSuggestedTime());
    }
  }

  function calculateSuggestedTime() {
    return (dispatch, getState) => {
      let state = getState().booking;
      let estimatedTime = getEstimatedTimeForService(state.steps.service.colf.squareMeters, state.steps.service.colf.selectedAdditionalServices);
      dispatch({type: 'COLF_SET_ESTIMATED_TIME', time: estimatedTime});
    }
  }

  function calculateGenericSuggestedTime() {
    return (dispatch, getState) => {
      let state = getState().booking;
      const serviceSlug = BookingModel.getServiceSlug(state.steps.service.selectedService);
      let estimatedTime = getEstimatedTime(state.steps.service.selectedService, state.steps.service[serviceSlug].selectedAdditionalServices);
      dispatch({type: 'SET_ESTIMATED_TIME', serviceName: serviceSlug, time: estimatedTime});
    }
  }

  function badanteSetAssistedInfo(info) {
    return {type: 'BADANTE_SET_ASSISTED_INFO', assistedInfo: info}
  }

  function babySitterAddNewChild() {
    return {type: 'BABYSITTER_ADD_NEW_CHILD'}
  }

  function babySitterRemoveChild(index) {
    return {type: 'BABYSITTER_REMOVE_CHILD', index: index}
  }

  function babySitterEditChild(index, info) {
    return {type: 'BABYSITTER_EDIT_CHILD', index: index, childInfo: info}
  }

  // service COLF
  function checkServiceColf(colfService) {
    if (typeof colfService === 'undefined' && colfService === null) return false;
    if(colfService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return ERRORS.TOO_LONG_NOTES;
    if (_.isNumber(colfService.squareMeters)) return true;
    return false;
  }

  function checkServiceTuttofare(tuttofareService) {
    if (typeof tuttofareService === 'undefined' && tuttofareService === null) return false;
    if(tuttofareService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;
    if (tuttofareService.selectedAdditionalServices.length == 0) return false;
    return true;
  }
  
  function checkServiceIdraulico(idraulicoService) {
    if (!idraulicoService) return false;
    if(idraulicoService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;
    if (idraulicoService.selectedAdditionalServices.length == 0) return false;
    return true;
  }
  
  function checkServiceElettricista(elettricistaService) {
    if (!elettricistaService) return false;
    if(elettricistaService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;
    if (elettricistaService.selectedAdditionalServices.length == 0) return false;
    return true;
  }

  // service STIRATURA    
  function checkServiceStiratura(stiraturaService) {    
    if (typeof stiraturaService === 'undefined' && stiraturaService === null) return false;  
    if(stiraturaService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;
    return true;    
  }

  // service CHECKIN/CHECKOUT    
  function checkServiceCheckinCheckout(checkinCheckoutService) {    
    if (typeof checkinCheckoutService === 'undefined' && checkinCheckoutService === null) return false;   
    return true;    
  }

  // service BADANTE
  function checkServiceBadante(badanteService) {
    if(badanteService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;
    if (typeof badanteService === 'undefined' && badanteService === null) return false;
    var nome = _.isString(badanteService.assistedInfo.nome) && badanteService.assistedInfo.nome !== '';
    var cognome = _.isString(badanteService.assistedInfo.cognome) && badanteService.assistedInfo.cognome !== '';
    var sesso = _.isString(badanteService.assistedInfo.sesso) && badanteService.assistedInfo.sesso !== '';
    var eta = _.isString(badanteService.assistedInfo.eta) && badanteService.assistedInfo.eta !== '';
    if (nome && cognome && eta && sesso) return true;
    else return ERRORS.ASSISTED_INFO_MISSING;
  }

  // service BABY SITTER
  function checkServiceBabySitter(babySitterService) {
    if (typeof babySitterService === 'undefined' && babySitterService === null) return false;
    if(babySitterService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;

    var childrenOk = true;
    if (babySitterService.childrenInfo.length > 0) {
      babySitterService.childrenInfo.forEach(function (child) {
        var nome = _.isString(child.nome) && child.nome !== '';
        var cognome = _.isString(child.cognome) && child.cognome !== '';
        var sesso = _.isString(child.sesso) && child.sesso !== '';
        var eta = _.isString(child.eta) && child.eta !== '';
        if (!nome || !cognome || !sesso || !eta) childrenOk = false;
      });
      if (childrenOk === true) return true;
      else return ERRORS.CHILDREN_INFO_MISSING;
    } else {
      return ERRORS.NO_CHILDREN_INFO;
    }
  }

  // service fisioterapista
  function checkServiceFisioterapista(fisioterapistaService) {
    if (typeof fisioterapistaService === 'undefined' && fisioterapistaService === null) return false;
    if(fisioterapistaService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;
    if (fisioterapistaService.subService === '') return ERRORS.NO_SUBSERVICE_SELECTED;
    return true;
  }

  // service PERSONAL TRAINER
  function checkServicePersonalTrainer(personalTrainerService) {
    if(personalTrainerService.notes.length > ERRORS.SERVICE_NOTES_MAX_LENGTH) return false;
    if (typeof personalTrainerService === 'undefined' && personalTrainerService === null) return false;
    if (personalTrainerService.subService === '') return ERRORS.NO_SUBSERVICE_SELECTED;
    var guestsOk = true;
    if (personalTrainerService.guestsInfo.length > 0) {
      personalTrainerService.guestsInfo.forEach(function (guest) {
        var nome = _.isString(guest.nome) && guest.nome !== '';
        var cognome = _.isString(guest.cognome) && guest.cognome !== '';
        var eta = _.isString(guest.eta) && guest.eta !== '';
        if (!nome || !cognome || !eta) guestsOk = false;
      });
      if (guestsOk === true) return true;
      else return ERRORS.GUESTS_INFO_MISSING;
    } else {
      return true;
    }
  }

  function personalTrainerAddNewGuest() {
    return dispatch => {
      dispatch(resetDependentSteps('service'));
      dispatch({type: 'PERSONALTRAINER_ADD_NEW_GUEST'});
    }
  }

  function personalTrainerRemoveGuest(index) {
    return dispatch => {
      dispatch(resetDependentSteps('service'));
      dispatch({type: 'PERSONALTRAINER_REMOVE_GUEST', index: index});
    }
  }

  function personalTrainerEditGuest(index, info) {
    return {type: 'PERSONALTRAINER_EDIT_GUEST', index: index, guestInfo: info}
  }

  function preloadAppointmentInfos(){
    return (dispatch, getState) => {
      const serviceStepState = getState().booking.steps.service;
      let serviceId = serviceStepState.selectedService;
      
      if (serviceId === SERVICES.PERSONALTRAINER) {
        serviceId = serviceStepState.personalTrainer.subService;
      }
      
      const ifCarnetServiceId = _.findKey(CARNET_SERVICES, (servicesArray) => _.indexOf(servicesArray, serviceId) > -1);

      if (ifCarnetServiceId) {
        serviceId = ifCarnetServiceId;
      }

      if ($rootScope.userId && serviceId) {
          RestService.getCustomerLastAppointmentInfo($rootScope.userId, ATTRIBUTES[serviceId]).then( (response) => {
              let jsonDettagliServizio = undefined;
              if (response.data) {
                jsonDettagliServizio = response.data.jsonDettagliServizio;
              }
              if (jsonDettagliServizio) {
                  jsonDettagliServizio = JSON.parse(jsonDettagliServizio);
                  if (serviceId === SERVICES.BABYSITTER) {
                      for (var i = 0; i < jsonDettagliServizio.numeroBambini - 1; i++) {
                        dispatch(babySitterAddNewChild());
                      }
                      _.forEach(jsonDettagliServizio.infoBambini,
                          (person, index) => {dispatch(babySitterEditChild(index, person))}
                      )
                  }
                  else if (serviceId === SERVICES.ALLENAMENTOFUNZIONALE || serviceId === SERVICES.DIMAGRIMENTO || 
                      serviceId === SERVICES.GINNASTICAPOSTURALE || serviceId === SERVICES.CICLISMO || serviceId === SERVICES.YOGA || 
                      serviceId === SERVICES.DIFESAPERSONALE || serviceId === SERVICES.CORSA|| serviceId === SERVICES.PILATES) {
                      for (i = 0; i < jsonDettagliServizio.numeroPersone - 1; i++) {
                        dispatch(personalTrainerAddNewGuest());
                      }
                      _.forEach(jsonDettagliServizio.infoPersone,
                          (person, index) => dispatch(personalTrainerEditGuest(index, person)))
                      
                  }
                  else if (serviceId === SERVICES.BADANTE) {
                      dispatch(badanteSetAssistedInfo(jsonDettagliServizio.infoPersona))
                  }
              }
              
          });
      }
    }
  }

  function getEstimatedTime(service, additionalServices) {
    var estimatedTime = 0;
    // estimated time from additional services
    if (additionalServices.length > 0) {
      additionalServices.forEach(function (_additional) {
        var serviceDetails = _.find(BookingModel.services, { id: service });
        var additional = _.find(BookingModel.additional[serviceDetails.id], {id: _additional});
        if (additional) estimatedTime += additional.time;
      });
    }

    return estimatedTime;
  }

  function getEstimatedTimeForService(squareMeters, additionalServices) {
    var estimatedTime = 0;
    console.log(squareMeters, additionalServices);
    // estimated time from additional services
    if (additionalServices.length > 0) {
      additionalServices.forEach(function (_additional) {
        var additional = _.find(BookingModel.additional[SERVICES.COLF], {id: _additional});
        if (typeof additional !== 'undefined') estimatedTime += additional.time;
      });
    }
    // estimated time by square meters of apartment
    estimatedTime += calculateSuggestedMinutes(squareMeters);
    return estimatedTime;
  }

  function calculateSuggestedMinutes(meters) {
    var suggested = 0;
    if (meters <= 60) suggested = 120;
    else if (meters <= 90) suggested = 150;
    else if (meters <= 120) suggested = 180;
    else if (meters <= 150) suggested = 210;
    else if (meters <= 180) suggested = 240;
    else if (meters <= 210) suggested = 270;
    else if (meters <= 240) suggested = 300;
    return suggested;
  }

  /**
   *
   *   Step Date
   *
   */
  function setSuggestionHandledForDate(dateId) {
    return {type: 'SET_SUGGESTIONS_HANDLED_FOR_DATE', dateId: dateId};
  }

  function setSuggestionUnhandledForDate(dateId) {
    return {type: 'SET_SUGGESTIONS_UNHANDLED_FOR_DATE', dateId: dateId};
  }

  function setConfirmedDate(date) {
    return {type: 'ADD_CONFIRMED_DATE', date: date};
  }

  function setSuggestions(suggestions) {
    return {type: 'ADD_SUGGESTION', suggestion: suggestions}
  }

  function setHeroesSuggestions(heroes) {
    return {type: 'ADD_HERO_SUGGESTED', heroes: heroes};
  }

  function cleanSuggestion(_suggestion) {
    let suggestion = _.cloneDeep(_suggestion);
    if (suggestion.distanzaMinuti < 0) suggestion.distanzaMinuti = 0;
    suggestion.handled = false;
    suggestion.start = suggestion.dataInizio;
    suggestion.end = suggestion.dataFine;
    delete suggestion.dataInizio;
    delete suggestion.dataFine;
    if (typeof suggestion.superHeroes !== 'undefined') delete suggestion.superHeroes;
    suggestion.suggestionId = guid();
    suggestion.labels = {
      start: createDateLabels(moment(suggestion.start)),
      end: createDateLabels(moment(suggestion.end))
    }
    return suggestion;
  }

  function processSuggestions() {
    return function (dispatch, getState) {
      let datesStep = getState().booking.steps.dates;
      datesStep.pickedDates.forEach(function (_pickedDate) {
        let relatedSuggestions = _.filter(datesStep.suggestions, {id: _pickedDate.id});
        if (_.isArray(relatedSuggestions) && relatedSuggestions.length > 0) {
          if (_.some(relatedSuggestions, {matchEsatto: true})) {
            let confirmed = createDateFromSuggestion(_pickedDate, _.find(relatedSuggestions, {matchEsatto: true}));
            dispatch(setConfirmedDate(confirmed));
            dispatch(setSuggestionHandledForDate(_pickedDate.id));
          }
        }
      });
      dispatch(proceedBooking({}));
    }
  }

  function checkPickedDates(dates) {
    var _inPast = false;
    var _datesOverlap = false;
    var now = moment().valueOf();
    dates.forEach(function (dateA, indexA) {
      if (dateA.start <= now) _inPast = true;
      dates.forEach(function (dateB, indexB) {
        if (indexB !== indexA && datesOverlap(dateA, dateB)) _datesOverlap = true;
      });
    });
    return {overlap: _datesOverlap, past: _inPast};
  }

  function checkPickedDatesMultiSH(dates) {
    var _inPast = false;
    var _overlappingSH = false;
    var now = moment().valueOf();
    dates.forEach(function (dateA, indexA) {
      if (dateA.start <= now) _inPast = true;
      dates.forEach(function (dateB, indexB) {
        if (indexB !== indexA && datesAndHeroOverlap(dateA, dateB)) _overlappingSH = true;
      });
    });
    return {overlap: false, past: _inPast, overlappingSH: _overlappingSH};
  }

  function datesAndHeroOverlap(_a, _b) {
    return datesOverlap(_a, _b) && _a.hero && _b.hero && _a.hero.id === _b.hero.id;
  }

  function datesOverlap(_a, _b) {
    var rangeA = moment().range(moment(_a.start), moment(_a.end));
    var rangeB = moment().range(moment(_b.start), moment(_b.end));
    return rangeA.overlaps(rangeB);
  }

  function setPickingMode(m) {
    return dispatch => {
      var mode = m;
      if (m !== 1 && m !== 2 && m !== 0) mode = 2;
      dispatch({type: 'SET_TIME_PICKER_MODE', mode: mode});
      if (m === 1 || m === 2) dispatch(setStartingPickedDates());
    }
  }

  function setStartingPickedDates() {
    return function (dispatch, getState) {
      var state = getState().booking;
      var dates = moment().hours(12).minutes(0).seconds(0).milliseconds(0);
      var starting = moment().hours(12).minutes(0).seconds(0).milliseconds(0);
      var ending = moment(starting);
      ending.add(getMinTime(state.steps.service.selectedService, state), 'minutes');
      var pickers = {
        startTime: starting.toDate(),
        startDate: dates.toDate(),
        endTime: ending.toDate(),
        endDate: dates.toDate(),
      }
      dispatch({type: 'SET_DATE_PICKERS', pickers: pickers});
    }
  }

  function getMinTime(serviceId, state) {
    let minTime = 120;
    if (serviceId === SERVICES.PERSONALTRAINER || serviceId === SERVICES.FISIOTERAPISTA) {
      const serviceSlug = BookingModel.getServiceSlug(state.steps.service.selectedService);
      let service = _.find(BookingModel.subServices[serviceId], {id: state.steps.service[serviceSlug].subService});
      minTime = service.time;
    } else if (serviceId === SERVICES.TUTTOFARE || serviceId === SERVICES.SERVIZI_ELETTRICI || serviceId === SERVICES.SERVIZI_IDRAULICI || serviceId === SERVICES.CHECKIN_CHECKOUT) {
      minTime = 60;
    }
    return minTime;
  }

  function setNewTimeDatePickers(date, whichPicker) {
    return function (dispatch, getState) {
      var state = getState().booking;
      var datesStep = state.steps.dates;
      var startTime = datesStep.startPicker.time,
          startDate = datesStep.startPicker.date,
          endTime = datesStep.endPicker.time,
          endDate = datesStep.endPicker.date,
          actedOn = '';

      var startPreEdit = moment(startDate).hours(moment(startTime).hours()).minutes(moment(startTime).minutes());
      var endPreEdit = moment(endDate).hours(moment(endTime).hours()).minutes(moment(endTime).minutes());

      var minTime = moment().seconds(0).milliseconds(0);
      if (minTime.minutes() < 30) {
        minTime.minutes(30);
      } else {
        minTime.add(1, 'hours');
        minTime.minutes(0);
      }

      switch (whichPicker) {
        case 'startTime':
          actedOn = 'start';
          startTime = date;
          break;
        case 'startDate':
          actedOn = 'start';
          startDate = date;
          break;
        case 'endTime':
          actedOn = 'end';
          endTime = date;
          break;
        case 'endDate':
          actedOn = 'end';
          endDate = date;
          break;
      }

      var startPostEdit = moment(startDate).hours(moment(startTime).hours()).minutes(moment(startTime).minutes());
      var endPostEdit = moment(endDate).hours(moment(endTime).hours()).minutes(moment(endTime).minutes());

      if (endPostEdit.isBefore(endPreEdit) && whichPicker === 'startTime' && datesStep.pickingMode === 1) {
        endDate = moment(endDate).add(1, 'days').toDate();
      }

      if (endPostEdit.isBefore(endPreEdit) && whichPicker === 'endTime' && datesStep.pickingMode === 1 && moment(endTime).hours() < 3) {
        endDate = moment(endDate).add(1, 'days').toDate();
      }

      /**
       if (startPostEdit.isBefore(minTime)) {
                console.debug('[CONSTRAIN_TIME] Start cannot be before minTime');
                actedOn = 'start';
                startPostEdit = moment(minTime);
                startDate = startPostEdit.isSame(startDate, 'day') ? startDate : moment(startPostEdit).hours(12).minutes(0).seconds(0).milliseconds(0).toDate();
                startTime = moment(startTime).hours(startPostEdit.hours()).minutes(startPostEdit.minutes()).seconds(0).milliseconds(0).toDate();
            }
       */

      if (datesStep.pickingMode === 1 && whichPicker === 'startDate')  endDate = startDate;

      let _minTime = getMinTime(state.steps.service.selectedService, state);
      var constrain = constrainTime(startTime, startDate, endTime, endDate, actedOn, state.steps.service.selectedService, _minTime);

      if (!moment(endDate).isSame(moment(startDate), 'day')) dispatch(setPickingMode(2));

      dispatch({type: 'SET_DATE_PICKERS', pickers: constrain});
    }
  }

  function constrainTime(startTime, startDate, endTime, endDate, actedOn, service, minTime) {
    console.log(service);
    const alwaysForceTime = service === SERVICES.FISIOTERAPISTA;
    var minBookingTime = minTime;
    var start = moment(startDate).hours(moment(startTime).hours()).minutes(moment(startTime).minutes());
    var end = moment(endDate).hours(moment(endTime).hours()).minutes(moment(endTime).minutes());
    var constrain = {
      startTime: startTime,
      startDate: startDate,
      endTime: endTime,
      endDate: endDate
    }
    var difference = end.diff(start, 'minutes', true);
    if (actedOn === 'start' && (difference < minBookingTime || alwaysForceTime)) {
      console.debug('[CONSTRAIN_TIME] User changed starting time and diffrence is:', difference);
      end = moment(start).add(minBookingTime, 'minutes');
      constrain.endDate = end.isSame(constrain.endDate, 'day') ? constrain.endDate : moment(end).hours(12).minutes(0).seconds(0).milliseconds(0).toDate();
      constrain.endTime = moment(constrain.endTime).hours(end.hours()).minutes(end.minutes()).seconds(0).milliseconds(0).toDate();
    } else if (actedOn === 'end' && (difference < minBookingTime || alwaysForceTime)) {
      console.debug('[CONSTRAIN_TIME] User changed ending time and difference is:', difference);
      start = moment(end).subtract(minBookingTime, 'minutes');
      constrain.startDate = start.isSame(constrain.startDate, 'day') ? constrain.startDate : moment(start).hours(12).minutes(0).seconds(0).milliseconds(0).toDate();
      constrain.startTime = moment(constrain.startTime).hours(start.hours()).minutes(start.minutes()).seconds(0).milliseconds(0).toDate();
    }
    return constrain;
  }

  function confirmTimeRangeSelection() {
    return function (dispatch, getState) {
      let state = getState().booking;
      let datesStep = state.steps.dates;
      let newDate = createDate(
          datesStep.startPicker.date,
          datesStep.startPicker.time,
          datesStep.endPicker.date,
          datesStep.endPicker.time
      );

      dispatch({type: 'ADD_SELECTED_DATE', selectedDate: newDate});
      dispatch(setPickingMode(0));

      if (datesStep.askedForHeroesSuggestions === true) {
        dispatch(setDateLoading(newDate.id));
        let newSuggestion = formatSuggestionRequestFromDate(newDate, state);
        dispatch(processHeroSelection([newSuggestion], () => {
          dispatch(setDateLoaded(newDate.id));
        }));
      } else if (datesStep.askedForSuggestions === true) {
        dispatch(setDateLoading(newDate.id));
        let newSuggestion = formatSuggestionRequestFromDate(newDate, state);
        dispatch(processFastBooking([newSuggestion], () => {
          dispatch(setDateLoaded(newDate.id));
        }, state));
      }

      if (state.completed.address === true) {
        dispatch(resetStep('dates'));
      }
    }
  }

  function addConfirmedDate(newDate) {
    return function (dispatch, getState) {
      let state = getState().booking;
      let datesStep = state.steps.dates;

      dispatch({type: 'ADD_SELECTED_DATE', selectedDate: newDate});
      dispatch(setPickingMode(0));

      if (datesStep.askedForHeroesSuggestions === true) {
        dispatch(setDateLoading(newDate.id));
        let newSuggestion = formatSuggestionRequestFromDate(newDate, state);
        dispatch(processHeroSelection([newSuggestion], () => {
          dispatch(setDateLoaded(newDate.id));
        }));
      } else if (datesStep.askedForSuggestions === true) {
        dispatch(setDateLoading(newDate.id));
        let newSuggestion = formatSuggestionRequestFromDate(newDate, state);
        dispatch(processFastBooking([newSuggestion], () => {
          dispatch(setDateLoaded(newDate.id));
        }, state));
      }

      if (state.completed.address === true) {
        dispatch(resetStep('dates'));
      }
    }
  }

  function createDate(startDate, startTime, endDate, endTime) {
    var startEpoch = getEpochFromDateAndTime(startDate, startTime),
        endEpoch = getEpochFromDateAndTime(endDate, endTime);
    var newDate = {
      start: startEpoch,
      end: endEpoch,
      id: guid(),
      labels: {
        start: createDateLabels(moment(startEpoch)),
        end: createDateLabels(moment(endEpoch))
      },
      loading: false
    }
    return newDate;
  }

  function setDateLoading(dateId) {
    return {type: 'SET_DATE_LOADING', dateId: dateId, newInfo: {loading: true}};
  }

  function setDateLoaded(dateId) {
    return {type: 'SET_DATE_LOADED', dateId: dateId, newInfo: {loading: false}};
  }

  function createDateFromStartEnd(_start, _end) {
    var startEpoch = moment(_start).valueOf(),
        endEpoch = moment(_end).valueOf();
    return {
      id: guid(),
      start: startEpoch,
      end: endEpoch,
      labels: {
        start: createDateLabels(moment(startEpoch)),
        end: createDateLabels(moment(endEpoch))
      },
      loading: false
    }
  }

  function editDate(dateId, newInfo) {
    return {type: 'EDIT_SELECTED_DATE', dateId: dateId, newInfo: newInfo};
  }

  function getEpochFromDateAndTime(_date, _time) {
    var date = moment(_date);
    var time = moment(_time);
    return date.hours(time.hours()).minutes(time.minutes()).seconds(0).milliseconds(0).valueOf();
  }

  function deletePickedDate(dateId) {
    return function (dispatch, getState) {
      var datesStep = getState().booking.steps.dates;
      dispatch(setError(''));
      dispatch({type: 'REMOVE_SELECTED_DATE', selectedDateId: dateId});
      // delete all suggestion (if any) for picked dates
      dispatch({type: 'REMOVE_SUGGESTION_FOR_DATE', dateId: dateId}); // remove suggestion
      dispatch({type: 'REMOVE_HEROES_SUGGESTED_FOR_DATE', dateId: dateId}); // remove any hero suggested
      if (datesStep.pickedDates.length === 1 && datesStep.pickedDates[0].id === dateId) dispatch(setPickingMode(1));
    }
  }

  function deleteConfirmedDate(dateId) {
    return (dispatch, getState) => {
      //let confirmedDates = getState().booking.steps.dates.confirmedDates;
      dispatch(resetStep('dates'));
      dispatch(setSuggestionUnhandledForDate(dateId));
      dispatch({type: 'REMOVE_CONFIRMED_DATE', confirmedDateId: dateId});
    }
  }

  function createDateLabels(dateToFormat) {
    var data = {
      dayOfWeek: dateToFormat.format("dddd"),
      dayOfWeekShort: dateToFormat.format("ddd"),
      dayOfMonth: dateToFormat.format("DD/MM/YYYY"),
      dayOfMonthShort: dateToFormat.format("DD/MM/YY"),
      time: dateToFormat.format("HH:mm"),
      dayOfMonthVertical: '<span class="day">' + dateToFormat.format("DD") + '</span><br>' +
      '<span class="month">' + dateToFormat.format("MMM") + '</span><br>' +
      '<span class="year">' + dateToFormat.format("YYYY") + '</span>',
    }
    return data;
  }

  function createRecurrenceFromDate(dateId, recurrenceInfo) {
    if (typeof dateId === 'undefined' || typeof recurrenceInfo === 'undefined' || typeof recurrenceInfo.frequency === 'undefined' || typeof recurrenceInfo.times === 'undefined') return;
    return function (dispatch, getState) {
      var dates = getState().booking.steps.dates.pickedDates;
      var date = _.find(dates, function (d) {
        return d.id === dateId;
      });
      if (typeof date !== 'undefined') {
        var times = recurrenceInfo.times,
            frequency = recurrenceInfo.frequency,
            recurrenceId = guid(),
            recurrenceResults = [];
        console.log(recurrenceInfo);
        for (var i = 0; i < times; i++) {
          console.log(i + 1);
          var newStart = moment(date.start),
              newEnd = moment(date.end);
          if (frequency === 'DAILY') {
            newStart.add(i + 1, 'days');
            newEnd.add(i + 1, 'days');
          } else if (frequency === 'MONTHLY') {
            newStart.add(i + 1, 'months');
            newEnd.add(i + 1, 'months');
          } else {
            var f = 1;
            if (frequency === 'TWO_WEEKS') f = 2;
            if (frequency === 'THREE_WEEKS') f = 3;
            newStart.add(f * (i + 1), 'weeks');
            newEnd.add(f * (i + 1), 'weeks');
          }
          var newDate = createDateFromStartEnd(newStart, newEnd);
          newDate.recurrenceId = recurrenceId;
          recurrenceResults.push(newDate);
        }
        if (recurrenceResults.length > 0) {
          dispatch(editDate(date.id, {recurrenceId: recurrenceId}));
          dispatch({type: 'ADD_SELECTED_DATE', selectedDate: recurrenceResults});
        }
      }
    }
  }

  function formatSuggestionRequestFromState(bookingState) {
    var suggestionsRequest = [];
    bookingState.steps.dates.pickedDates.forEach(function (_date) {
      let request = formatSuggestionRequestFromDate(_date, bookingState);
      suggestionsRequest.push(request);
    });
    return suggestionsRequest;
  }

  function formatSuggestionRequestFromDate(_date, bookingState) {
    var jsonDettagli = {}, _service = null;
    console.debug('[FORMAT_SUGGESTION] Service is: ', bookingState.steps.service.selectedService);
    // badante
    if (_.includes(['TS-0000-0000-0000-0002', 'TS-0000-0000-0001-0002', 'TS-0000-0000-0002-0002', 'TS-0000-0000-0003-0002'], bookingState.steps.service.selectedService)) {
      jsonDettagli.numeroBambini = bookingState.steps.service.babySitter.childrenInfo.length;
      console.debug('[FORMAT_SUGGESTION] JsonDettagli is: ', jsonDettagli);
    }

    if (bookingState.steps.service.selectedService === SERVICES.PERSONALTRAINER) {
      jsonDettagli.numeroPersone = bookingState.steps.service.personalTrainer.guestsInfo.length + 1;
    }

    var sottoCompetenze = [];
    _service = BookingModel.getServiceSlug(bookingState.steps.service.selectedService);
    if (_service && _.isArray(bookingState.steps.service[_service].selectedAdditionalServices)) {
      bookingState.steps.service[_service].selectedAdditionalServices.forEach(function (_additionalService) {
        if (_.isString(_additionalService) && _additionalService !== '') sottoCompetenze.push({id: _additionalService});
      });
      _.forEach(bookingState.steps.service[_service].selectedAdditionalTools, additionalToolId => {
        sottoCompetenze.push({id: additionalToolId})
      });
    }

    // pick postal code from address or new address input
    let cap = '';
    if (bookingState.steps.address.isNewAddress === true) {
      cap = bookingState.steps.address.input.info.postal_code;
    } else {
      let selectedAddress = _.find(bookingState.steps.address.userAddresses, {id: bookingState.steps.address.selectedUserAddress});
      cap = selectedAddress.cap;
    }

    // selected service. pick carnet service type if is carnet order
    let selectedService = BookingModel.getFinalService(bookingState.steps.service);

    // carnet service
    if (bookingState.carnet.isCarnetOrder === true) selectedService = bookingState.carnet.info.tipoServizio;

    var request = {
      id: _date.id,
      tipoServizio: {
        id: selectedService
      },
      dataInizio: _date.start,
      dataFine: _date.end,
      indirizzoPrestazione: {
        cap: cap,
        citta: "Milano",
        metratura: 60,
        nomeCitofono: "Belli",
        id: "",
        numeroCivico: "10",
        piano: 2,
        provincia: "MI",
        scala: "B",
        tipo: "Residenza",
        via: "via Ripetta"
      },
      cellulare: '',
      nome: '',
      cognome: '',
      email: '',
      tipoIngresso: '',
      note: '',
      jsonDettagliServizio: JSON.stringify(_.cloneDeep(jsonDettagli)),
      sottoCompetenze: sottoCompetenze
    }
    if (bookingState.carnet.isCarnetOrder === true && _.isString(bookingState.carnet.idCarnet) && bookingState.carnet.idCarnet !== '') request.tipo = 'AppuntamentiCarnet';
    return request;
  }

  function createDateFromSuggestion(date, suggestion) {
    return date.merge({
      start: suggestion.start,
      end: suggestion.end,
      prezzoEuro: suggestion.prezzoEuro,
      labels: {
        start: createDateLabels(moment(suggestion.start)),
        end: createDateLabels(moment(suggestion.end)),
      }
    }, {deep: true});
  }

  function userPickedSuggestion(dateId, suggestionId, heroId) {
    return (dispatch, getState) => {
      let datesStep = getState().booking.steps.dates;
      let originalDate = _.find(datesStep.pickedDates, {id: dateId});
      let hero, suggestion;
      if (heroId) {
        hero = _.find(datesStep.heroesSuggested, (_h) => _h.id === heroId && _h.appointment === dateId);
        console.debug('[USER_PICKED_SUGGESTION] Hero selected', hero);
        suggestion = _.find(hero.suggestions, {suggestionId: suggestionId});
        console.debug('[USER_PICKED_SUGGESTION] Suggestion selected', suggestionId, suggestion);
      } else {
        suggestion = _.find(datesStep.suggestions, {suggestionId: suggestionId});
      }
      if (originalDate && suggestion) {
        let confirmed = createDateFromSuggestion(originalDate, suggestion);
        if (hero) {
          dispatch(setConfirmedDate(confirmed.merge({
            hero: hero
          }, {deep: true})));
          datesStep = getState().booking.steps.dates;
          const checked = checkPickedDatesMultiSH(datesStep.confirmedDates);
          checked.overlappingSH ? dispatch(setError(ERRORS.SAME_SH_AND_DATETIME)) : dispatch(setError(''));
        } else {
          dispatch(setConfirmedDate(confirmed));
        }

        dispatch(setSuggestionHandledForDate(dateId));
      }
    }
  }

  function canBookMultipleSuperheroes(service) {
    return (dispatch, getState) => {
      let datesStep = getState().booking.steps.dates;
      if (datesStep.heroesSuggested && datesStep.heroesSuggested.length) {
        if (service === SERVICES.TUTTOFARE) {
          return true;
        }
        return false;
      }
      return false;
    }
  }

  function addNewSuperhero() {
    return (dispatch, getState) => {
      const bookingState = getState().booking;
      const datesStep = bookingState.steps.dates;
      let originalDate;
      if (datesStep && datesStep.pickedDates && datesStep.pickedDates.length) {
        const insertedDates = _.map(datesStep.pickedDates, originalDate => {
          dispatch(setPickingMode(1));
          if (originalDate) {
            let newDate = createDate(
              originalDate.start,
              originalDate.start,
              originalDate.end,
              originalDate.end
            );
            dispatch(addConfirmedDate(newDate));
            return newDate;
          }
        });
        return Promise.resolve(insertedDates);
      }
    }
  }


  function userChangedDate(change, dateId) {
    return (dispatch, getState) => {
      // set date loading => delete suggestions => edit date => new suggestions => set date loaded
      let bookingState = getState().booking;
      let datesStep = bookingState.steps.dates;
      let originalDate = _.find(datesStep.pickedDates, {id: dateId});
      if (typeof originalDate !== 'undefined') {
        dispatch(setDateLoading(dateId)); // set date in loading state
        let newStart = moment(originalDate.start).add(change, 'days');
        let newEnd = moment(originalDate.end).add(change, 'days');
        let changes = {
          start: newStart.valueOf(),
          end: newEnd.valueOf(),
          labels: {
            start: createDateLabels(newStart),
            end: createDateLabels(newEnd),
          }
        };
        dispatch({type: 'REMOVE_SUGGESTION_FOR_DATE', dateId: dateId}); // remove suggestion
        dispatch({type: 'REMOVE_HEROES_SUGGESTED_FOR_DATE', dateId: dateId}); // remove any hero suggested
        dispatch(editDate(dateId, changes)); // edit original picked date
        if (datesStep.askedForHeroesSuggestions === false) {
          let newSuggestion = formatSuggestionRequestFromDate(originalDate.merge(changes, {deep: true}), bookingState);
          dispatch(processFastBooking([newSuggestion], () => {
            dispatch(setDateLoaded(dateId));
          }, bookingState));
        } else if (datesStep.askedForHeroesSuggestions === true) {
          let newSuggestion = formatSuggestionRequestFromDate(originalDate.merge(changes, {deep: true}), bookingState);
          dispatch(processHeroSelection([newSuggestion], () => {
            dispatch(setDateLoaded(dateId));
          }));
        }
      }
    }
  }

  /**
   *
   *   Step Info utente / registrazione
   *
   */
  function userSelectedBillingAddress(addressId) {
    return {type: 'SELECT_BILLING_ADDRESS', addressId};
  }

  function userSelectedAddress(addressId, skipCheck = false) {
    return (dispatch, getState) => {
      //if (getState().booking.completed.address === true) dispatch(resetStep('address'));
      if (skipCheck === false)dispatch(resetDependentSteps('address'));
      dispatch({type: 'SELECT_ADDRESS', addressId});
    }
  }

  function setBookingNotes(notes) {
    return {type: 'SET_BOOKING_NOTES', notes: notes ? notes : ''};
  }

  function userInfoChanged(info) {
    console.log(info);
    return {type: 'SET_NEW_USER_INFO', info};
  }

  function setUserInfoValid(valid) {
    return {type: 'SET_NEW_USER_INFO_VALID', valid};
  }

  function toggleSameBillingAddress() {
    return {type: 'TOGGLE_SAME_BILLING_ADDRESS'};
  }

  function billingAddressChanged(info) {
    return {type: 'SET_BILLING_ADDRESS_INFO', info};
  }

  function billingInfoChanged(info) {
    return {type: 'SET_BILLING_USER_INFO', info};
  }

  function setBillingAddressValid(valid) {
    return {type: 'SET_NEW_BILLING_ADDRESS_VALID', valid};
  }

  function addNewBillingAddress() {
    return (dispatch, getState) => {
      const state = getState();
      BookingModals.addNewBillingAddress(state.booking.userInfo.info.id)
          .then((newBillingAddress) => {
            console.debug(newBillingAddress);
            dispatch({type: 'ADD_BILLING_ADDRESSES', addresses: formatAddress(newBillingAddress)});
            dispatch(userSelectedBillingAddress(newBillingAddress.id));
          });
    }
  }

  /**
   *
   *   Business logic di prenotazione
   *
   */
  function proceedBooking(info) {
    return function (dispatch, getState) {
      let _state = getState();
      var bookingState = getState().booking;
      //console.log(JSON.stringify(state, null, '\t'));
      var currentStep = bookingState.currentStep;
      dispatch(resetError());
      switch (bookingState.router) {
        case 'booking.address':
          if (canProceedAddressStep(bookingState) && checkAddressStep(bookingState, dispatch)) {
            console.debug('[PROCEED_BOOKING] Step Address: everything is ok, proceeding next step');
            dispatch(setStepCompleted('address'));
            dispatch(changeStepFromState(bookingState.router, true));
          } else if (canProceedAddressStep(bookingState)) {
            console.debug('[PROCEED_BOOKING] Step Address: Address is filled but has not been confirmed from Google');
            dispatch(requestGoogleConfirmation(bookingState.steps.address.input.info));
          } else {
            console.debug('[PROCEED_BOOKING] Step Address: Address has missing some info');
          }
          break;
        case 'booking.service':
          if (canProceedServiceStep(bookingState.steps.service) && checkServiceStep(bookingState.steps.service, dispatch)) {
            console.debug('[PROCEED_BOOKING] Steps Service: everything is ok, proceeding next step');
            dispatch(setStepCompleted('service'));
            dispatch(changeStepFromState(bookingState.router, true));
          }
          break;
        case 'booking.bnbService':
          if (canProceedServiceStep(bookingState.steps.service) && checkServiceStep(bookingState.steps.service, dispatch)) {
            console.debug('[PROCEED_BOOKING] Steps Service: everything is ok, proceeding next step');
            dispatch(setStepCompleted('service'));
            dispatch(changeStepFromState(bookingState.router, true));
          }
          break;
        case 'booking.dates':
          if (canProceedDatesStep(bookingState.steps.dates) && checkDatesStep(bookingState.steps.dates, bookingState.steps.service, dispatch)) {
            console.debug('[PROCEED_BOOKING] Steps Dates: everything is ok, proceeding next step');
            dispatch(setStepCompleted('dates'));
            dispatch(changeStepFromState(bookingState.router, true));
          } else if (canProceedDatesStep(bookingState.steps.dates) && typeof info === 'undefined' && bookingState.steps.dates.confirmedDates.length !== bookingState.steps.dates.pickedDates.length) {
            console.debug('[PROCEED_BOOKING] Steps Dates: user must choose suggestions for 1 or more dates');
            dispatch(setError(ERRORS.MUST_CONFIRM_ALL_DATES));
          } else if (_.isObject(info) && info.mode !== '' && canProceedDatesStep(bookingState.steps.dates)) {
            console.debug('[PROCEED_BOOKING] Steps Dates: user has selected dates but they have not been confirmed');
            dispatch(requestDatesConfirmation(bookingState.steps.dates.pickedDates, bookingState.steps.service, info.mode));
          }
          break;
        case 'booking.userData':
          if (canProceedUserDataStep(_state, dispatch) && checkUserDataStep(_state, dispatch)) {
            console.debug('[PROCEED_BOOKING] Steps User Data: everything is ok, completeing order..');
            dispatch(setStepCompleted('userData'));
            dispatch(completeOrder());
          }
          break;
        default:
          break;
      }
    }
  }

  // return BOOL to handle proceed button in booking process
  function canProceedBooking() {
    return function (dispatch, getState) {
      let _state = getState();
      let bookingState = _state.booking;
      var canProceed;
      switch (bookingState.router) {
        case 'booking.address':
          canProceed = canProceedAddressStep(bookingState);
          break;
        case 'booking.service':
          canProceed = canProceedServiceStep(bookingState.steps.service);
          break;
        case 'booking.bnbService':
          canProceed = canProceedServiceStep(bookingState.steps.service);
          break;
        case 'booking.dates':
          canProceed = canProceedDatesStep(bookingState.steps.dates) && bookingState.completed.address === true && bookingState.completed.service === true && !bookingState.error;
          break;
        case 'booking.userData':
          canProceed = canProceedUserDataStep(_state, dispatch);
          break;
      }
      if (canProceed === true) return true;
      else return false;
    }
  }

  function canProceedAddressStep(state) {
    let addressStep = state.steps.address;
    let userDataStep = state.steps.userData;
    // validty of address
    let address = (typeof addressStep.input.info !== 'undefined' && addressStep.input.info.route && addressStep.input.info.postal_code && addressStep.input.info.street_number && addressStep.input.info.locality && addressStep.input.info.administrative_area_level_2 && addressStep.input.info.type) ? true : false;
    let newAddressNotes = addressStep.input.info.type === 'INTERNAL' ? true : (userDataStep.additionalNotes !== '');
    let addressNotes = true;
    if (addressStep.selectedUserAddress !== '') {
      let selectedAddress = _.find(addressStep.userAddresses, {id: addressStep.selectedUserAddress});
      addressNotes = selectedAddress.type === 'EXTERNAL' ? (userDataStep.additionalNotes !== '') : true;
    }

    if (typeof addressStep === 'undefined' && addressStep === null) return false;
    // user is logged, check for no new address and has selected an address
    if (state.userInfo.isLogged === true && addressStep.isNewAddress === false && addressStep.selectedUserAddress !== '' && addressNotes === true) return true;
    // user is logged, adding new address: check for validity of address
    if (state.userInfo.isLogged === true && addressStep.isNewAddress === true && address === true && newAddressNotes === true) return true;
    // user is not logged, adding new address
    if (state.userInfo.isLogged === false && addressStep.isNewAddress === true && addressStep.showFullAddressInput === true && address === true && newAddressNotes === true) return true;
    return false;
  }

  function checkAddressStep(state, dispatch) {
    console.debug('CHECK ADDRESS STEP');
    let addressStep = state.steps.address;
    if (typeof addressStep === 'undefined' && addressStep === null) return false;
    var canProceed = canProceedAddressStep(state);
    if (canProceed === true && addressStep.confirmed === true) {
      return true;
    } else {
      dispatch(setError(canProceed));
      return false;
    }
    return false;
  }

  function canProceedServiceStep(serviceStep) {
    if (typeof serviceStep === 'undefined' && serviceStep === null) return false;
    if (serviceStep.selectedService === SERVICES.COLF || serviceStep.selectedService === SERVICES.COLF_BNB) {
      return checkServiceColf(serviceStep.colf);
    }
    if (serviceStep.selectedService === SERVICES.BADANTE) {
      return checkServiceBadante(serviceStep.badante);
    }
    if (serviceStep.selectedService === SERVICES.BABYSITTER) {
      return checkServiceBabySitter(serviceStep.babySitter);
    }
    if (serviceStep.selectedService === SERVICES.PERSONALTRAINER) {
      return checkServicePersonalTrainer(serviceStep.personalTrainer);
    }
    if (serviceStep.selectedService === SERVICES.FISIOTERAPISTA) {
      return checkServiceFisioterapista(serviceStep.fisioterapista);
    }
    if (serviceStep.selectedService === SERVICES.TUTTOFARE) {
      return checkServiceTuttofare(serviceStep.tuttofare);
    }
    if (serviceStep.selectedService === SERVICES.SERVIZI_ELETTRICI) {
      return checkServiceElettricista(serviceStep.elettricista);
    }
    if (serviceStep.selectedService === SERVICES.SERVIZI_IDRAULICI) {
      return checkServiceIdraulico(serviceStep.idraulico);
    }
    if (serviceStep.selectedService === SERVICES.STIRATURA) {   
      return checkServiceStiratura(serviceStep.stiratura);    
    }
    if (serviceStep.selectedService === SERVICES.CHECKIN_CHECKOUT) {   
      return checkServiceCheckinCheckout(serviceStep.checkincheckout);    
    }
    return false;
  }

  function checkServiceStep(serviceStep, dispatch) {
    if (typeof serviceStep === 'undefined' && serviceStep === null) return false;
    var canProceed = canProceedServiceStep(serviceStep);
    if (canProceed === true) {
      return true
    } else {
      dispatch(setError(canProceed));
      return false;
    }
    //return false;
  }

  function canProceedDatesStep(datesStep) {
    if (typeof datesStep === 'undefined' && datesStep === null) return false;
    if (datesStep.pickedDates.length > 0) return true;
    return false;
  }

  function checkDatesStep(datesStep, serviceStep, dispatch) {
    if (typeof datesStep === 'undefined' && datesStep === null) return false;
    let overlappingSH = false;
    let canProceed = canProceedDatesStep(datesStep);
    let checked = checkPickedDates(datesStep.confirmedDates);

    if (serviceStep.selectedService === SERVICES.TUTTOFARE ||
      serviceStep.selectedService === SERVICES.SERVIZI_IDRAULICI ||
      serviceStep.selectedService === SERVICES.SERVIZI_ELETTRICI) {
      checked = checkPickedDatesMultiSH(datesStep.confirmedDates);
    }

    if (canProceed === true &&
        checked.overlap === false &&
        checked.past === false &&
        datesStep.confirmedDates.length > 0 &&
        datesStep.confirmedDates.length === datesStep.pickedDates.length && !_.some(datesStep.suggestions, {handled: false})) return true;
    else if (canProceed !== true || checked.overlap === true || checked.past === true) {
      if (checked.overlap === true) dispatch(setError(ERRORS.PICKED_DATES_OVERLAP));
      if (checked.past === true) dispatch(setError(ERRORS.PAST_DATES));
      if (datesStep.confirmedDates.length !== datesStep.pickedDates.length) dispatch(setError(ERRORS.MUST_CONFIRM_ALL_DATES));
      dispatch(setError(canProceed));
      return false;
    }
    return false;
  }

  function requestDatesConfirmation(pickedDates, serviceStep, mode) {
    return function (dispatch, getState) {
      let bookingState = getState().booking;
      let checked = checkPickedDates(pickedDates);
      if (serviceStep.isMultipleSuperheroes) {
        checked = checkPickedDatesMultiSH(pickedDates);
      }

      dispatch(setBookingLoading());

      if ((bookingState.carnet.isCarnetOrder && !checkCarnetHoursAvailability(pickedDates, bookingState.carnet.info)) ||
          (bookingState.steps.carnet.userChooseCarnet && !checkCarnetHoursAvailability(pickedDates, bookingState.steps.carnet.info))) {
        dispatch(setError(ERRORS.CARNET_HOURS_NOT_SUFFICIENT));
        dispatch(setBookingLoaded());
      }
      else {
        if (checked.overlap === false && checked.past === false) {
          // call API
          if (mode === 'FAST_BOOKING') {
            let request = formatSuggestionRequestFromState(bookingState);
            dispatch(processFastBooking(request, null, bookingState));
          } else if (mode === 'HERO_SELECTION') {
            if (serviceStep.isMultipleSuperheroes) {
              const request = formatSuggestionRequestFromState(bookingState);
              dispatch(addNewSuperhero(pickedDates)).then((insertedDates) => {
                bookingState = getState().booking;
                const updatedRequest = formatSuggestionRequestFromState(bookingState);
                dispatch(processHeroSelection(updatedRequest, null, insertedDates));
              });
              
            }
            else {
              const request = formatSuggestionRequestFromState(bookingState);
              dispatch(processHeroSelection(request));
            }
            
          }
        } else {
          if (checked.overlap === true) dispatch(setError(ERRORS.PICKED_DATES_OVERLAP));
          if (checked.past === true) dispatch(setError(ERRORS.PAST_DATES));
          dispatch(setBookingLoaded());
        }
      }
    }
  }

  function checkCarnetHoursAvailability(pickedDates, carnetInfo) {
    let sum = 0;
    pickedDates.forEach(function (_date) {
      let time = (_date.end - _date.start) / 1000 / 60 / 60;
      sum += time;
    });
    return carnetInfo.hours.remaining >= sum;
  }

  function processFastBooking(request, cb, bookingState) {
    return (dispatch) => {
      let withHero = bookingState.heroSelection.isHeroSelectionOrder === true ? bookingState.heroSelection.heroId : null;
      RestService.getDatesSuggestionWithHero(request, withHero, bookingState.edit.id)
          .then(function (response) {
            var suggested = response.data.plain();
            var suggestions = [];
            if (suggested.length > 0) {
              var allMatch = true;
              suggested.forEach(function (_suggested) {
                if (_suggested.matchEsatto !== true) allMatch = false;
                let cleanedSuggestion = cleanSuggestion(_suggested);
                suggestions.push(cleanedSuggestion);
              });
              dispatch({type: 'SET_SUGGESTIONS_REQUESTED'});
              dispatch(setSuggestions(suggestions));
              dispatch(processSuggestions());
            } else {
              dispatch(setError(ERRORS.NO_HERO_AVAILABLE));
            }
            if (_.isFunction(cb)) cb();
          }).finally(()=> {
        dispatch(setBookingLoaded());
      });
    }
  }

  function processHeroSelection(request, cb, insertedDates) {
    return (dispatch, getState) => {
      const serviceStep = getState().booking.steps.service;
      RestService.getDatesSuggestionWithHeroes(request, getState().booking.edit.id)
          .then(response => {
            let suggested = response.data.plain();
            let heroes = [];
            if (suggested.length > 0) {
              suggested.forEach(_suggestion => {
                let cleanedSuggestion = cleanSuggestion(_suggestion);
                _suggestion.superHeroes.forEach(_hero => {
                  let heroObj = _.find(heroes, (_h) => _h.id === _hero.id && _h.appointment === cleanedSuggestion.id);
                  if (typeof heroObj === 'undefined') {
                    heroObj = {
                      id: _hero.id,
                      nome: _hero.nome,
                      cognome: _hero.cognome,
                      photoUrl: _hero.photoUrl ? _hero.photoUrl : AssetsStore.Image('user.placeholder'),
                      appointment: cleanedSuggestion.id,
                      suggestions: [],
                      hasVat: _hero.partitaIva,
                      match: _suggestion.matchEsatto === true ? true : false,
                      manual: _suggestion.gestioneManuale === true ? true : false
                    }
                    heroes.push(heroObj);
                  }
                  heroObj.suggestions.push(cleanedSuggestion);
                });
              });
              //console.debug('[PROCESS_HERO_SELECTION] Hero recieved form server, calculated suggestions and shuffled: ', _.cloneDeep(heroes));
              //heroes = _.shuffle(heroes);
              //console.debug('[PROCESS_HERO_SELECTION] Hero recieved form server, calculated suggestions and shuffled: ', _.cloneDeep(heroes));

              dispatch({type: 'SET_SUGGESTIONS_REQUESTED'});
              dispatch({type: 'SET_HERO_SUGGESTIONS_REQUESTED'});
              //dispatch(setSuggestions(suggestions));
              dispatch(setHeroesSuggestions(heroes));
              dispatch(processSuggestions());
            } else {
              dispatch(setError(ERRORS.NO_HERO_AVAILABLE));
              if (serviceStep.isMultipleSuperheroes && insertedDates) {
                _.forEach(insertedDates, date => {
                  dispatch(deletePickedDate(date.id));
                });
              }
            }
            if (_.isFunction(cb)) cb();
          }).finally(()=> {
        dispatch(setBookingLoaded());
      });
    }
  }

  let first = true;

  function canProceedUserDataStep(_state, dispatch) {
    let state = _state.booking;
    let userDataStep = state.steps.userData;
    let addressStep = state.steps.address;
    if (typeof userDataStep === 'undefined' || userDataStep === null) return false;
    // common ERRORS
    if (_state.common.type !== TYPES.CARNET && userDataStep.additionalNotes === '') return ERRORS.NO_ADDITIONAL_NOTES;
    if (state.userInfo.isLogged === true) {
      //user is logged: must select billing address and notes
      if (userDataStep.selectedBillingAddress !== '' && _state.common.type === TYPES.CARNET) return true;
      if (userDataStep.selectedBillingAddress !== '' && userDataStep.additionalNotes !== '') return true;
      if (userDataStep.selectedBillingAddress === '') return ERRORS.NO_BILLING_ADDRESS;
    } else {
      if (SERVICES.PERSONALTRAINER === state.steps.service.selectedService) {
        if (first) {
          dispatch(toggleSameBillingAddress());
          first = false;
        }
      }

      if (userDataStep.isBillingAddressSame === true &&
          userDataStep.newUserInfo.valid === true &&
          ((addressStep.input.info.citofono !== '' && addressStep.input.info.piano !== '') || (SERVICES.PERSONALTRAINER === state.steps.service.selectedService && addressStep.input.info.type === "EXTERNAL")) &&
          userDataStep.newUserInfo.email === userDataStep.newUserInfo.confirmEmail) return true;

      if (userDataStep.isBillingAddressSame === false &&
          userDataStep.newBillingAddress.valid === true &&
          userDataStep.newUserInfo.valid === true &&
          ((addressStep.input.info.citofono !== '' && addressStep.input.info.piano !== '') || (SERVICES.PERSONALTRAINER === state.steps.service.selectedService && addressStep.input.info.type === "EXTERNAL")) &&
          userDataStep.newUserInfo.email === userDataStep.newUserInfo.confirmEmail) return true;

      if (userDataStep.newUserInfo.email != userDataStep.newUserInfo.confirmEmail) return ERRORS.MAIL_DONT_MATCH;
      if (userDataStep.isBillingAddressSame === false && userDataStep.newBillingAddress.valid === false) {
        return ERRORS.BILLING_ADDRESS_INFO_MISSING;
      }
      return ERRORS.USER_INFO_MISSING;
      // user is not logged
    }
    return false;
  }

  function checkUserDataStep(_state, dispatch) {
    let bookingState = _state.booking;
    let userDataStep = bookingState.steps.userData;
    if (typeof userDataStep === 'undefined' || userDataStep === null) return false;
    var canProceed = canProceedUserDataStep(_state, dispatch);
    if (_state.common.type === TYPES.CARNET && canProceed === true && bookingState.general.privacyContract === true) {
      return true
    } else if (canProceed === true && bookingState.general.privacyContract === true && bookingState.completed.address === true && bookingState.completed.dates === true && bookingState.completed.service === true) {
      return true;
    } else {
      if (bookingState.general.privacyContract !== true) dispatch(setError(ERRORS.NO_PRIVACY_AGREEMENT));
      else dispatch(setError(canProceed));
      return false;
    }

    return false;
  }

  function updateFromServerConfirm(_response) {
    let orderId, finalPrice;
    if (typeof _response.id !== 'undefined' && _response.id !== '') {
      orderId = _response.id;
      finalPrice = 0;
    } else {
      orderId = _response.merchantReference;
      finalPrice = _response.paymentAmount / 100;
    }
    return {type: 'SERVER_CONFIRMED_ORDER', finalPrice, orderId};
  }

  function completeOrder() {
    return (dispatch, getState) => {
      dispatch(setBookingLoading());
      let state = getState().booking;
      // get booking type based on current info
      let orderType = getBookingType(state);
      dispatch({type: 'SET_ORDER_TYPE', orderType});
      // place order
      if (state.userInfo.isLogged === true) {
        checkForNewAddress(state, dispatch).then(() => {
          dispatch(placeOrderLogged());
        });
      } else {
        dispatch(placeOrderNewUser());
      }

    }
  }

  function placeOrderNewUser() {
    return (dispatch, getState) => {
      let state = getState().booking;
      let _user = createUserFromState(state);
      RestService.createNewCustomer(_user).then((data) => {
        let _newUser = data.data.plain();
        let addressId, billingAddressId;
        _newUser.indirizzi.forEach(_address => {
          if (_address.tipo === 'Residenza') addressId = _address.id;
          if (_address.tipo === 'Fatturazione') billingAddressId = _address.id;
        });
        dispatch(setUserInfo(_newUser, true));
        dispatch(userSelectedAddress(addressId, true));
        dispatch(userSelectedBillingAddress(billingAddressId));
        if (__imgUploader.queue.length > 0) {
          uploadUserPhoto(__imgUploader, _newUser.id).then(() => {
            dispatch(placeOrderLogged());
          });
        } else {
          dispatch(placeOrderLogged());
        }
      }, error => {
        if (error.status === 400 && error.data.tipo == 'Univocita') {
          dispatch(setBookingLoaded());
          LoginService.showLogin(true);
        }
      });
    }
  }

  function checkForNewAddress(state, dispatch) {
    let deferred = $q.defer();
    if (state.steps.address.isNewAddress === true && state.steps.address.confirmed === true) {
      // create new user address and select it
      let info = state.steps.address.input.info;
      let newAddress = {
        cap: info.postal_code,
        citta: info.locality,
        numeroCivico: info.street_number,
        provincia: info.administrative_area_level_2,
        latitudine: info.location.lat,
        longitudine: info.location.lng,
        tipo: "Residenza",
        via: info.route,
        piano: info.piano,
        nomeCitofono: info.citofono,
        scala: info.scala,
        googleMapsId: info.googleMapsId,
        note: JSON.stringify({type: info.type})
      }
      RestService.createCustomerAddress(state.userInfo.info.id, newAddress).then((data) => {
        let _newAddress = data.data.plain();
        dispatch(addUserAddress(_newAddress));
        dispatch(userSelectedAddress(_newAddress.id, true));
        deferred.resolve();
      }, () => {
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  function placeOrderLogged(isApp = false, appOrder, appUserId) {
    return (dispatch, getState) => {
      const state = getState().booking;
      const orderType = isApp ? appOrder.type : state.type;
      const order = isApp ? _.omit(appOrder, 'type') : createOrderFromState(state);
      const userId = isApp ? appUserId : state.userInfo.info.id;
      let placed; 
      
      switch (orderType) {
        case ORDERS.STANDARD_FAST:
          placed = RestService.createNewCustomerOrder(userId, order);
          break;

        case ORDERS.STANDARD_HERO:
          if (!state.general.genericWithPreference) {
            placed = RestService.createNewCustomerMultiHeroOrder(userId, order);
          } else {
            placed = RestService.createNewCustomerOrder(userId, order);
          }
          break;

        case ORDERS.STANDARD_CARNET:
          placed = RestService.createNewCustomerCarnetBasedOrder(userId, order);
          break;

        case ORDERS.EDIT_FAST:
        case ORDERS.EDIT_HERO:
          placed = RestService.createEditedCustomerOrder(userId, order);
          break;

        case ORDERS.EDIT_CARNET:
          placed = RestService.createEditedCustomerCarnetBasedOrder(userId, order);
          break;

        case ORDERS.CONTEXTUAL_CARNET:
          placed = RestService.createNewContextualCarnetOrder(userId, order);
          break;

        default:
          placed = RestService.createNewCustomerOrder(userId, order);
          break;
      }
      console.info('Placing order:', _.cloneDeep(order));
      placed.then(_data => {
        let _response = _data.data.plain();
        console.info('Server response for order:', _.cloneDeep(_response));

        // if price is zero from server no need to go to adyen
        let priceIsZero = false;
        if (typeof _response.paymentAmount !== 'undefined' && _response.paymentAmount === 0 || _response.paymentAmount === '0') priceIsZero = true;

        // show voucher modal
        if (typeof order.voucherId !== 'undefined' && order.voucherId !== '' && priceIsZero === true) {
          Voucher.acceptedRedeemCode().then(function () {
            dispatch(updateFromServerConfirm(_response));
            dispatch(processPlacedOrderWithoutPayment(_response));
          });
        } else if (typeof order.voucherId !== 'undefined' && order.voucherId !== '') {
          Voucher.accepted(getSumCostFromState(state), _response.paymentAmount / 100, order.voucherId).then(() => {
            dispatch(updateFromServerConfirm(_response));
            dispatch(processPlacedOrderWithPayment(_response));
          }, () => {
            dispatch(updateFromServerConfirm(_response));
            dispatch(processPlacedOrderWithPayment(_response));
          });
        } else if (state.type === ORDERS.STANDARD_CARNET || state.type === ORDERS.EDIT_CARNET || priceIsZero === true) {
          dispatch(updateFromServerConfirm(_response));
          dispatch(processPlacedOrderWithoutPayment(_response));
        } else {
          dispatch(updateFromServerConfirm(_response));
          dispatch(processPlacedOrderWithPayment(_response));
        }
      }, _data => {
        let _error = _data.data;
        dispatch(processErrorOrder(_error));
      }).finally(() => {
        dispatch(setBookingLoaded());
      });
    }
  }

  function getSumCostFromState(_state) {
    let sum = 0;
    _state.steps.dates.confirmedDates.forEach((_date) => {
      sum += _date.prezzoEuro;
    });

    if (_state.edit.isEditing === true) {
      sum += _state.carnet.isCarnetOrder === true ? PRICING.edit.carnet : PRICING.edit.standard;
    }

    return sum;
  }

  function processPlacedOrderWithPayment(_response) {
    return (dispatch, getState) => {
      const state = getState();
      saveBookingStateToSession(state);
      dispatch(redirectToPaymentPage(_response));
    }
  }

  function processPlacedOrderWithoutPayment(_response) {
    return (dispatch, getState) => {
      saveBookingStateToSession(getState());
      $timeout(()=> {
        dispatch({type: 'SET_ORDER_AUTHORISATION', authorisation: 'AUTHORISED'});
        dispatch(redirectToConfirmPage(_response));
      }, 100);
    }
  }

  function processErrorOrder(_error) {
    return (dispatch, getState) => {
      let error = null;
      if (_.includes(_error.messaggio, 'Dominio email cliente non valido')) error = ERRORS.VOUCHER_NOT_ENABLED_FOR_CURRENT_USER;
      Voucher.denied(error).then(() => {
        dispatch(userChangedVoucher(''));
        dispatch(placeOrderLogged());
      });
    }
  }

  function createOrderFromState(state) {
    let serviceSlug = BookingModel.getServiceSlug(state.steps.service.selectedService),
        startingOrderPrice = 0,
        sottoCompetenze = [],
        order = {
          appuntamenti: [],
          indirizzoFatturazione: {id: state.steps.userData.selectedBillingAddress},
        },
        jsonDettagli = {
          specifiche: [],
          note: state.steps.service[serviceSlug].notes
        };

    /// voucher id
    order.voucherId = state.general.voucher !== '' ? state.general.voucher : '';

    // carnet
    if (state.carnet.isCarnetOrder === true) order.idCarnet = state.carnet.info.id;

    // hero selection / carnet

    if (state.heroSelection.isHeroSelectionOrder === true && (!state.general.genericWithPreference || state.carnet.isCarnetOrder === true)) order.idSuperHero = state.heroSelection.heroId;

    // recall
    if (state.general.recall === true) order.recall = true;

    // ordine di modifica appuntamento
    if (state.edit.isEditing === true && _.isString(state.edit.id) && state.edit.id) order.idAppuntamentoDaModificare = state.edit.id;

    // if contextual carnet
    if (state.steps.carnet.userChooseCarnet === true) {
      order.idTipoCarnet = state.steps.carnet.info.id;
      order.idSuperHero = state.steps.dates.confirmedDates[0].hero.id;
    }

    // sottocompetenze
    if (_.isArray(state.steps.service[serviceSlug].selectedAdditionalServices)) {
      state.steps.service[serviceSlug].selectedAdditionalServices.forEach(_additional => {
        if (_.isString(_additional)) sottoCompetenze.push({id: _additional});
        let service = _.find(BookingModel.additional[state.steps.service.selectedService], {id: _additional});
        if (typeof service !== 'undefined') jsonDettagli.specifiche.push(service.label);
      });
      
      _.forEach(state.steps.service[serviceSlug].selectedAdditionalTools, additionalToolId => {
        sottoCompetenze.push({id: additionalToolId})
      });
    }

    // dettagli
    if (state.steps.service.selectedService === SERVICES.COLF || state.steps.service.selectedService === SERVICES.COLF_BNB) {
      jsonDettagli.squareMeters = state.steps.service.colf.squareMeters;
      //jsonDettagli.suggestedHours = self.active.info.suggestedHours;
    } else if (state.steps.service.selectedService === SERVICES.BABYSITTER) {
      jsonDettagli.infoBambini = state.steps.service.babySitter.childrenInfo;
      jsonDettagli.numeroBambini = state.steps.service.babySitter.childrenInfo.length;
    } else if (state.steps.service.selectedService === SERVICES.BADANTE) {
      jsonDettagli.infoPersona = state.steps.service.badante.assistedInfo;
    } else if (state.steps.service.selectedService === SERVICES.PERSONALTRAINER) {
      jsonDettagli.infoPersone = state.steps.service.personalTrainer.guestsInfo;
      jsonDettagli.numeroPersone = state.steps.service.personalTrainer.guestsInfo.length + 1;
    } else if (state.steps.service.selectedService === SERVICES.FISIOTERAPISTA) {
      // save any fisioterapista specific data into jsonDettagli here
    } else if (state.steps.service.selectedService === SERVICES.STIRATURA) {
      // save any stiratura specific data into jsonDettagli here
    } else if (state.steps.service.selectedService === SERVICES.TUTTOFARE) {
      // save any tuttofare specific data into jsonDettagli here
    }

    // date
    state.steps.dates.confirmedDates.forEach(_confirmed => {
      let tipoServizio = BookingModel.getFinalService(state.steps.service);
      if (state.carnet.isCarnetOrder === true) tipoServizio = state.carnet.info.tipoServizio;
      if (state.steps.carnet.userChooseCarnet === true) {
        tipoServizio = Carnet.byId(state.steps.carnet.info.id).service;
      }

      if (state.general.genericWithPreference && !state.carnet.isCarnetOrder) {
        if (_confirmed.hero) {
          jsonDettagli.superheroPreferito = _confirmed.hero.id;
        } else if (state.heroSelection.isHeroSelectionOrder) {
          jsonDettagli.superheroPreferito = state.heroSelection.heroId;
        }
      }

      let date = {
        id: _confirmed.id,
        tipoServizio: {id: tipoServizio},
        indirizzoPrestazione: {id: state.steps.address.selectedUserAddress},
        dataInizio: _confirmed.start,
        dataFine: _confirmed.end,
        cellulare: state.userInfo.info.cellulare,
        nome: state.userInfo.info.nome,
        cognome: state.userInfo.info.cognome,
        email: state.userInfo.info.email,
        tipoIngresso: state.steps.userData.additionalNotes,
        note: state.steps.service[serviceSlug].notes,
        jsonDettagliServizio: JSON.stringify(jsonDettagli),
        sottoCompetenze: sottoCompetenze
      }
      // se è ricorrenze aggiungere id
      if (_.isString(_confirmed.recurrenceId) && _confirmed.recurrenceId !== '') date.idRicorrenza = _confirmed.recurrenceId;

      // multi hero order
      if(!state.carnet.isCarnetOrder) {
        if (_confirmed.hero) {
          if (!state.general.genericWithPreference) {
            date.superHero = {id: _confirmed.hero.id};
          }
        } else if (state.heroSelection.isHeroSelectionOrder === true) {
          // se è ordine nominale aggiungo id supereroe
          if (!state.general.genericWithPreference) {
            date.superHero = {id: state.heroSelection.heroId};
          }
        }
      }

      // se è ordine carnet aggiungo id supereroe associato al carnet
      // if (state.carnet.isCarnetOrder === true) date.superHero = { id: state.carnet.info.idSuperHero };

      startingOrderPrice += _confirmed.prezzoEuro;
      order.appuntamenti.push(date);
    });

    return order;
  }

  function saveBookingStateToSession(state) {
    let info = JSON.stringify(state);
    let orderId = state.booking.orderInfo.id;
    locker.namespace('ilmiosupereroe').put(orderId, info);
    console.debug('[ANGULAR_LOCKER] Saving state to session:', info);
  }

  function redirectToPaymentPage(_response) {
    return () => {
      var formHtml =
          '<form method="POST" action="' + _response.redirectUrl + '">' +
          '<input type="hidden" name="merchantReference" value="' + _response.merchantReference + '">' +
          '<input type="hidden" name="paymentAmount" value="' + _response.paymentAmount + '">' +
          '<input type="hidden" name="currencyCode" value="' + _response.currencyCode + '">' +
          '<input type="hidden" name="skinCode" value="' + _response.skinCode + '">' +
          '<input type="hidden" name="merchantAccount" value="' + _response.merchantAccount + '">' +
          '<input type="hidden" name="sessionValidity" value="' + _response.sessionValidity + '">' +
          '<input type="hidden" name="shopperLocale" value="' + _response.shopperLocale + '">' +
          '<input type="hidden" name="countryCode" value="' + _response.countryCode + '">' +
          '<input type="hidden" name="shopperEmail" value="' + _response.shopperEmail + '">' +
          '<input type="hidden" name="shopperReference" value="' + _response.shopperReference + '">' +
          '<input type="hidden" name="allowedMethods" value="' + _response.allowedMethods + '">' +
          '<input type="hidden" name="blockedMethods" value="">' +
          '<input type="hidden" name="merchantSig" value="' + _response.merchantSignature + '">' +
          '<input type="hidden" name="recurringContract" value="' + _response.recurringContract + '" />' +
          '<input type="submit" value="Create payment">' +
          '</form>';
      var form = angular.element(formHtml);
      angular.element('body').append(form);
      form.submit();
    }
  }

  function redirectToConfirmPage(_response) {
    return () => {
      let orderId = _response.id ? _response.id : _response.merchantReference;
      $state.go(stateOrder[5], {merchantReference: orderId, authResult: 'AUTHORISED'});
    }
  }

  /**
   *
   *  Scelta carnet contestuale
   *
   */

  function showCarnetOptions() {
    return (dispatch, getState) => {
      let state = getState().booking;
      let heroId = state.steps.dates.confirmedDates[0].hero.id;
      let serviceId = BookingModel.getFinalService(state.steps.service);

      RestService.getHero(heroId, {public: true}).then(data => {
        let heroInfo = data.data.plain();
        let disabledCarnet = heroInfo.tipiCarnetNonAccettati;
        if (typeof disabledCarnet === 'undefined') disabledCarnet = '';
        BookingModals.chooseCarnet(serviceId, disabledCarnet, _carnet => {
          console.debug(_carnet);
          dispatch(setChoosenCarnet({
            id: _carnet.id,
            price: _carnet.priceTotal,
            hours: _carnet.hours,
            priceHour: _carnet.priceHour,
            title: _carnet.title
          }));
          // dispatch(setChoosenCarnet(_carnet.id));
        });
        console.debug('[SHOW_CARNET_OPTIONS] Opening modal');
      });
    }
  }

  function setChoosenCarnet(info) {
    return {type: 'SET_CHOSEN_CARNET', info};
  }

  /**
   *
   *   Creazione nuovo utente prenotazione guest
   *
   */

  /**
   * Crea il DTO per il nuovo utente dallo state della prenotazione
   * @param  {object} state State ottenuto da redux
   * @return {object}       DTO dell'utente
   */
  function createUserFromState(state) {
    let userDataStep = state.steps.userData;
    let userAddressInfo = state.steps.address.input.info;
    // main user info
    let _user = {
      email: userDataStep.newUserInfo.email,
      nome: userDataStep.newUserInfo.firstName,
      cognome: userDataStep.newUserInfo.lastName,
      cellulare: userDataStep.newUserInfo.mobileNumber,
      codiceFiscale: userDataStep.newUserInfo.taxCode,
      indirizzi: [],
      tipo: 'Privato',
      canale: 'WEB',
      newsLetter: state.general.newsletter
    };
    // user main address
    let _userAddress = {
      cap: userAddressInfo.postal_code,
      citta: userAddressInfo.locality,
      metratura: 50,
      nomeCitofono: userAddressInfo.citofono,
      numeroCivico: userAddressInfo.street_number,
      piano: userAddressInfo.piano,
      provincia: userAddressInfo.administrative_area_level_2,
      scala: userAddressInfo.scala,
      tipo: 'Residenza',
      via: userAddressInfo.route,
      latitudine: userAddressInfo.location.lat,
      longitudine: userAddressInfo.location.lng,
      googleMapsId: userAddressInfo.googleMapsId,
      note: JSON.stringify({type: userAddressInfo.type})
    }
    _user.indirizzi.push(_userAddress);
    // user billing address
    let _billingAddress;
    if (userDataStep.isBillingAddressSame === true) {
      _billingAddress = {
        nome: userDataStep.newBillingInfo.nome,
        cognome: userDataStep.newBillingInfo.cognome,
        codiceFiscale: userDataStep.newBillingInfo.codiceFiscale,
        cap: _userAddress.cap,
        citta: _userAddress.citta,
        numeroCivico: _userAddress.numeroCivico,
        provincia: _userAddress.provincia,
        tipo: 'Fatturazione',
        via: _userAddress.via
      }
    } else {
      _billingAddress = {
        nome: userDataStep.newBillingInfo.nome,
        cognome: userDataStep.newBillingInfo.cognome,
        codiceFiscale: userDataStep.newBillingInfo.codiceFiscale,
        cap: userDataStep.newBillingAddress.postal_code,
        citta: userDataStep.newBillingAddress.locality,
        numeroCivico: userDataStep.newBillingAddress.street_number,
        provincia: userDataStep.newBillingAddress.administrative_area_level_2,
        tipo: 'Fatturazione',
        via: userDataStep.newBillingAddress.route
      }
    }
    _user.indirizzi.push(_billingAddress);
    return _user;
  }

  function uploadUserPhoto(uploader, userId) {
    return new Promise((resolve, reject) => {
      if (typeof uploader !== 'undefined' && uploader.queue.length > 0) {
        uploader.queue.forEach((item) => {
          item.url = RestService.getCustomerPhotoUploadUrl(userId);
          item.onSuccess = () => {
            resolve();
          };
          item.upload();
        });
      } else {
        reject('Error: No image to upload!');
      }
    });
  }

  function imgFileUploader($scope) {
    if (__imgUploader === null) __imgUploader = UserForm.imgFileUploader($scope);
    console.log(__imgUploader);
    return __imgUploader;
  }

  /**
   *
   *   Avvio prenotazione.
   *
   */
  function startBookingAndSelectHero(heroInfo) {
    return (dispatch) => {
      // set filters based on services and additionalservices based on hero availability
      let disabledServices = _.map(heroInfo.competenze, competenza => Services.byCompetenza(competenza.id)),
          disabledAdditionalServices = _.map(heroInfo.sottoCompetenze, sottocomp => sottocomp.id);
      let info = {
        id: heroInfo.id,
        name: heroInfo.nome,
        photoUrl: heroInfo.photoUrl
      };
      dispatch(goNextStep(1));
      dispatch(userSelectedHeroFromSearch(info));
      dispatch(disableServicesAndAdditional(disabledServices, disabledAdditionalServices));
    }
  }

  function startBNBBookingAndSelectHero(heroInfo) {
    return (dispatch) => {
      // set filters based on services and additionalservices based on hero availability
      let disabledServices = _.map(heroInfo.competenze, competenza => Services.byCompetenza(competenza.id)),
          disabledAdditionalServices = _.map(heroInfo.sottoCompetenze, sottocomp => sottocomp.id);
      let info = {
        id: heroInfo.id,
        name: heroInfo.nome,
        photoUrl: heroInfo.photoUrl
      };
      $state.go('booking.bnbService');
      dispatch(userSelectedHeroFromSearch(info));
      dispatch(disableServicesAndAdditional(disabledServices, disabledAdditionalServices));
    }
  }

  function disableServicesAndAdditional(availServices, availAdditionalServices) {
    let disabledServices = [], disabledAdditionalServices = [];
    BookingModel.services.forEach(_service => {
      if (!_.includes(availServices, _service.id) && !_.isArray(BookingModel.subServices[_service.id])) disabledServices.push(_service.id);
    });

    _.forEach(BookingModel.subServices, (parent, parentId) => {
      let shouldDisableParent = true;
      parent.forEach(_subservice => {
        if (!_.includes(availServices, _subservice.id)) {
          disabledServices.push(_subservice.id);
        } else {
          shouldDisableParent = false;
        }
      });
      if (shouldDisableParent === true) disabledServices.push(parentId);
    });

    _.forEach(BookingModel.additional, parent => {
      parent.forEach(_additional => {
        if (_.isString(_additional.id) && !_.includes(availAdditionalServices, _additional.id)) disabledAdditionalServices.push(_additional.id);
      });
    });
    return {type: 'SET_SELECTED_HERO_FILTERS', disabledServices, disabledAdditionalServices};
  }

  function userSelectedHeroFromSearch(heroInfo) {
    return {type: 'SET_SELECTED_HERO', heroInfo};
  }

  function getCarnetParentService(serviceId) {
    let parent = null;
    _.forEach(CARNET_SERVICES, (_services, _parent) => {
      if (_.includes(_services, serviceId)) parent = _parent;
    });
    return parent;
  }

  function startBookingWithCarnet(_carnetInfo) {
    return dispatch => {
      console.log(_carnetInfo);


      // hero selection
      let heroInfo = {
        id: _carnetInfo.idSuperHero,
        name: _carnetInfo.nomeSuperHero + ' ' + _carnetInfo.cognomeSuperHero,
        photoUrl: _carnetInfo.superHeroPhotoUrl
      };
      dispatch(userSelectedHeroFromSearch(heroInfo));
      dispatch(processCarnet(_carnetInfo));
      dispatch(goNextStep(1));
    }
  }

  function processCarnet(_carnetInfo) {
    return (dispatch) => {
      // carnet info
      let carnetInfo = {
        id: _carnetInfo.id,
        userId: _carnetInfo.idCliente,
        tipo: _carnetInfo.idTipoCarnet,
        tipoServizio: _carnetInfo.idTipoServizio,
        label: _carnetInfo.prestazione,
        icon: _carnetInfo.carnetIcon,
        isPrestazione: _carnetInfo.isPrestazione,
        expireOn: _carnetInfo.scadenza,
        hours: {total: _carnetInfo.oreTotali, remaining: _carnetInfo.oreResidue}
      }
      dispatch({type: 'SET_CARNET_INFO', info: carnetInfo});

      // disabled services not affiliated with carnet and preselect carnet service
      let parentService = getCarnetParentService(_carnetInfo.idTipoServizio);
      _.forEach(SERVICES, _service => {
        if (typeof BookingModel.subServices[_service] === 'undefined' || !_.some(BookingModel.subServices[_service], {id: parentService})) {
          if (_service === parentService) {
            console.log(_carnetInfo);
            let serviceTree = getServiceTreeFromId(parentService);
            dispatch(selectService(serviceTree.service));
            if (serviceTree.subservice !== null) dispatch(selectSubService(serviceTree.service, serviceTree.subservice));
            if (_carnetInfo.sottoCompetenza && _carnetInfo.sottoCompetenza != "") {
              dispatch(selectAdditionalService(serviceTree.service, _carnetInfo.sottoCompetenza));
              _.forEach(BookingModel.additional[_service], (value) => {
                if (value.id !== _carnetInfo.sottoCompetenza) {
                  dispatch(disableAdditionalService(value.id));
                }
              });
              
            }
          } else {
            dispatch(disableService(_service));
          }
        }
      });
    }
  }

  function disableServices(services) {
    return (dispatch) => {
      _.forEach(services, s => dispatch(disableService(s)));
    }
  }

  function startBookingEditingAppointment(appointmentInfo) {
    console.log(appointmentInfo);
    return (dispatch) => {
      //let _info = mapAppointmentInfoToState(appointmentInfo);
      dispatch(goNextStep(1));
      dispatch(mapAppointmentInfoToState(appointmentInfo));
      dispatch(startBookingPreselectingService(appointmentInfo.tipoServizio.id));
    }
  }

  function startBookingPreselectingService(serviceId, subService) {
    return dispatch => {
      // get service to select
      dispatch(goNextStep(1));
      if (_.isString(serviceId) && serviceId !== '') {
        let serviceTree = getServiceTreeFromId(serviceId);
        dispatch(selectService(serviceTree.service));
        if (serviceTree.subservice !== null) dispatch(selectSubService(serviceTree.service, serviceTree.subservice));
        if (subService) dispatch(selectSubService(serviceTree.service, subService));
      }
    }
  }

  function startBookingBNBPreselectingService(serviceId, subService) {
    return dispatch => {
      // get service to select
      $state.go('booking.bnbService');
      if (_.isString(serviceId) && serviceId !== '') {
        let serviceTree = getServiceTreeFromId(serviceId);
        dispatch(selectService(serviceTree.service));
        if (serviceTree.subservice !== null) dispatch(selectSubService(serviceTree.service, serviceTree.subservice));
        if (subService) dispatch(selectSubService(serviceTree.service, subService));
      }
    }
  }

  function getServiceTreeFromId(serviceId) {
    let response = {
      service: null,
      subservice: null,
    }

    // first try to find it in subservices
    _.forEach(BookingModel.subServices, (_services, _parent) => {
      let found = _.find(_services, {id: serviceId});
      console.debug(found, _parent, serviceId);
      if (typeof found !== 'undefined') {
        response.subservice = serviceId;
        response.service = _parent;
      }
    });

    // then try to serach in parent services
    if (response.service === null) {
      let selected = _.find(SERVICES, (id, name) => {
        return id === serviceId;
      });
      if (typeof selected !== 'undefined') {
        response.service = selected;
      }
    }

    return response;
  }

  function getEditingLabelForOriginal(_info) {
    let start = moment(_info.dataInizio);
    let end = moment(_info.dataFine);
    return start.format('DD/MM/YYYY') + ' dalle ' + start.format('HH:mm') + ' alle ' + end.format('HH:mm');
  }

  function mapAppointmentInfoToState(_info) {
    return dispatch => {
      // set hero if not null
      if (_info.superHero !== null) {
        let heroInfo = {
          id: _info.superHero.id,
          name: _info.superHero.nome,
          photoUrl: _info.superHero.photoUrl
        }
        dispatch(userSelectedHeroFromSearch(heroInfo));
      }

      // set address
      let addressId = _info.indirizzoPrestazione.id;
      dispatch(userSelectedAddress(addressId, true));

      // additional services, if any
      let serviceId = _info.tipoServizio.id;
      dispatch(selectService(serviceId));
      dispatch({
        type: 'SET_EDITING_APPOINTMENT',
        id: _info.id,
        info: {start: _info.dataInizio, end: _info.dataFine, label: getEditingLabelForOriginal(_info)}
      });
      if (_info.sottoCompetenze.length > 0) {
        let additionalServices = _info.sottoCompetenze.map((_sottoCompetenza) => {
          return _sottoCompetenza.id;
        });
        dispatch(selectAdditionalService(serviceId, additionalServices));
        // TOGGLE_ADDITIONAL_SERVICE
      }

      let jsonDettagli = JSON.parse(_info.jsonDettagliServizio);
      if (serviceId === SERVICES.COLF || serviceId === SERVICES.COLF_BNB) {
        dispatch(parseAndDispatchJsonDettagliColf(jsonDettagli));
      } else if (serviceId === SERVICES.BADANTE) {
        dispatch(parseAndDispatchJsonDettagliBadante(jsonDettagli));
      } else if (serviceId === SERVICES.BABYSITTER) {
        dispatch(parseAndDispatchJsonDettagliBabysitter(jsonDettagli));
      } else if (serviceId === SERVICES.FISIOTERAPISTA) {
        dispatch(parseAndDispatchJsonDettagliFisioterapista(jsonDettagli));
      } else if (serviceId === SERVICES.PERSONALTRAINER) {
        dispatch(parseAndDispatchJsonDettagliPersonalTrainer(jsonDettagli));
      } else if (serviceId === SERVICES.STIRATURA) {
        dispatch(parseAndDispatchJsonDettagliStiratura(jsonDettagli));
      } else if (serviceId === SERVICES.TUTTOFARE) {
        dispatch(parseAndDispatchJsonDettagliTuttofare(jsonDettagli));
      }


      let date = createDateFromStartEnd(_info.dataInizio, _info.dataFine);
      dispatch({type: 'ADD_SELECTED_DATE', selectedDate: date});
      dispatch(setPickingMode(0));


      let serviceNotes = _info.note;
      if (_.isString(serviceNotes) && serviceNotes !== '') {
        dispatch(setServiceNote(serviceId, serviceNotes));
      }

      let additionalNotes = _info.tipoIngresso;
      if (_.isString(additionalNotes) && additionalNotes !== '') {
        dispatch(setBookingNotes(additionalNotes));
      }

      // carnet
      if (typeof _info.carnet !== 'undefined') {
        dispatch(processCarnet(_info.carnet));
      }

    }
  }

  function parseAndDispatchJsonDettagliColf(jsonDettagli) {
    return dispatch => {
      // additional services that are not actual services (for colf)
      let additional = [];
      if (jsonDettagli.specifiche.length > 0) {
        jsonDettagli.specifiche.forEach(_specifica => {
          var additional = _.find(BookingModel.additional[SERVICES.COLF], {label: _specifica});
          if (typeof additional !== 'undefined' && _.isNumber(additional.id)) additional.push(additional.id);
        });
      }
      if (additional.length > 0) {
        dispatch(selectAdditionalService(SERVICES.COLF, additional));
      }
      // square meters of the house
      if (jsonDettagli.squareMeters && _.isNumber(jsonDettagli.squareMeters)) {
        dispatch(colfSetSquareMeters(jsonDettagli.squareMeters));
      }
    }
  }

  function parseAndDispatchJsonDettagliBadante(jsonDettagli) {
    return dispatch => {
      // assisted person info
      let assisted = jsonDettagli.infoPersona;
      dispatch(badanteSetAssistedInfo(assisted));
    }
  }

  function parseAndDispatchJsonDettagliBabysitter(jsonDettagli) {
    return dispatch => {
      // assisted person info
      let children = jsonDettagli.infoBambini;
      children.forEach((_child, index) => {
        if (index > 0) dispatch(babySitterAddNewChild());
        dispatch(babySitterEditChild(index, _child));
      });
    }
  }

  function parseAndDispatchJsonDettagliFisioterapista(jsonDettagli) {
    return dispatch => {
      // dispatch data to store if anything is saved in jsonDettagliServizio for this service
    }
  }

  function parseAndDispatchJsonDettagliTuttofare(jsonDettagli) {
    return dispatch => {
      // dispatch data to store if anything is saved in jsonDettagliServizio for this service
    }
  }

  function parseAndDispatchJsonDettagliPersonalTrainer(jsonDettagli) {
    return dispatch => {
      // assisted person info
      let guests = jsonDettagli.infoPersone;
      guests.forEach((_guest, index) => {
        if (index > 0) dispatch(personalTrainerAddNewGuest());
        dispatch(personalTrainerEditGuest(index, _guest));
      });
    }
  }

  function parseAndDispatchJsonDettagliStiratura(jsonDettagli) {
    return dispatch => {
      // dispatch data to store if anything is saved in jsonDettagliServizio for this service
    }
  }


  /**
   *
   *   Generici
   *
   */
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  return {
    changeStepFromState,
    selectService,
    setOrderType,
    selectSubService,
    nextStep,
    setCarnetInfo,
    disableService,
    placeOrderLogged,
    enableService,
    selectAdditionalService,
    resetAdditionalServices,
    selectAdditionalTool,
    setServiceNote,
    colfSetSquareMeters,
    badanteSetAssistedInfo,
    babySitterAddNewChild,
    babySitterRemoveChild,
    babySitterEditChild,
    personalTrainerAddNewGuest,
    personalTrainerRemoveGuest,
    personalTrainerEditGuest,
    setBookingAddress,
    setUserInputAddress,
    proceedBooking,
    canProceedBooking,
    setStartingPickedDates,
    setNewTimeDatePickers,
    setPickingMode,
    confirmTimeRangeSelection,
    deletePickedDate,
    deleteConfirmedDate,
    createRecurrenceFromDate,
    userPickedSuggestion,
    userChangedDate,
    setUserInfo,
    preloadAppointmentInfos,
    userSelectedBillingAddress,
    setBookingNotes,
    userInfoChanged,
    setUserInfoValid,
    userSelectedAddress,
    addNewAddress,
    startBookingAndSelectHero,
    startBNBBookingAndSelectHero,
    startBookingEditingAppointment,
    startBookingWithCarnet,
    startBookingPreselectingService,
    togglePrivacyContract,
    toggleNewsletter,
    userChangedVoucher,
    setBookingState,
    imgFileUploader,
    showCarnetOptions,
    toggleSameBillingAddress,
    billingAddressChanged,
    billingInfoChanged,
    setBillingAddressValid,
    resetState,
    addNewBillingAddress,
    setConfirmedBookingAddress,
    canProceedUserDataStep,
    checkUserDataStep,
    createUserFromState,
    updateFromServerConfirm,
    processErrorOrder,
    processPlacedOrderWithPayment,
    processPlacedOrderWithoutPayment,
    canBookMultipleSuperheroes,
    addNewSuperhero,
    setMultipleSuperheroes,
    getCarnetParentService,
    toogleGenericWithPreference,
    disableServices,
    startBookingBNBPreselectingService,
  }
}
