/*global $:false, angular:false, console:false, _:false */
'use strict';

export function AvailabilityZonesService (
    $timeout, RestService, NotifyService
){
    "ngInject";

    var self = this,
        heroInfo = null,
        uiGmapIsReady = null,
        map = null;

    var styles = JSON.parse('[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]');

    var zone = JSON.parse('[{"cap":"20081","codice":"MilanoAbbiategrasso","descrizione":"Abbiategrasso","id":"ZN-00000000-0000-0000-0001-000000000001"},{"cap":"20080","codice":"MilanoAlbairate","descrizione":"Albairate","id":"ZN-00000000-0000-0000-0001-000000000002"},{"cap":"20020","codice":"MilanoArconate","descrizione":"Arconate","id":"ZN-00000000-0000-0000-0001-000000000003"},{"cap":"20020","codice":"MilanoArese","descrizione":"Arese","id":"ZN-00000000-0000-0000-0001-000000000004"},{"cap":"20010","codice":"MilanoArluno","descrizione":"Arluno","id":"ZN-00000000-0000-0000-0001-000000000005"},{"cap":"20090","codice":"MilanoAssago","descrizione":"Assago","id":"ZN-00000000-0000-0000-0001-000000000006"},{"cap":"20021","codice":"MilanoBaranzate","descrizione":"Baranzate","id":"ZN-00000000-0000-0000-0001-000000000007"},{"cap":"20010","codice":"MilanoBareggio","descrizione":"Bareggio","id":"ZN-00000000-0000-0000-0001-000000000008"},{"cap":"20060","codice":"MilanoBasiano","descrizione":"Basiano","id":"ZN-00000000-0000-0000-0001-000000000009"},{"cap":"20080","codice":"MilanoBasiglio","descrizione":"Basiglio","id":"ZN-00000000-0000-0000-0001-000000000010"},{"cap":"20060","codice":"MilanoBellinzagoLombardo","descrizione":"Bellinzago Lombardo","id":"ZN-00000000-0000-0000-0001-000000000011"},{"cap":"20010","codice":"MilanoBernateTicino","descrizione":"Bernate Ticino","id":"ZN-00000000-0000-0000-0001-000000000012"},{"cap":"20080","codice":"MilanoBesate","descrizione":"Besate","id":"ZN-00000000-0000-0000-0001-000000000013"},{"cap":"20082","codice":"MilanoBinasco","descrizione":"Binasco","id":"ZN-00000000-0000-0000-0001-000000000014"},{"cap":"20010","codice":"MilanoBoffalorasopraTicino","descrizione":"Boffalora sopra Ticino","id":"ZN-00000000-0000-0000-0001-000000000015"},{"cap":"20021","codice":"MilanoBollate","descrizione":"Bollate","id":"ZN-00000000-0000-0000-0001-000000000016"},{"cap":"20091","codice":"MilanoBresso","descrizione":"Bresso","id":"ZN-00000000-0000-0000-0001-000000000017"},{"cap":"20080","codice":"MilanoBubbiano","descrizione":"Bubbiano","id":"ZN-00000000-0000-0000-0001-000000000018"},{"cap":"20090","codice":"MilanoBuccinasco","descrizione":"Buccinasco","id":"ZN-00000000-0000-0000-0001-000000000019"},{"cap":"20010","codice":"MilanoBuscate","descrizione":"Buscate","id":"ZN-00000000-0000-0000-0001-000000000020"},{"cap":"20060","codice":"MilanoBussero","descrizione":"Bussero","id":"ZN-00000000-0000-0000-0001-000000000021"},{"cap":"20020","codice":"MilanoBustoGarolfo","descrizione":"Busto Garolfo","id":"ZN-00000000-0000-0000-0001-000000000022"},{"cap":"20080","codice":"MilanoCalvignasco","descrizione":"Calvignasco","id":"ZN-00000000-0000-0000-0001-000000000023"},{"cap":"20040","codice":"MilanoCambiago","descrizione":"Cambiago","id":"ZN-00000000-0000-0000-0001-000000000024"},{"cap":"20010","codice":"MilanoCanegrate","descrizione":"Canegrate","id":"ZN-00000000-0000-0000-0001-000000000025"},{"cap":"20080","codice":"MilanoCarpiano","descrizione":"Carpiano","id":"ZN-00000000-0000-0000-0001-000000000026"},{"cap":"20061","codice":"MilanoCarugate","descrizione":"Carugate","id":"ZN-00000000-0000-0000-0001-000000000027"},{"cap":"20080","codice":"MilanoCasarile","descrizione":"Casarile","id":"ZN-00000000-0000-0000-0001-000000000028"},{"cap":"20010","codice":"MilanoCasorezzo","descrizione":"Casorezzo","id":"ZN-00000000-0000-0000-0001-000000000029"},{"cap":"20062","codice":"MilanoCassanodAdda","descrizione":"Cassano d\'Adda","id":"ZN-00000000-0000-0000-0001-000000000030"},{"cap":"20060","codice":"MilanoCassinadePecchi","descrizione":"Cassina de\' Pecchi","id":"ZN-00000000-0000-0000-0001-000000000031"},{"cap":"20081","codice":"MilanoCassinettadiLugagnano","descrizione":"Cassinetta di Lugagnano","id":"ZN-00000000-0000-0000-0001-000000000032"},{"cap":"20022","codice":"MilanoCastanoPrimo","descrizione":"Castano Primo","id":"ZN-00000000-0000-0000-0001-000000000033"},{"cap":"20063","codice":"MilanoCernuscosulNaviglio","descrizione":"Cernusco sul Naviglio","id":"ZN-00000000-0000-0000-0001-000000000034"},{"cap":"20070","codice":"MilanoCerroalLambro","descrizione":"Cerro al Lambro","id":"ZN-00000000-0000-0000-0001-000000000035"},{"cap":"20023","codice":"MilanoCerroMaggiore","descrizione":"Cerro Maggiore","id":"ZN-00000000-0000-0000-0001-000000000036"},{"cap":"20090","codice":"MilanoCesanoBoscone","descrizione":"Cesano Boscone","id":"ZN-00000000-0000-0000-0001-000000000037"},{"cap":"20020","codice":"MilanoCesate","descrizione":"Cesate","id":"ZN-00000000-0000-0000-0001-000000000038"},{"cap":"20092","codice":"MilanoCiniselloBalsamo","descrizione":"Cinisello Balsamo","id":"ZN-00000000-0000-0000-0001-000000000039"},{"cap":"20080","codice":"MilanoCisliano","descrizione":"Cisliano","id":"ZN-00000000-0000-0000-0001-000000000040"},{"cap":"20093","codice":"MilanoColognoMonzese","descrizione":"Cologno Monzese","id":"ZN-00000000-0000-0000-0001-000000000041"},{"cap":"20060","codice":"MilanoColturano","descrizione":"Colturano","id":"ZN-00000000-0000-0000-0001-000000000042"},{"cap":"20011","codice":"MilanoCorbetta","descrizione":"Corbetta","id":"ZN-00000000-0000-0000-0001-000000000043"},{"cap":"20032","codice":"MilanoCormano","descrizione":"Cormano","id":"ZN-00000000-0000-0000-0001-000000000044"},{"cap":"20010","codice":"MilanoCornaredo","descrizione":"Cornaredo","id":"ZN-00000000-0000-0000-0001-000000000045"},{"cap":"20094","codice":"MilanoCorsico","descrizione":"Corsico","id":"ZN-00000000-0000-0000-0001-000000000046"},{"cap":"20012","codice":"MilanoCuggiono","descrizione":"Cuggiono","id":"ZN-00000000-0000-0000-0001-000000000047"},{"cap":"20090","codice":"MilanoCusago","descrizione":"Cusago","id":"ZN-00000000-0000-0000-0001-000000000048"},{"cap":"20095","codice":"MilanoCusanoMilanino","descrizione":"Cusano Milanino","id":"ZN-00000000-0000-0000-0001-000000000049"},{"cap":"20020","codice":"MilanoDairago","descrizione":"Dairago","id":"ZN-00000000-0000-0000-0001-000000000050"},{"cap":"20070","codice":"MilanoDresano","descrizione":"Dresano","id":"ZN-00000000-0000-0000-0001-000000000051"},{"cap":"20083","codice":"MilanoGaggiano","descrizione":"Gaggiano","id":"ZN-00000000-0000-0000-0001-000000000052"},{"cap":"20024","codice":"MilanoGarbagnateMilanese","descrizione":"Garbagnate Milanese","id":"ZN-00000000-0000-0000-0001-000000000053"},{"cap":"20060","codice":"MilanoGessate","descrizione":"Gessate","id":"ZN-00000000-0000-0000-0001-000000000054"},{"cap":"20064","codice":"MilanoGorgonzola","descrizione":"Gorgonzola","id":"ZN-00000000-0000-0000-0001-000000000055"},{"cap":"20056","codice":"MilanoGrezzago","descrizione":"Grezzago","id":"ZN-00000000-0000-0000-0001-000000000056"},{"cap":"20088","codice":"MilanoGudoVisconti","descrizione":"Gudo Visconti","id":"ZN-00000000-0000-0000-0001-000000000057"},{"cap":"20010","codice":"MilanoInveruno","descrizione":"Inveruno","id":"ZN-00000000-0000-0000-0001-000000000058"},{"cap":"20065","codice":"MilanoInzago","descrizione":"Inzago","id":"ZN-00000000-0000-0000-0001-000000000059"},{"cap":"20084","codice":"MilanoLacchiarella","descrizione":"Lacchiarella","id":"ZN-00000000-0000-0000-0001-000000000060"},{"cap":"20020","codice":"MilanoLainate","descrizione":"Lainate","id":"ZN-00000000-0000-0000-0001-000000000061"},{"cap":"20025","codice":"MilanoLegnano","descrizione":"Legnano","id":"ZN-00000000-0000-0000-0001-000000000062"},{"cap":"20060","codice":"MilanoLiscate","descrizione":"Liscate","id":"ZN-00000000-0000-0000-0001-000000000063"},{"cap":"20085","codice":"MilanoLocatediTriulzi","descrizione":"Locate di Triulzi","id":"ZN-00000000-0000-0000-0001-000000000064"},{"cap":"20013","codice":"MilanoMagenta","descrizione":"Magenta","id":"ZN-00000000-0000-0000-0001-000000000065"},{"cap":"20020","codice":"MilanoMagnago","descrizione":"Magnago","id":"ZN-00000000-0000-0000-0001-000000000066"},{"cap":"20010","codice":"MilanoMarcalloconCasone","descrizione":"Marcallo con Casone","id":"ZN-00000000-0000-0000-0001-000000000067"},{"cap":"20060","codice":"MilanoMasate","descrizione":"Masate","id":"ZN-00000000-0000-0000-0001-000000000068"},{"cap":"20060","codice":"MilanoMediglia","descrizione":"Mediglia","id":"ZN-00000000-0000-0000-0001-000000000069"},{"cap":"20077","codice":"MilanoMelegnano","descrizione":"Melegnano","id":"ZN-00000000-0000-0000-0001-000000000070"},{"cap":"20066","codice":"MilanoMelzo","descrizione":"Melzo","id":"ZN-00000000-0000-0000-0001-000000000071"},{"cap":"20010","codice":"MilanoMesero","descrizione":"Mesero","id":"ZN-00000000-0000-0000-0001-000000000072"},{"cap":"20081","codice":"MilanoMorimondo","descrizione":"Morimondo","id":"ZN-00000000-0000-0000-0001-000000000073"},{"cap":"20086","codice":"MilanoMottaVisconti","descrizione":"Motta Visconti","id":"ZN-00000000-0000-0000-0001-000000000074"},{"cap":"20014","codice":"MilanoNerviano","descrizione":"Nerviano","id":"ZN-00000000-0000-0000-0001-000000000075"},{"cap":"20020","codice":"MilanoNosate","descrizione":"Nosate","id":"ZN-00000000-0000-0000-0001-000000000076"},{"cap":"20026","codice":"MilanoNovateMilanese","descrizione":"Novate Milanese","id":"ZN-00000000-0000-0000-0001-000000000077"},{"cap":"20082","codice":"MilanoNoviglio","descrizione":"Noviglio","id":"ZN-00000000-0000-0000-0001-000000000078"},{"cap":"20090","codice":"MilanoOpera","descrizione":"Opera","id":"ZN-00000000-0000-0000-0001-000000000079"},{"cap":"20010","codice":"MilanoOssona","descrizione":"Ossona","id":"ZN-00000000-0000-0000-0001-000000000080"},{"cap":"20080","codice":"MilanoOzzero","descrizione":"Ozzero","id":"ZN-00000000-0000-0000-0001-000000000081"},{"cap":"20037","codice":"MilanoPadernoDugnano","descrizione":"Paderno Dugnano","id":"ZN-00000000-0000-0000-0001-000000000082"},{"cap":"20090","codice":"MilanoPantigliate","descrizione":"Pantigliate","id":"ZN-00000000-0000-0000-0001-000000000083"},{"cap":"20015","codice":"MilanoParabiago","descrizione":"Parabiago","id":"ZN-00000000-0000-0000-0001-000000000084"},{"cap":"20067","codice":"MilanoPaullo","descrizione":"Paullo","id":"ZN-00000000-0000-0000-0001-000000000085"},{"cap":"20016","codice":"MilanoPero","descrizione":"Pero","id":"ZN-00000000-0000-0000-0001-000000000086"},{"cap":"20068","codice":"MilanoPeschieraBorromeo","descrizione":"Peschiera Borromeo","id":"ZN-00000000-0000-0000-0001-000000000087"},{"cap":"20060","codice":"MilanoPessanoconBornago","descrizione":"Pessano con Bornago","id":"ZN-00000000-0000-0000-0001-000000000088"},{"cap":"20090","codice":"MilanoPieveEmanuele","descrizione":"Pieve Emanuele","id":"ZN-00000000-0000-0000-0001-000000000089"},{"cap":"20096","codice":"MilanoPioltello","descrizione":"Pioltello","id":"ZN-00000000-0000-0000-0001-000000000090"},{"cap":"20010","codice":"MilanoPoglianoMilanese","descrizione":"Pogliano Milanese","id":"ZN-00000000-0000-0000-0001-000000000091"},{"cap":"20060","codice":"MilanoPozzodAdda","descrizione":"Pozzo d\'Adda","id":"ZN-00000000-0000-0000-0001-000000000092"},{"cap":"20060","codice":"MilanoPozzuoloMartesana","descrizione":"Pozzuolo Martesana","id":"ZN-00000000-0000-0000-0001-000000000093"},{"cap":"20010","codice":"MilanoPregnanaMilanese","descrizione":"Pregnana Milanese","id":"ZN-00000000-0000-0000-0001-000000000094"},{"cap":"20027","codice":"MilanoRescaldina","descrizione":"Rescaldina","id":"ZN-00000000-0000-0000-0001-000000000095"},{"cap":"20017","codice":"MilanoRho","descrizione":"Rho","id":"ZN-00000000-0000-0000-0001-000000000096"},{"cap":"20020","codice":"MilanoRobecchettoconInduno","descrizione":"Robecchetto con Induno","id":"ZN-00000000-0000-0000-0001-000000000097"},{"cap":"20087","codice":"MilanoRobeccosulNaviglio","descrizione":"Robecco sul Naviglio","id":"ZN-00000000-0000-0000-0001-000000000098"},{"cap":"20090","codice":"MilanoRodano","descrizione":"Rodano","id":"ZN-00000000-0000-0000-0001-000000000099"},{"cap":"20088","codice":"MilanoRosate","descrizione":"Rosate","id":"ZN-00000000-0000-0000-0001-000000000100"},{"cap":"20089","codice":"MilanoRozzano","descrizione":"Rozzano","id":"ZN-00000000-0000-0000-0001-000000000101"},{"cap":"20078","codice":"MilanoSanColombanoalLambro","descrizione":"San Colombano al Lambro","id":"ZN-00000000-0000-0000-0001-000000000102"},{"cap":"20097","codice":"MilanoSanDonatoMilanese","descrizione":"San Donato Milanese","id":"ZN-00000000-0000-0000-0001-000000000103"},{"cap":"20010","codice":"MilanoSanGiorgiosuLegnano","descrizione":"San Giorgio su Legnano","id":"ZN-00000000-0000-0000-0001-000000000104"},{"cap":"20098","codice":"MilanoSanGiulianoMilanese","descrizione":"San Giuliano Milanese","id":"ZN-00000000-0000-0000-0001-000000000105"},{"cap":"20010","codice":"MilanoSantoStefanoTicino","descrizione":"Santo Stefano Ticino","id":"ZN-00000000-0000-0000-0001-000000000106"},{"cap":"20028","codice":"MilanoSanVittoreOlona","descrizione":"San Vittore Olona","id":"ZN-00000000-0000-0000-0001-000000000107"},{"cap":"20070","codice":"MilanoSanZenonealLambro","descrizione":"San Zenone al Lambro","id":"ZN-00000000-0000-0000-0001-000000000108"},{"cap":"20018","codice":"MilanoSedriano","descrizione":"Sedriano","id":"ZN-00000000-0000-0000-0001-000000000109"},{"cap":"20090","codice":"MilanoSegrate","descrizione":"Segrate","id":"ZN-00000000-0000-0000-0001-000000000110"},{"cap":"20030","codice":"MilanoSenago","descrizione":"Senago","id":"ZN-00000000-0000-0000-0001-000000000111"},{"cap":"20099","codice":"MilanoSestoSanGiovanni","descrizione":"Sesto San Giovanni","id":"ZN-00000000-0000-0000-0001-000000000112"},{"cap":"20090","codice":"MilanoSettala","descrizione":"Settala","id":"ZN-00000000-0000-0000-0001-000000000113"},{"cap":"20019","codice":"MilanoSettimoMilanese","descrizione":"Settimo Milanese","id":"ZN-00000000-0000-0000-0001-000000000114"},{"cap":"20020","codice":"MilanoSolaro","descrizione":"Solaro","id":"ZN-00000000-0000-0000-0001-000000000115"},{"cap":"20060","codice":"MilanoTrezzanoRosa","descrizione":"Trezzano Rosa","id":"ZN-00000000-0000-0000-0001-000000000116"},{"cap":"20090","codice":"MilanoTrezzanosulNaviglio","descrizione":"Trezzano sul Naviglio","id":"ZN-00000000-0000-0000-0001-000000000117"},{"cap":"20056","codice":"MilanoTrezzosullAdda","descrizione":"Trezzo sull\'Adda","id":"ZN-00000000-0000-0000-0001-000000000118"},{"cap":"20067","codice":"MilanoTribiano","descrizione":"Tribiano","id":"ZN-00000000-0000-0000-0001-000000000119"},{"cap":"20060","codice":"MilanoTruccazzano","descrizione":"Truccazzano","id":"ZN-00000000-0000-0000-0001-000000000120"},{"cap":"20029","codice":"MilanoTurbigo","descrizione":"Turbigo","id":"ZN-00000000-0000-0000-0001-000000000121"},{"cap":"20020","codice":"MilanoVanzaghello","descrizione":"Vanzaghello","id":"ZN-00000000-0000-0000-0001-000000000122"},{"cap":"20010","codice":"MilanoVanzago","descrizione":"Vanzago","id":"ZN-00000000-0000-0000-0001-000000000123"},{"cap":"20069","codice":"MilanoVapriodAdda","descrizione":"Vaprio d\'Adda","id":"ZN-00000000-0000-0000-0001-000000000124"},{"cap":"20080","codice":"MilanoVermezzo","descrizione":"Vermezzo","id":"ZN-00000000-0000-0000-0001-000000000125"},{"cap":"20080","codice":"MilanoVernate","descrizione":"Vernate","id":"ZN-00000000-0000-0000-0001-000000000126"},{"cap":"20060","codice":"MilanoVignate","descrizione":"Vignate","id":"ZN-00000000-0000-0000-0001-000000000127"},{"cap":"20020","codice":"MilanoVillaCortese","descrizione":"Villa Cortese","id":"ZN-00000000-0000-0000-0001-000000000128"},{"cap":"20090","codice":"MilanoVimodrone","descrizione":"Vimodrone","id":"ZN-00000000-0000-0000-0001-000000000129"},{"cap":"20010","codice":"MilanoVittuone","descrizione":"Vittuone","id":"ZN-00000000-0000-0000-0001-000000000130"},{"cap":"20070","codice":"MilanoVizzoloPredabissi","descrizione":"Vizzolo Predabissi","id":"ZN-00000000-0000-0000-0001-000000000131"},{"cap":"20080","codice":"MilanoZeloSurrigone","descrizione":"Zelo Surrigone","id":"ZN-00000000-0000-0000-0001-000000000132"},{"cap":"20080","codice":"MilanoZibidoSanGiacomo","descrizione":"Zibido San Giacomo","id":"ZN-00000000-0000-0000-0001-000000000133"},{"cap":"20121,20122,20123","codice":"MilanoZona1","descrizione":"Zona 1","id":"ZN-00000000-0000-0000-0001-000000000134"},{"cap":"20124,20125,20126,20127,20128,20131,20132","codice":"MilanoZona2","descrizione":"Zona 2","id":"ZN-00000000-0000-0000-0001-000000000135"},{"cap":"20129,20133,20134","codice":"MilanoZona3","descrizione":"Zona 3","id":"ZN-00000000-0000-0000-0001-000000000136"},{"cap":"20135,20137,20138,20139","codice":"MilanoZona4","descrizione":"Zona 4","id":"ZN-00000000-0000-0000-0001-000000000137"},{"cap":"20136,20141,20142,20143","codice":"MilanoZona5","descrizione":"Zona 5","id":"ZN-00000000-0000-0000-0001-000000000138"},{"cap":"20144,20146,20147,20152","codice":"MilanoZona6","descrizione":"Zona 6","id":"ZN-00000000-0000-0000-0001-000000000139"},{"cap":"20145,20148,20149,20151,20153","codice":"MilanoZona7","descrizione":"Zona 7","id":"ZN-00000000-0000-0000-0001-000000000140"},{"cap":"20154,20155,20156,20157,20158,20159,20161,20162","codice":"MilanoZona8","descrizione":"Zona 8","id":"ZN-00000000-0000-0000-0001-000000000141"}]');

    var zoneObj = {
      id: {},
      codice: {},
      descrizione: {}
    };

    self.zoneArray = [];

    self.selector = {
      model: null
    };

    zone.forEach(function(zona){
      zoneObj.id[zona.codice] = zona.id;
      zoneObj.codice[zona.id] = zona.codice;
      zoneObj.descrizione[zona.codice] = zona.descrizione;
      self.zoneArray.push(zona);
    });


    self.zoneData = zoneObj;

    self.map = {
      center: { latitude: 45.465422, longitude: 9.164658 },
      zoom: Modernizr.touch ? 10 : 11,
      control: {}
    }

    self.mapOptions = {
      styles: styles,
      disableDoubleClickZoom: Modernizr.touch ? true : false,
      scrollwheel: false,
      maxZoom : 15,
      minZoom : Modernizr.touch ? 10 : 11
    }

    self.zonesJson = JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"zona":1},"geometry":{"type":"Polygon","coordinates":[[[9.175043106079102,45.477405995964276],[9.166417121887207,45.47177854268367],[9.165258407592773,45.46753501112275],[9.166202545166016,45.4673243310189],[9.164268672466278,45.46143061223281],[9.174058735370636,45.45534248562009],[9.177446365356445,45.45296613177457],[9.180021286010742,45.452905921983756],[9.186930656433105,45.45230382054015],[9.192895889282227,45.45200276740782],[9.20106053352356,45.45194255658851],[9.20181155204773,45.45230382054015],[9.202358722686768,45.453436518552564],[9.20401096343994,45.456849527498335],[9.206757545471191,45.460822957927796],[9.20555591583252,45.47048444989679],[9.205470085144043,45.473824954349965],[9.198925495147705,45.47702984682734],[9.193877577781677,45.47951238472931],[9.18681263923645,45.48046775653326],[9.182467460632324,45.481167349233175],[9.181437492370605,45.4789105674028],[9.180879592895508,45.47759030812477],[9.177140593528748,45.47680603689943],[9.176416397094727,45.47638286443829],[9.175043106079102,45.477405995964276]]]}},{"type":"Feature","properties":{"zona":2},"geometry":{"type":"Polygon","coordinates":[[[9.186815321445465,45.48046775653326],[9.188963770866394,45.4877133857658],[9.190787672996521,45.48941135717421],[9.192128777503967,45.4917523301645],[9.196283519268034,45.49903222832452],[9.2007976770401,45.50692586825621],[9.205494225025175,45.51514355230358],[9.211478233337402,45.5256075208071],[9.222335815429688,45.52324728409931],[9.231691360473633,45.52246552781801],[9.240961074829102,45.522104713562825],[9.245080947875977,45.51368505735564],[9.25147533416748,45.51278287661031],[9.259328842163086,45.51909783811403],[9.273362159729004,45.516872646826776],[9.272632598876953,45.50189542211625],[9.276924133300781,45.50189542211625],[9.273319244384766,45.49648098683461],[9.264567196369171,45.4999853891093],[9.255766868591309,45.50048170312951],[9.243656694889069,45.500959213246695],[9.23924446105957,45.49750375338381],[9.241390228271484,45.49124653781489],[9.236969947814941,45.491066030895205],[9.238343238830566,45.48203994730762],[9.231562614440918,45.47927165857007],[9.225382804870605,45.47939202177826],[9.216928482055664,45.479331840206285],[9.210834503173826,45.48020446670827],[9.20478343963623,45.47415598454891],[9.193882942199707,45.47951238472931],[9.186815321445465,45.48046775653326]]]}},{"type":"Feature","properties":{"zona":3},"geometry":{"type":"Polygon","coordinates":[[[9.206577837467194,45.46227341603134],[9.21204686164856,45.46223390988476],[9.221649169921875,45.46217370998905],[9.23774242401123,45.46207212251932],[9.269175231456757,45.461906572176446],[9.269027709960938,45.46666218842334],[9.264822006225586,45.46753501112275],[9.263448715209961,45.47698470876219],[9.267997741699219,45.478970749424704],[9.268383979797362,45.48583107857135],[9.262676239013672,45.48583107857135],[9.260873794555664,45.490494421832885],[9.263148307800293,45.49440531526346],[9.26323413848877,45.5000605884845],[9.255761504173279,45.50048170312951],[9.243664741516113,45.500962973152824],[9.23924446105957,45.497501873315294],[9.241390228271484,45.49124653781489],[9.236969947814941,45.491066030895205],[9.238343238830566,45.482038066722836],[9.231565296649933,45.47927165857007],[9.22538012266159,45.47939202177826],[9.216928482055664,45.479331840206285],[9.210831820964813,45.48020258606224],[9.20478343963623,45.47415598454891],[9.205472767353058,45.473824954349965],[9.20555591583252,45.47048444989679],[9.206577837467194,45.46227341603134]]]}},{"type":"Feature","properties":{"zona":4},"geometry":{"type":"Polygon","coordinates":[[[9.19653296470642,45.451972662006185],[9.199719429016113,45.44050133455025],[9.203667640686035,45.43923663601642],[9.204740524291992,45.43360537226622],[9.211649894714355,45.43396675365872],[9.215941429138184,45.43011189949995],[9.213151931762695,45.42743141603499],[9.219331741333008,45.41755168132622],[9.224138259887695,45.41851563399241],[9.226627349853516,45.416045472341004],[9.221134185791016,45.41291242895992],[9.224309921264648,45.40748944311699],[9.23521041870117,45.41002023463975],[9.234695434570312,45.413635454398545],[9.245166778564453,45.4159249738866],[9.245767593383789,45.42670856724186],[9.25074577331543,45.42526284188612],[9.255123138427734,45.427130230162774],[9.255123138427734,45.43050342013797],[9.265937805175781,45.438393487911696],[9.267139434814453,45.450015776430654],[9.265851974487305,45.45549488494389],[9.269167184829712,45.461906572176446],[9.20930564403534,45.462250841093834],[9.206577837467194,45.46227153478691],[9.206762909889221,45.460822957927796],[9.20401096343994,45.456849527498335],[9.20181155204773,45.45230193896306],[9.201063215732574,45.45194255658851],[9.19653296470642,45.451972662006185]]]}},{"type":"Feature","properties":{"zona":5},"geometry":{"type":"Polygon","coordinates":[[[9.177961349487305,45.452484451648175],[9.137449264526367,45.44387372538452],[9.124314486980438,45.43393852082076],[9.127321243286133,45.42544355958045],[9.136762619018553,45.41465972459114],[9.137191772460938,45.41164711216872],[9.150581359863281,45.41152660432918],[9.16010856628418,45.40899588030234],[9.159507751464844,45.39628028905252],[9.172768592834473,45.39326669632959],[9.17959213256836,45.389620034263125],[9.191350936889647,45.392121488957834],[9.209933280944822,45.39640082941875],[9.223065376281738,45.396732314100085],[9.222941994667053,45.40982816961657],[9.221128821372986,45.41291242895992],[9.226621985435484,45.41604735512732],[9.22413557767868,45.41851563399241],[9.219329059123993,45.41755356406231],[9.21314924955368,45.42743141603499],[9.215938746929169,45.4301137818172],[9.21164721250534,45.43396675365872],[9.204740524291992,45.43360725446698],[9.203662276268005,45.43923851802932],[9.199716746807098,45.44050133455025],[9.196530282497404,45.45197454359427],[9.192879796028137,45.45200276740782],[9.186919927597046,45.45230382054015],[9.180021286010742,45.4529078035407],[9.17744368314743,45.45296613177457],[9.177961349487305,45.452484451648175]]]}},{"type":"Feature","properties":{"zona":6},"geometry":{"type":"Polygon","coordinates":[[[9.124314486980438,45.43393852082076],[9.11590576171875,45.43833326256496],[9.109039306640625,45.43977865314493],[9.099769592285154,45.450136202118934],[9.091873168945312,45.452785502209274],[9.08243179321289,45.4502566275501],[9.086036682128906,45.44327152752011],[9.078826904296875,45.44038088829218],[9.060287475585938,45.44074222629504],[9.061317443847656,45.46753501112275],[9.076766967773438,45.4669330658798],[9.091873168945312,45.46976215263039],[9.111270904541016,45.469521384817995],[9.117021560668945,45.47102616677216],[9.118952751159668,45.47298232325123],[9.124145507812498,45.46988253615093],[9.131226539611816,45.46801656268899],[9.14161205291748,45.46736947682174],[9.150753021240234,45.46648160272921],[9.152984619140625,45.46708355279314],[9.165789484977722,45.46607152056701],[9.164268672466278,45.46143061223281],[9.17406141757965,45.45534060414437],[9.17744368314743,45.45296613177457],[9.17795866727829,45.452484451648175],[9.137446582317352,45.44387184352622],[9.124314486980438,45.43393852082076]]]}},{"type":"Feature","properties":{"zona":7},"geometry":{"type":"Polygon","coordinates":[[[9.172368943691254,45.475660642764765],[9.156074523925781,45.48805749706375],[9.121997058391571,45.503583566635655],[9.120194613933563,45.50141791993921],[9.104833602905273,45.505147592996856],[9.10963475704193,45.51152355847056],[9.089298248291016,45.51320389609124],[9.08792495727539,45.49985002998086],[9.073333740234375,45.49792488715171],[9.059429168701172,45.49828585644593],[9.046554565429688,45.491667718377784],[9.061317443847656,45.46753501112275],[9.076761603355408,45.46693494696869],[9.091873168945312,45.46976403362488],[9.111265540122986,45.4695232658205],[9.1170135140419,45.47102804772447],[9.118950068950653,45.47298420413824],[9.124142825603485,45.46988629813182],[9.131226539611816,45.46801844374173],[9.14162814617157,45.46737135789607],[9.15075033903122,45.466485364937085],[9.152984619140625,45.467085433877045],[9.165789484977722,45.46607340168466],[9.166197180747984,45.4673243310189],[9.165255725383759,45.46753689219157],[9.166414439678192,45.471782304538],[9.172368943691254,45.475660642764765]]]}},{"type":"Feature","properties":{"zona":8},"geometry":{"type":"Polygon","coordinates":[[[9.089295566082,45.513205775635456],[9.088354110717773,45.5201502628001],[9.092259407043457,45.52457023152074],[9.093976020812988,45.52935062309411],[9.102344512939453,45.52962119914793],[9.112257957458496,45.520450951951915],[9.119081497192383,45.5231871493864],[9.138822555541992,45.52571275198491],[9.144144058227539,45.52042088310905],[9.153928756713867,45.522104713562825],[9.154014587402344,45.5277572043752],[9.166631698608398,45.53551342148722],[9.17933464050293,45.54080387060464],[9.182252883911133,45.5405032902423],[9.185686111450195,45.53340912723174],[9.188346862792969,45.52871927390669],[9.199333190917969,45.530222474607434],[9.198732376098633,45.532747761346435],[9.21572685241699,45.533288879467456],[9.211475551128387,45.5256075208071],[9.190790355205536,45.48941323751285],[9.188963770866394,45.4877133857658],[9.186815321445465,45.48046775653326],[9.18246477842331,45.48116922984702],[9.18144017457962,45.4789105674028],[9.180876910686493,45.47758842739146],[9.177143275737762,45.47680791765882],[9.176413714885712,45.476384745211824],[9.175043106079102,45.477405995964276],[9.172368943691254,45.47566628515747],[9.156071841716766,45.48806125783135],[9.121997058391571,45.503583566635655],[9.120194613933563,45.50141791993921],[9.104833602905273,45.505147592996856],[9.109637439250946,45.51152355847056],[9.089295566082,45.513205775635456]]]}}]}');

    self.addAreaProvincia = function(codice){
      if(!_.includes(self.areasProvinciaSelected, codice) && codice) {
        $timeout(function(){
          self.areasProvinciaSelected.push(codice);
          self.selector.model = null;
        });
      }
    }

    self.removeAreaProvincia = function(codice){
      if(_.includes(self.areasProvinciaSelected, codice)) {
        $timeout(function(){
          _.pull(self.areasProvinciaSelected, codice);
        });
      }
    }

    self.sendZones = function(){
      sendNewZones();
    }

    self.getZonesArray = function(){
      return getZonesArray();
    }

    self.isMilan = function(codice){
      if(codice == "MilanoZona1" || codice == "MilanoZona2" || codice == "MilanoZona3" || codice == "MilanoZona4" || codice == "MilanoZona5" || codice == "MilanoZona6" || codice == "MilanoZona7" || codice == "MilanoZona8")
        return true;
      else
        return false;
    }

    var array = ['ciao'];

    array.length = 0;

    self.setData = function(id, instance, area, areaP, selected, disabled){
      var formDisabled = false;
      if(disabled !== undefined && disabled === true)
        formDisabled = true;
      heroInfo = id;
      uiGmapIsReady = instance;
      self.areasSelected = area;
      self.areasProvinciaSelected = areaP;
      self.selected = selected;

      /*uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {
          map = inst.map;
          var uuid = map.uiGmap_id;
          var mapInstanceNumber = inst.instance; // Starts at 1.
          var idleStyle = {
            fillColor: "#fff",
            fillOpacity: 0,
            strokeWeight: 3,
            strokeColor: "#EE693C"
          };
          var activeStyle = {
            fillColor: '#EE693C',
            fillOpacity: 0.5,
            strokeWeight: 3,
            strokeColor: "#EE693C"
          };

          map.data.addGeoJson(self.zonesJson);

          setInizialSelected(heroInfo.data.zone);

          // Add some style.
          map.data.setStyle(function(feature) {
            var zonaNumero = feature.getProperty('zona');
            var selected = self.selected['MilanoZona'+zonaNumero];
            if(selected)
              return (activeStyle);
            else
              return (idleStyle);
          });


          if(!formDisabled) {
            if(!Modernizr.touch){
              map.data.addListener('mouseover', function(event) {
                var zonaNumero = event.feature.getProperty('zona');
                var selected = self.selected['MilanoZona'+zonaNumero];
                if(!selected){
                  map.data.overrideStyle(event.feature, activeStyle);
                }
              });

              map.data.addListener('mouseout', function(event) {
                var zonaNumero = event.feature.getProperty('zona');
                var selected = self.selected['MilanoZona'+zonaNumero];
                if(!selected){
                  map.data.overrideStyle(event.feature, idleStyle);
                }
              });
            }

            // Set mouseover event for each feature.
            map.data.addListener('click', function(event) {
              var zonaNumero = event.feature.getProperty('zona');
              toggleZona(zonaNumero);
              if(!Modernizr.touch){
                map.data.overrideStyle(event.feature, activeStyle);
              } else {
                var selected = self.selected['MilanoZona'+zonaNumero];
                if(selected) map.data.overrideStyle(event.feature, activeStyle);
                else map.data.overrideStyle(event.feature, idleStyle);
              }
            });
          }

        });
    });*/
    }

    self.setDataNew = function(instance, area, areaP, selected){
      uiGmapIsReady = instance;
      self.areasSelected = area;
      self.areasProvinciaSelected = areaP;
      self.selected = selected;

      /*uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {
          map = inst.map;
          var uuid = map.uiGmap_id;
          var mapInstanceNumber = inst.instance; // Starts at 1.
          var idleStyle = {
            fillColor: "#fff",
            fillOpacity: 0,
            strokeWeight: 3,
            strokeColor: "#EE693C"
          };
          var activeStyle = {
            fillColor: '#EE693C',
            fillOpacity: 0.5,
            strokeWeight: 3,
            strokeColor: "#EE693C"
          };

          map.data.addGeoJson(self.zonesJson);

          // Add some style.
          map.data.setStyle(function(feature) {
            var zonaNumero = feature.getProperty('zona');
            var selected = self.selected['MilanoZona'+zonaNumero];
            if(selected)
              return (activeStyle);
            else
              return (idleStyle);
          });

          map.data.revertStyle();

          if(!Modernizr.touch){
            map.data.addListener('mouseover', function(event) {
              var zonaNumero = event.feature.getProperty('zona');
              var selected = self.selected['MilanoZona'+zonaNumero];
              if(!selected){
                map.data.overrideStyle(event.feature, activeStyle);
              }
            });

            map.data.addListener('mouseout', function(event) {
              var zonaNumero = event.feature.getProperty('zona');
              var selected = self.selected['MilanoZona'+zonaNumero];
              if(!selected){
                map.data.overrideStyle(event.feature, idleStyle);
              }
            });
          }

          // Set mouseover event for each feature.
          map.data.addListener('click', function(event) {
            var zonaNumero = event.feature.getProperty('zona');
            toggleZona(zonaNumero);
            if(!Modernizr.touch){
              map.data.overrideStyle(event.feature, activeStyle);
            } else {
              var selected = self.selected['MilanoZona'+zonaNumero];
              if(selected) map.data.overrideStyle(event.feature, activeStyle);
              else map.data.overrideStyle(event.feature, idleStyle);
            }
          });

        });
    });*/
    }

    function resetSelected(){

    }

    function setInizialSelected(zones){
      if(zones.length > 1 && _.isArray(zones)){
        var mapZones = [];
        var otherZones = [];
        zones.forEach(function(zona){
          if(_.includes(zona.codice, 'MilanoZona')){
            var num = zona.codice;
            num = parseInt(num.replace("MilanoZona", ""));
            if(!isNaN(num))
              toggleZona(num);
          } else {
            otherZones.push(zona.codice);
          }
        });
        $timeout(function(){
          otherZones.forEach(function(zone){
            self.areasProvinciaSelected.push(zone);
          });
        });
      }
    }

    function toggleZona(num){
      self.selected['MilanoZona'+num] = !self.selected['MilanoZona'+num];
      updateModel();
    }

    function updateModel(){
      var model = [];
      for(var key in self.selected){
        if(self.selected[key] === true){
          model.push(key);
        }
      }
      $timeout(function(){
        self.areasSelected.length = 0;
        model.forEach(function(m){
          self.areasSelected.push(m);
        });
      });
    }

    function sendNewZones(){
      var idsToSend = [];
      self.areasSelected.forEach(function(area){
        idsToSend.push(zoneObj.id[area]);
      });
      self.areasProvinciaSelected.forEach(function(area){
        idsToSend.push(zoneObj.id[area]);
      });

      var newHero = _.cloneDeep(heroInfo.data.plain());
      newHero.numeroRecensioni = undefined;

      //var newHero = {
      //  luogoNascita: oldHero.luogoNascita,
      //  cellulare: oldHero.cellulare,
      //  dataNascita: oldHero.dataNascita,
      //  codiceFiscale: oldHero.codiceFiscale,
      //  nome: oldHero.nome,
      //  titoloStudio: oldHero.titoloStudio,
      //  cognome: oldHero.cognome,
      //  indirizzoResidenza: oldHero.indirizzoResidenza,
      //  sesso: oldHero.sesso,
      //  cittadinanza: oldHero.cittadinanza,
      //  email: oldHero.email,
      //  conoscenzaItaliano: oldHero.conoscenzaItaliano,
      //};
      var newZones = [];
      zone.forEach(function(zona){
        if(_.includes(idsToSend, zona.id)){
          newZones.push(zona);
        }
      });

      newHero.zone = newZones;
      var p = RestService.editHero(heroInfo.data.id, newHero);
      p.then(function(data){
        NotifyService.saveConfirmed();
      }, function(){
        NotifyService.saveConfirmed(true);
      });
    }

    function getZonesArray(){
      var idsToSend = [];
      self.areasSelected.forEach(function(area){
        idsToSend.push(zoneObj.id[area]);
      });
      self.areasProvinciaSelected.forEach(function(area){
        idsToSend.push(zoneObj.id[area]);
      });

      var newZones = [];
      zone.forEach(function(zona){
        if(_.includes(idsToSend, zona.id)){
          newZones.push(zona);
        }
      });

      return newZones;
    }

}
