'use strict';

export default function LandingSectionDirective (

        $log,
        $timeout,
        $window,
        $ngRedux,
        $state,
        AssetsStore,
        HerosearchActions,
        BookingActions,
        StaticPage,
        BookingModel,
        SERVICES,
        Carnet,
        CarnetActions
    ) {
        "ngInject";

        var filters = {
            badante: 'ATT-00000000-0000-0000-0001-000000000001',
            'baby-sitter': 'ATT-00000000-0000-0000-0001-000000000002',
            colf: 'ATT-00000000-0000-0000-0001-000000000003',
            'personal-trainer': {
                'allenamento-funzionale': 'ATT-00000000-0000-0000-0001-000000000004',
                dimagrimento: 'ATT-00000000-0000-0000-0001-000000000005',
                'ginnastica-posturale': 'ATT-00000000-0000-0000-0001-000000000006',
                ciclismo: 'ATT-00000000-0000-0000-0001-000000000007',
                yoga: 'ATT-00000000-0000-0000-0001-000000000008',
                'difesa-personale': 'ATT-00000000-0000-0000-0001-000000000009',
                corsa: 'ATT-00000000-0000-0000-0001-000000000010',
                pilates: 'ATT-00000000-0000-0000-0001-0000000000011'
            }
        }

        var serviceSummerCarnets = {
            [SERVICES.BADANTE]: 'TC-0000-0000-00CE-0001',
            [SERVICES.COLF]: 'TC-0000-0000-00CE-0003',
            [SERVICES.BABYSITTER]: 'TC-0000-0000-00CE-0002',
        }

        var colf = {
            title: 'Per le tue pulizie affidati ad un supereroe',
            tagline: 'Scegli il professionista che fa per te e prenotalo online.',
            background: AssetsStore.Image('landing.colf'),
            backgroundClassName: 'center-center',
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'Le nostre Colf sono specializzate per svolgere tutte le mansioni domestiche. Affidati a loro  per tenere la tua casa sempre in ordine',
                list: [
                    { id: 4, title: "Pulizie di base", icon: AssetsStore.Icon('babySitterServices.houseCleaning'), description: 'Pulizia di base'},
                    { id: 1, title: "Frigorifero", icon: AssetsStore.Icon('colfServices.fridge'), description: 'Pulizia elettrodomestici (es. forno, frigorifero)'},
                    { id: 3, title: "Vetri interni", icon: AssetsStore.Icon('colfServices.windows'), description: 'Pulizia vetri e terrazze'},
                    { id: 5, title: "Lampadari", icon: AssetsStore.Icon('colfServices.chandelier'), description: 'Pulizia arredamento (es. armadi, lampadari)'},
                    { id: 6, title: "Lavaggio capi", icon: AssetsStore.Icon('colfServices.washing'), description: "Lavaggio capi d\'abbigliamento"},
                    { id: 7, title: "Stiratura", icon: AssetsStore.Icon('colfServices.iron'), description: 'Stiratura'}
                ]
            }
        }

        var badante = {
            title: 'Per i tuoi cari chiedi aiuto ad un supereroe',
            tagline: 'Affidabili, cordiali e referenziati. Scegli il professionista che fa per te.',
            background: AssetsStore.Image('landing.badante'),
            backgroundClassName: 'center-center',
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'L’assistenza alle persone anziane è un lavoro delicato. Per questo le nostre Badanti hanno la giusta sensibilità per capire al meglio i bisogni dei tuoi cari',
                list: [
                    {title: "Assistenza di base", icon: AssetsStore.Icon('service.two'), description: 'Assistenza di base (es. compagnia, tempo libero)'},
                    {title: "Igiene personale", icon: AssetsStore.Icon('badanteServices.personalHygene'), description: 'Assistenza alla cura dell’igiene personale'},
                    {title: "Cucina", icon: AssetsStore.Icon('badanteServices.pan'), description: 'Supporto allo svolgimento delle attività domestiche (es. pulizie, cucinare)'},
                    {title: "Mobilizzazione domestica", icon: AssetsStore.Icon('badanteServices.mobility'), description: 'Assistenza mobilizzazione domestica'},
                    {title: "Commissioni varie", icon: AssetsStore.Icon('badanteServices.shoppingCart'), description: 'Assistenza nello svolgimento delle commissioni quotidiane'}
                ]
            }
        }

        var babySitter = {
            title: 'Per i tuoi bimbi ci vuole un supereroe',
            tagline: 'Dolci, affidabili, referenziate. Scegli una Baby Sitter professionale.',
            background: AssetsStore.Image('home.dividerImages.three'),
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'Vorresti essere ogni ora a fianco dei tuoi bimbi, ma i tanti impegni non sempre te lo consentono. Le nostre Baby Sitter sanno cosa vuol dire essere genitori, e sono in grado di accompagnare e curare i tuoi bimbi in ogni passo della loro crescita',
                list: [
                    {title: "Assistenza di base", icon: AssetsStore.Icon('service.three'), description: 'Assistenza di base (es. Controllarli e seguirli nelle ore di gioco)'},
                    {title: "Compiti", icon: AssetsStore.Icon('babySitterServices.study'), description: 'Seguirli nei compiti'},
                    {title: "Igiene personale", icon: AssetsStore.Icon('badanteServices.personalHygene'), description: 'Curare la loro igiene personale (per i bimbi più piccoli)'},
                    {title: "Spostamenti", icon: AssetsStore.Icon('babySitterServices.car'), description: 'Accompagnarli nei loro spostamenti con mezzi pubblici (es. a scuola)'},
                    {title: "Cucina", icon: AssetsStore.Icon('babySitterServices.pan'), description: 'Svolgere alcune attività domestiche (es. pulizie, cucinare)'}
                ]
            }
        }

        var personalTrainer = {
            title: 'Per la tua forma affidati ad un supereroe',
            tagline: 'Trova Personal Trainer professionali, disponibili dove e quando vuoi tu',
            background: AssetsStore.Image('landing.personalTrainer'),
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                list: [
                    { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), },
                    { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), },
                    { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'), },
                    { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'), },
                    { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'), },
                    { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'), },
                    { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'), },
                    { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'), },
                ]
            }
        }

        var personalTrainerSubcompetences = {
            'allenamento-funzionale': { 
                title: 'Per il tuo allenamento funzionale <b>affidati ad un supereroe</b>',
                tagline: 'Patito di TRX e kettlebell? Scegli un professionista, ti raggiunge dove vuoi!',
                background: AssetsStore.Image('landing.personalTrainerAllenamentoFunzionale'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), name: 'dimagrimento'},
                        { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'), name: 'ginnastica-posturale'},
                        { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'),  name: 'ciclismo'},
                        { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'),  name: 'yoga'},
                        { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),  name: 'difesa-personale'},
                        { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'),  name: 'corsa'},
                        { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'),  name: 'pilates'},
                    ]
                }
            },
            dimagrimento: { 
                title: 'Per tenerti in forma <b>affidati ad un supereroe</b>',
                tagline: 'Perdere peso? Con i Personal Trainer a domicilio è facile! Prenota un esperto dedicato!',
                background: AssetsStore.Image('landing.personalTrainerDimagrimento'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), name: 'allenamento-funzionale'},
                        { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'), name: 'ginnastica-posturale'},
                        { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'),  name: 'ciclismo'},
                        { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'),  name: 'yoga'},
                        { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),  name: 'difesa-personale'},
                        { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'),  name: 'corsa'},
                        { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'),  name: 'pilates'},
                    ]
                }
            },
            'ginnastica-posturale': { 
                title: 'Scopri <b>la postura perfetta</b> con un supereroe',
                tagline: 'Un Personal Trainer dedicato per la tua ginnastica posturale. Dove e quando vuoi!',
                background: AssetsStore.Image('landing.personalTrainerGinnasticaPosturale'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), name: 'allenamento-funzionale'},
                        { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), name: 'dimagrimento'},
                        { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'),  name: 'ciclismo'},
                        { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'),  name: 'yoga'},
                        { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),  name: 'difesa-personale'},
                        { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'),  name: 'corsa'},
                        { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'),  name: 'pilates'},
                    ]
                }
            },
            ciclismo: { 
                title: 'Per essere solo al comando <b>ti serve un supereroe!</b>',
                tagline: 'Passione ciclismo? Raggiungi l’eccellenza con un Personal Trainer esperto. Disponibile dove e quando vuoi!',
                background: AssetsStore.Image('landing.personalTrainerCiclismo'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), name: 'allenamento-funzionale'},
                        { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), name: 'dimagrimento'},
                        { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),  name: 'dimagrimento'},
                        { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'),  name: 'yoga'},
                        { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),  name: 'difesa-personale'},
                        { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'),  name: 'corsa'},
                        { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'),  name: 'pilates'},
                    ]
                }
            },
            yoga: { 
                title: '<b>TONIFICA CORPO E MENTE</b> CON UN SUPEREROE',
                tagline: 'Star bene "fuori e dentro" con lo yoga? Prenota un Personal Trainer dove e quando vuoi.',
                background: AssetsStore.Image('landing.personalTrainerYoga'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), name: 'allenamento-funzionale'},
                        { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), name: 'dimagrimento'},
                        { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),  name: 'dimagrimento'},
                        { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'),  name: 'ciclismo'},
                        { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),  name: 'difesa-personale'},
                        { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'),  name: 'corsa'},
                        { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'),  name: 'pilates'},
                    ]
                }
            },
            'difesa-personale': { 
                title: 'IMPARA <b>LE TECNICHE DI DIFESA PERSONALE</b> CON UN SUPEREROE',
                tagline: 'Difenditi grazie a un Personal Trainer professionista. Dove e quando vuoi tu.',
                background: AssetsStore.Image('landing.personalTrainerDifesaPersonale'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), name: 'allenamento-funzionale'},
                        { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), name: 'dimagrimento'},
                        { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),  name: 'dimagrimento'},
                        { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'),  name: 'ciclismo'},
                        { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'),  name: 'yoga'},
                        { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'),  name: 'corsa'},
                        { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'),  name: 'pilates'},
                    ]
                }
            },
            corsa: { 
                title: 'Ami la corsa? Con un supereroe <b>non avrai più ostacoli!</b>',
                tagline: 'Corri in discesa con un Personal Trainer esperto. Dove e quando vuoi.',
                background: AssetsStore.Image('landing.personalTrainerCorsa'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), name: 'allenamento-funzionale'},
                        { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), name: 'dimagrimento'},
                        { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),  name: 'dimagrimento'},
                        { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'),  name: 'ciclismo'},
                        { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'),  name: 'yoga'},
                        { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),  name: 'difesa-personale'},
                        { title: 'Pilates', icon: AssetsStore.Icon('personalTrainer.pilates'),  name: 'pilates'},
                    ]
                }
            },
            pilates: { 
                title: 'SCOPRI IL MONDO DEL PILATES <b>CON UN SUPEREROE</b>',
                tagline: 'Concentrazione, respirazione… Pilates! Prenota un Personal Trainer dedicato e migliorati la vita!',
                background: AssetsStore.Image('landing.personalTrainerPilates'),
                services: {
                    title: 'Cosa possono fare i nostri supereroi per te',
                    tagline: 'I nostri Personal Trainer sono in grado di seguirti nei tuoi allenamenti quando e dove preferisci. Affidati alla loro professionalità e competenza!',
                    list: [
                        { title: 'Allenamento Funzionale', icon: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), name: 'allenamento-funzionale'},
                        { title: 'Dimagrimento', icon: AssetsStore.Icon('personalTrainer.dimagrimento'), name: 'dimagrimento'},
                        { title: 'Ginnastica Posturale', icon: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'),  name: 'dimagrimento'},
                        { title: 'Ciclismo', icon: AssetsStore.Icon('personalTrainer.ciclismo'),  name: 'ciclismo'},
                        { title: 'Yoga', icon: AssetsStore.Icon('personalTrainer.yoga'),  name: 'yoga'},
                        { title: 'Difesa Personale', icon: AssetsStore.Icon('personalTrainer.difesaPersonale'),  name: 'difesa-personale'},
                        { title: 'Corsa', icon: AssetsStore.Icon('personalTrainer.corsa'),  name: 'corsa'},
                    ]
                }
            }

        }

        var stiro = {
            title: 'NON SUDARE SETTE CAMICIE... <b>TE LE STIRA UN SUPEREROE!</b>',
            tagline: 'Allarme guardaroba? Scegli professioniste pronte a imbracciare asse e ferro da stiro. A casa tua, quando vuoi.',
            background: AssetsStore.Image('landing.stiro'),
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'I nostri professionisti del Servizio Stiratura possono aiutarti con ogni capo: t-shirt, camicie ma anche tende e lenzuola. Competenza garantita!',
                list: [
                    //{title: "Assistenza di base", icon: AssetsStore.Icon('service.three'), description: 'Assistenza di base (es. Controllarli e seguirli nelle ore di gioco)'},
                    //{title: "Compiti", icon: AssetsStore.Icon('babySitterServices.study'), description: 'Seguirli nei compiti'},
                    //{title: "Igiene personale", icon: AssetsStore.Icon('badanteServices.personalHygene'), description: 'Curare la loro igiene personale (per i bimbi più piccoli)'},
                    //{title: "Spostamenti", icon: AssetsStore.Icon('babySitterServices.car'), description: 'Accompagnarli nei loro spostamenti con mezzi pubblici (es. a scuola)'},
                    //{title: "Cucina", icon: AssetsStore.Icon('babySitterServices.pan'), description: 'Svolgere alcune attività domestiche (es. pulizie, cucinare)'}
                ]
            }
        }

        var fisioterapista = {
            title: 'LA GIOIA DI MUOVERSI? <b>E\' UN SUPERPOTERE!</b>',
            tagline: 'Professionisti in fisioterapia ed osteopatia al tuo servizio. Prenotali quando e dove vuoi.',
            background: AssetsStore.Image('landing.fisioterapista'),
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'Fisioterapisti, osteopati e massofisioterapisti al servizio del tuo benessere. La sicurezza di una mano esperta!',
                list: [
                    {title: "Valutazione Funzionale", icon: AssetsStore.Icon('fisioterapista.valutazioneFunzionale')},
                    {title: "Fisioterapia Cardiologica", icon: AssetsStore.Icon('fisioterapista.fisioterapiaCardiologica')},
                    {title: "Fisioterapia Ortopedica", icon: AssetsStore.Icon('fisioterapista.fisioterapiaOrtopedica')},
                    {title: "Fisioterapia Neurologica", icon: AssetsStore.Icon('fisioterapista.fisioterapiaNeurologica')},
                    {title: "Fisioterapia Respiratoria", icon: AssetsStore.Icon('fisioterapista.fisioterapiaRespiratoria')},
                    {title: "Ginnastica Posturale", icon: AssetsStore.Icon('fisioterapista.ginnasticaPosturale')},
                    {title: "Linfodrenaggio", icon: AssetsStore.Icon('fisioterapista.linfodrenaggio')},
                    {title: "Massoterapia Gambe e Schiena", icon: AssetsStore.Icon('fisioterapista.massoterapiaGambeSchiena')},
                    {title: "Osteopatia", icon: AssetsStore.Icon('fisioterapista.osteopatia')}
                ]
            }
        }

        var tuttofare = {
            title: 'LAVORETTI DI CASA? <b>QUI CI VUOLE UN SUPEREROE!</b>',
            tagline: 'Devi spostare l’armadio? Scegli uno dei nostri professionisti e prenotalo online.',
            background: AssetsStore.Image('landing.tuttofare'),
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'Devi spostare l’armadio? O proprio montarlo da zero? I nostri professionisti sono qui per aiutarti per questa e per le tante altre piccole necessità di ogni giorno. Prenotali online quando e dove vuoi tu!',
                list: [
                    {title: "Montaggio e smontaggio mobili", icon: AssetsStore.Icon('tuttofareServices.montaggio')},
                    {title: "Spostamento mobili o oggetti pesanti", icon: AssetsStore.Icon('tuttofareServices.spostamento')},
                    {title: "Aiuto nei traslochi", icon: AssetsStore.Icon('tuttofareServices.trasloco')},
                    {title: "Carico e scarico merci", icon: AssetsStore.Icon('tuttofareServices.scaricoMerci')},
                    {title: "Piccoli lavori di giardinaggio", icon: AssetsStore.Icon('tuttofareServices.giardinaggio')},
                    {title: "Piccoli lavori domestici", icon: AssetsStore.Icon('tuttofareServices.lavoriDomestici')},
                    {title: "Sistemazione legna", icon: AssetsStore.Icon('tuttofareServices.legna')},
                    {title: "Stuccatura", icon: AssetsStore.Icon('tuttofareServices.stuccatura')},
                ]
            }
        }

        var tecma = {
            title: 'GIOIA181 ti da il benvenuto in un mondo di servizi',
            tagline: 'Rilassati e riprenditi il tuo tempo, con gli esclusivi vantaggi riservati a chi ha scelto di vivere in una nuova casa che adotta gli standard di Psicologia dell’Abitare',
            background: AssetsStore.Image('landing.personalTrainerPilates'),
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'Cerchi una Baby Sitter per i tuoi piccoli? Hai bisogno di rimetterti in forma? Cerchi qualcuno che ti aiuti a montare l\'armadio? I nostri professionisti sono qui per aiutarti per queste e per le tante altre piccole necessità di ogni giorno. Prenotali online quando e dove vuoi tu!',
                list: [
                    {title: "Colf", icon: AssetsStore.Icon('service.oneSmall')},
                    {title: "Badante", icon: AssetsStore.Icon('service.twoSmall')},
                    {title: "Baby Sitter", icon: AssetsStore.Icon('service.threeSmall')},
                    {title: "Personal Trainer", icon: AssetsStore.Icon('service.fourSmall')},
                    {title: "Fisioterapista", icon: AssetsStore.Icon('service.fiveSmall')},
                    {title: "Stiratura", icon: AssetsStore.Icon('service.stiraturaSmall')},
                    {title: "Tuttofare", icon: AssetsStore.Icon('service.tuttofareLanding')},
                    {title: "Commissioni", icon: AssetsStore.Icon('service.commissioniLanding')},
                ]
            }
        }

        var carnetEstivo = {
            title: 'VOGLIA DI VACANZE? AFFIDATI AD UN SUPEREROE!',
            tagline: 'Con il Carnet Estate trovi un Super Professionista (Colf, Badanti, Baby Sitter) a soli 10,5 €/h',
            subtagline: '(promozione valida fino al 15/09/2016)',
            background: AssetsStore.Image('landing.carnetEstivo'),
            services: {
                title: 'Cosa possono fare i nostri supereroi per te',
                tagline: 'I nostri Supereroi sono a tua disposizione per qualunque necessità. Affidati a loro per una Estate in relax!',
                list: [
                    {title: "Colf", icon: AssetsStore.Icon('service.oneSmall')},
                    {title: "Badante", icon: AssetsStore.Icon('service.twoSmall')},
                    {title: "Baby Sitter", icon: AssetsStore.Icon('service.threeSmall')},
                ]
            }
        }

        return {
            restrict: 'EA',
            scope: {
                serviceToShow: '@',
                subServiceToShow: '@',
            },
            bindToController: true,
            controller: 'LandingSectionController',
            controllerAs: 'ctrl',
            templateUrl: 'app/guest/landing-section/landing-section.directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {
            // bindings
            ctrl.inputPlaceholder = 'Inserisci l\'indirizzo della tua abitazione per prenotare!';
            ctrl.badgeIcon = AssetsStore.Icon('badge.carnet');
            ctrl.assuranceLabel = AssetsStore.Image('assurance.label');
            ctrl.startNewHeroSelectionOrder = startNewHeroSelectionOrder;
            ctrl.goToServicePage = goToServicePage;
            ctrl.selectService = function selectService(serviceId) {
                ctrl.selectedService = serviceId;
                if (ctrl.isTecma) this.startBooking();
            }
            ctrl.selectSubService = function selectSubService(serviceId, subServiceId) {
                ctrl.selectedService = serviceId;
                ctrl.selectedSubService = subServiceId;
                if (ctrl.isTecma) this.startBooking();
            }

            ctrl.startBookingCarnet = startBookingCarnet;

            // bind service data
            if (ctrl.serviceToShow === 'colf') ctrl.service = colf;
            else if (ctrl.serviceToShow === 'badante') ctrl.service = badante;
            else if (ctrl.serviceToShow === 'baby-sitter') ctrl.service = babySitter;
            else if (ctrl.serviceToShow === 'tuttofare') ctrl.service = tuttofare;
            else if (ctrl.serviceToShow === 'personal-trainer') {
                ctrl.service = personalTrainer;
                if (ctrl.subServiceToShow) {
                    ctrl.service = personalTrainerSubcompetences[ctrl.subServiceToShow];
                }
            }
            else if (ctrl.serviceToShow === 'stiro') ctrl.service = stiro;
            else if (ctrl.serviceToShow === 'fisioterapista') ctrl.service = fisioterapista;
            else if (ctrl.serviceToShow === 'tecma') { ctrl.isTecma = true; ctrl.service = tecma; }
            else if (ctrl.serviceToShow === 'carnet-estivo') { 
                ctrl.service = ctrl.service = carnetEstivo; 
                ctrl.disabled = [SERVICES.PERSONALTRAINER, SERVICES.FISIOTERAPISTA, SERVICES.STIRATURA, SERVICES.TUTTOFARE];
            }

            // activate owl carousel
            $timeout(bootstrapLandingSection, 50);

            function bootstrapLandingSection ()
            {

                StaticPage.setWrapperHeight(elem);
            }

        }

        function startNewHeroSelectionOrder (competenza, sottoServizio)
        {
            // se la competenza è definita inizia un nuovo booking preselezionandola
            // altrimenti inizia un nuovo booking
            if (sottoServizio) {
                $ngRedux.dispatch(HerosearchActions.setNewFilters({service: filters[competenza][sottoServizio]}));
            }
            else {
                $ngRedux.dispatch(HerosearchActions.setNewFilters({service: filters[competenza]}));
            }
        
            $state.go('booking.herosearch');
        }

        function startBooking(isBnb) {
        //console.debug('Starting booking with service preselected: ', ctrl.selectedService[index]);
            let service = this.selectedService;
            if (this.selectedSubService !== '') service = this.selectedSubService;
            if (!isBnb) {
                $ngRedux.dispatch(BookingActions.startBookingPreselectingService(service));
            } else {
                $ngRedux.dispatch(BookingActions.startBookingBNBPreselectingService(service));
            }
        }

        function startBookingCarnet() {
        //console.debug('Starting booking with service preselected: ', ctrl.selectedService[index]);
            let service = this.selectedService;
            if (this.selectedSubService) service = this.selectedSubService;
            if (service) {
                $ngRedux.dispatch(CarnetActions.startBookingAndSelectCarnet(Carnet.byId(serviceSummerCarnets[service])));
            }
            //$state.go('main.guest.carnet', {servizio: serviceNames[this.selectedService]});
        }
        
        function goToServicePage(service)
        {
            console.log(service);
            const isPersonalTrainer = _.includes(_.keys(personalTrainerSubcompetences), service.name);
            //const isFisioterapista = _.includes(fisioterapistaServices, suffix);
            if (isPersonalTrainer) {
                $state.go('main.guest.welcomeSubService', {servizio: 'personal-trainer', sottoServizio: service.name});
            }
        }
    }
