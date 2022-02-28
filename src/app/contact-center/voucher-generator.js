'use strict';

export default function ContactCenterVoucherGeneratorController (
    $scope, AssetsStore, RestService, Services, FileSaver, NotifyService, Carnet
) {
    "ngInject";
    var self = this;

    self.tipiVoucher = [
    	{
    		id: 'convenzione',
    		name: 'Convenzione'
    	},
    	{
    		id: 'promozione',
    		name: 'Promozione'
    	},
        {
            id: 'unaTantum',
            name: 'Una Tantum'
        },
        {
            id: 'exactMatch',
            name: 'Match Esatto'
        },
    ];

    self.tipiSconto = [
    	{
    		id: 'percentuale',
    		name: 'Percentuale'
    	},
    	{
    		id: 'orario',
    		name: 'Orario'
    	}
    ];

    self.tipiServizio = _.map(Services.allCompetences(), competence => {
        return {
            id: competence.relatedService,
            name: competence.label
        };
    });

    self.voucherData = {
    };

    self.createVouchers = function(valid) {
        const formattedData = formatVoucherData(self.voucherData);
    	RestService.createVouchers(formattedData).then( response =>
            {
                var file = new Blob([response.data], { type: 'text/csv' });
                FileSaver.saveAs(file, 'generated_vouchers.csv');
            }
        )
        .catch(reason => {
            if (reason.status === 400) {
                if (reason.data && reason.data.dettaglioErrori) {
                    NotifyService.modal({ title: "Errore", content: reason.data.dettaglioErrori[0].campo + ' ' + reason.data.dettaglioErrori[0].messaggio});
                }
            }
        });
    }

    self.carnetTypes = _.filter(Carnet.byParent(self.voucherData.service), (_carnet) => (!_carnet.isHidden || _.startsWith(_carnet.id, 'TC-0000-0001')));

    self.reset = function() {
        self.voucherData = {}
    }

    self.serviceSelected = function() {
        self.carnetTypes = _.filter(Carnet.byParent(self.voucherData.service), (_carnet) => (!_carnet.isHidden || _.startsWith(_carnet.id, 'TC-0000-0001')));
    };

    function formatVoucherData(dirtyData) {
        const cleanedData = {};
        const services = [];

        if (!dirtyData.carnetOnly) {
            services.push(dirtyData.service);
        }

        _.forEach(_.keys(dirtyData), ts => {
            const index = _.findIndex(self.carnetTypes, carnet => carnet.service === ts);
            if (index > -1 && dirtyData[ts]) {
                services.push(ts);
            }
        });

        const discountType = {
            promozione: 'orario',
            unaTantum: 'orario',
            exactMatch: 'orario',
            convenzione: 'percentuale'
        }

        cleanedData['num'] = dirtyData.quantity;
        cleanedData['canale'] = dirtyData.channel;
        cleanedData['tipoVoucher'] = dirtyData.voucherType;
        cleanedData['tipoSconto'] = discountType[dirtyData.voucherType];
        cleanedData['dataInizio'] = dirtyData.fromDate;
        cleanedData['dataFine'] = dirtyData.toDate;
        cleanedData['idsTipoServizio'] = services;
        cleanedData['oreSconto'] = discountType[dirtyData.voucherType] == 'orario' ? dirtyData.discountHours: 0;
        cleanedData['scontoPercentuale'] = discountType[dirtyData.voucherType] == 'percentuale' ? dirtyData.discountPercentage : 0;
        cleanedData['fattoreCaricoSuperHero'] = 0;
        cleanedData['oreMinimeAppuntamento'] = dirtyData.appointmentMinimumDuration ? dirtyData.appointmentMinimumDuration : 0;
        cleanedData['dominiConsentiti'] = '*';
        cleanedData['usaEGetta'] = dirtyData.singleUse;
        return cleanedData;
    }
  }