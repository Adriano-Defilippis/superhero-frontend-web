'use strict';

export const GiftCardPricesService = {
    bindings: {
        info: '=',
    },
    controllerAs: 'GiftCardPricesService',
    controller: function () {
        "ngInject";
    },
    template: `
        <div class="row">
            <div class="col s12">
                <table class="pricing-table__wrapper">
                    <thead>
                        <tr>
                            <td>
                                <strong class="pricing-table__service-label">Pren. Semplice</strong>
                            </td>
                            <td ng-if="GiftCardPricesService.info.carnet.small !== null">
                                <strong class="pricing-table__service-label">Carnet Small<br>
                                <small>({{GiftCardPricesService.info.carnet.small.hours}} {{GiftCardPricesService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{GiftCardPricesService.info.carnet.small.validity}} mesi)</small></strong>
                            </td>
                            <td ng-if="GiftCardPricesService.info.carnet.medium !== null">
                                <strong class="pricing-table__service-label">Carnet Medium<br>
                                <small>({{GiftCardPricesService.info.carnet.medium.hours}} {{GiftCardPricesService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{GiftCardPricesService.info.carnet.medium.validity}} mesi)</small></strong>
                            </td>
                            <td ng-if="GiftCardPricesService.info.carnet.large !== null">
                                <strong class="pricing-table__service-label">Carnet Large<br>
                                <small>({{GiftCardPricesService.info.carnet.large.hours}} {{GiftCardPricesService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{GiftCardPricesService.info.carnet.large.validity}} mesi)</small></strong>
                            </td>
                            <td ng-if="GiftCardPricesService.info.carnet.xxl !== null">
                                <strong class="pricing-table__service-label">Carnet XXL<br>
                                <small>({{GiftCardPricesService.info.carnet.xxl.hours}} {{GiftCardPricesService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{GiftCardPricesService.info.carnet.xxl.validity}} mesi)</small></strong>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ GiftCardPricesService.info.base }}&euro;{{ GiftCardPricesService.info.serviceType === 'hourAndHalf' ? '/1h30m' : GiftCardPricesService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }}</td>
                            <td ng-if="GiftCardPricesService.info.carnet.small !== null">{{ GiftCardPricesService.info.carnet.small.price }}&euro;<br><small>({{ GiftCardPricesService.info.carnet.small.hourly }} &euro;{{ GiftCardPricesService.info.serviceType === 'hourAndHalf' ? '/1h30m' : GiftCardPricesService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                            <td ng-if="GiftCardPricesService.info.carnet.medium !== null">{{ GiftCardPricesService.info.carnet.medium.price }}&euro;<br><small>({{ GiftCardPricesService.info.carnet.medium.hourly }} &euro;{{ GiftCardPricesService.info.serviceType === 'hourAndHalf' ? '/1h30m' : GiftCardPricesService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                            <td ng-if="GiftCardPricesService.info.carnet.large !== null">{{ GiftCardPricesService.info.carnet.large.price }}&euro;<br><small>({{ GiftCardPricesService.info.carnet.large.hourly }} &euro;{{ GiftCardPricesService.info.serviceType === 'hourAndHalf' ? '/1h30m' : GiftCardPricesService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                            <td ng-if="GiftCardPricesService.info.carnet.xxl !== null">{{ GiftCardPricesService.info.carnet.xxl.price }}&euro;<br><small>({{ GiftCardPricesService.info.carnet.xxl.hourly }} &euro;{{ GiftCardPricesService.info.serviceType === 'hourAndHalf' ? '/1h30m' : GiftCardPricesService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                        </tr>
                    </tbody>
                </table>
                <section ng-if="GiftCardPricesService.info.notes.length > 0">
                    <h5 class="center">Maggiorazioni (solo prenotazione semplice)</h5>
                    <div class="white pricing-table__notes">
                        <p class="center" ng-repeat="note in GiftCardPricesService.info.notes">{{ note }}</p>
                    </div>
                </section>
                <div class="section">
                    <p class="center">Tutti i prezzi si intendono IVA inclusa, ove prevista</p>
                </div>
            </div>
        </div>
    `
}
