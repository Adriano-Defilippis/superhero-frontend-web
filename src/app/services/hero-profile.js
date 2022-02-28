/*global $:false, angular:false, console:false, _:false */
'use strict';
export default function HeroProfileService (
    $timeout, $log, ngDialog, AssetsStore, Services, BookingModel, RestService, GeoUtils, BookingActions, $ngRedux, $q, $state, SERVICES
) {
    "ngInject";

    var self = this;

    self.isBnb = _.includes($state.current.url, 'BNB');

    self.startNewBooking = function(heroInfo){
        if (self.isBnb) {
            $ngRedux.dispatch(BookingActions.startBNBBookingAndSelectHero(heroInfo));
        } else {
            $ngRedux.dispatch(BookingActions.startBookingAndSelectHero(heroInfo));
        }
    }

    self.startCarnetBooking = function(heroInfo){
        // calculate enabled carnet based on hero services
        let allowed = [];
        //const preselectedService = Services.byCompetenza($ngRedux.getState().herosearch.filters.service);
        let competencesId = _.map(BookingModel.services, (value) => value.id);
        heroInfo.competenze.forEach(comp => { allowed.push(Services.byCompetenza(comp.id)) });
        if (self.isBnb) {
            var bnbServices = [SERVICES.TUTTOFARE, SERVICES.SERVIZI_ELETTRICI, SERVICES.SERVIZI_IDRAULICI, SERVICES.CHECKIN_CHECKOUT, SERVICES.COLF_BNB];
            const disabledServices = _.without(allowed, ...bnbServices);
            allowed = _.without(allowed, ...disabledServices);
        } else {
            const disabledServices = [SERVICES.CHECKIN_CHECKOUT, SERVICES.COLF_BNB];
            allowed = _.without(allowed, ...disabledServices);
        }
        const disabled = _.difference(competencesId, allowed);
        let disabledCarnet = heroInfo.tipiCarnetNonAccettati;
        if (typeof disabledCarnet === 'undefined') disabledCarnet = '';
        // open modal
        ngDialog.closeAll(); // close any open modal
        ngDialog.open({
            template: `
            <div style="margin-bottom: 70px;">
                <carnet-choice
                    enabled-services="ctrl.allowedServices"
                    show-discount="false"
                    disabled="ctrl.disabled"
                    preselect="null"
                    discount-tips="false"
                    disabled-carnet="ctrl.disabledCarnet"
                    hero-info="ctrl.heroInfo">
                </carnet-choice>
            </div>
            `,
            plain: true,
            controller: function () {
                this.allowedServices = allowed;
                this.heroInfo = heroInfo;
                this.disabled = disabled;
                //this.preselectedService = preselectedService;
                this.disabledCarnet = disabledCarnet;
            },
            controllerAs: 'ctrl'
        });
    }

    self.patchLegacyData = function (_heroInfo) {
        let heroInfo = _.clone(_heroInfo);
        const attributiInformativi = _heroInfo.jsonAttributiInformativi ? JSON.parse(_heroInfo.jsonAttributiInformativi) : {
            anniEsperienza: { Colf: '', Badante: '', BabySitter: '' },
            referenze: { Colf: '', Badante: '', BabySitter: '' }
        };
        if (!_.isString(attributiInformativi.anniEsperienza.Colf)) attributiInformativi.anniEsperienza.Colf = '';
        if (!_.isString(attributiInformativi.anniEsperienza.Badante)) attributiInformativi.anniEsperienza.Badante = '';
        if (!_.isString(attributiInformativi.anniEsperienza.BabySitter)) attributiInformativi.anniEsperienza.BabySitter = '';
        // anni esperienza
        if (heroInfo.anniEsperienzaColf !== '' && attributiInformativi.anniEsperienza.Colf === '') attributiInformativi.anniEsperienza.Colf = heroInfo.anniEsperienzaColf;
        if (heroInfo.anniEsperienzaBadante !== '' && attributiInformativi.anniEsperienza.Badante === '') attributiInformativi.anniEsperienza.Badante = heroInfo.anniEsperienzaBadante;
        if (heroInfo.anniEsperienzaBabySitter !== '' && attributiInformativi.anniEsperienza.BabySitter === '') attributiInformativi.anniEsperienza.BabySitter = heroInfo.anniEsperienzaBabySitter;
        // referenze
        if (heroInfo.referenzeColf !== '' && attributiInformativi.referenze.Colf === '') attributiInformativi.referenze.Colf = heroInfo.referenzeColf;
        if (heroInfo.referenzeBadante !== '' && attributiInformativi.referenze.Badante === '') attributiInformativi.referenze.Badante = heroInfo.referenzeBadante;
        if (heroInfo.referenzeBabySitter !== '' && attributiInformativi.referenze.BabySitter === '') attributiInformativi.referenze.BabySitter = heroInfo.referenzeBabySitter;
        heroInfo.jsonAttributiInformativi = JSON.stringify(attributiInformativi);
        return heroInfo;
    }

    self.getHeroExperiences = function (heroData) {
        if (typeof heroData === 'undefined' || typeof heroData.competenze === 'undefined') return '';
        let experiences = [];
        const attributiInformativi = heroData.jsonAttributiInformativi ? JSON.parse(heroData.jsonAttributiInformativi) : {
          anniEsperienza: { Colf: '', Badante: '', BabySitter: '' },
          referenze: { Colf: '', Badante: '', BabySitter: '' }
        };
        heroData.competenze.forEach(_comp => {
            experiences.push({
                label: _comp.descrizione,
                years: attributiInformativi.anniEsperienza[_comp.nome],
                references: attributiInformativi.referenze[_comp.nome]
            });
        });
        return experiences;
    }
}
