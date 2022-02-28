'use strict';

export default function StickyFooterDirective (
        $log,
        $timeout
    ){
        "ngInject";

        $log.debug('[STICKY_FOOTER] Directive initialized');

        return {
            restrict: 'EA',
            templateUrl: 'app/components/sticky-footer/sticky-footer.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {
            scope.isMobile = Modernizr.touch;

            if (!Modernizr.touch) {

                var didScroll = false;
                var hidden = false;

                window.addEventListener("scroll", function() {
                    didScroll = true;

                    var timer = setInterval(function() {
                        // clear interval
                        clearInterval(timer);

                        if(didScroll) {

                            didScroll = false;

                            var windowScroll = window.pageYOffset + window.innerHeight;

                            // Get options from each line
                            var selector = 'footer.footer',
                                offset = 0,
                                callback = hideFooter,
                                callbackUpward = showFooter;

                            var currentElement = document.querySelector(selector);
                            if ( currentElement !== null) {
                                var elementOffset = currentElement.getBoundingClientRect().top + window.pageYOffset;

                                if (windowScroll > (elementOffset + offset)) {
                                    if (hidden !== true && _.isFunction(callback)) {
                                        callback(elem);
                                        hidden = true;
                                    }
                                } else if (windowScroll < (elementOffset + offset) && hidden) {
                                    callbackUpward(elem);
                                    hidden = false;
                                }
                            }

                        }
                    }, 100);
                });
            }
        }

        function hideFooter (elem)
        {
            $log.debug('HIDE FOOTER!');
            $timeout(function(){
                elem.find('#sticky-footer').addClass('hidden');
            });

        }

        function showFooter (elem)
        {
            $log.debug('SHOW FOOTER!');
            $timeout(function(){
                elem.find('#sticky-footer').removeClass('hidden');
            });
        }

    }
