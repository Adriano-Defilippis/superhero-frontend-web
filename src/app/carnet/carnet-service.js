'use strict';

export default function CarnetService (
        AssetsStore, RestService
    ) {
        "ngInject";

        let self = this;
        this.newList = [];
        this.empty = [];

        self.loadData = function(carnetTypeResponse) {
            this.newList = [];
            let types = carnetTypeResponse.data.plain();
            types.forEach(carnet => {
                self.newList.push(formatCarnet(carnet));
            });
        }

        function formatCarnet (_carnet) {
            let carnetSubCompetenceId = null;
            if (_carnet.sottoCompetenza) {
                carnetSubCompetenceId = _carnet.sottoCompetenza.id;
            }

            let hoursLabelTail = " ore";
            if (_carnet.tipo.indexOf("sed") > -1) {
                hoursLabelTail = " prestazioni";
            }

            let carnet = {
                id: _carnet.id,
                parent: 'TS-0000-0000-0000-' + _.last(_.split(_carnet.tipoServizio.id, '-')),
                service: _carnet.tipoServizio.id,
                subCompetence: carnetSubCompetenceId,
                title : "Carnet " + _carnet.tipo,
                priceHour : _carnet.tipoServizio.costoUnitario,
                hours : _carnet.totaleOre,
                hoursLabel : _carnet.totaleOre + hoursLabelTail,
                validity: _carnet.mesiValidita + " mesi",
                expireIn: _carnet.mesiValidita,
                priceTotal : _carnet.costo,
                state: _carnet.stato,
                //priceDiscount: 552,
                //discountLabel: '2 ore in omaggio',
                icon: AssetsStore.Icon('badge.carnet' + getCarnetIcon(_carnet.tipo, _.includes(_carnet.id, 'WF'))),
                type: _carnet.tipo,
                prestazione: _carnet.tipoServizio.prestazione,
                competenza: _carnet.tipoServizio.competenza.id,
                giftCard: _.includes(_carnet.id, 'WF') ? true : false,
                prestazioneLabel: _carnet.tipoServizio.competenza.descrizione,
                isHidden: _carnet.nascosto
            }

            return carnet;
        }

        function getCarnetIcon (carnetType, isGiftCard = false) {
            if (isGiftCard === true) return 'GiftCard';
            if (carnetType === 'Estivo') return 'Estivo';
            if (carnetType === '5sed') return 'Small';
            if (carnetType === '10sed') return 'Medium';
            return carnetType;
        }

        this.getCarnetIcon = getCarnetIcon;

        this.byService = function (_service) {
            if (this.newList.length === 0) return this.empty;
            let _carnet = _.find(this.newList, carnet => carnet.service === _service);
            if (typeof _carnet !== 'undefined') return _carnet;
            else this.empty;
        }

        this.byParentAndSubcompetence = function (parent, _subcompetence) {
            if (this.newList.length === 0) return this.empty;
            let _carnet = _.filter(this.newList, c => { 
                if (_subcompetence) {
                    return c.parent === parent && !c.giftCard && c.subCompetence === _subcompetence
                }
                else {
                    return c.parent === parent && !c.giftCard
                }
            });
            if (typeof _carnet !== 'undefined') return _carnet;
            else this.empty;
        }

        this.byParent = function (parent) {
            if (this.newList.length === 0) return this.empty;
            var _carnet = _.filter(this.newList, c => { return c.parent === parent && !c.giftCard });
            if (typeof _carnet !== 'undefined') return _carnet;
            else this.empty;
        }

        // get carnet by id
        this.byId = function (id)
        {
            var carnet = _.find(this.newList, function (c) {
                return c.id == id;
            });

                if (carnet) return carnet;
                else return {}
        }

        this.getGiftCardCarnets = function()
        {
            if (this.newList.length === 0) return this.empty;
            var giftCardCarnet = _.filter(this.newList, function (c) {
                return c.giftCard === true;
            });
            if (typeof giftCardCarnet !== 'undefined') return giftCardCarnet;
            else return this.empty;
        }
}
