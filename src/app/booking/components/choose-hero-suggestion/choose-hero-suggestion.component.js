'use strict';

export const ChooseHeroSuggestion = {
    bindings: {
        date: '=',
        suggestions: '=',
        heroesSuggested: '=',
        onChangeDate: '&',
        onChooseSuggestion: '&',
        onDeleteSuggestion: '&'
    },
    controller: function(User, RestService, AssetsStore) {
        "ngInject";
        var ctrl = this;
        ctrl.showMoreOptions = false;
        ctrl.limit = 6;
        ctrl.iconVat = AssetsStore.Icon('noVat.document');
        this.onClickHero = (heroId) => {
            User.showHeroProfile({ id: heroId }, () => {  });
        }
        this.suggestionsMoreThanLimit = () => {
            let moreThanLimit = false;
            this.heroesSuggested.forEach(hero => {
                if (hero.suggestions.length > this.limit) moreThanLimit = true;
            });
            return moreThanLimit;
        }
    },
    controllerAs: 'ChooseHeroSuggestion',
    templateUrl: 'app/booking/components/choose-hero-suggestion/choose-hero-suggestion.component.html'
}
