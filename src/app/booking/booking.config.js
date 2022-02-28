/*eslint-env es6 */
'use strict';

import common from './_reducers/common.reducers';
import booking from './_reducers/booking.reducers';
import herosearch from './_reducers/herosearch.reducers';
import carnet from './_reducers/carnet.reducers';
import createLogger from 'redux-logger';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

export const SERVICES = {
    BADANTE: 'TS-0000-0000-0000-0001',

    BABYSITTER: 'TS-0000-0000-0000-0002',

    COLF: 'TS-0000-0000-0000-0003',
    COLF_BNB: 'TS-0000-0000-0000-0003A',

    PERSONALTRAINER: 'PERSONALTRAINER',
        ALLENAMENTOFUNZIONALE: 'TS-0000-0000-0000-0004',
        DIMAGRIMENTO: 'TS-0000-0000-0000-0005',
        GINNASTICAPOSTURALE: 'TS-0000-0000-0000-0006',
        CICLISMO: 'TS-0000-0000-0000-0007',
        YOGA: 'TS-0000-0000-0000-0008',
        DIFESAPERSONALE: 'TS-0000-0000-0000-0009',
        CORSA: 'TS-0000-0000-0000-0010',
        PILATES: 'TS-0000-0000-0000-0011',

    FISIOTERAPISTA: 'FISIOTERAPISTA',
        VALUTAZIONE_FUNZIONALE:              'TS-0000-0000-0000-0014',
        FISIO_ORTOPEDICA:                    'TS-0000-0000-0000-0015',
        FISIO_NEUROLOGICA:                   'TS-0000-0000-0000-0016',
        FISIO_RESPIRATORIA:                  'TS-0000-0000-0000-0017',
        FISIO_CARDIOLOGICA:                  'TS-0000-0000-0000-0018',
        GINNASTICA_POSTURALE:                'TS-0000-0000-0000-0019',
        LINFODRENAGGIO:                      'TS-0000-0000-0000-0020',
        MASSOTERAPIA_MEZZA:                  'TS-0000-0000-0000-0021',
        MASSOTERAPIA_INTERA:                 'TS-0000-0000-0000-0022',
        OSTEOPATIA:                          'TS-0000-0000-0000-0023',
    
    STIRATURA: 'TS-0000-0000-0000-0013',
    TUTTOFARE: 'TS-0000-0000-0000-0024',
    SERVIZI_ELETTRICI: 'TS-0000-0000-0000-0025',
    SERVIZI_IDRAULICI: 'TS-0000-0000-0000-0026',
    CHECKIN_CHECKOUT: 'TS-0000-0000-0000-0027',
}

export const ATTRIBUTES = {
    [SERVICES.BADANTE] : 'ATT-00000000-0000-0000-0001-000000000001',
    [SERVICES.BABYSITTER] : 'ATT-00000000-0000-0000-0001-000000000002',
    [SERVICES.COLF] : 'ATT-00000000-0000-0000-0001-000000000003',
    [SERVICES.COLF_BNB]: 'ATT-00000000-0000-0000-0001-000000000003A',
    [SERVICES.GINNASTICAPOSTURALE] : 'ATT-00000000-0000-0000-0001-000000000006',
    [SERVICES.ALLENAMENTOFUNZIONALE] : 'ATT-00000000-0000-0000-0001-000000000004',
    [SERVICES.DIMAGRIMENTO] : 'ATT-00000000-0000-0000-0001-000000000005',
    [SERVICES.CICLISMO] : 'ATT-00000000-0000-0000-0001-000000000007',
    [SERVICES.YOGA] : 'ATT-00000000-0000-0000-0001-000000000008',
    [SERVICES.DIFESAPERSONALE] : 'ATT-00000000-0000-0000-0001-000000000009',
    [SERVICES.CORSA] : 'ATT-00000000-0000-0000-0001-000000000010',
    [SERVICES.PILATES] : 'ATT-00000000-0000-0000-0001-000000000011',
    [SERVICES.VALUTAZIONE_FUNZIONALE] : 'ATT-00000000-0000-0000-0001-000000000014',
    [SERVICES.FISIO_ORTOPEDICA] : 'ATT-00000000-0000-0000-0001-000000000015',
    [SERVICES.FISIO_NEUROLOGICA] : 'ATT-00000000-0000-0000-0001-000000000016',
    [SERVICES.FISIO_RESPIRATORIA] : 'ATT-00000000-0000-0000-0001-000000000017',
    [SERVICES.FISIO_CARDIOLOGICA] : 'ATT-00000000-0000-0000-0001-000000000018',
    [SERVICES.GINNASTICA_POSTURALE] : 'ATT-00000000-0000-0000-0001-000000000019',
    [SERVICES.LINFODRENAGGIO] : 'ATT-00000000-0000-0000-0001-000000000020',
    [SERVICES.MASSOTERAPIA_MEZZA] : 'ATT-00000000-0000-0000-0001-000000000021',
    [SERVICES.MASSOTERAPIA_INTERA] : 'ATT-00000000-0000-0000-0001-000000000022',
    [SERVICES.OSTEOPATIA] : 'ATT-00000000-0000-0000-0001-000000000023',
    [SERVICES.TUTTOFARE] : 'ATT-00000000-0000-0000-0001-000000000024',
    [SERVICES.SERVIZI_ELETTRICI] : 'ATT-00000000-0000-0000-0001-000000000025',
    [SERVICES.SERVIZI_IDRAULICI] : 'ATT-00000000-0000-0000-0001-000000000026',
    [SERVICES.CHECKIN_CHECKOUT] : 'ATT-00000000-0000-0000-0001-000000000027',
    [SERVICES.STIRATURA] : 'ATT-00000000-0000-0000-0001-000000000013',
}

export const CARNET_SERVICES = {
    // base SERVICE             carnet small                carnet medium           carnet large              carnet extra large
    'TS-0000-0000-0000-0001': ['TS-0000-0000-0001-0001', 'TS-0000-0000-0002-0001', 'TS-0000-0000-0003-0001', 'TS-0000-0000-0004-0001', 'TS-0000-0000-00NC-0001', 'TS-0000-0000-00CE-0001'],
    'TS-0000-0000-0000-0002': ['TS-0000-0000-0001-0002', 'TS-0000-0000-0002-0002', 'TS-0000-0000-0003-0002', 'TS-0000-0000-0004-0002', 'TS-0000-0000-00MC-0002', 'TS-0000-0000-00CE-0002', 'TS-0000-0001-0001-0002', 'TS-0000-0001-0002-0002', 'TS-0000-0001-0003-0002', 'TS-0000-0001-0004-0002'],
    'TS-0000-0000-0000-0003': ['TS-0000-0000-0001-0003', 'TS-0000-0000-0002-0003', 'TS-0000-0000-0002A-0003', 'TS-0000-0000-0003-0003', 'TS-0000-0000-0004-0003', 'TS-0000-0000-00CE-0003'],
    'TS-0000-0000-0000-0003A': ['TS-0000-0000-0001-0003A', 'TS-0000-0000-0002-0003A'],
    'TS-0000-0000-0000-0004': ['TS-0000-0000-0001-0004', 'TS-0000-0000-0002-0004', 'TS-0000-0000-0003-0004', 'TS-0000-0000-0004-0004'],
    'TS-0000-0000-0000-0005': ['TS-0000-0000-0001-0005', 'TS-0000-0000-0002-0005', 'TS-0000-0000-0003-0005', 'TS-0000-0000-0004-0005'],
    'TS-0000-0000-0000-0006': ['TS-0000-0000-0001-0006', 'TS-0000-0000-0002-0006', 'TS-0000-0000-0003-0006', 'TS-0000-0000-0004-0006'],
    'TS-0000-0000-0000-0007': ['TS-0000-0000-0001-0007', 'TS-0000-0000-0002-0007', 'TS-0000-0000-0003-0007', 'TS-0000-0000-0004-0007'],
    'TS-0000-0000-0000-0008': ['TS-0000-0000-0001-0008', 'TS-0000-0000-0002-0008', 'TS-0000-0000-0003-0008', 'TS-0000-0000-0004-0008'],
    'TS-0000-0000-0000-0009': ['TS-0000-0000-0001-0009', 'TS-0000-0000-0002-0009', 'TS-0000-0000-0003-0009', 'TS-0000-0000-0004-0009'],
    'TS-0000-0000-0000-0010': ['TS-0000-0000-0001-0010', 'TS-0000-0000-0002-0010', 'TS-0000-0000-0003-0010', 'TS-0000-0000-0004-0010'],
    'TS-0000-0000-0000-0011': ['TS-0000-0000-0001-0011', 'TS-0000-0000-0002-0011', 'TS-0000-0000-0003-0011', 'TS-0000-0000-0004-0011'],
    'TS-0000-0000-0000-0013': ['TS-0000-0000-0001-0013', 'TS-0000-0000-0002-0013', 'TS-0000-0000-0002A-00013', 'TS-0000-0000-0003-0013', 'TS-0000-0000-0004-0013'],
    'TS-0000-0000-0000-0014': ['TS-0000-0000-0001-0014', 'TS-0000-0000-0002-0014', 'TS-0000-0000-0003-0014', 'TS-0000-0000-0004-0014'],
    'TS-0000-0000-0000-0015': ['TS-0000-0000-0001-0015', 'TS-0000-0000-0002-0015', 'TS-0000-0000-0003-0015', 'TS-0000-0000-0004-0015'],
    'TS-0000-0000-0000-0016': ['TS-0000-0000-0001-0016', 'TS-0000-0000-0002-0016', 'TS-0000-0000-0003-0016', 'TS-0000-0000-0004-0016'],
    'TS-0000-0000-0000-0017': ['TS-0000-0000-0001-0017', 'TS-0000-0000-0002-0017', 'TS-0000-0000-0003-0017', 'TS-0000-0000-0004-0017'],
    'TS-0000-0000-0000-0018': ['TS-0000-0000-0001-0018', 'TS-0000-0000-0002-0018', 'TS-0000-0000-0003-0018', 'TS-0000-0000-0004-0018'],
    'TS-0000-0000-0000-0019': ['TS-0000-0000-0001-0019', 'TS-0000-0000-0002-0019', 'TS-0000-0000-0003-0019', 'TS-0000-0000-0004-0019'],
    'TS-0000-0000-0000-0020': ['TS-0000-0000-0001-0020', 'TS-0000-0000-0002-0020', 'TS-0000-0000-0003-0020', 'TS-0000-0000-0004-0020'],
    'TS-0000-0000-0000-0021': ['TS-0000-0000-0001-0021', 'TS-0000-0000-0002-0021', 'TS-0000-0000-0003-0021', 'TS-0000-0000-0004-0021'],
    'TS-0000-0000-0000-0022': ['TS-0000-0000-0001-0022', 'TS-0000-0000-0002-0022', 'TS-0000-0000-0003-0022', 'TS-0000-0000-0004-0022'],
    'TS-0000-0000-0000-0023': ['TS-0000-0000-0001-0023', 'TS-0000-0000-0002-0023', 'TS-0000-0000-0003-0023', 'TS-0000-0000-0004-0023'],
    'TS-0000-0000-0000-0027': ['TS-0000-0000-0002-0027', 'TS-0000-0000-0003-0027'],
}

export const SERVICE_CATEGORIES = [{
    id: 'CAT1',
    label: 'Servizi di collaborazione domestica',
    included: ['ATT-00000000-0000-0000-0001-000000000001', 'ATT-00000000-0000-0000-0001-000000000002', 'ATT-00000000-0000-0000-0001-000000000003', 'ATT-00000000-0000-0000-0001-000000000013'],
    competenze: []
},{
    id: 'CAT2',
    label: 'Servizi di Personal trainer/educatore sportivo',
    included: ['ATT-00000000-0000-0000-0001-000000000004', 'ATT-00000000-0000-0000-0001-000000000005', 'ATT-00000000-0000-0000-0001-000000000006', 'ATT-00000000-0000-0000-0001-000000000007', 'ATT-00000000-0000-0000-0001-000000000008', 'ATT-00000000-0000-0000-0001-000000000009', 'ATT-00000000-0000-0000-0001-000000000010', 'ATT-00000000-0000-0000-0001-000000000011'],
    competenze: []
},{
    id: 'CAT3',
    label: 'Fisioterapia/Osteopatia',
    included: ['ATT-00000000-0000-0000-0001-000000000014', 'ATT-00000000-0000-0000-0001-000000000015', 'ATT-00000000-0000-0000-0001-000000000016', 'ATT-00000000-0000-0000-0001-000000000017', 'ATT-00000000-0000-0000-0001-000000000018', 'ATT-00000000-0000-0000-0001-000000000019', 'ATT-00000000-0000-0000-0001-000000000020', 'ATT-00000000-0000-0000-0001-000000000021', 'ATT-00000000-0000-0000-0001-000000000022', 'ATT-00000000-0000-0000-0001-000000000023'],
    competenze: []
},{
    id: 'CAT4',
    label: 'Tuttofare',
    included: ['ATT-00000000-0000-0000-0001-000000000024', 'ATT-00000000-0000-0000-0001-000000000025', 'ATT-00000000-0000-0000-0001-000000000026'],
    competenze: []
},{
    id: 'CAT5',
    label: 'Bed and Breakfast',
    included: ['ATT-00000000-0000-0000-0001-000000000003A', 'ATT-00000000-0000-0000-0001-000000000027'],
    competenze: []
}];

export const COLF_ADDITIONAL_SERVICES = {
    PULIZIA_FRIGORIFERO: 1,
    PULIZIA_FORNO: 2,
    PULIZIA_VETRI_INTERNI: 3,
    PULIZIA_ARMADI: 4,
    PULIZIA_LAMPADARI: 5,
    LAVAGGIO_CAPI: 6,
    PULIZIA_TERRAZZA: 7,
    PULIZIA_CANTINA: 8,
    PULIZIA_GARAGE: 9,
    STIRATURA:                          'ATT-00000000-0000-0000-0002-000000000006'
}

export const BADANTE_ADDITIONAL_SERVICES = {
    IGIENE_PERSONALE:                   'ATT-00000000-0000-0000-0002-000000000008',
    CUCINA:                             'ATT-00000000-0000-0000-0002-000000000012',
    PULIZIE_DOMESTICHE:                 'ATT-00000000-0000-0000-0002-000000000013',
    PRESTAZIONI_INFERMIERISTICHE:       'ATT-00000000-0000-0000-0002-000000000010',
    MOBILITIZZAZIONE_DOMESTICA:         'ATT-00000000-0000-0000-0002-000000000009',
    COMMISIONI_VARIE:                   'ATT-00000000-0000-0000-0002-000000000014',
    ATTIVITA_FISIOTERAPICHE:            'ATT-00000000-0000-0000-0002-000000000011',
}

export const BABYSITTER_ADDITIONAL_SERVICES = {
    SUPPORTO_SCOLASTICO:                'ATT-00000000-0000-0000-0002-000000000017',
    PULIZIE:                            'ATT-00000000-0000-0000-0002-000000000019',
    CUCINA:                             'ATT-00000000-0000-0000-0002-000000000018',
    COMMISIONI_VARIE:                   'ATT-00000000-0000-0000-0002-000000000020',
    DA_0_A_2_ANNI:                      'ATT-00000000-0000-0000-0002-000000000021',
    DA_3_A_6_ANNI:                      'ATT-00000000-0000-0000-0002-000000000022',
    DA_7_A_12_ANNI:                     'ATT-00000000-0000-0000-0002-000000000023',
    DA_13_A_PIU_ANNI:                   'ATT-00000000-0000-0000-0002-000000000024',
}

export const TUTTOFARE_ADDITIONAL_SERVICES = {
    MONTAGGIO_SMONTAGGIO_MOBILI: 'ATT-00000000-0000-0000-0002-000000000036',
    SPOSTAMENTO: 'ATT-00000000-0000-0000-0002-000000000037',
    TRASLOCHI: 'ATT-00000000-0000-0000-0002-000000000038',
    CARICO_SCARICO_MERCI: 'ATT-00000000-0000-0000-0002-000000000039',
    GIARDINAGGIO: 'ATT-00000000-0000-0000-0002-000000000040',
    PICCOLI_LAVORI_DOMESTICI: 'ATT-00000000-0000-0000-0002-000000000041',
    SISTEMAZIONE_LEGNA: 'ATT-00000000-0000-0000-0002-000000000042',
    STUCCATURA: 'ATT-00000000-0000-0000-0002-000000000043',
}

export const SERVIZI_IDRAULICI_ADDITIONAL_SERVICES = {
    RIPARAZIONE_RUBINETTI: 10,
    RIPARAZIONE_SCARICHI: 11,
    DISOTTURAZIONE_SCARICHI: 12,
    INSTALLAZIONE_RUBINETTERIE: 13,
    INSTALLAZIONE_SANITARI: 14,
    SOSTITUZIONE_SANITARI: 15,
    INSTALLAZIONE_BOILER_ELETTRICO: 16,
    SOSTITUZIONE_BOILER_ELETTRICO: 17,
    INSTALLAZIONE_BOILER_GAS: 18,
    SOSTITUZIONE_BOILER_GAS: 19,
    INSTALLAZIONE_PIATTO_DOCCIA: 20,
    SOSTITUZIONE_PIATTO_DOCCIA: 21,
    INSTALLAZIONE_COLONNA_DOCCIA: 22,
    SOSTITUZIONE_POMPA_ACQUA: 23,
}

export const SERVIZI_ELETTRICI_ADDITIONAL_SERVICES = {
    INSTALLAZIONE_LAMPADARI: 24,
    CAMBIO_LAMPADINE: 25,
    INSTALAZIONE_PRESA_ELETTRICA: 26,
    SOSTITUZIONE_PRESA_ELETTRICA: 27,
    INSTALLAZIONE_TELEVISORE: 28,
    ALLACCIAMENTO_IMPIANTO_SATELLITARE: 29,
    ALLACCIAMENTO_IMPIANTO_SATELLITARE_SENZA_PARABOLA: 30,
}

export const TUTTOFARE_ADDITIONAL_TOOLS = {
    ATTREZZI_DI_BASE: 'ATT-00000000-0000-0000-0002-000000000044',
    ATTREZZI_DI_GRANDI_DIMENSIONI: 'ATT-00000000-0000-0000-0002-000000000045'
}

export const SERVIZI_ELETTRICI_ADDITIONAL_TOOLS = {
    ATTREZZI_DI_BASE: 'ATT-00000000-0000-0000-0002-000000000046',
    ATTREZZI_DI_GRANDI_DIMENSIONI: 'ATT-00000000-0000-0000-0002-000000000047'
}

export const SERVIZI_IDRAULICI_ADDITIONAL_TOOLS = {
    ATTREZZI_DI_BASE: 'ATT-00000000-0000-0000-0002-000000000048',
    ATTREZZI_DI_GRANDI_DIMENSIONI: 'ATT-00000000-0000-0000-0002-000000000049'
}

export const COSTS = {
    EDITING: 2,
    EDITING_CARNET: 1,
}

export const ERRORS = {
    TOO_LONG_NOTES: 'Limite caratteri delle note superato, ricontrolla prima di proseguire.',
    SERVICE_NOTES_MAX_LENGTH: 250,
    ADDRESS_NOT_COMPLETE: 'Attenzione: tutti i campi dell\'indirizzo sono obbligatori.',
    ADDRESS_NOT_COVERED: 'Siamo spiacenti, al momento non offriamo servizi per il CAP specificato.',
    ADDRESS_NOT_FOUND: 'Nessun indirizzo trovato. Prego ricontrollare i dati.',
    ADDRESS_TOO_GENERIC: 'L\'indirizzo inserito risulta non valido, prego ricontrollare i dati.',
    ASSISTED_INFO_MISSING: 'Per proseguire devi inserire tutti i dati dell\'assistito. Prego ricontrollare i dati.',
    CHILDREN_INFO_MISSING: 'Mancano alcuni dati dei bambini assistiti, ricontrolla prima di proseguire.',
    NO_CHILDREN_INFO: 'Non sono presenti informazioni sui bambini assistiti.',
    PICKED_DATES_OVERLAP: 'Alcuni appuntamenti si sovrappongono, prova a ricontrollare e modificare alcuni dati.',
    SAME_SH_AND_DATETIME: 'Alcuni appuntamenti contengono lo stesso supereroe prenotato per lo stesso giorno e la stessa ora. Prego ricontrollare i dati.',
    PAST_DATES: 'Attenzione, uno o più date specificate sono già passate, prego ricontrollare',
    NO_HERO_AVAILABLE: 'Spiacenti, nessun Supereroe risulta disponibile per le date selezionate.',
    MUST_CONFIRM_ALL_DATES: 'Devi confermare tutte le date prima di proseguire.',
    NO_BILLING_ADDRESS: 'Devi selezionare un indirizzo per la fatturazione.',
    NO_ADDITIONAL_NOTES: 'Completare correttamente tutti i campi obbligatori per proseguire.',
    CARNET_HOURS_NOT_SUFFICIENT: 'Non hai ore residue sufficienti sul carnet per effettuare la prenotazione.',
    NO_PRIVACY_AGREEMENT: 'Per proseguire devi accettare le condizioni di utilizzo del servizio.',
    MAIL_DONT_MATCH: 'Attenzione, la mail di conferma non coincide con la mail inserita.',
    USER_INFO_MISSING: 'Devi compilare tutti i campi dei tuoi dati per proseguire.',
    BILLING_ADDRESS_INFO_MISSING: 'Indirizzo di fatturazione non valido, prego ricontrollare',
    GUESTS_INFO_MISSING: 'Mancano alcuni dati delle persone, ricontrolla prima di proseguire.',
    NO_SUBSERVICE_SELECTED: 'Devi selezionare uno dei servizi specifici per proseguire la prenotazione.',
    VOUCHER_NOT_VALID: 'Errore di validazione del voucher: ',
    VOUCHER_NOT_ENABLED_FOR_CURRENT_USER: 'Attenzione: il codice voucher inserito non è abilitato per il tuo utente.',
    MUST_SELECT_HERO_TO_CONTINUE: 'Devi selezionare un Supereroe per proseguire con la prenotazione.',

    // herosearch errors
    NO_CAP: 'Devi specificare un CAP valido.',
    NO_SERVICE: 'Devi specificare la competenza richiesta.',
    NO_RESULTS: 'La ricerca non ha portato ad alcun risultato. Prova a cambiare i filtri ed effettuare una nuova ricerca.',

    form: {
        required: 'Campo obbligatorio',
        minlength: {
            firstName: "Inserisci un nome di almeno 3 caratteri",
            lastName: "Inserisci un cognome di almeno 3 caratteri",
            email: "Inserisci una mail di almeno 3 caratteri",
            taxCode: "Il codice fiscale deve essere di 16 caratteri",
            mobileNumber: 'Il numero di cellulare è troppo corto',
        },
        invalid: {
            email: "Inserisci un indirizzo email valido"
        },
        noCopyPaste: "Inserisci manualmente il codice fiscale",
        patterns: {
            firstName: 'Il nome può contenere solo lettere',
            lastName: 'Il cognome può contenere solo lettere',
            email: 'L\'email deve essere nel formato mail@provider.it',
            taxCode: 'Devi inserire un codice fiscale valido',
            mobileNumber: 'Il cellulare può contenere solo numeri',
        }
    }
}

export const STEPS = [
    { order: 1, label: 'Servizio', name: 'service', state: 'booking.service' },
    { order: 2, label: 'Dove', name: 'address', state: 'booking.address' },
    { order: 3, label: 'Data e ora', name: 'dates', state: 'booking.dates' },
    { order: 4, label: 'I tuoi dati', name: 'userData', state: 'booking.userData' },
    { order: 5, label: 'Pagamento', name: 'confirm', state: 'booking.confirm' }
]

export const CARNET_STEPS = [
    { order: 1, label: 'Il tuo Supereroe', name: 'herosearch', state: 'booking.herosearch' },
    { order: 2, label: 'I tuoi dati', name: 'userData', state: 'booking.userData' },
    { order: 3, label: 'Pagamento', name: 'confirm', state: 'booking.confirm' }
]

export const CONFIRM = {
    standard: {
        AUTHORISED: {
            title: 'Complimenti!',
            content: 'La Sua richiesta è stata presa in carico. Entro 4 ore (durante la fascia oraria 9.00 -  18.00 dal lunedì al venerdì) le verrà indicato via e-mail il <b>nominativo del Supereroe assegnato.</b> Conferma prevista per <b>{expirationDate}</b>.',
            icon: 'badge.check'
        },
        REFUSED: {
            title: 'Spiacenti',
            content: 'Non è stato possibile portare a termine il pagamento poichè il pagamento è stato rifiutato.<br>Riprova ad effettuare un nuovo ordine utilizzando un\'altra carta.',
            icon: 'badge.cancel'
        },
        CANCELLED: {
            title: 'Cancellato',
            content: 'Il pagamento è stato cancellato. Hai cambiato idea? forse potrebbe interessarti sapere che...',
            icon: 'badge.cancel'
        },
        ERROR: {
            title: 'Errore',
            content: 'È occorso un errore durante il pagamento. Riprovare più tardi oppure contatta il supporto tecnico.',
            icon: 'badge.cancel'
        }
    },
    carnet: {
        AUTHORISED: {
            title: 'Complimenti!',
            content: 'Hai completato regolarmente l\’<b>acquisto del tuo Carnet {carnetType}</b>. Da questo momento puoi liberamente utilizzare il tuo Carnet per prenotare i tuoi prossimi appuntamenti.',
            icon: 'badge.check'
        },
        PENDING: {
            title: 'Complimenti!',
            content: 'Hai completato regolarmente l\’<b>acquisto del tuo Carnet {carnetType}</b>. Non appena verrà confermata la ricezione del bonifico, il tuo Carnet sarà attivato.',
            icon: 'badge.check' 
        },
    },
    carnetGift: {
        AUTHORISED: {
            content: 'Hai completato regolarmente l\’<b>utilizzo della tua Gift Card per un Carnet {carnetType}</b>. Da questo momento puoi liberamente utilizzare il tuo Carnet per prenotare i tuoi prossimi appuntamenti.'
        }
    },
    heroSelection: {
        AUTHORISED: {
            content: 'La Sua richiesta è stata presa in carico. Entro 4 ore (durante la fascia oraria 9.00 - 18.00 dal lunedì al venerdì) riceverà via e-mail la conferma della sua prenotazione. Conferma prevista per <b>{expirationDate}</b>.',
        },
    },
    userNotLogged: 'Si ricordi che per completare il processo di registrazione ed accedere alla pagina a Lei riservata, è necessario <b>impostare la password seguendo il link contenuto nella mail che Le abbiamo appena inviato</b>. Attraverso la Sua pagina personale potrà controllare lo stato delle prenotazioni, richiamare Supereroi precedentemente conosciuti, controllare lo storico ed accedere a tante altre funzionalità.'
}

export const PRICING = {
    edit: {
        standard: 2,
        carnet: 1
    }
}

export default function BookingModuleConfig (
    stateHelperProvider,
    $ngReduxProvider,
    $urlRouterProvider
) {
    "ngInject";


    let logger = createLogger();
    let reducers = combineReducers({ common, booking, herosearch, carnet });
    let middlewares = [];
    if (window.devToolsExtension) {
        middlewares.push(window.devToolsExtension());
    }

    $ngReduxProvider.createStoreWith(reducers, [ thunk, logger ], middlewares);

    $urlRouterProvider.when('/prenota', '/prenota/servizi');

    stateHelperProvider.setNestedState({
        name: 'booking',
        url: '/prenota?app&userId&token&ordine&isCarnetOrder&carnetInfo',
        abstract: true,
        templateUrl: 'app/booking/base/base.tmpl.html',
        controller: 'BookingBaseController as Booking',
        onEnter: function(CookiePolicy, $rootScope) {
            $rootScope.isApp = Cookies.get('is-app');
            CookiePolicy.showBanner($rootScope);
        },
        resolve: {
            userInfo: function(RestService, $rootScope, $ngRedux, $stateParams, Restangular){
                if ($stateParams.app && $stateParams.userId && $stateParams.token) {
                    const isApp = $stateParams.app.toLowerCase() === 'true';
                    $rootScope.logged = true;
                    Cookies.set('auth-token', $stateParams.token, { expires: (60 * 60 * 8) });
                    Cookies.set('is-app', true, { expires: (60 * 60 * 8) });
                    Cookies.set('user-id', $stateParams.userId, { expires: (60 * 60 * 8) });
                    Cookies.set('user-role', "cliente", { expires: (60 * 60 * 8) });
                    Restangular.setDefaultHeaders({'X-Auth-Token': $stateParams.token});
                    return RestService.getCustomer($stateParams.userId);
                }
                if ($rootScope.logged && $rootScope.userRole === 'admin') {
                    const state = $ngRedux.getState();
                    if(state.booking.carnet.info.userId) {
                        return RestService.getCustomer(state.booking.carnet.info.userId);
                    }
                    else {
                        return RestService.getCustomer('CL-11111111-1111-1111-1111');
                    }
                } else if ($rootScope.logged && $rootScope.userRole !== "admin") {
                    if (Cookies.get('is-app')) {
                        $rootScope.userId = Cookies.get('user-id');
                        $rootScope.userRole = Cookies.get('user-role');
                        Restangular.setDefaultHeaders({'X-Auth-Token': Cookies.get('auth-token')});
                    }
                    return RestService.getCustomer($rootScope.userId);
                } else {
                    return {};
                }
            },
            carnetTypes: function(RestService){
                'ngInject';
                return RestService.getCarnetTypes();
            }
        },
        children: [
            {
                name: 'service',
                url: '/servizi',
                templateUrl: 'app/booking/step-service/step-service.tmpl.html',
                controller: 'BookingStepServiceController as StepService'
            },
            {
                name: 'bnbService',
                url: '/BNB/servizi',
                templateUrl: 'app/booking/step-service/step-service.tmpl.html',
                controller: 'BookingStepServiceController as StepService'
            },
            {
                name: 'address',
                url: '/indirizzo?via&num&cap&loc&prov',
                templateUrl: 'app/booking/step-address/step-address.tmpl.html',
                controller: 'BookingStepAddressController as StepAddress',
                onEnter: ($ngRedux, $stateParams) => {
                    "ngInject";
                    if ($stateParams.via || $stateParams.num || $stateParams.cap || $stateParams.loc || $stateParams.prov) {
                        let address = {
                            route: $stateParams.via,
                            street_number: $stateParams.num,
                            postal_code: $stateParams.cap,
                            locality: $stateParams.loc,
                            administrative_area_level_2: $stateParams.prov,
                        }
                        $ngRedux.dispatch({ type: 'SET_BOOKING_ADDRESS', addressInfo: address });
                    }
                }
            },
            {
                name: 'appOrderCreation',
                url: '/app',
                controller: 'AppOrderCreationController as AppOrderCreation'
            },
            {
                name: 'dates',
                url: '/quando',
                templateUrl: 'app/booking/step-dates/step-dates.tmpl.html',
                controller: 'BookingStepDatesController as StepDates'
            },
            {
                name: 'userData',
                url: '/dati',
                templateUrl: 'app/booking/step-userdata/step-userdata.tmpl.html',
                controller: 'BookingStepUserDataController as StepUserData'
            },
            {
                name: 'appUserData',
                url: '/dati/app?data',
                templateUrl: 'app/booking/step-userdata/step-userdata.tmpl.html',
                controller: 'AppStepUserDataController as StepUserData'
            },
            {
                name: 'herosearch',
                url: '/cerca-supereroe',
                templateUrl: 'app/booking/step-herosearch/step-herosearch.tmpl.html',
                controller: 'BookingStepHeroSearchController as StepHeroSearch'
            },
            {
                name: 'bnbHerosearch',
                url: '/BNB/cerca-supereroe',
                templateUrl: 'app/booking/step-herosearch/step-herosearch.tmpl.html',
                controller: 'BookingStepHeroSearchController as StepHeroSearch'
            },
            {
                name: 'heroprofile',
                url: '/cerca-supereroe/:idHero',
                templateUrl: 'app/booking/step-herosearch/hero-profile.tmpl.html',
                controller: 'HeroProfileController as HeroProfile',
                data : { pageTitle: 'Profilo Supereroe' },
                resolve: {
                    heroProfileInfo: ['RestService', '$rootScope', '$stateParams', function(RestService, $rootScope, $stateParams){
                        return RestService.getHero($stateParams.idHero, { public: true });
                    }],
                    feedbacks: function (RestService, $stateParams) {
                        "ngInject";
                        return RestService.getHeroFeedbacks($stateParams.idHero);
                    }
                }
            },
            {
                name: 'bnbHeroprofile',
                url: '/BNB/cerca-supereroe/:idHero',
                templateUrl: 'app/booking/step-herosearch/hero-profile.tmpl.html',
                controller: 'HeroProfileController as HeroProfile',
                data : { pageTitle: 'Profilo Supereroe' },
                resolve: {
                    heroProfileInfo: ['RestService', '$rootScope', '$stateParams', function(RestService, $rootScope, $stateParams){
                        return RestService.getHero($stateParams.idHero, { public: true });
                    }],
                    feedbacks: function (RestService, $stateParams) {
                        "ngInject";
                        return RestService.getHeroFeedbacks($stateParams.idHero);
                    }
                }
            },
            {
                name: 'confirm',
                url: '/conferma-pagamento?merchantReference&skinCode&paymentMethod&authResult&pspReference&merchantSig&carnetOrder&giftCardOrder&authVoucher',
                templateUrl: 'app/booking/step-confirm/step-confirm.tmpl.html',
                controller: 'BookingStepConfirmController as StepConfirm',
                resolve: {
                    expirationDate: function(RestService, $rootScope, $stateParams){
                        "ngInject";
                        if ($rootScope.logged && $rootScope.userRole !== "admin") {
                            return RestService.getCustomerOrderExpirationDate($rootScope.userId, $stateParams.merchantReference)
                                    .then((response) => ({ status: true, data: response.data ? response.data : response }))
                                    .catch(() => ({ status: false }));
                        }
                        else if ($rootScope.logged && $rootScope.userRole === "admin") {
                            return RestService.getCustomerOrderExpirationDate('CL-11111111-1111-1111-1111', $stateParams.merchantReference)
                                    .then((response) => ({ status: true, data: response.data ? response.data : response }))
                                    .catch(() => ({ status: false }));
                        }
                    }
                },
                onEnter: ($ngRedux, $stateParams, locker, $rootScope) => {
                    "ngInject";
                    if (Cookies.get('is-app')) {
                        $rootScope.isApp = Cookies.get('is-app');
                    }
                    let orderId, orderState, authorisation, paymentMethod;
                    if ($stateParams.carnetOrder) { // ordine su base carnet, non è passato per adyen
                        orderId = $stateParams.carnetOrder;
                        authorisation = 'AUTHORISED';
                    } else if ($stateParams.giftCardOrder) {
                        orderId = $stateParams.giftCardOrder;
                        authorisation = 'AUTHORISED';
                    } else if($stateParams.merchantReference && $stateParams.skinCode && $stateParams.paymentMethod && $stateParams.authResult && $stateParams.pspReference && $stateParams.merchantSig) {
                        orderId = $stateParams.merchantReference;
                        authorisation = $stateParams.authResult;
                        paymentMethod = $stateParams.paymentMethod;
                    } else if ($stateParams.merchantReference) {
                        orderId = $stateParams.merchantReference;
                        authorisation = 'AUTHORISED';
                    }
                    orderState = locker.namespace('ilmiosupereroe').get(orderId);

                    if (typeof orderState !== 'undefined') {
                        orderState = JSON.parse(orderState);
                        if (typeof orderState.booking !== 'undefined' && typeof orderState.booking.userInfo !== 'undefined') delete orderState.booking.userInfo;
                        $ngRedux.dispatch({ type: 'SET_BOOKING_STATE', state: orderState });
                        $ngRedux.dispatch({ type: 'SET_ORDER_AUTHORISATION', authorisation });
                        $ngRedux.dispatch({ type: 'SET_ORDER_PAYMENT_METHOD', paymentMethod });
                    } else if (!$stateParams.merchantReference || !$stateParams.authResult) {
                        // error
                    }


                    // call google conversion tracking code if order was authorised
                    if (authorisation === 'AUTHORISED') {
                        window.google_trackConversion({
                            google_conversion_id: 944299938,
                            google_conversion_language : "en",
                            google_conversion_format : "3",
                            google_conversion_color: "ffffff",
                            google_conversion_label: "fHGiCIO-ml4Qor-jwgM",
                            google_remarketing_only: false
                        });
                    }
                }
            }
        ]
    });
}

export const PATTERNS = {
    firstName: /^[^0-9]+$/,
    lastName: /^[^0-9]+$/,
    mobileNumber: /([\+]\d{1,4})?[\.-]?[\(]?\d{3}[\)]?[\.-]?\d{3}[\.-]?\d{4}/,
    email: /[a-zA-Z0-9]+(?:(\.|_)[A-Za-z0-9!#$%&'*+/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
    taxCode: /^([A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})|([0-9]{11})$/,
}
