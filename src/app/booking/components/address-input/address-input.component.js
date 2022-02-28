'use strict';

export const AddressInput = {
    bindings: {
        localita: '=',
        provincia: '=',
        via: '=',
        numeroCivico: '=',
        cap: '=',
        citofono: '=',
        piano: '=',
        scala: '=',
        showFullAddress: '=',
        disableInput: '=',
        showAddressDetails: '=',
        showAddressType: '=',
        addressType: '=',
        errors: '=',
        showError: '=',
        onChangeAutocompleteAddress: '&',
        onChangeUserInput: '&'
    },
    controllerAs: 'AddressInput',
    templateUrl: 'app/booking/components/address-input/address-input.component.html',
    controller: function AddressInputController ($timeout, uiGmapGoogleMapApi, BookingModel) {
        "ngInject";

        var ctrl = this, input, autocomplete, _addEventListener;

        ctrl.addressTypes = BookingModel.addressTypes;

        uiGmapGoogleMapApi.then(function (mapsInstance) {
            input = angular.element('address-input').find('#autocomplete-address')[0];
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
                if(angular.isFunction(ctrl.onChangeAutocompleteAddress)) ctrl.onChangeAutocompleteAddress({ addressInfo: result, type: ctrl.showAddressType !== true ? 'INTERNAL' : null });
            });
        }

        ctrl.userInputAddressChanged = function () {
            var newInfo = {
                addressInfo: {
                    route: ctrl.via,
                    street_number: ctrl.numeroCivico,
                    locality: ctrl.localita,
                    postal_code: ctrl.cap,
                    administrative_area_level_2: ctrl.provincia,
                    citofono: ctrl.citofono,
                    piano: ctrl.piano,
                    scala: ctrl.scala,
                    type: ctrl.showAddressType === true ? ctrl.addressType : 'INTERNAL'
                }
            }
            console.log('[USER_ADDRESS_INPUT_CHANGED]', newInfo);
            ctrl.onChangeUserInput(newInfo);
        }

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
