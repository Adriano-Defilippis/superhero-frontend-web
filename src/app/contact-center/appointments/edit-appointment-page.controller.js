'use strict';

export default function CcEditAppointmentPageController (
    $scope, $timeout, $state, appointment, AssetsStore, Services, ContactCenter, AppointmentsUtility
) {
    "ngInject";

    var ctrl = this;

    ctrl.appointment = appointment.data.plain();
    cleanAppointmentData(ctrl.appointment);

    var time = moment('2015-06-01');

    console.log(ctrl.appointment);

    AppointmentsUtility.getAppointmentRequests(ctrl.appointment.id).then(function(requests){
        ctrl.smsData.push.apply(ctrl.smsData, AppointmentsUtility.formatAppointmentRequests( requests.data.plain() ) );
    });

    ctrl.changeHero = function(){
        ContactCenter.changeHero(ctrl.appointment);
    }

    ctrl.editPrice = ContactCenter.changePriceModel(ctrl.appointment);
    ctrl.editTime = ContactCenter.changeTimeModel(ctrl.appointment);
    ctrl.heroesResults = [];
    ctrl.isEditingPrice = false;

    ctrl.isManualAppointment = isManualAppointment;

    ContactCenter.changeHeroModel(ctrl.appointment).then(function(heroes){
        ctrl.heroesResults.push.apply(ctrl.heroesResults, heroes);
    });

    ctrl.smsSent = 'f0315';
    ctrl.smsData = [];

    ctrl.selectHero = function(hero){
        $timeout(function(){
            ctrl.newHeroSelected = hero;
        });
    }

    ctrl.resetHeroSelection = function(){
        $timeout(function(){
            ctrl.newHeroSelected = undefined;
        });
    }

    ctrl.disableChangeHero = function(){
        var now = new Date().getTime();
        return ctrl.appointment.idCarnet || ctrl.appointment.dataInizio < now;
    }

    ctrl.disableDelete = function(){
        return _.includes(ctrl.appointment.stato, 'Cancellato');
    }

    ctrl.disableSaveChanges = function(){
        return ctrl.editTime.newStart.getTime() >= ctrl.editTime.newEnd.getTime();
    }


    ctrl.saveChanges = function(){
        // salva le modifiche all'appunatmento
        // se l'appuntamento è nel passato: PUT altrimenti POST
        var now = new Date().getTime();
        if(ctrl.appointment.dataInizio > now){
            // appuntamento nel futuro
            let savedModal = ContactCenter.saveEditFutureAppointment(ctrl.appointment, ctrl.editPrice.newPrice, {start: ctrl.editTime.newStart.getTime(), end: ctrl.editTime.newEnd.getTime()}, ctrl.newHeroSelected);
            savedModal.then(function (data) {
                console.debug('Edits confirmed, redirecting to appointments page');
                $state.go('main.support.appointments');
            });
        } else {
            // appuntamento nel passato
            ContactCenter.saveEditPastAppointment(ctrl.appointment, ctrl.editPrice.newPrice, {start: ctrl.editTime.newStart.getTime(), end: ctrl.editTime.newEnd.getTime()});
        }
    }

    ctrl.deleteAppointment = function(){
        ContactCenter.cancelAppointmentModal(ctrl.appointment);
    }

    ctrl.orderBilling = function(billing) {
        if (billing.tipoFattura === 'Prestazione') return 0;
        if (billing.tipoFattura === 'Piattaforma') return 1;
        if (billing.tipoFattura === 'Voucher') return 2;
    }

    function cleanAppointmentData(a){
        // photourls
        // a.superHero.photoUrl = a.superHero && a.superHero.photoUrl ? a.superHero.photoUrl : AssetsStore.Image('user.placeholder');

        // fix for billing
        if (!_.isArray(a.fatture)) a.fatture = [];

        if(a.stato === 'SuperHeroNotFound' || !a.superHero || !a.superHero.id) {
            a.hasHero = false;
        } else {
            a.hasHero = true;
        }

        if (a.hasHero) {
            a.superHero.photoUrl = a.superHero.photoUrl ? a.superHero.photoUrl : AssetsStore.Image('user.placeholder');
            a.superHero.nomeCompleto = a.superHero.nome + ' ' + a.superHero.cognome;
        }

        a.cliente.photoUrl = a.cliente.photoUrl ? a.cliente.photoUrl : AssetsStore.Image('user.placeholder');
        a.cliente.nomeCompleto = a.cliente.nome + ' ' + a.cliente.cognome;

        // labels
        a.labels = {}

        // Servizio & Carnet label
        if (a.tipoServizio && a.tipoServizio.id) {
            a.labels.servizio = Services.Label(a.tipoServizio.id);
            if (a.idCarnet) a.labels.carnet = Services.CarnetByService(a.tipoServizio.id).tipo;
        }


        // stato
        if(a.stato === 'Aperto') a.labels.stato = 'In attesa di conferma da parte di collaboratore (aperto)';
        if(a.stato === 'Confermato') a.labels.stato = 'In attesa di esecuzione (confermato)';
        if(a.stato === 'Cancellato') a.labels.stato = 'Cancellato (da utente)';
        if(a.stato === 'CancellatoAmministrativamente') a.labels.stato = 'Cancellato (da amministrazione)';
        if(a.stato === 'Pagato') a.labels.stato = 'Pagato';
        if(a.stato === 'CancellatoPostModifica') a.labels.stato = 'Modificato';
        if(a.stato === 'SuperHeroNotFound') a.labels.stato = 'Eroe non trovato (SuperHeroNotFound)';
        if(a.stato === 'ErrorePagamento') a.labels.stato = 'Errore durante il pagamento';

        // Importo fattura
        if(a.stato === 'Immesso') a.labels.importoFattura = 'Non disponibile';
        if(a.stato === 'Aperto') a.labels.importoFattura = 'Non disponibile';
        if(a.stato === 'Confermato') a.labels.importoFattura = 'Non disponibile';
        if(a.stato === 'Pagato') a.labels.importoFattura = a.costoPrestazioneScontata;
        if(a.stato === 'Cancellato') a.labels.importoFattura = a.costoPenaleCancellazione;
        if(a.stato === 'CancellatoPostModifica') a.labels.importoFattura = a.costoPenaleModifica;
        if(a.stato === 'CancellatoAmministrativamente') a.labels.importoFattura = 0;
        if(a.stato === 'SuperHeroNotFound') a.labels.importoFattura = 'Non disponibile';
        if(a.stato === 'ErrorePagamento') a.labels.importoFattura = 'Non disponibile';

        if(a.stato === 'Pagato' || a.stato === 'Cancellato' || a.stato === 'CancellatoPostModifica' || a.stato === 'CancellatoAmministrativamente') a.labels.importoFattura += '€';

        a.labels.importoSconto = a.costoPrestazione - a.costoPrestazioneScontata;

        if(a.costoPenaleCancellazione > 0) a.labels.penaleCanc = a.costoPenaleCancellazione;
        if(a.costoPenaleModifica > 0) a.labels.penaleMod = a.costoPenaleModifica;

        // Tipolgia
        if(a.tipo === 'AppuntamentiCarnet') a.labels.tipologia = 'Appuntamento su base carnet';
        if(a.tipo === 'Appuntamenti') a.labels.tipologia = 'Appuntamento standard';
        if(a.tipo === 'ModificaAppuntamento') a.labels.tipologia = 'Appuntamento modificato da utente';
        if(a.tipo === 'AppuntamentiNominale') a.labels.tipologia = 'Appuntamento nominale';
        if(a.tipo === 'NominaleMultiplo') a.labels.tipologia = 'Appuntamento nominale multiplo';
        if(a.tipo === 'ModificaAppuntamentoCarnet') a.labels.tipologia = 'Appuntamento su base carnet modificato da utente';
        if(a.tipo === 'ModificaAppuntamentoNominale') a.labels.tipologia = 'Appuntamento nominale modificato da utente';
        if(a.tipo === 'ModificaAmministrativaAppuntamento') a.labels.tipologia = 'Appuntamento standard modificato (AMM)';
        if(a.tipo === 'ModificaAmministrativaAppuntamentoCarnet') a.labels.tipologia = 'Appuntamento su base carnet modificato (AMM)';
        if(a.tipo === 'ModificaAmministrativaAppuntamentoNominale') a.labels.tipologia = 'Appuntamento nominale modificato (AMM)';

        // voucher
        a.showVoucher = false;
        if (a.voucher !== null) {
            a.showVoucher = true;
            a.labels.codiceVoucher = a.voucher.codice;
            a.labels.validitaVoucher = {
                inizio: moment(a.voucher.dataInizio).format('DD/MM/YY - HH:mm'),
                fine: moment(a.voucher.dataFine).format('DD/MM/YY - HH:mm')
            };
            a.labels.canaleVoucher = a.voucher.canale;
            a.labels.tipoVoucher = a.voucher.tipoVoucher;
            a.labels.tipoScontoVoucher = a.voucher.tipoSconto;
            a.labels.tipoScontoVoucherDetail = '';
            if (a.voucher.tipoSconto === 'percentuale') {
                a.labels.tipoScontoVoucherDetail = '('+a.voucher.scontoPercentuale + '%)';
            } else if (a.voucher.tipoSconto === 'orario') {
                a.labels.tipoScontoVoucherDetail = a.voucher.oreSconto > 1 ? '('+a.voucher.oreSconto + ' ore)' : '('+a.voucher.oreSconto + ' ora)';
            }

        }

        // sottocompetenze
        a.labels.sottoCompetenze = [];
        if (a.sottoCompetenze.length > 0) {
            a.sottoCompetenze.forEach(function(s){
                a.labels.sottoCompetenze.push(Services.detail.Label(s.id));
            });
        }


        // dettagli servizio
        a.labels.dettaglioServizio = '';
        var jsonDettagli = JSON.parse(a.jsonDettagliServizio);
        if(jsonDettagli){
            // Colf
            if(jsonDettagli.service == 1){
                var info = jsonDettagli.squareMeters + 'mq (' + jsonDettagli.suggestedHours/60 + 'hr)';
                a.labels.dettaglioServizio = '<b>Dettagli appartamento:</b>&nbsp;'+info;
            } else
            // Badante
            if(jsonDettagli.service == 2){
                var info = jsonDettagli.infoPersona.nome + ' ' + jsonDettagli.infoPersona.cognome + ', ' + jsonDettagli.infoPersona.sesso + ', ' + jsonDettagli.infoPersona.eta;
                a.labels.dettaglioServizio = '<b>Dettagli assistito:</b>&nbsp;'+info;
            } else
            // Baby sitter
            if(jsonDettagli.service == 3) {
                var info = '';
                jsonDettagli.infoBambini.forEach(function(b){
                    info += b.nome + ' ' + b.cognome + ', ' + b.sesso + ', ' +b.eta+'<br>';
                });
                a.labels.dettaglioServizio = '<b>Dettagli bambini:</b>&nbsp;'+info;
            }

            if ((a.tipoServizio.id === 'TS-0000-0000-0000-0025' || a.tipoServizio.id === 'TS-0000-0000-0000-0026') && jsonDettagli.specifiche) {
                jsonDettagli.specifiche.forEach(function(s){
                    a.labels.sottoCompetenze.push(s);
                });
            }
        }

        // indirizzi
        var indirizzoTemplate = _.template('<%= via %> <%= civico %>, <%= cap %>, <%= citta %> (<%= prov %>)');

        a.indirizzoFatturazione = _.clone(a.ordine.indirizzoFatturazione);

        a.labels.indirizzoFatturazione = indirizzoTemplate({
            via: a.indirizzoFatturazione.via,
            civico: a.indirizzoFatturazione.numeroCivico,
            cap: a.indirizzoFatturazione.cap,
            citta: a.indirizzoFatturazione.citta,
            prov: a.indirizzoFatturazione.provincia,
        });

        a.labels.indirizzoPrestazione = indirizzoTemplate({
            via: a.indirizzoPrestazione.via,
            civico: a.indirizzoPrestazione.numeroCivico,
            cap: a.indirizzoPrestazione.cap,
            citta: a.indirizzoPrestazione.citta,
            prov: a.indirizzoPrestazione.provincia,
        });

        if(a.hasHero){
            a.indirizzoSuperHero = _.clone(a.superHero.indirizzoResidenza);
            a.labels.indirizzoSuperHero = indirizzoTemplate({
                via: a.indirizzoSuperHero.via,
                civico: a.indirizzoSuperHero.numeroCivico,
                cap: a.indirizzoSuperHero.cap,
                citta: a.indirizzoSuperHero.citta,
                prov: a.indirizzoSuperHero.provincia,
            });
        }

    }

    function isManualAppointment ()
    {
        return ctrl.appointment.gestioneManuale && ctrl.appointment.stato === 'Aperto';
    }

}
