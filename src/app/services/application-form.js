'use strict';

import { SERVICE_CATEGORIES } from '../booking/booking.config';

export default function ApplicationFormService (
    $rootScope, $q, $log, RestService, FileUploader, RecruiterService, $timeout
){
    "ngInject";

    var self = this;

    self.stati = JSON.parse('[{"sigla":"AF","nome":"Afghanistan"},{"sigla":"AL","nome":"Albania"},{"sigla":"DZ","nome":"Algeria"},{"sigla":"AD","nome":"Andorra"},{"sigla":"AO","nome":"Angola"},{"sigla":"AI","nome":"Anguilla"},{"sigla":"AQ","nome":"Antartide"},{"sigla":"AG","nome":"Antigua e Barbuda"},{"sigla":"AN","nome":"Antille Olandesi"},{"sigla":"SA","nome":"Arabia Saudita"},{"sigla":"AR","nome":"Argentina"},{"sigla":"AM","nome":"Armenia"},{"sigla":"AW","nome":"Aruba"},{"sigla":"AU","nome":"Australia"},{"sigla":"AT","nome":"Austria"},{"sigla":"AZ","nome":"Azerbaigian"},{"sigla":"BS","nome":"Bahamas"},{"sigla":"BH","nome":"Bahrein"},{"sigla":"BD","nome":"Bangladesh"},{"sigla":"BB","nome":"Barbados"},{"sigla":"BE","nome":"Belgio"},{"sigla":"BZ","nome":"Belize"},{"sigla":"BJ","nome":"Benin"},{"sigla":"BM","nome":"Bermuda"},{"sigla":"BT","nome":"Bhutan"},{"sigla":"BY","nome":"Bielorussia"},{"sigla":"BO","nome":"Bolivia"},{"sigla":"BA","nome":"Bosnia Erzegovina"},{"sigla":"BW","nome":"Botswana"},{"sigla":"BR","nome":"Brasile"},{"sigla":"BN","nome":"Brunei"},{"sigla":"BG","nome":"Bulgaria"},{"sigla":"BF","nome":"Burkina Faso"},{"sigla":"BI","nome":"Burundi"},{"sigla":"KH","nome":"Cambogia"},{"sigla":"CM","nome":"Camerun"},{"sigla":"CA","nome":"Canada"},{"sigla":"CV","nome":"Capo Verde"},{"sigla":"TD","nome":"Ciad"},{"sigla":"CL","nome":"Cile"},{"sigla":"CN","nome":"Cina"},{"sigla":"CY","nome":"Cipro"},{"sigla":"CO","nome":"Colombia"},{"sigla":"KM","nome":"Comore"},{"sigla":"CG","nome":"Congo"},{"sigla":"KP","nome":"Corea del Nord"},{"sigla":"KR","nome":"Corea del Sud"},{"sigla":"CR","nome":"Costa Rica"},{"sigla":"CI","nome":"Costa d’Avorio"},{"sigla":"HR","nome":"Croazia"},{"sigla":"CU","nome":"Cuba"},{"sigla":"DK","nome":"Danimarca"},{"sigla":"DM","nome":"Dominica"},{"sigla":"EC","nome":"Ecuador"},{"sigla":"EG","nome":"Egitto"},{"sigla":"SV","nome":"El Salvador"},{"sigla":"AE","nome":"Emirati Arabi Uniti"},{"sigla":"ER","nome":"Eritrea"},{"sigla":"EE","nome":"Estonia"},{"sigla":"ET","nome":"Etiopia"},{"sigla":"RU","nome":"Federazione Russa"},{"sigla":"FJ","nome":"Figi"},{"sigla":"PH","nome":"Filippine"},{"sigla":"FI","nome":"Finlandia"},{"sigla":"FR","nome":"Francia"},{"sigla":"GA","nome":"Gabon"},{"sigla":"GM","nome":"Gambia"},{"sigla":"GE","nome":"Georgia"},{"sigla":"GS","nome":"Georgia del Sud e Isole Sandwich del Sud"},{"sigla":"DE","nome":"Germania"},{"sigla":"GH","nome":"Ghana"},{"sigla":"JM","nome":"Giamaica"},{"sigla":"JP","nome":"Giappone"},{"sigla":"GI","nome":"Gibilterra"},{"sigla":"DJ","nome":"Gibuti"},{"sigla":"JO","nome":"Giordania"},{"sigla":"GR","nome":"Grecia"},{"sigla":"GD","nome":"Grenada"},{"sigla":"GL","nome":"Groenlandia"},{"sigla":"GP","nome":"Guadalupa"},{"sigla":"GU","nome":"Guam"},{"sigla":"GT","nome":"Guatemala"},{"sigla":"GG","nome":"Guernsey"},{"sigla":"GF","nome":"Guiana Francese"},{"sigla":"GN","nome":"Guinea"},{"sigla":"GQ","nome":"Guinea Equatoriale"},{"sigla":"GW","nome":"Guinea-Bissau"},{"sigla":"GY","nome":"Guyana"},{"sigla":"HT","nome":"Haiti"},{"sigla":"HN","nome":"Honduras"},{"sigla":"IN","nome":"India"},{"sigla":"ID","nome":"Indonesia"},{"sigla":"IR","nome":"Iran"},{"sigla":"IQ","nome":"Iraq"},{"sigla":"IE","nome":"Irlanda"},{"sigla":"IS","nome":"Islanda"},{"sigla":"BV","nome":"Isola Bouvet"},{"sigla":"NF","nome":"Isola Norfolk"},{"sigla":"CX","nome":"Isola di Christmas"},{"sigla":"IM","nome":"Isola di Man"},{"sigla":"AX","nome":"Isole Aland"},{"sigla":"KY","nome":"Isole Cayman"},{"sigla":"CC","nome":"Isole Cocos"},{"sigla":"CK","nome":"Isole Cook"},{"sigla":"FK","nome":"Isole Falkland"},{"sigla":"FO","nome":"Isole Faroe"},{"sigla":"HM","nome":"Isole Heard ed Isole McDonald"},{"sigla":"MP","nome":"Isole Marianne Settentrionali"},{"sigla":"MH","nome":"Isole Marshall"},{"sigla":"UM","nome":"Isole Minori lontane dagli Stati Uniti"},{"sigla":"SB","nome":"Isole Solomon"},{"sigla":"TC","nome":"Isole Turks e Caicos"},{"sigla":"VI","nome":"Isole Vergini Americane"},{"sigla":"VG","nome":"Isole Vergini Britanniche"},{"sigla":"IL","nome":"Israele"},{"sigla":"IT","nome":"Italia"},{"sigla":"JE","nome":"Jersey"},{"sigla":"KZ","nome":"Kazakistan"},{"sigla":"KE","nome":"Kenya"},{"sigla":"KG","nome":"Kirghizistan"},{"sigla":"KI","nome":"Kiribati"},{"sigla":"KW","nome":"Kuwait"},{"sigla":"LA","nome":"Laos"},{"sigla":"LS","nome":"Lesotho"},{"sigla":"LV","nome":"Lettonia"},{"sigla":"LB","nome":"Libano"},{"sigla":"LR","nome":"Liberia"},{"sigla":"LY","nome":"Libia"},{"sigla":"LI","nome":"Liechtenstein"},{"sigla":"LT","nome":"Lituania"},{"sigla":"LU","nome":"Lussemburgo"},{"sigla":"MG","nome":"Madagascar"},{"sigla":"MW","nome":"Malawi"},{"sigla":"MV","nome":"Maldive"},{"sigla":"MY","nome":"Malesia"},{"sigla":"ML","nome":"Mali"},{"sigla":"MT","nome":"Malta"},{"sigla":"MA","nome":"Marocco"},{"sigla":"MQ","nome":"Martinica"},{"sigla":"MR","nome":"Mauritania"},{"sigla":"MU","nome":"Mauritius"},{"sigla":"YT","nome":"Mayotte"},{"sigla":"MX","nome":"Messico"},{"sigla":"FM","nome":"Micronesia"},{"sigla":"MD","nome":"Moldavia"},{"sigla":"MC","nome":"Monaco"},{"sigla":"MN","nome":"Mongolia"},{"sigla":"ME","nome":"Montenegro"},{"sigla":"MS","nome":"Montserrat"},{"sigla":"MZ","nome":"Mozambico"},{"sigla":"MM","nome":"Myanmar"},{"sigla":"NA","nome":"Namibia"},{"sigla":"NR","nome":"Nauru"},{"sigla":"NP","nome":"Nepal"},{"sigla":"NI","nome":"Nicaragua"},{"sigla":"NE","nome":"Niger"},{"sigla":"NG","nome":"Nigeria"},{"sigla":"NU","nome":"Niue"},{"sigla":"NO","nome":"Norvegia"},{"sigla":"NC","nome":"Nuova Caledonia"},{"sigla":"NZ","nome":"Nuova Zelanda"},{"sigla":"OM","nome":"Oman"},{"sigla":"NL","nome":"Paesi Bassi"},{"sigla":"PK","nome":"Pakistan"},{"sigla":"PW","nome":"Palau"},{"sigla":"PS","nome":"Palestina"},{"sigla":"PA","nome":"Panama"},{"sigla":"PG","nome":"Papua Nuova Guinea"},{"sigla":"PY","nome":"Paraguay"},{"sigla":"PE","nome":"Perù"},{"sigla":"PN","nome":"Pitcairn"},{"sigla":"PF","nome":"Polinesia Francese"},{"sigla":"PL","nome":"Polonia"},{"sigla":"PT","nome":"Portogallo"},{"sigla":"PR","nome":"Portorico"},{"sigla":"QA","nome":"Qatar"},{"sigla":"HK","nome":"Regione Amministrativa Speciale di Hong Kong della Repubblica Popolare Cinese"},{"sigla":"MO","nome":"Regione Amministrativa Speciale di Macao della Repubblica Popolare Cinese"},{"sigla":"GB","nome":"Regno Unito"},{"sigla":"CZ","nome":"Repubblica Ceca"},{"sigla":"CF","nome":"Repubblica Centrafricana"},{"sigla":"CD","nome":"Repubblica Democratica del Congo"},{"sigla":"DO","nome":"Repubblica Dominicana"},{"sigla":"MK","nome":"Repubblica di Macedonia"},{"sigla":"RO","nome":"Romania"},{"sigla":"RW","nome":"Ruanda"},{"sigla":"RE","nome":"Réunion"},{"sigla":"EH","nome":"Sahara Occidentale"},{"sigla":"KN","nome":"Saint Kitts e Nevis"},{"sigla":"LC","nome":"Saint Lucia"},{"sigla":"PM","nome":"Saint Pierre e Miquelon"},{"sigla":"VC","nome":"Saint Vincent e Grenadines"},{"sigla":"WS","nome":"Samoa"},{"sigla":"AS","nome":"Samoa Americane"},{"sigla":"BL","nome":"San Bartolomeo"},{"sigla":"SM","nome":"San Marino"},{"sigla":"SH","nome":"Sant’Elena"},{"sigla":"ST","nome":"Sao Tomé e Príncipe"},{"sigla":"SN","nome":"Senegal"},{"sigla":"RS","nome":"Serbia"},{"sigla":"CS","nome":"Serbia e Montenegro"},{"sigla":"SC","nome":"Seychelles"},{"sigla":"SL","nome":"Sierra Leone"},{"sigla":"SG","nome":"Singapore"},{"sigla":"SY","nome":"Siria"},{"sigla":"SK","nome":"Slovacchia"},{"sigla":"SI","nome":"Slovenia"},{"sigla":"SO","nome":"Somalia"},{"sigla":"ES","nome":"Spagna"},{"sigla":"LK","nome":"Sri Lanka"},{"sigla":"US","nome":"Stati Uniti"},{"sigla":"ZA","nome":"Sudafrica"},{"sigla":"SD","nome":"Sudan"},{"sigla":"SR","nome":"Suriname"},{"sigla":"SJ","nome":"Svalbard e Jan Mayen"},{"sigla":"SE","nome":"Svezia"},{"sigla":"CH","nome":"Svizzera"},{"sigla":"SZ","nome":"Swaziland"},{"sigla":"TJ","nome":"Tagikistan"},{"sigla":"TH","nome":"Tailandia"},{"sigla":"TW","nome":"Taiwan"},{"sigla":"TZ","nome":"Tanzania"},{"sigla":"TF","nome":"Territori australi francesi"},{"sigla":"IO","nome":"Territorio Britannico dell’Oceano Indiano"},{"sigla":"TL","nome":"Timor Est"},{"sigla":"TG","nome":"Togo"},{"sigla":"TK","nome":"Tokelau"},{"sigla":"TO","nome":"Tonga"},{"sigla":"TT","nome":"Trinidad e Tobago"},{"sigla":"TN","nome":"Tunisia"},{"sigla":"TR","nome":"Turchia"},{"sigla":"TM","nome":"Turkmenistan"},{"sigla":"TV","nome":"Tuvalu"},{"sigla":"UA","nome":"Ucraina"},{"sigla":"UG","nome":"Uganda"},{"sigla":"HU","nome":"Ungheria"},{"sigla":"UY","nome":"Uruguay"},{"sigla":"UZ","nome":"Uzbekistan"},{"sigla":"VU","nome":"Vanuatu"},{"sigla":"VA","nome":"Vaticano"},{"sigla":"VE","nome":"Venezuela"},{"sigla":"VN","nome":"Vietnam"},{"sigla":"WF","nome":"Wallis e Futuna"},{"sigla":"YE","nome":"Yemen"},{"sigla":"ZM","nome":"Zambia"},{"sigla":"ZW","nome":"Zimbabwe"},{"sigla":"ZZ","nome":"regione non valida o sconosciuta"}]');

    function compare(a,b) {
      if (a.nome < b.nome)
         return -1;
      if (a.nome > b.nome)
        return 1;
      return 0;
    }

    /*self.stati.sort(compare);

    var output = '';
    self.stati.forEach(function(stato){
      var asd = '<md-option value="'+stato.sigla+'">'+stato.nome+'</md-option>';
      output += asd;
    });*/


    self.provincie = JSON.parse('[{"nome":"Agrigento ","sigla":"AG"},{"nome":"Caltanissetta ","sigla":"CL"},{"nome":"Catania ","sigla":"CT"},{"nome":"Enna ","sigla":"EN"},{"nome":"Messina ","sigla":"ME"},{"nome":"Palermo ","sigla":"PA"},{"nome":"Ragusa ","sigla":"RG"},{"nome":"Siracusa ","sigla":"SR"},{"nome":"Trapani ","sigla":"TP"},{"nome":"Alessandria ","sigla":"AL"},{"nome":"Asti ","sigla":"AT"},{"nome":"Biella ","sigla":"BI"},{"nome":"Cuneo ","sigla":"CN"},{"nome":"Novara ","sigla":"NO"},{"nome":"Torino ","sigla":"TO"},{"nome":"Verbano-Cusio-Ossola ","sigla":"VB"},{"nome":"Vercelli ","sigla":"VC"},{"nome":"Ancona ","sigla":"AN"},{"nome":"Ascoli Piceno ","sigla":"AP"},{"nome":"Macerata ","sigla":"MC"},{"nome":"Pesaro e Urbino ","sigla":"PU"},{"nome":"Fermo","sigla":"FM"},{"nome":"Aosta ","sigla":"AO"},{"nome":"Arezzo ","sigla":"AR"},{"nome":"Firenze ","sigla":"FI"},{"nome":"Grosseto ","sigla":"GR"},{"nome":"Livorno ","sigla":"LI"},{"nome":"Lucca ","sigla":"LU"},{"nome":"Massa-Carrara ","sigla":"MS"},{"nome":"Pisa ","sigla":"PI"},{"nome":"Pistoia ","sigla":"PT"},{"nome":"Prato ","sigla":"PO"},{"nome":"Siena ","sigla":"SI"},{"nome":"Avellino ","sigla":"AV"},{"nome":"Benevento ","sigla":"BN"},{"nome":"Caserta ","sigla":"CE"},{"nome":"Napoli ","sigla":"NA"},{"nome":"Salerno ","sigla":"SA"},{"nome":"Bari ","sigla":"BA"},{"nome":"Brindisi ","sigla":"BR"},{"nome":"Foggia ","sigla":"FG"},{"nome":"Lecce ","sigla":"LE"},{"nome":"Taranto ","sigla":"TA"},{"nome":"Barletta-Andria-Trani","sigla":"BT"},{"nome":"Belluno ","sigla":"BL"},{"nome":"Padova ","sigla":"PD"},{"nome":"Rovigo ","sigla":"RO"},{"nome":"Treviso ","sigla":"TV"},{"nome":"Venezia ","sigla":"VE"},{"nome":"Verona ","sigla":"VR"},{"nome":"Vicenza ","sigla":"VI"},{"nome":"Bergamo ","sigla":"BG"},{"nome":"Brescia ","sigla":"BS"},{"nome":"Como ","sigla":"CO"},{"nome":"Cremona ","sigla":"CR"},{"nome":"Lecco ","sigla":"LC"},{"nome":"Lodi ","sigla":"LO"},{"nome":"Mantova ","sigla":"MN"},{"nome":"Milano ","sigla":"MI"},{"nome":"Pavia ","sigla":"PV"},{"nome":"Sondrio ","sigla":"SO"},{"nome":"Varese ","sigla":"VA"},{"nome":"Monza/Brianza","sigla":"MB"},{"nome":"Bologna ","sigla":"BO"},{"nome":"Ferrara ","sigla":"FE"},{"nome":"Forl-0043esena ","sigla":"FC"},{"nome":"Modena ","sigla":"MO"},{"nome":"Parma ","sigla":"PR"},{"nome":"Piacenza ","sigla":"PC"},{"nome":"Ravenna ","sigla":"RA"},{"nome":"Reggio Emilia ","sigla":"RE"},{"nome":"Rimini ","sigla":"RN"},{"nome":"Bolzano ","sigla":"BZ"},{"nome":"Trento ","sigla":"TN"},{"nome":"Cagliari ","sigla":"CA"},{"nome":"Carbonia-Iglesias ","sigla":"CI"},{"nome":"Nuoro ","sigla":"NU"},{"nome":"Olbia-Tempio ","sigla":"OT"},{"nome":"Oristano ","sigla":"OR"},{"nome":"Medio Campidano ","sigla":"VS"},{"nome":"Sassari ","sigla":"SS"},{"nome":"Ogliastra ","sigla":"OG"},{"nome":"Campobasso ","sigla":"CB"},{"nome":"Isernia ","sigla":"IS"},{"nome":"Catanzaro ","sigla":"CZ"},{"nome":"Cosenza ","sigla":"CS"},{"nome":"Crotone ","sigla":"KR"},{"nome":"Reggio Calabria ","sigla":"RC"},{"nome":"Vibo Valentia ","sigla":"VV"},{"nome":"Chieti ","sigla":"CH"},{"nome":"L\'Aquila ","sigla":"AQ"},{"nome":"Pescara ","sigla":"PE"},{"nome":"Teramo ","sigla":"TE"},{"nome":"Frosinone ","sigla":"FR"},{"nome":"Latina ","sigla":"LT"},{"nome":"Rieti ","sigla":"RI"},{"nome":"Roma ","sigla":"RM"},{"nome":"Viterbo ","sigla":"VT"},{"nome":"Genova ","sigla":"GE"},{"nome":"Imperia ","sigla":"IM"},{"nome":"La Spezia ","sigla":"SP"},{"nome":"Savona ","sigla":"SV"},{"nome":"Gorizia ","sigla":"GO"},{"nome":"Pordenone ","sigla":"PN"},{"nome":"Trieste ","sigla":"TS"},{"nome":"Udine ","sigla":"UD"},{"nome":"Matera ","sigla":"MT"},{"nome":"Potenza ","sigla":"PZ"},{"nome":"Perugia ","sigla":"PG"},{"nome":"Terni ","sigla":"TR"}]');

    self.options = {
      smartphone: [
        { value : "Nessuno", name : "Nessuno" },
        { value : "Android", name : "Android" },
        { value : "iOS", name : "iPhone" },
        { value : "BlackBerry", name : "Blackberry" },
        { value : "WindowsPhone", name : "Windows Phone" }
      ],
      autoMunito : [
        { value: "patenteA", name : "Patente A" },
        { value: "patenteB", name : "Patente B" },
        { value: "patenteC", name : "Patente C" }
      ],
      internetAccess: [
        { value : "Desktop", name : "Tramite PC desktop" },
        { value : "Cellulare", name : "Tramite smartphone" },
        { value : "DesktopCellulare", name : "Tramite desktop/smartphone" }
      ],
      studyDegree: [
        {value : "LicenzaMedia", name : "Licenza Media"},
        {value : "Diploma", name : "Diploma"},
        {value : "Laurea", name : "Laurea"}
      ],
      languageKnowledgeItalian: [
        { value : "Scarsa", name : "Italiano Scarso" },
        { value : "Discreta", name : "Italiano Discreto" },
        { value : "Media", name : "Italiano Medio" },
        { value : "Buona", name : "Italiano Buono" },
        { value : "Ottima", name : "Italiano Ottimo" },
        { value : "Madrelingua", name : "Italiano Madrelingua" }
      ],
      languageKnowledgeEnglish: [
        { value : "Scarsa", name : "Inglese Scarso" },
        { value : "Discreta", name : "Inglese Discreto" },
        { value : "Media", name : "Inglese Medio" },
        { value : "Buona", name : "Inglese Buono" },
        { value : "Ottima", name : "Inglese Ottimo" },
        { value : "Madrelingua", name : "Inglese Madrelingua" }
      ],
      languageKnowledgeFrench: [
        { value : "Scarsa", name : "Francese Scarso" },
        { value : "Discreta", name : "Francese Discreto" },
        { value : "Media", name : "Francese Medio" },
        { value : "Buona", name : "Francese Buono" },
        { value : "Ottima", name : "Francese Ottimo" },
        { value : "Madrelingua", name : "Francese Madrelingua" }
      ],
      experience: [
        {value : '0-1', name : "Da zero a un anno"},
        {value : '1-3', name : "Da uno a tre anni"},
        {value : '3-7', name : "Da tre a sette anni"},
        {value : '7-15', name : "Da sette a quindici anni"},
        {value : '15+', name : "Più di quindici anni"}
      ],
      availability: [
        {value : 3, name : "Meno di 3"},
        {value : 10, name : "Tra 3 e 10"},
        {value : 20, name : "Tra 10 e 20"},
        {value : 30, name : "Tra 20 e 30"},
        {value : 40, name : "Tra 30 e 40"}
      ],
      partitaIva: [
        {value : "RegimeMinimi", name : "Regime dei minimi"},
        {value : "NormaleIndividuale", name : "Partita IVA Classica (individuale)"},
        {value : "NormaleImprese", name : "Partita IVA Classica (impresa)"}
      ],
      aboutUs: [
        {value : "Passaparola", name : "Passaparola"},
        {value : "AnnuncioInternet", name : "Annuncio in Internet"},
        {value : "BannerInternet", name : "Banner in Internet"},
        {value : "CartelloniPubblicitari", name : "Cartelloni pubblicitari"},
        {value : "Altro", name : "Altro"}
      ],
      hired: [
        {value : "Disoccupato", name : "disoccupato"},
        {value : "ImpegnoPartTime", name : "impiego part time"},
        {value : "ImpegnoFullTime", name : "impiego full time"}
      ],
      otherLanguages: [
        {value : "inglese", name : "Inglese"},
        {value : "francese", name : "Francese"},
        {value : "altro", name : "Altro"},
      ],
      maxDistance : [
        {value : 3, name : "Da 1 a 3 km"},
        {value : 5, name : "Da 3 a 5 km"},
        {value : 10, name : "Da 5 a 10 km"},
        {value : 20, name : "Da 10 a 20 km"},
        {value : 30, name : "Più di 30 km"}
      ],
      modalitaOperativa : [
          { value: 'ImpresaIndividuale', name: 'Impresa individuale' },
          { value: 'ProfessionistaConCassa', name: 'Professionista con cassa di previdenza' },
          { value: 'ProfessionistaSenzaCassa', name: 'Professionista senza cassa di previdenza' },
          { value: 'Societa', name: 'Società' },
          { value: 'EnteAssociazione', name: 'Ente/Associazione' },
      ],
      opzioniAliquota: [
          { value: 'RegimeMinimi', name: 'Regime dei Minimi' },
          { value: 'RegimeForfettario', name: 'Regime Forfettario' },
          { value: 'EsenteIva', name: 'Esente IVA' },
          { value: 'EsenteIvaFisioterapista', name: 'Esente IVA (fisioterapisti/massofisioterapisti)' },
          { value: 'SsdAsd', name: 'SSD/ASD con attività commerciale' },
          { value: 'iva4', name: 'IVA al 4%' },
          { value: 'iva10', name: 'IVA al 10%' },
          { value: 'iva22', name: 'IVA al 22%' },
      ],
      opzioniRitenuta: [
          { value: 'No', name: 'Nessuna ritenuta / Non applicabile' },
          { value: 'Si20', name: 'Ritenuta al 20%' },
          { value: 'SiLibero', name: 'Ritenuta al (specificare aliquota)' }
      ]
    }

    self.labels = {
      required: "Campo obbligatorio",
      requiredImg: "Devi inserire un'immagine",
      requiredCv: "Devi inserire il cv",
      minlengh: {
        nome: "Inserisci un nome di almeno 2 caratteri",
        cognome: "Inserisci un cognome di almeno 2 caratteri",
        codiceFiscale: "Il codice fiscale deve essere di 16 caratteri",
        confermaCodiceFiscale: "Il codice fiscale deve essere di 16 caratteri",
      },
      invalid: {
        email: "Inserisci un indirizzo email valido"
      },
      taxMin: 'Il valore deve essere compreso tra 0 e 100'
    };

    self.datePickerOptions =  function(ctrl){
      return {
        visible: false,
        options: { showWeeks: false,
          startingDay: 1,
          maxMode: 'year',
          minMode: 'day',
        },
        show: function(event){
          event.preventDefault();
          event.stopPropagation();
          $timeout(function(){
            ctrl.datePicker.visible = true;
          });
        },
        hide: function(){
          $timeout(function(){
            ctrl.datePicker.visible = false;
          });
        }
      }
    };

    self.attributes = [];

    self.competenze = {
      badante: 'ATT-00000000-0000-0000-0001-000000000001',
      colf: 'ATT-00000000-0000-0000-0001-000000000003',
      babySitter: 'ATT-00000000-0000-0000-0001-000000000002'
    }

    self.conoscenzaInglese = {
      "Scarsa": 'ATT-00000000-0000-0000-0003-000000000011',
      "Discreta": 'ATT-00000000-0000-0000-0003-000000000012',
      "Media": 'ATT-00000000-0000-0000-0003-000000000013',
      "Buona": 'ATT-00000000-0000-0000-0003-000000000014',
      "Ottima": 'ATT-00000000-0000-0000-0003-000000000015',
      "Madrelingua": 'ATT-00000000-0000-0000-0003-000000000016',
    }

    self.conoscenzaFrancese = {
      "Scarsa": 'ATT-00000000-0000-0000-0003-000000000001',
      "Discreta": 'ATT-00000000-0000-0000-0003-000000000002',
      "Media": 'ATT-00000000-0000-0000-0003-000000000003',
      "Buona": 'ATT-00000000-0000-0000-0003-000000000004',
      "Ottima": 'ATT-00000000-0000-0000-0003-000000000005',
      "Madrelingua": 'ATT-00000000-0000-0000-0003-000000000006',
    }

    self.sottoCompetenze = {
      ColfPuliziaAbitazioniPrivate: 'ATT-00000000-0000-0000-0002-000000000001',
      ColfPuliziaCondomini: 'ATT-00000000-0000-0000-0002-000000000002',
      ColfPuliziaHotels: 'ATT-00000000-0000-0000-0002-000000000003',
      ColfPuliziaUffici: 'ATT-00000000-0000-0000-0002-000000000004',
      ColfPuliziaEdificiIndustriali: 'ATT-00000000-0000-0000-0002-000000000005',
      ColfStiro: 'ATT-00000000-0000-0000-0002-000000000006',
      ColfPuliziaAltro: 'ATT-00000000-0000-0000-0002-000000000007',
      BadanteIgienePersonale: 'ATT-00000000-0000-0000-0002-000000000008',
      BadanteMobilizzazioneDomestica: 'ATT-00000000-0000-0000-0002-000000000009',
      BadantePrestazioniInfermieristicheBase: 'ATT-00000000-0000-0000-0002-000000000010',
      BadanteFisioterapia: 'ATT-00000000-0000-0000-0002-000000000011',
      BadanteCucina: 'ATT-00000000-0000-0000-0002-000000000012',
      BadantePulizie: 'ATT-00000000-0000-0000-0002-000000000013',
      BadanteCommissioni: 'ATT-00000000-0000-0000-0002-000000000014',
      BadanteStiro: 'ATT-00000000-0000-0000-0002-000000000015',
      BadanteAltro: 'ATT-00000000-0000-0000-0002-000000000016',
      BabySitterSupportoScolastico: 'ATT-00000000-0000-0000-0002-000000000017',
      BabySitterCucina: 'ATT-00000000-0000-0000-0002-000000000018',
      BabySitterPulizie: 'ATT-00000000-0000-0000-0002-000000000019',
      BabySitterCommissioni: 'ATT-00000000-0000-0000-0002-000000000020',
      BabySitter0_2Anni: 'ATT-00000000-0000-0000-0002-000000000021',
      BabySitter3_6Anni: 'ATT-00000000-0000-0000-0002-000000000022',
      BabySitter7_12Anni: 'ATT-00000000-0000-0000-0002-000000000023',
      BabySitter12AnniInSu: 'ATT-00000000-0000-0000-0002-000000000024',
      BabySitterAltro: 'ATT-00000000-0000-0000-0002-000000000025',
    }

    var attributiInformativi = {
        descrizioneTitoloStudio: '',
        referenze: {
            Colf: '',
            Badante: '',
            BabySitter: '',
            AllenamentoFunzionale: '',
            Dimagrimento: '',
            BodyBuilding: '',
            GinnasticaPosturale: '',
        },
        anniEsperienza: {
            Colf: '',
            Badante: '',
            BabySitter: '',
            AllenamentoFunzionale: '',
            Dimagrimento: '',
            BodyBuilding: '',
            GinnasticaPosturale: '',
        }
    };

    self.formModel = {
      accessoInternet: false,
      accessoInternetDettaglio: "",
      amanteAnimali: false,
      anniEsperienzaBabySitter: '',
      anniEsperienzaBadante: '',
      anniEsperienzaColf: '',
      attualmenteImpiegatoBabySitter: '',
      attualmenteImpiegatoBadante: '',
      attualmenteImpiegatoColf: '',
      autoMotoMunito: false,
      autoMotoMunitoDettaglio: "",
      autorizzazioneControlloFedina: false,
      cellulare: "",
      cittadinanza: "",
      codiceFiscale: "",
      confermaCodiceFiscale: "",
      cognome: "",
      contoCorrente: false,
      dataNascita: "",
      descrizione: "",
      disponibilitaAprirePartitaIva: false,
      disponibilitaWeekEnd : false,
      disponibilitaNotturna: false,
      maxDistanzaPercorribile: 0,
      email: "",
      competenze: {
        colf: false,
        badante: false,
        babySitter: false
      },
      sottoCompetenze: {
        ColfPuliziaAbitazioniPrivate: false,
        ColfPuliziaCondomini: false,
        ColfPuliziaHotels: false,
        ColfPuliziaUffici: false,
        ColfPuliziaEdificiIndustriali: false,
        ColfStiro: false,
        ColfPuliziaAltro: false,
        BadanteIgienePersonale: false,
        BadanteMobilizzazioneDomestica: false,
        BadantePrestazioniInfermieristicheBase: false,
        BadanteFisioterapia: false,
        BadanteCucina: false,
        BadantePulizie: false,
        BadanteCommissioni: false,
        BadanteStiro: false,
        BadanteAltro: false,
        BabySitterSupportoScolastico: false,
        BabySitterCucina: false,
        BabySitterPulizie: false,
        BabySitterCommissioni: false,
        BabySitter0_2Anni: false,
        BabySitter3_6Anni: false,
        BabySitter7_12Anni: false,
        BabySitter12AnniInSu: false,
        BabySitterAltro: false
      },
      indirizzoResidenza: {
        cap: "",
        citta: "",
        metratura: null,
        nomeCitofono: "",
        numeroCivico: "",
        piano: null,
        provincia: "",
        scala: "",
        tipo: "",
        via: ""
      },
      indirizzoDomicilio: {
        cap: "",
        citta: "",
        metratura: null,
        nomeCitofono: "",
        numeroCivico: "",
        piano: null,
        provincia: "",
        scala: "",
        tipo: "",
        via: ""
      },
      indirizzoSedeLegale: {
        cap: "",
        citta: "",
        metratura: null,
        nomeCitofono: "",
        numeroCivico: "",
        piano: null,
        provincia: "",
        scala: "",
        tipo: "",
        via: ""
      },
      indirizzoResidenzaUgualeDomicilio: true,
      indirizzoSedeLegaleUgualeResidenza: true,
      lingue: [],
      luogoNascita: "",
      noteRecruiter: '',
      nome: "",
      oreSettimanaliDisponibili: 0,
      parlareDiNoi: "",
      partitaIva: false,
      partitaIvaNumero: "",
      partitaIvaTipo: "",
      ragioneSociale: '',
      permessoSoggiorno: false,
      photoUrl: null,
      cvUrl: null,
      problemiGiustizia: null,
      referenzeBabySitter: null,
      referenzeBadante: null,
      referenzeColf: "",
      sesso: "",
      smartPhone: false,
      conoscenzaItaliano: "",
      conoscenzaInglese: "",
      conoscenzaFrancese: "",
      smartPhoneDettaglio: "",
      tipoImpiegoBabySitter: "",
      tipoImpiegoBadante: "",
      tipoImpiegoColf: "",
      titoloStudio: "",
      tipoImpiego: "",
      zone: [],
      disponibilitaCarnetXXL: true,
      attributiInformativi: attributiInformativi,
    };

    var categories = SERVICE_CATEGORIES;

    self.cleanAttributes = function(_attributes, _hero) {
        var blackList = [
            // baby sitter
            'ATT-00000000-0000-0000-0002-000000000021', 'ATT-00000000-0000-0000-0002-000000000022', 'ATT-00000000-0000-0000-0002-000000000023', 'ATT-00000000-0000-0000-0002-000000000024',
            // bandate
            'ATT-00000000-0000-0000-0002-000000000015'
        ];

        var data = _attributes;
        var _comp = _hero.competenze, _sottocomp = _hero.sottoCompetenze;
        var competenze = _.filter(data, { tipo: 'Competenza' });
        var sottoCompetenze = _.filter(data, { tipo: 'SottoCompetenza' });
        var tree = _.cloneDeep(competenze);

        _.forEach(tree, function(_c){
            _.forEach(categories, function(_cat) {
                if (_.includes(_cat.included, _c.id)) _c.category = _cat.id;
            });


            _c.sottoCompetenze = [];
            if (_.some(_comp, { id: _c.id })) {
                _c.selected = true;
            } else {
                _c.selected = false;
            }

            // referenze
            var referenze = _hero.attributiInformativi.referenze[_c.nome];
            if (typeof referenze !== 'undefined' && referenze != '') {
                _c.referenze = _hero.attributiInformativi.referenze[_c.nome];
            } else {
                _c.referenze = '';
            }

            // anniEsperienza
            var anniEsperienza = _hero.attributiInformativi.anniEsperienza[_c.nome];
            if (typeof anniEsperienza !== 'undefined' && anniEsperienza != '') {
                _c.anniEsperienza = _hero.attributiInformativi.anniEsperienza[_c.nome];
            } else {
                _c.anniEsperienza = '';
            }
        });

        _.forEach(sottoCompetenze, function(_s){
            _.forEach(tree, function(_c){
                if (_.startsWith(_s.nome, _c.nome) && !_.includes(blackList, _s.id)) {
                    _s.selected = false;
                    if (_.some(_sottocomp, { id: _s.id })) _s.selected = true;
                    _c.sottoCompetenze.push(_s);
                }
            });
        });

        console.debug(tree);
        return tree;
    }

    function patchLegacyData(_hero) {
        if (!_.isString(_hero.attributiInformativi.anniEsperienza.Colf)) _hero.attributiInformativi.anniEsperienza.Colf = '';
        if (!_.isString(_hero.attributiInformativi.anniEsperienza.Badante)) _hero.attributiInformativi.anniEsperienza.Badante = '';
        if (!_.isString(_hero.attributiInformativi.anniEsperienza.BabySitter)) _hero.attributiInformativi.anniEsperienza.BabySitter = '';
        // anni esperienza
        if (_hero.anniEsperienzaColf !== '' && _hero.attributiInformativi.anniEsperienza.Colf === '') _hero.attributiInformativi.anniEsperienza.Colf = _hero.anniEsperienzaColf;
        if (_hero.anniEsperienzaBadante !== '' && _hero.attributiInformativi.anniEsperienza.Badante === '') _hero.attributiInformativi.anniEsperienza.Badante = _hero.anniEsperienzaBadante;
        if (_hero.anniEsperienzaBabySitter !== '' && _hero.attributiInformativi.anniEsperienza.BabySitter === '') _hero.attributiInformativi.anniEsperienza.BabySitter = _hero.anniEsperienzaBabySitter;
        // referenze
        if (_hero.referenzeColf !== '' && _hero.attributiInformativi.referenze.Colf === '') _hero.attributiInformativi.referenze.Colf = _hero.referenzeColf;
        if (_hero.referenzeBadante !== '' && _hero.attributiInformativi.referenze.Badante === '') _hero.attributiInformativi.referenze.Badante = _hero.referenzeBadante;
        if (_hero.referenzeBabySitter !== '' && _hero.attributiInformativi.referenze.BabySitter === '') _hero.attributiInformativi.referenze.BabySitter = _hero.referenzeBabySitter;
    }

    self.createNewFormModel = function (_attrs) {
        var model = _.cloneDeep(self.formModel);
        model._attributes = self.cleanAttributes(_attrs, { attributiInformativi: _.cloneDeep(attributiInformativi) });
        model._attributesCategories = categories;
        return model;
    }

    self.getCittadinanzaLabel = function(code){
      var found = _.find(self.stati, function(s){
        return s.sigla == code;
      });
      if(found) return found.nome;
      else return '';
    };

    self.createFormModel = function(hero, _attrs){
      console.log(hero);
      var model = _.cloneDeep(hero);

      // json attributi
      model.attributiInformativi = _.cloneDeep(attributiInformativi);
      if (_.isString(model.jsonAttributiInformativi) && model.jsonAttributiInformativi !== '') {
          model.attributiInformativi = _.merge(JSON.parse(model.jsonAttributiInformativi));
      }

      if (typeof model.attributiInformativi.referenze === 'undefined') model.attributiInformativi.referenze = {};
      if (typeof model.attributiInformativi.anniEsperienza === 'undefined') model.attributiInformativi.anniEsperienza = {};
      if (typeof model.attributiInformativi.descrizioneTitoloStudio === 'undefined') model.attributiInformativi.descrizioneTitoloStudio = '';

      // patch data for old attributes
      patchLegacyData(model);
      model._attributes = self.cleanAttributes(_attrs, model);
      model._attributesCategories = categories;
      if (model.tipoImpiego === null) model.tipoImpiego = '';

      // fixes date
      model.dataNascita = new Date(model.dataNascita);

      model.confermaCodiceFiscale = hero.codiceFiscale;

      // sync competenze
      var competenze = {
        colf: false,
        badante: false,
        babySitter: false
      };
      model.competenze.forEach(function(single){
        if(single.nome == "BabySitter")
          competenze.babySitter = true;
        if(single.nome == "Colf")
          competenze.colf = true;
        if(single.nome == "Badante")
          competenze.badante = true;
      });
      model.competenze = competenze;

      // sync sottoCompetenze
      var sottoCompetenze = _.clone(self.sottoCompetenze);
      for(var key in sottoCompetenze){
        if(sottoCompetenze.hasOwnProperty(key))
          sottoCompetenze[key] = false;
      }
      model.sottoCompetenze.forEach(function(single){
        if(sottoCompetenze[single.nome] !== undefined && sottoCompetenze[single.nome] === false)
          sottoCompetenze[single.nome] = true;
      });
      model.sottoCompetenze = sottoCompetenze;

      // sync lingue
      model.lingue.forEach(function(single){
        // if inglese
        for(var key in self.conoscenzaInglese){
          if(self.conoscenzaInglese.hasOwnProperty(key)){
            if(single.id == self.conoscenzaInglese[key]) model.conoscenzaInglese = key;
          }
        }

        // if francese
        for(var key in self.conoscenzaFrancese){
          if(self.conoscenzaFrancese.hasOwnProperty(key)){
            if(single.id == self.conoscenzaFrancese[key]) model.conoscenzaFrancese = key;
          }
        }
      });

      // carnet non accettati
      if(model.tipiCarnetNonAccettati) model.disponibilitaCarnetXXL = false;
      else model.disponibilitaCarnetXXL = true;
      model.tipiCarnetNonAccettati = undefined;

      // aliquota iva e modalità operativa
      // opzioni aliquotaApplicata
      if (model.regimeMinimi === true) {
          model.opzioniAliquota = 'RegimeMinimi';
      } else if (model.regimeForfettario === true) {
          model.opzioniAliquota = 'RegimeForfettario';
      } else if (model.esenteIva === true) {
          model.opzioniAliquota = 'EsenteIva';
      } else if (model.esenteIvaFisioterapista === true) {
          model.opzioniAliquota = 'EsenteIvaFisioterapista';
      } else if (model.aliquotaApplicata === 4) {
          model.opzioniAliquota = 'iva4';
      } else if (model.aliquotaApplicata === 10) {
          model.opzioniAliquota = 'iva10';
      } else if (model.aliquotaApplicata === 22) {
          model.opzioniAliquota = 'iva22';
      }

      // ritenuta e aliquota
      if (model.ritenutaAcconto == 0) {
          model.opzioniRitenuta = 'No';
      } else if (model.ritenutaAcconto == 20) {
          model.opzioniRitenuta = 'Si20';
          model.ritenutaAcconto = 20;
      } else {
          model.opzioniRitenuta = 'SiLibero';
      }

       // opzioni rivalsa in Fatturazione
       if (model.rivalsaApplicata > 0) {
           model.applicareRivalsa = true;
       }

       // modalità operativa
       if (typeof model.modalitaOperativa == 'undefined' || model.modalitaOperativa == null) {
           model.modalitaOperativa = '';
       }

       // indirizzoDomicilio
       model.indirizzoResidenzaUgualeDomicilio = false;
       model.indirizzoSedeLegaleUgualeResidenza = false;


      return model;
    }

    self.sendNewApplication = function(obj){
      var clean = cleanData(obj);
      return RestService.createNewHero(clean);
    }

    self.updateApplication = function(id, obj){
      var clean = cleanData(obj);
      return RestService.editHero(id, clean);
    }

    self.approveHero = function(id){
      RecruiterService.approveHero(id);
    }


    self.getModalPicture = function(id, callback){
      RecruiterService.selectPicture(id, callback);
    }

    self.getModalCv = function(id, callback){
      RecruiterService.selectCv(id, callback);
    }

    self.validateCF = function(cf, nome, cognome, anno, comune, sesso, callback){
      validateCF(cf, nome, cognome, anno, comune, sesso, callback);
    }

    self.error = function(){
      RecruiterService.saveConfirmed(true);
    }

    self.success = function(){
      RecruiterService.saveConfirmed(false);
    }

    self.modalResponse = function(code){
      if(code === 200 || code === 201 || code === 202)
        RecruiterService.saveConfirmed(false);
      else if(code == 400)
        RecruiterService.saveConfirmed(true, true);
      else
        RecruiterService.saveConfirmed(true);
    }

    self.imgFileUploader = function($scope){
      var uploader =  new FileUploader({
      });

      uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
        }
      });

      uploader.filters.push({
        name: 'replaceItem',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          if(uploader.queue.length > 0){
            uploader.queue.length = 0;
          }
          return true;
        }
      });

      uploader.onAfterAddingFile = function(item) {
        // $scope.croppedImage = '';
        item.croppedImage = '';
        var reader = new FileReader();
        reader.onload = function(event) {
          $scope.$apply(function(){
            item.image = event.target.result;
          });
        };
        reader.readAsDataURL(item._file);
      };

      uploader.onBeforeUploadItem = function(item) {
        var blob = dataURItoBlob(item.croppedImage);
        item._file = blob;
      };

      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(status === 200) {
          var newUrl = response.url;
          if(_.isFunction($scope.closeThisDialog)) $scope.closeThisDialog();
        }
      };

      uploader.onErrorItem = function(fileItem, response, status, headers) {
        if(_.isFunction($scope.closeThisDialog)) $scope.closeThisDialog();
      };

      return uploader;
    };

    self.cvFileUploader = function($scope){
      var uploader =  new FileUploader({
      });

      uploader.filters.push({
        name: 'cvFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            $log.debug('[FILE_UPLOADER] ', item, options);
          var type = '|' + item.type + '|'; // .doc .docx .txt .odt .pdf
          return '|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|text/plain|application/pdf|application/vnd.oasis.opendocument.text|'.indexOf(type) !== -1;
        }
      });

      uploader.filters.push({
        name: 'replaceItem',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          if(uploader.queue.length > 0){
            uploader.queue.length = 0;
          }
          return true;
        }
      });

      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(status === 200) {
          var newUrl = response.url;
          $scope.closeThisDialog();
        }
      };

      uploader.onErrorItem = function(fileItem, response, status, headers) {
        $scope.closeThisDialog();
      };

      uploader.onAfterAddingFile = function(item) {
        $log.debug('[FILE_UPLOADER] ', item);
      };

      return uploader;
    };

    self.getErrorContent = function(data){
      var err = '';
      console.log(data);
      if(data.tipo === 'Univocita') {
        err = 'Risulta già registrata una candidatura con questo campo inserito:'+
              `<ul class="error-list">
                <li>${data.messaggio}</li>
              </ul>`;
      } else {
        if(data.dettaglioErrori.length > 0){
          let errors = '';
          data.dettaglioErrori.forEach(function(s){
            errors += s.campo ? '<li>'+s.campo.replace('.',' -> ')+'</li>' : '';
          });
          err = 'I seguenti campi contengono degli errori:'+
                '<ul>'+
                  errors+
                '</ul>';
        }
      }

      return err;
    }

    function cleanData(dirtyData){
        /**
      // Competenze
      var competenze = [];
      if(dirtyData.competenze.colf)
        competenze.push({ id: self.competenze.colf });
      if(dirtyData.competenze.badante)
        competenze.push({ id: self.competenze.badante });
      if(dirtyData.competenze.babySitter)
        competenze.push({ id: self.competenze.babySitter });

      // Sottocompetenze
      var sottoCompetenze = [];
      for(var key in dirtyData.sottoCompetenze){
        if(dirtyData.sottoCompetenze.hasOwnProperty(key) && dirtyData.sottoCompetenze[key]){
          sottoCompetenze.push({ id: self.sottoCompetenze[key] });
        }
      }
      **/

      // Competenze
      var competenze = [];
      var sottoCompetenze = [];
      dirtyData._attributes.forEach(function(_comp){
          if (_comp.selected === true) competenze.push({ id: _comp.id });
          dirtyData.attributiInformativi.referenze[_comp.nome] = _comp.referenze;
          dirtyData.attributiInformativi.anniEsperienza[_comp.nome] = _comp.anniEsperienza;
          _comp.sottoCompetenze.forEach(function(_sottocomp){
              if (_sottocomp.selected === true) sottoCompetenze.push({ id: _sottocomp.id });
          });
      });

      // lingue
      var lingue = [];
      if(dirtyData.conoscenzaInglese) lingue.push({ id: self.conoscenzaInglese[dirtyData.conoscenzaInglese] });
      if(dirtyData.conoscenzaFrancese) lingue.push({ id: self.conoscenzaFrancese[dirtyData.conoscenzaFrancese] });

      // disponibilita carnet XXL
      var tipiCarnetNonAccettati = '';
      if(!dirtyData.disponibilitaCarnetXXL) tipiCarnetNonAccettati = 'TC-0000-0000-0004-0001,TC-0000-0000-0004-0002';


      // opzioni aliquotaApplicata
      var aliquotaApplicata = 0;
      var ritenutaAcconto = 0;
      var rivalsaApplicata = 0;
      var esenteIva = false;
      var regimeMinimi = false;
      var regimeForfettario = false;
      var esenteIvaFisioterapista = false;

      if (dirtyData.opzioniAliquota === 'RegimeMinimi') {
          regimeMinimi = true;
      } else if (dirtyData.opzioniAliquota === 'RegimeForfettario') {
          regimeForfettario = true
      } else if (dirtyData.opzioniAliquota === 'EsenteIva') {
          esenteIva = true;
      } else if (dirtyData.opzioniAliquota === 'EsenteIvaFisioterapista') {
          esenteIvaFisioterapista = true;
      } else if (dirtyData.opzioniAliquota === 'iva4') {
          aliquotaApplicata = 4;
      } else if (dirtyData.opzioniAliquota === 'iva10') {
          aliquotaApplicata = 10;
      } else if (dirtyData.opzioniAliquota === 'iva22') {
          aliquotaApplicata = 22;
      }


      // optioni ritenuta
      if (dirtyData.opzioniRitenuta == 'No') {
          ritenutaAcconto = 0;
      } else if (dirtyData.opzioniRitenuta == 'Si20') {
          ritenutaAcconto = 20;
      } else if (dirtyData.opzioniRitenuta == 'SiLibero') {
          ritenutaAcconto = dirtyData.ritenutaAcconto;
      }

      // opzioni rivalsa in Fatturazione
      if (dirtyData.applicareRivalsa === true) {
          rivalsaApplicata = 4;
      }

      var obj = {
        email: dirtyData.email,
        nome: _.capitalize(dirtyData.nome),
        cognome: _.capitalize(dirtyData.cognome),
        partitaIva: dirtyData.partitaIva,
        partitaIvaNumero: dirtyData.partitaIvaNumero,
        partitaIvaTipo: dirtyData.partitaIvaTipo,
        ragioneSociale: dirtyData.ragioneSociale,
        cellulare: dirtyData.cellulare,
        codiceFiscale: dirtyData.codiceFiscale,
        cittadinanza : dirtyData.cittadinanza,
        permessoSoggiorno: dirtyData.permessoSoggiorno,
        sesso: dirtyData.sesso,
        dataNascita: new Date(dirtyData.dataNascita).getTime(),
        dataAccetazioneCondizioni: dirtyData.dataAccetazioneCondizioni,
        dataApprovazione: dirtyData.dataApprovazione,
        dataRegistrazione: dirtyData.dataRegistrazione,
        luogoNascita: dirtyData.luogoNascita,
        titoloStudio: dirtyData.titoloStudio,
        noteRecruiter: dirtyData.noteRecruiter,
        conoscenzaItaliano: dirtyData.conoscenzaItaliano,
        indirizzoDomicilio: dirtyData.indirizzoDomicilio,
        problemiGiustizia: dirtyData.problemiGiustizia,
        autorizzazioneControlloFedina: dirtyData.autorizzazioneControlloFedina,
        anniEsperienzaBabySitter: dirtyData.anniEsperienzaBabySitter,
        anniEsperienzaBadante: dirtyData.anniEsperienzaBadante,
        anniEsperienzaColf: dirtyData.anniEsperienzaColf,
        attualmenteImpiegatoColf: dirtyData.competenze.colf && dirtyData.tipoImpiegoColf != 'Disoccupato' ? true : false,
        attualmenteImpiegatoBabySitter: dirtyData.competenze.babySitter && dirtyData.tipoImpiegoBabySitter != 'Disoccupato' ? true : false,
        attualmenteImpiegatoBadante: dirtyData.competenze.badante && dirtyData.tipoImpiegoBadante != 'Disoccupato' ? true : false,
        smartPhone: dirtyData.smartPhoneDettaglio !== 'Nessuno',
        smartPhoneDettaglio: dirtyData.smartPhoneDettaglio,
        accessoInternet: true,
        accessoInternetDettaglio: dirtyData.accessoInternetDettaglio,
        tipoImpiegoBabySitter: dirtyData.tipoImpiegoBabySitter,
        tipoImpiegoBadante: dirtyData.tipoImpiegoBadante,
        tipoImpiegoColf: dirtyData.tipoImpiegoColf,
        tipoImpiego: dirtyData.tipoImpiego,
        referenzeBabySitter: dirtyData.referenzeBabySitter,
        referenzeBadante: dirtyData.referenzeBadante,
        referenzeColf: dirtyData.referenzeColf,
        parlareDiNoi: dirtyData.parlareDiNoi,
        autoMotoMunito: dirtyData.autoMotoMunito,
        amanteAnimali: dirtyData.amanteAnimali,
        contoCorrente: dirtyData.contoCorrente,
        codiceIban: dirtyData.codiceIban,
        photoUrl: dirtyData.photoUrl,
        cvUrl: dirtyData.cvUrl,
        presoInCarico: dirtyData.presoInCarico,
        disponibilitaAprirePartitaIva: dirtyData.disponibilitaAprirePartitaIva,
        disponibilitaWeekEnd: dirtyData.disponibilitaWeekEnd,
        disponibilitaNotturna: dirtyData.disponibilitaNotturna,
        maxDistanzaPercorribile: dirtyData.maxDistanzaPercorribile,
        oreSettimanaliDisponibili: dirtyData.oreSettimanaliDisponibili,
        descrizione: dirtyData.descrizione,

        // serialized & billing
        modalitaOperativa: dirtyData.modalitaOperativa,
        aliquotaApplicata: aliquotaApplicata,
        ritenutaAcconto: ritenutaAcconto,
        rivalsaApplicata: rivalsaApplicata,
        regimeMinimi: regimeMinimi,
        regimeForfettario: regimeForfettario,
        esenteIva: esenteIva,
        esenteIvaFisioterapista: esenteIvaFisioterapista,

        // serialized
        competenze: competenze,
        sottoCompetenze: sottoCompetenze,
        zone: dirtyData.zone,
        lingue: lingue,
        tipiCarnetNonAccettati: tipiCarnetNonAccettati,
        jsonAttributiInformativi: JSON.stringify(dirtyData.attributiInformativi)
      };

      if (dirtyData.indirizzoResidenzaUgualeDomicilio) {
          obj.indirizzoResidenza = _.cloneDeep(dirtyData.indirizzoDomicilio);
      } else if (isAddressSet(dirtyData.indirizzoResidenza)) {
          obj.indirizzoResidenza = dirtyData.indirizzoResidenza;
      }

      if (dirtyData.indirizzoSedeLegaleUgualeResidenza) {
          obj.indirizzoSedeLegale = _.cloneDeep(obj.indirizzoResidenza);
      } if (isAddressSet(dirtyData.indirizzoSedeLegale)) {
          obj.indirizzoSedeLegale = dirtyData.indirizzoSedeLegale;
      }

      obj.indirizzoSedeLegale.tipo = "SedeLegale";
      obj.indirizzoResidenza.tipo = "Residenza";
      obj.indirizzoDomicilio.tipo = "Domicilio";

      obj.indirizzoResidenza.nomeCitofono = dirtyData.cognome;
      obj.indirizzoResidenza.scala = 1;

      return obj;
    }

    function isAddressSet (address) {
        if (typeof address !== 'undefined' && address.cap && address.via && address.citta && address.provincia && address.numeroCivico) return true;
        else return false;
    }

    function validateCF(cf, nome, cognome, anno, comune, sesso, callback){
      var p = generateCF(nome, cognome, anno, comune, sesso);
      p.success(function(data){
        var xml = $.parseXML(data);
        var generated = $(xml).find('string').html();
        var startCF = (cf.toUpperCase()).substring(0, cf.length - 5);
        var startGeneratedCF = (generated.toUpperCase()).substring(0, generated.length - 5);
        callback(startGeneratedCF === startCF);
      });
    }

    function generateCF(nome, cognome, anno, comune, sesso){
      return RestService.generateCF({ Nome: _.deburr(nome), Cognome: _.deburr(cognome), DataNascita: anno, ComuneNascita: 'Milano', Sesso: sesso });
    }

    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };

}
