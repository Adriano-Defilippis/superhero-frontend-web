/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function StaticPageFactory (

        $log,
        $window,
        $state,
        $timeout

    ){
        "ngInject";

        // config
        var bannerHeight = 0.82,
            autocompletes = {};

        // banner / slider height
        function setWrapperHeight (elem)
        {
            var wrapper = elem.find('.wrapper__handler');
            var winHeight = parseInt(angular.element($window).height() * bannerHeight);

            // set height to 100% if mobile device
            if (Modernizr.touch) winHeight = angular.element($window).height();

            wrapper.css({height: winHeight });

        }

        function setupGoogleAutocomplete (maps, cssSelector)
        {
            $timeout(function(){
                var defaultBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(-33.8902, 151.1759),
                    new google.maps.LatLng(-33.8474, 151.2631)
                );

                var inputs = cssSelector;

                var options = {
                    types: ['address'],
                    componentRestrictions: {country: "it"}
                };

                var inputsElems = document.getElementsByClassName(inputs);

                [].forEach.call(inputsElems, function (input) {
                    if(!input) return;
                    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

                    function addEventListenerWrapper(type, listener) {
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

                    input.addEventListener = addEventListenerWrapper;
                    input.attachEvent = addEventListenerWrapper;

                    var auto = new google.maps.places.Autocomplete(input, options);

                    google.maps.event.addListener(auto, 'place_changed', function() {
                        selectAddress(auto.getPlace());
                    });
                });
            }, 200);
        }

        function selectAddress(address){
            var addressFound = {};
            address.address_components.forEach(function(comp){
                addressFound[comp.types[0]] = comp.short_name;
            });
            console.log(addressFound);
            $state.go('booking.address',
            { via: addressFound.route,
                num: addressFound.street_number ? addressFound.street_number : ' ',
                cap: addressFound.postal_code ? addressFound.postal_code : ' ',
                prov: addressFound.administrative_area_level_2,
                loc: addressFound.locality
            });
        }


        return {
            setupGoogleAutocomplete: setupGoogleAutocomplete,
            setWrapperHeight: setWrapperHeight
        }

    }
