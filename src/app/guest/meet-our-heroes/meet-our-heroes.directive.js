'use strict';

export default function MeetOurHeroesDirective (

        $log,
        $q,
        $state,
        $timeout,
        $ngRedux,
        RestService,
        HerosearchActions,
        AssetsStore

    ) {
        "ngInject";

        var slider;
        var filters = {
            badante: 'ATT-00000000-0000-0000-0001-000000000001',
            'baby-sitter': 'ATT-00000000-0000-0000-0001-000000000002',
            colf: 'ATT-00000000-0000-0000-0001-000000000003',
            'personal-trainer': [
                'ATT-00000000-0000-0000-0001-000000000004',
                'ATT-00000000-0000-0000-0001-000000000005',
                'ATT-00000000-0000-0000-0001-000000000006',
                'ATT-00000000-0000-0000-0001-000000000007',
                'ATT-00000000-0000-0000-0001-000000000008',
                'ATT-00000000-0000-0000-0001-000000000009',
                'ATT-00000000-0000-0000-0001-000000000010',
                'ATT-00000000-0000-0000-0001-000000000011',
            ],
            'fisioterapista': [
                'ATT-00000000-0000-0000-0001-000000000014',
                'ATT-00000000-0000-0000-0001-000000000015',
                'ATT-00000000-0000-0000-0001-000000000016',
                'ATT-00000000-0000-0000-0001-000000000017',
                'ATT-00000000-0000-0000-0001-000000000018',
                'ATT-00000000-0000-0000-0001-000000000019',
                'ATT-00000000-0000-0000-0001-000000000020',
                'ATT-00000000-0000-0000-0001-000000000021',
                'ATT-00000000-0000-0000-0001-000000000022',
                'ATT-00000000-0000-0000-0001-000000000023',
            ],
            tuttofare: 'ATT-00000000-0000-0000-0001-000000000024'
        }

        return {
            restrict: 'EA',
            scope: {
                service: '@',
            },
            controller: function() {},
            controllerAs: 'ctrl',
            templateUrl: 'app/guest/meet-our-heroes/meet-our-heroes.directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {

            // init values
            ctrl.loading = true;
            ctrl.heroes = [];
            ctrl.service = $state.params.servizio;
            ctrl.goToHeroSearch = goToHeroSearch;

            loadHeroesToShow(scope).then(function(heroes){
                ctrl.heroes.push.apply(ctrl.heroes, heroes);
                $timeout(bootstrapCarousel, 50);
            });

            scope.$on('$destroy', function(){
                if (typeof slider !== 'undefined') slider.trigger('destroy.owl.carousel');
            });

            function bootstrapCarousel ()
            {
                var options = {
                    autoplay: true,
                    loop: true,
                    autoplayHoverPause: true,
                    responsiveClass:true,
                    responsive:{
                        0:{
                            items:2
                        },
                        900:{
                            items:3
                        }
                    }

                }

                slider = elem.find('#heroes-slider');
                slider.owlCarousel(options);
            }
        }

        function goToHeroSearch ()
        {   
            $ngRedux.dispatch(HerosearchActions.setNewFilters({service: filters[$state.params.servizio]}));
            $state.go('booking.herosearch');
        }

        function loadHeroesToShow (scope)
        {
            var deferred = $q.defer();
            var heroes = [];
            var f = {};

            if ($state.params.servizio !== null && typeof $state.params.servizio !== 'undefined') {
                console.log($state.params.servizio);
                f.idCompetenza = filters[$state.params.servizio];
                $log.debug('[MEET_HEORES] loaded with filters');
            }

            RestService.searchSuperheroes(f).then(function(data){
                var shuffled = shuffle(data.data.plain());
                var counter = 0;
                shuffled.forEach(function(h){
                    h.nome = _.capitalize(h.nome.toLowerCase());
                    if ( (h.photoUrl !== null || h.photoUrl) && (h.descrizione && h.descrizione !== null) && counter < 12 ) heroes.push(h);
                    counter++;
                });
                deferred.resolve(heroes);
            });

            return deferred.promise;
        }

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

    }
