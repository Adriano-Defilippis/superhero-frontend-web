'use strict';

export default function HomeSliderDirective (

        $log,
        $timeout,
        $window,
        $ngRedux,
        $state,
        AssetsStore,
        StaticPage,
        BookingActions,
        SERVICES

    ) {
        "ngInject";

        var slider;
        let isBnb = false;

        var services = [
            { label: 'Colf', id: SERVICES.COLF, image: AssetsStore.Icon('service.oneSmall'), },
            { label: 'Badante', id: SERVICES.BADANTE, image: AssetsStore.Icon('service.twoSmall'), },
            { label: 'Baby Sitter', id: SERVICES.BABYSITTER, image: AssetsStore.Icon('service.threeSmall'), },
            { label: 'Personal Trainer - Allenamento Funzionale', id: SERVICES.ALLENAMENTOFUNZIONALE, image: AssetsStore.Icon('personalTrainer.allenamentoFunzionale'), },
            { label: 'Personal Trainer - Dimagrimento', id: SERVICES.DIMAGRIMENTO, image: AssetsStore.Icon('personalTrainer.dimagrimento'), },
            { label: 'Personal Trainer - Ginnastica Posturale', id: SERVICES.GINNASTICAPOSTURALE, image: AssetsStore.Icon('personalTrainer.ginnasticaPosturale'), },
        ]

        return {
            restrict: 'EA',
            scope: {
                disabledServices: '=',
            },
            controller: 'HomeSliderController',
            controllerAs: 'ctrl',
            templateUrl: 'app/guest/slider/home-slider.directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {
            // bindings
            try {
                isBnb = JSON.parse(attrs.isBnb);
            } catch (err) {}

            let slides = [
                {
                    title: 'Rilassati, riprenditi il tuo tempo',
                    tagline: 'Alla tua casa pensano le migliori colf',
                    imgUrl: AssetsStore.Image('home.sliderImages.three')
                },
                {
                    title: 'Rilassati, riprenditi il tuo tempo',
                    tagline: 'Affida i tuoi cari a un professionista',
                    imgUrl: AssetsStore.Image('home.sliderImages.one')
                },
                {
                    title: 'Rilassati, riprenditi il tuo tempo',
                    tagline: 'Il tuo bambino nelle mani più sicure',
                    imgUrl: AssetsStore.Image('home.sliderImages.four')
                },
                {
                    title: 'Rilassati, riprenditi il tuo tempo',
                    tagline: 'Tieniti in forma sotto la guida di un esperto',
                    imgUrl: AssetsStore.Image('home.sliderImages.two')
                },
                {
                    title: 'Rilassati, riprenditi il tuo tempo',
                    tagline: 'Professionisti in fisioterapia ed osteopatia al tuo servizio. Prenotali quando e dove vuoi.',
                    imgUrl: AssetsStore.Image('home.sliderImages.five')
                },
                {
                    title: 'Rilassati, riprenditi il tuo tempo',
                    tagline: 'Riscopri il benessere psicofisico sotto la guida di un esperto',
                    imgUrl: AssetsStore.Image('home.sliderImages.six')
                }
            ];

            if (isBnb) {
                slides = [
                    {
                        title: 'Gestire la tua casa in affitto?',
                        tagline: 'Rilassati, ci pensa ilmiosupereroe.it',
                        imgUrl: AssetsStore.Image('landing.bnb'),
                        tagLineClass: 'uppercase',
                    }
                ];
            }

            ctrl.isBnb = isBnb;
            ctrl.inputPlaceholder = 'Inserisci l\'indirizzo della tua abitazione per prenotare!';
            ctrl.badgeIcon = AssetsStore.Icon('badge.carnet');
            ctrl.altBadgeIcon = AssetsStore.Icon('badge.carnetOver');
            ctrl.itemsrc = AssetsStore.Icon('badge.carnet');
            ctrl.assuranceLabel = AssetsStore.Image('assurance.label');
            ctrl.startNewHeroSelectionOrder = startNewHeroSelectionOrder;
            ctrl.slides = slides;
            ctrl.services = services;
            ctrl.selectedService = '';
            ctrl.disabledServices = scope.disabledServices;

            ctrl.selectChanged = function (focus) {
                //console.log('Changed');
                slider.trigger('stop.owl.autoplay');
                //if (typeof slider !== 'undefined' && focus === true) slider.trigger('stop.owl.autoplay');
                //if (typeof slider !== 'undefined' && focus === false) slider.trigger('play.owl.autoplay');
            }

            // activate owl carousel
            $timeout(bootstrapCarousel, 50);

            scope.$on('$destroy', function(){
                if (typeof slider !== 'undefined') slider.trigger('destroy.owl.carousel');
            });

            function bootstrapCarousel ()
            {
                StaticPage.setWrapperHeight(elem);

                var options = {
                    singleItem: true,
                    items: 1,
                    autoplay: true,
                    loop: true,
                    mouseDrag: false,
                    touchDrag: false,
                    pullDrag: false,
                    freeDrag: false,
                    //autoplayHoverPause: true,
                    animateOut: 'fadeOut'
                }

                slider = elem.find('#home-slider');
                slider.owlCarousel(options);
                $timeout(() => {
                    let pos = angular.element('.active .select-placeholder').position();
                    angular.element('.service-select').css({ top: pos.top, opacity: 1 });
                });
            }
        }

        function startNewHeroSelectionOrder (competenza)
        {
            if (isBnb) {
                $state.go('booking.bnbHerosearch');
              } else {
                $state.go('booking.herosearch');
              }
        }


    }
