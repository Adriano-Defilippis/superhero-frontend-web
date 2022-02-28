'use strict';

export default function UserBillingsPageController (
    billings, Services
) {
    'ngInject';

	var self = this;
    self.billings = formatBillings(billings.data.plain());

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
                var orario = _billing.tipoFattura !== 'Carnet' ? moment(_billing.vociInFattura[0].data).format('HH:mm') + ' -> ' + moment(_billing.vociInFattura[0].data).add(_billing.vociInFattura[0].durataMinuti, 'minutes').format('HH:mm') : '';
                var billing = {
                    codice: _billing.vociInFattura[0].idAppuntamento.substr(_billing.vociInFattura[0].idAppuntamento.length - 6),
                    data: moment(_billing.dataFattura).format('DD/MM/YY'),
                    _data: _billing.dataFattura,
                    dataOperazione: moment(_billing.dataOperazione).format('DD/MM/YY'),
                    _dataOperazione: _billing.dataOperazione,
                    tipoOperazione: getTipoOperazione(_billing.tipologiaOperazione),
                    dataAppuntamento: moment(_billing.vociInFattura[0].data).format('DD/MM/YY'),
                    _dataAppuntamento: _billing.vociInFattura[0].data,
                    descrizione: _billing.vociInFattura[0].descrizione,
                    durata: _billing.vociInFattura[0].durataMinuti,
                    orario: orario,
                    servizio: Services.Label(_billing.idTipoServizio),
                    idFattura: _billing.id,
                    idAppuntamento: _billing.vociInFattura[0].idAppuntamento,
                    importo: importo,
                    intestatario: _billing.intestatario.nomeCompleto
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

}
