'use strict';

export default function VantaggiController (AssetsStore, $rootScope) {
    "ngInject";

    var ctrl = this;

    ctrl.headerImage = AssetsStore.Image('convenience.header');

    ctrl.mv = {
        heroFeatures : 
        [
            {
                className: 'large-row',
                backgroundImage: AssetsStore.Image('convenience.image1'),
                data: [{
                    className: 'right',
                    image: AssetsStore.Image('convenience.numbers.1'),
                    title: {
                        text: 'Supereroi dalle identità ben note',
                        className: 'white-text'
                    },
                    description: {
                        text: 'Supereroi sì… ma non mascherati! Su <b>www.ilmiosupereroe.it</b> puoi consultare in ogni momento il profilo personale dei nostri professionisti, con foto e caratteristiche. Così puoi selezionare il Supereroe che fa per te: deve parlare italiano? Essere disponibile nei weekend? Avere una certificazione particolare? Hai tutte le informazioni a disposizione!',
                        className: 'white-text'
                    }
                }]
            },
            {
                backgroundImage: null,
                data: [{
                    image: AssetsStore.Image('convenience.numbers.2'),
                    title: {
                        text: 'Requisiti verificati. Uno per uno.',
                        className: 'orange-text'
                    },
                    description: {
                        text: 'I nostri professionisti sono tutti bravi, perché sono ligi al nostro "Decalogo del Supereroe”. Ma noi andiamo oltre, perché verifichiamo personalmente ognuno dei requisiti richiesti. Praticamente è come se ne conoscessimo vita, morte e... superpoteri!'
                    }
                },
                {
                    image: AssetsStore.Image('convenience.numbers.3'),
                    title: {
                        text: 'Loro assicurati, tu rassicurato!',
                        className: 'orange-text'
                    },
                    description: {
                        text: 'Tutti i Supereroi sono assicurati sui danni accidentali a cose e persone sino a 1.000.000 di euro e ogni volta che prenoti un Supereroe ti porti a casa senza costi aggiuntivi la copertura assicurativa. Scopri tutto <a href="assicurazione">qui</a>.'
                    }
                }]
            },
            {
                className: 'large-row',
                backgroundImage: AssetsStore.Image('convenience.image2'),
                data: [{
                    image: AssetsStore.Image('convenience.numbers.4'),
                    title: {
                        text: 'Rispondono ad ogni richiesta in un “zot”!',
                        className: 'white-text'
                    },
                    description: {
                        text: 'Un professionista non è un Supereroe se non è un lampo nel rispondere. I nostri confermano la loro disponibilità <b>in meno di 1 ora</b>: la soluzione perfetta ad ogni emergenza! E scegli tu dove vuoi che si facciano trovare: a casa, ma anche in ufficio, al parco, da tua madre… o da tua suocera!',
                        className: 'white-text'
                    }
                }]
            },
            {
                backgroundImage: null,
                data: [{
                    image: AssetsStore.Image('convenience.numbers.5'),
                    title: {
                        text: 'Più ti aiutano e meno ti costano… con il Carnet.',
                        className: 'orange-text'
                    },
                    description: {
                        text: 'Vuoi che la tua Colf venga tutte le settimane? Che la Baby Sitter corra ogni volta che fai tardi al lavoro? Che il Personal Trainer venga a farti lezione tutti i mercoledì in pausa pranzo? Tranquillo, i nostri Carnet fanno al caso tuo e ti permettono di risparmiare. Sì, abbiamo anche questo Superpotere!'
                    }
                },{
                    image: AssetsStore.Image('convenience.numbers.6'),
                    title: {
                        text: 'Scegli il Supereroe che fa per te. E solo lui!',
                        className: 'orange-text'
                    },
                    description: {
                        text: 'Ogni Supereroe è unico, lo sappiamo bene: per questo su www.ilmiosupereroe.it puoi scegliere proprio il professionista che vedi nella scheda. Sembra banale ma… non ti arriverà mai una persona diversa da quella che hai selezionato. E, se ne sei rimasto soddisfatto, richiamarlo sarà facilissimo: nella tua Pagina Personale basta usare il pratico tasto <b>“Richiama”</b>!'
                    }
                }],
            },
            {
                className: 'large-row',
                backgroundImage: AssetsStore.Image('convenience.image3'),
                data: [{
                    className: 'right',
                    image: AssetsStore.Image('convenience.numbers.7'),
                    title: {
                        text: 'Forti e decisi… ma flessibili.',
                        className: 'white-text'
                    },
                    description: {
                        text: 'Scegliendo un Supereroe avrai un professionista solido, affidabile… ma anche flessibile: puoi prenotarlo per te, ma anche farlo diventare un’innovativa idea regalo… e persino condividerlo con gli amici per una lezione di gruppo. Comodo, no? Vuoi saperne di più! Chiama il nostro <a href="contatti">Servizio Clienti</a>.',
                        className: 'white-text'
                    }
                }],
            },
            {
                backgroundImage: null,
                data: [{
                    image: AssetsStore.Image('convenience.numbers.8'),
                    title: {
                        text: 'Supereroe impegnato? Fatti aiutare!',
                        className: 'orange-text'
                    },
                    description: {
                        text: 'I Supereroi sono rapidi… ma non possono essere in due posti contemporaneamente. Se nella fascia oraria prescelta il tuo Supereroe preferito è impegnato, il nostro sistema ti consiglierà in tempo reale alcune fasce orarie alternative per poterlo comunque prenotare in tranquillità!'
                    }
                },{
                    image: AssetsStore.Image('convenience.numbers.9'),
                    title: {
                        text: 'Last, but not least...',
                        className: 'orange-text'
                    },
                    description: {
                        text: '...il nostro SSC - "<a href="contatti">Super Servizio Clienti</a>" - è a tua disposizione per aiutarti e consigliarti in qualunque momento!'
                    }
                }]
            }
    ]}
}
