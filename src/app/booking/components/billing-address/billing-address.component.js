'use strict';

export const BillingAddress = {
    bindings: {
        addressIsSame: '=',
        hideSameAddressToggle: '=',
        showFullAddress: '=',
        via: '=',
        numeroCivico: '=',
        cap: '=',
        localita: '=',
        provincia: '=',
        nome: '=',
        cognome: '=',
        codiceFiscale: '=',
        onChangeAddressIsSame: '&',
        onChangeAddressInfo: '&',
        onChangeBillingInfo: '&',
        onFormValid: '&'
    },
    controllerAs: 'BillingAddress',
    templateUrl: 'app/booking/components/billing-address/billing-address.component.html',
    controller: function ($scope, uiGmapGoogleMapApi, $timeout) {
        "ngInject";

        var ctrl = this, input, autocomplete, _addEventListener;


        uiGmapGoogleMapApi.then(function (mapsInstance) {
            input = angular.element('billing-address').find('#autocomplete-address')[0];
            var options = {
                type: ['address'],
                componentRestrictions: {country: "it"}
            }
            // event listener for ENTER key
            _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

            // attach event to input
            input.addEventListener = addEventListenerWrapper;
            input.attachEvent = addEventListenerWrapper;

            // start autocomplete
            autocomplete = new google.maps.places.Autocomplete(input, options);

            // add event listener to gmaps
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                ctrl.addressChanged();
            });
        });

        ctrl.addressChanged = function () {
            $timeout(function(){
                var result = autocomplete.getPlace();
                const address = _.reduce(result.address_components, (old, current) => {
                    old[current.types[0]] = current.short_name;
                    return old;
                  }, {});
                if(angular.isFunction(ctrl.onChangeAddressInfo)) ctrl.onChangeAddressInfo({ addressInfo: address });
            });
        }

        ctrl.userInputAddressChanged = () => {
            const newInfo = {
                addressInfo: {
                    route: ctrl.via,
                    street_number: ctrl.numeroCivico,
                    locality: ctrl.localita,
                    postal_code: ctrl.cap,
                    administrative_area_level_2: ctrl.provincia,
                }
            }
            console.log('[USER_ADDRESS_INPUT_CHANGED]', newInfo);
            ctrl.onChangeAddressInfo(newInfo);
        }

        ctrl.userBillingInfoChanged = () => {
            const newInfo = {
                billingInfo: {
                    nome: ctrl.nome,
                    cognome: ctrl.cognome,
                    codiceFiscale: ctrl.codiceFiscale,
                }
            };
            console.log('[USER_BILLING_INPUT_CHANGED]', newInfo);
            ctrl.onChangeBillingInfo(newInfo);
        }

        ctrl.wipeUserBillingInfo = () => {
            const newInfo = {
                billingInfo: {
                    nome: '',
                    cognome: '',
                    codiceFiscale: '',
                }
            };
            console.log('[USER_BILLING_INPUT_CHANGED]', newInfo);
            ctrl.onChangeBillingInfo(newInfo);
        }

        $scope.$watch(() => ctrl.Form.$valid, (valid, oldValid) => {
            if (valid !== oldValid) ctrl.onFormValid({ valid });
        });

        ctrl.sameUserInfo = true;

        function addEventListenerWrapper (type, listener) {
            if (type === "keydown") {
                var orig_listener = listener;
                listener = function(event) {
                    var suggestion_selected = $(".pac-item-selected").length > 0;
                    if (event.which === 13 && !suggestion_selected) {
                        var simulated_downarrow = $.Event("keydown", {
                            keyCode: 40,
                            which: 40
                        });
                        orig_listener.apply(input, [simulated_downarrow]);
                    }

                    orig_listener.apply(input, [event]);
                };
            }
            _addEventListener.apply(input, [type, listener]);
        }

    }
}
