'use strict';

export const PrivacyContract = {
    bindings: {
        newsletter: '=',
        showNewsletter: '=',
        privacyContract: '=',
        onToggleNewsletter: '&',
        onTogglePrivacyContract: '&'
    },
    controller: function(AssetsStore) {
        "ngInject";
        this.contracts = {
            fornitura: AssetsStore.PDF('cliente.condizioniFornitura'),
            utilizzo: AssetsStore.PDF('cliente.condizioniUtilizzo'),
            privacy: AssetsStore.PDF('cliente.informazioniPrivacy'),
        }
    },
    controllerAs: 'PrivacyContract',
    templateUrl: 'app/booking/components/privacy-contract/privacy-contract.component.html'
}

export default PrivacyContract;
