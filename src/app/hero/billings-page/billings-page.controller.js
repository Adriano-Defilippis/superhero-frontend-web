'use strict';

export default function HeroBillingsPageController (
    billings, $stateParams, Services
) {
    'ngInject';

	var self = this;

    let activeState = $stateParams.stato;
    if (!$stateParams.stato) activeState = 'Attive';

    self.billings = formatBillings(billings.data.plain());
    self.filterBillings = filterBillings;
    self.activeState = activeState;

    if ($stateParams.id) {
        self.buttonsActive = [
            {
                isActive: activeState == 'Attive',
                state: '.',
                params: { id: $stateParams.id, stato: 'Attive' },
                label: 'Attive',
                counter: filterBillings('Attive').length
            },
            {
                isActive: activeState == 'Passive',
                state: '.',
                params: { id: $stateParams.id, stato: 'Passive' },
                label: 'Passive',
                counter: filterBillings('Passive').length
            }
        ]
    }
    else {
        self.buttonsActive = [
            {
                isActive: activeState == 'Attive',
                state: 'main.hero.billings',
                params: { stato: 'Attive' },
                label: 'Attive',
                counter: filterBillings('Attive').length
            },
            {
                isActive: activeState == 'Passive',
                state: 'main.hero.billings',
                params: { stato: 'Passive' },
                label: 'Passive',
                counter: filterBillings('Passive').length
            }
        ]
    }

    

    function formatBillings (_billings) {
        var billings = [];
        _billings.forEach(function(_billing){
            if (_billing && _billing.vociInFattura && _billing.vociInFattura.length > 0) {
                const importo = _.reduce(_billing.vociInFattura, (prev, curr) => { 
                    prev.costoFinaleScontato = prev.costoFinaleScontato + curr.costoFinaleScontato; 
                    return prev;
                }, 
                { costoFinaleScontato: 0 }
                ).costoFinaleScontato;
                var orario = moment(_billing.vociInFattura[0].data).format('HH:mm') + ' -> ' + moment(_billing.vociInFattura[0].data).add(_billing.vociInFattura[0].durataMinuti, 'minutes').format('HH:mm');
                var billing = {
                    codice: _billing.codiceFatturaCompleto,
                    codiceFatt:  _billing.id.substr(_billing.id.length - 6),
                    codiceApp: _billing.vociInFattura[0].idAppuntamento.substr(_billing.vociInFattura[0].idAppuntamento.length - 6),
                    data: moment(_billing.dataFattura).format('DD/MM/YY'),
                    _data: _billing.dataFattura,
                    dataOperazione: moment(_billing.dataOperazione).format('DD/MM/YY'),
                    _dataOperazione: _billing.dataOperazione,
                    tipoOperazione: getTipoOperazione(_billing.tipologiaOperazione, _billing.tipoFattura),
                    dataAppuntamento: moment(_billing.vociInFattura[0].data).format('DD/MM/YY'),
                    _dataAppuntamento: _billing.vociInFattura[0].data,
                    descrizione: _billing.vociInFattura[0].descrizione,
                    durata: _billing.vociInFattura[0].durataMinuti,
                    orario: orario,
                    servizio: Services.Label(_billing.idTipoServizio),
                    idFattura: _billing.id,
                    idAppuntamento: _billing.vociInFattura[0].idAppuntamento,
                    importo: importo,
                    tipoFattura: _billing.tipoFattura,
                    destinatario: _billing.destinatario.nomeCompleto || _billing.destinatario.ragioneSociale
                }
                billings.push(billing);
            }
        });
        return billings;
    }

    function getTipoOperazione(tipo, tipoFattura){
        let suffix = '';
        if (tipoFattura === 'Voucher') suffix = ' (compenso voucher)';
        if(tipo === 'Appuntamenti' || tipo === 'ModificaAppuntamento' || tipo === 'ModificaAmministrativaAppuntamento') return 'prenotazione semplice' + suffix;
        if(tipo === 'AppuntamentiCarnet' || tipo === 'ModificaAppuntamentoCarnet' || tipo === 'ModificaAmministrativaAppuntamentoCarnet') return 'prenotazione su base carnet' + suffix;
        if(tipo === 'AppuntamentiNominale' || tipo === 'ModificaAppuntamentoNominale' || tipo === 'ModificaAmministrativaAppuntamentoNominale' || tipo === 'NominaleMultiplo') return 'prenotazione nominale' + suffix;
        if(tipo === 'CancellatoPostModifica') return 'commissioni di modifica';
        if(tipo === 'Cancellato') return 'commissioni di cancellazione';
        return _.lowerCase(tipo) + suffix;
    }

    function filterBillings(type = null) {
        if (type === null) type = activeState;
        if (type === 'Passive') return self.billings.filter(billing => {
            return billing ? billing.tipoFattura === 'Piattaforma' : false;
        });
        if (type === 'Attive') return self.billings.filter(billing => billing ? billing.tipoFattura !== 'Piattaforma' : false);
    }

}
