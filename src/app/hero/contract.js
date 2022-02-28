'use strict';

import { SERVICE_CATEGORIES } from '../booking/booking.config';

export default function ContractController (
    $scope, $rootScope, $state, $timeout, accountInfo, RestService, AssetsStore, LoginService, heroInfo
){
    "ngInject";

    var self = this;

    if(!$rootScope.logged){
        $timeout(function(){
          LoginService.showLogin();
        }, 100);
      }

    self.showOnlyContract = heroInfo.data.mostraCondizioniServizio;

    self.heroInfo = heroInfo.data.plain();
    let contracts = [];
    const contractsInfo = {
        CAT1: {
            slug: 'tariffarioServiziCasa',
            name: 'Allegato - Tariffario e Corrispettivi Colf, Badante, BabySitter e Stiratura',
            updateText: 'Aggiornamento delle “Condizioni generali di utilizzo del servizio - fornitore” a seguito dell’inserimento del paragrafo 5 relativo alla nuova copertura assicurativa sui danni alle cose.'
        },
        CAT2: {
            slug: 'tariffarioServiziPersonalTrainer',
            name: 'Allegato - Tariffario e Corrispettivi Personal Trainer',
            updateText: ' Aggiornamento delle “Condizioni generali di utilizzo del servizio - fornitore” a seguito dell’inserimento del paragrafo 5 relativo alla nuova copertura assicurativa sui danni alle cose.'
        },
        CAT3: {
            slug: 'tariffarioServiziFisioterapista',
            name: 'Allegato - Tariffario e Corrispettivi Fisioterapista',
            updateText: ' Aggiornamento delle “Condizioni generali di utilizzo del servizio - fornitore” a seguito dell’inserimento del paragrafo 5 relativo alla nuova copertura assicurativa sui danni alle cose.'
        },
        CAT4: {
            slug: 'tariffarioServiziTuttofare',
            name: 'Allegato - Tariffario e Corrispettivi Tuttofare',
            updateText: ' Aggiornamento delle “Condizioni generali di utilizzo del servizio - fornitore” a seguito dell’inserimento del paragrafo 5 relativo alla nuova copertura assicurativa sui danni alle cose.'
        },
        CAT5: {
            slug: 'tariffarioServiziColfCheckinBNB',
            name: 'Allegato - Tariffario e Corrispettivi Colf, Check-in BNB',
            updateText: ' Aggiornamento delle “Condizioni generali di utilizzo del servizio - fornitore” a seguito dell’inserimento del paragrafo 5 relativo alla nuova copertura assicurativa sui danni alle cose.'
        },
    }
    self.heroInfo.competenze.forEach(competenza => {
        SERVICE_CATEGORIES.forEach(category => {
            if (_.includes(category.included, competenza.id)) {
                contracts.push(category.id);
            }
        });
    });

    contracts = _.uniq(contracts);
    self.contractsPricing = contracts.map(_contract => {
        let contract = contractsInfo[_contract];
        if (contract) {
            return { link: AssetsStore.PDF('collaboratore.'+contract.slug), name: contract.name  }
        ;}
    });

    self.updatedAgreementTexts = contracts.map(_contract => {
        let contract = contractsInfo[_contract];
        if (contract) {
            return contract.updateText; 
        }
    });

    console.debug(contracts, self.contracts);

    self.IBAN = '';
    self.condizioniUtilizzo = false;
    self.presaVisione = false;
    self.IBANisValid = true;
    
    if (self.showOnlyContract) {
        self.IBANisValid = true;
    }

    self.contracts = {
      condizioniUtilizzo: AssetsStore.PDF('collaboratore.condizioniGenerali'),
      allegatoA: AssetsStore.PDF('eroe.tariffarioCorrispettivi'),
      informazioniPrivacy: AssetsStore.PDF('collaboratore.informazioniPrivacy'),
    }

    $timeout(function(){
      
    });

    self.disableButton = function(){
      if(self.presaVisione && self.condizioniUtilizzo && self.IBANisValid) return false;
      else return true;
    }

    self.next = function(){
      if(!self.disableButton()){
        let updated = undefined;
        if (self.heroInfo.mostraCondizioniServizio) {
            updated = RestService.updateAgreement(accountInfo.data.plain().id);
        }
        else {
            updated = RestService.updateUserIban(accountInfo.data.plain().id, self.IBAN.replace(/\s+/g, ''));
        }
        updated.then(function(){
          $state.go('main.hero.index');
        }, function(){

        });
      }
    }

    function setIbanValid(valid){
      $timeout(function(){
        self.IBANisValid = valid;
      });
    }

  }
