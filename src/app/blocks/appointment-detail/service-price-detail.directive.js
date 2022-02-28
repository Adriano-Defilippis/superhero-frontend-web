'use strict';

export default function ServicePriceDetailDirective (

        $log,
        $filter,
        Services

    ) {
        "ngInject";

        return {
            restrict: 'EA',
            scope: {
                appointmentInfo: '='
            },
            templateUrl: 'app/blocks/appointment-detail/service-price-detail.directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs)
        {
            if (!scope.appointmentInfo) $log.error('[SERVICE_PRICE_DETAIL] Appointment info is missing');

            var info = scope.appointmentInfo;

            var price = info.costoPrestazione,
                priceDiscount = 0,
                duration = info.durataMinuti / 60;

            // check if price is discounted
            if (info.costoPrestazioneScontata > 0 && info.costoPrestazioneScontata < price) {
                priceDiscount = info.costoPrestazioneScontata;
            }

            // filter price for FE
            price = $filter('number')(price, 2);

            // format cost detail in case
            if (priceDiscount > 0) {
                priceDiscount = $filter('number')(priceDiscount, 2);
                scope.costDetail = duration + 'H - <span class="hyphened">'+price+'</span> '+priceDiscount+'&euro;';
            } else {
                scope.costDetail = duration + 'H - ' + price + '&euro;';
            }

            // Service label & icon
            scope.serviceLabel = Services.Label(info.tipoServizio.id);
            scope.iconPath = Services.Icon(info.tipoServizio.id);

            // Discount details
            if (info.voucher != null && info.voucher.tipoVoucher == 'convenzione') {
                scope.discountLabel = info.voucher.canale;
            } else if (info.voucher != null && info.voucher.tipoVoucher == 'promozione' && info.voucher.tipoScontoOrario) {
                scope.discountLabel = 'promozione: ' + info.voucher.oreSconto + (info.voucher.oreSconto > 1 ? ' ore' : ' ora') + ' gratis';
            } else if (info.voucher != null && info.voucher.tipoVoucher == 'promozione' && !info.voucher.tipoScontoOrario) {
                scope.discountLabel = 'promozione';
            }
        }


    }
