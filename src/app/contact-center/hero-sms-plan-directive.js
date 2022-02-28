'use strict';

export default function CCHeroSMSPlanDirective (

        $log,
        $timeout,
        AppointmentsUtility

    ){
        "ngInject";

        $log.debug('[HERO_SMS_PLAN] Directive initialized');

        return {
            restrict: 'EA',
            scope: {
                smsData: '=',
            },
            templateUrl: 'app/contact-center/hero-sms-plan-directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {
            $log.debug('[HERO_SMS_PLAN] Loading with data', scope.smsData);

            var singleStyle = {
                width: 200,
                marginRight: 20
            }

            scope.$watchCollection(
                "smsData",
                function( newValue, oldValue ) {
                    $timeout(function(){
                        elem.find('.single-hero').css(singleStyle);
                        elem.find('.sms-plan-wrapper').css({width: newValue.length * 220});
                    });
                }
            );

            scope.showRequestDetail = function(req)
            {
                $log.debug(req);
                var momentDate = moment(new Date (req.orarioRichiesta));
                AppointmentsUtility.showRequestDetail(req.id, momentDate);
            }

        }

    }
