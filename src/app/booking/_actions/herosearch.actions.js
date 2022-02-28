/* globals RestService: true, SERVICES: true, ERRORS: true */
'use strict';

import ERRORS from '../booking.config';
//import { CARNET_SERVICES } from '../booking.config';

export default function HerosearchActionsFactory (
    $state, ERRORS, RestService, AssetsStore
) {
    "ngInject";

    function resetSearch (skipRedirect) {
        return (dispatch, getState) => {
            if (skipRedirect !== true) {
                let state = getState().common.router;
                redirectToHeroSearchPageIfNecessary(state);
            }
            dispatch({ type: 'RESET_SEARCH' });
        }
    }

    function toggleAdvanced () {
        return { type: 'TOGGLE_ADVANCED' }
    }

    function setNewFilters (newFilters) {
        return { type: 'SET_FILTERS', newFilters }
    }

    function setError (error) {
        return { type: 'SET_ERROR', error };
    }

    function setResults (results) {
        return { type: 'SET_RESULTS', results };
    }

    function disabledServiceSelection () {
        return { type: 'DISABLE_SERVICE_SELECTION' };
    }

    function editSearch () {
        return (dispatch, getState) => {
            let state = getState().common.router;
            redirectToHeroSearchPageIfNecessary(state);
            dispatch(setResults([]));
            dispatch({ type: 'SET_PERFORMED_SEARCH', perfomed: false });
        }
    }

    function redirectToHeroSearchPageIfNecessary (route) {
        if (route === 'booking.heroprofile') $state.go('booking.herosearch');
    }

    function performSearch () {
        return (dispatch, getState) => {
            let filters = getState().herosearch.filters;
            let checked = checkFilters(filters);
            console.log(filters);
            if (checked === true) {
                dispatch(setError(''));
                let formattedFilters = formatFilters(filters);
                RestService.searchSuperheroes(formattedFilters).then(_results => {
                    let results = _.shuffle(_results.data.plain());
                    dispatch({ type: 'SET_PERFORMED_SEARCH' });
                    dispatch(setResults(cleanHeroes(results)));
                    console.log(results);
                    if (results.length === 0) dispatch(setError(ERRORS.NO_RESULTS));
                });
            } else {
                dispatch(setError(checked));
            }
        }
    }

    function checkFilters (filters) {
        let postalCodeReg = /^\d+$/;
        if (filters.postalCode.length < 5 || typeof filters.postalCode === 'undefined' || !postalCodeReg.test(filters.postalCode)) return ERRORS.NO_CAP;
        if (filters.service === '') return ERRORS.NO_SERVICE;
        return true;
    }

    function formatFilters (filters) {
        let formatted = {
            idCompetenza: filters.service,
            cap: filters.postalCode,
            disponibilitaWeekEnd: filters.misc.disponibilitaWeekend,
            disponibilitaNotturna: filters.misc.disponibilitaNotturna,
            amanteAnimali: filters.misc.amanteAnimali,
            idSottoCompetenze: [],
            conoscenzaItaliano: filters.languages.italian,
            idCarnet: filters.idCarnet,
            idLingue: []
        }
        if (filters.languages.english !== '') formatted.idLingue.push(filters.languages.english);
        if (filters.languages.french !== '') formatted.idLingue.push(filters.languages.french);

        if (filters.additional.length > 0) {
            filters.additional.forEach(_additional => {
                formatted.idSottoCompetenze.push(_additional);
            });
        }

        let finalFormated = _(formatted)
            .omitBy(_.isUndefined)
            .omitBy(_.isNull)
            .omitBy((attr) => { return _.isEmpty(attr) && !_.isBoolean(attr) })
            .omitBy((attr) => { return attr === false })
            .value();

        return finalFormated;
    }

    function cleanHeroes (heroes) {
        let cleaned = [];
        heroes.forEach(hero => {
            if (typeof hero.photoUrl === 'undefined' || hero.photoUrl === null || hero.photoUrl === '') {
                hero.photoUrl = AssetsStore.Image('user.placeholder');
            }
            cleaned.push(hero);
        });
        return cleaned;
    }

    function showHeroProfile (heroId, isBnb) {
        return dispatch => {
            if (isBnb) {
                $state.go('booking.bnbHeroprofile', { idHero: heroId });
            } else {
                $state.go('booking.heroprofile', { idHero: heroId });
            }
        }
    }

    return {
        editSearch,
        resetSearch,
        toggleAdvanced,
        setNewFilters,
        performSearch,
        disabledServiceSelection,
        showHeroProfile
    }
}
