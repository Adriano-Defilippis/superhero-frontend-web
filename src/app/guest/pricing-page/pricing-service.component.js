'use strict';

export const PricingService = {
    bindings: {
        info: '=',
    },
    controllerAs: 'PricingService',
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
                            <td ng-if="PricingService.info.carnet.small !== null">
                                <strong class="pricing-table__service-label">Carnet Small<br>
                                <small>({{PricingService.info.carnet.small.hours}} {{PricingService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{PricingService.info.carnet.small.validity}} mesi)</small></strong>
                            </td>
                            <td ng-if="PricingService.info.carnet.medium !== null">
                                <strong class="pricing-table__service-label">Carnet Medium<br>
                                <small>({{PricingService.info.carnet.medium.hours}} {{PricingService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{PricingService.info.carnet.medium.validity}} mesi)</small></strong>
                            </td>
                            <td ng-if="PricingService.info.carnet.large !== null">
                                <strong class="pricing-table__service-label">Carnet Large<br>
                                <small>({{PricingService.info.carnet.large.hours}} {{PricingService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{PricingService.info.carnet.large.validity}} mesi)</small></strong>
                            </td>
                            <td ng-if="PricingService.info.carnet.xxl !== null">
                                <strong class="pricing-table__service-label">Carnet XXL<br>
                                <small>({{PricingService.info.carnet.xxl.hours}} {{PricingService.info.serviceType === 'prestazione' ? 'prestazioni' :'ore' }}, validità {{PricingService.info.carnet.xxl.validity}} mesi)</small></strong>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ PricingService.info.base }}&euro;{{ PricingService.info.serviceType === 'hourAndHalf' ? '/1h30m' : PricingService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }}</td>
                            <td ng-if="PricingService.info.carnet.small !== null">{{ PricingService.info.carnet.small.price }}&euro;<br><small>({{ PricingService.info.carnet.small.hourly }} &euro;{{ PricingService.info.serviceType === 'hourAndHalf' ? '/1h30m' : PricingService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                            <td ng-if="PricingService.info.carnet.medium !== null">{{ PricingService.info.carnet.medium.price }}&euro;<br><small>({{ PricingService.info.carnet.medium.hourly }} &euro;{{ PricingService.info.serviceType === 'hourAndHalf' ? '/1h30m' : PricingService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                            <td ng-if="PricingService.info.carnet.large !== null">{{ PricingService.info.carnet.large.price }}&euro;<br><small>({{ PricingService.info.carnet.large.hourly }} &euro;{{ PricingService.info.serviceType === 'hourAndHalf' ? '/1h30m' : PricingService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                            <td ng-if="PricingService.info.carnet.xxl !== null">{{ PricingService.info.carnet.xxl.price }}&euro;<br><small>({{ PricingService.info.carnet.xxl.hourly }} &euro;{{ PricingService.info.serviceType === 'hourAndHalf' ? '/1h30m' : PricingService.info.serviceType === 'prestazione' ? '/prestazione' :'/h' }})</small></td>
                        </tr>
                    </tbody>
                </table>
                <section ng-if="PricingService.info.notes.length > 0">
                    <h5 class="center">Maggiorazioni (solo prenotazione semplice)</h5>
                    <div class="white pricing-table__notes">
                        <p class="center" ng-repeat="note in PricingService.info.notes">{{ note }}</p>
                    </div>
                </section>
                <div class="section">
                    <p class="center">Tutti i prezzi si intendono IVA inclusa, ove prevista</p>
                </div>
            </div>
        </div>
    `
}
