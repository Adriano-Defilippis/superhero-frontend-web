'use strict';

export default function CarnetInfoLargeDirective(

        $log,
        $state,
        $timeout,
        ngDialog,
        AssetsStore,
        Services,
        User,
        $ngRedux,
        BookingActions

    ) {
        "ngInject";

        return {
            restrict: 'EA',
            scope: {
                carnetInfo: '=',
                preselected: '@highlighted'
            },
            templateUrl: 'app/carnet/carnet-info-large-directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs)
        {
            $log.debug('[CARNET_INFO_LARGE_DIRECTIVE] Initialized');

            // init variables
            scope.carnetList = [];

            // Push carnet info in array
            if (scope.carnetInfo && _.isArray(scope.carnetInfo)) {
                scope.carnetList.push.apply(scope.carnetList, scope.carnetInfo);
            } else if (scope.carnetInfo && _.isObject(scope.carnetInfo)) {
                scope.carnetList.push(scope.carnetInfo);
            }

            // preselect if available
            if (scope.preselected !== null && typeof scope.preselected !== 'undefined') {
                $timeout(function () {
                    var elemToPreselect = elem.find('li[data-id-ref=\''+scope.preselected+'\']');
                    console.log(elemToPreselect);
                    elemToPreselect.addClass('active');
                    //elem.find('[data-collapsible]').collapsible();
                });

            }

            // helpers
            scope.openHistoryDialog = function (singleCarnetInfo)
            {
                const filterStates = ['Pagato', 'Aperto', 'Confemato', 'Immesso'];
                var carnetAppoints = _.filter(User.appointments, function(el){
                    console.log(el);
                    return el.idCarnet === singleCarnetInfo.id && _.indexOf(filterStates, el.stato) > -1;
                });

                $log.debug('[CARNET_INFO_LARGE_DIRECTIVE] Appointment history:', carnetAppoints);

                ngDialog.open({
                    template: 'app/user/carnet-archive.html',
                    className: 'ngdialog-theme-default',
                    controller: ['$scope', function($scope){
                        $scope.prenotazioni = carnetAppoints;
                    }]
                });
            }

            scope.newCarnetOrder = function (singleCarnetInfo)
            {
                $ngRedux.dispatch(BookingActions.startBookingWithCarnet(singleCarnetInfo));
            }

            scope.changeHero = function (singleCarnetInfo)
            {
                var isSupport = _.includes($state.current.name, 'support');

                if (isSupport) {
                    $state.go('main.support.user.carnet-edit-hero', { idCarnet: singleCarnetInfo.id });
                } else {
                    $state.go('main.user.carnet-edit-hero', { idCarnet: singleCarnetInfo.id });
                }
            }

        }

    }
