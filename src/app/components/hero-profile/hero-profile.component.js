'use strict';

export const HeroProfile = {
    bindings: {
        info: '=',
        feedbacks: '=',
        isSelectable: '=',
        disableActions: '=',
        initTab: '@',

        onHeroSelection: '&',
        onClickStartBooking: '&',
        onClickBuyCarnet: '&'
    },
    controller: function(GeoUtils, AssetsStore) {
        "ngInject";

        var ctrl = this;
        const hero = ctrl.info;

        const attributiInformativi = JSON.parse(hero.jsonAttributiInformativi);
        const esperienze = hero.competenze.map(comp => {
            return {
                title: comp.descrizione + ' ('+ attributiInformativi.anniEsperienza[comp.nome] +' anni)',
                content: attributiInformativi.referenze[comp.nome]
            }
        });

        const lines = [
            { title: 'Nazionalità', content: GeoUtils.getCountryByCode(hero.cittadinanza) },
            { title: 'Età', content: calculateAge(hero.dataNascita) },
            { title: 'Formazione', content: hero.titoloStudio },
            { title: 'Esperienze Pregresse', content: '', sublines: esperienze },
            { title: 'Conoscenza italiano', content: hero.conoscenzaItaliano },
            { title: 'Conoscenza altre lingue', content: hero.lingue.map(lingua => lingua.descrizione).join(', ') },
            { title: 'Amante degli animali', content: hero.amanteAnimali ? 'Si' : 'No' },
            { title: 'Disponibile a lavorare di notte', content: hero.disponibilitaNotturna ? 'Si' : 'No' },
            { title: 'Disponibile a lavorare nel weekend', content: hero.disponibilitaWeekEnd ? 'Si' : 'No' },
            // { title: 'Carnet non accettati', content: hero.tipiCarnetNonAccettati }
        ]

        const feedbacks = ctrl.feedbacks.map(feed => {
            return {
                author: feed.nomeCliente + ' ' + feed.cognomeCliente.charAt(0)+'.',
                rating: feed.punteggioSintesi,
                date: moment(feed.dataCreazione).format('DD[<br><span>]MMM[</span>]'),
                content: feed.descrizione,
            }
        });

        ctrl.hero = {
            profilePic: hero.photoUrl ? hero.photoUrl : AssetsStore.Image('user.placeholder'),
            name: hero.nome,
            description: hero.descrizione,
            lines: lines,
            feedbacks: feedbacks
        }
    },
    controllerAs: 'Profile',
    templateUrl: 'app/components/hero-profile/hero-profile.component.html'
}

function calculateAge(birthday) { // birthday is a date
    var bday = new Date(birthday);
    var ageDifMs = Date.now() - bday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
