'use strict';

import { SERVICES } from '../booking.config';

export default function BookingModalsFactory (
    ngDialog, $q
) {
    "ngInject";

    let templates = {};

    templates[SERVICES.COLF] = {
        satisfaction:'app/booking/modals/colf.satisfaction.html',
        products: 'app/booking/modals/colf.products.html',
        description: 'app/booking/modals/colf.description.html'
    }

    templates[SERVICES.BADANTE] = {
        satisfaction:'app/booking/modals/badante.satisfaction.html',
        products: 'app/booking/modals/badante.products.html',
        description: 'app/booking/modals/badante.description.html'
    }

    templates[SERVICES.BABYSITTER] = {
        satisfaction:'app/booking/modals/babysitter.satisfaction.html',
        products: 'app/booking/modals/babysitter.products.html',
        description: 'app/booking/modals/babysitter.description.html'
    }

    templates[SERVICES.PERSONALTRAINER] = {
        satisfaction:'app/booking/modals/personaltrainer.satisfaction.html',
        products: 'app/booking/modals/personaltrainer.products.html',
        description: 'app/booking/modals/personaltrainer.description.html'
    }

    templates[SERVICES.FISIOTERAPISTA] = {
        satisfaction:'app/booking/modals/fisioterapista.satisfaction.html',
        products: 'app/booking/modals/fisioterapista.products.html',
        description: 'app/booking/modals/fisioterapista.description.html'
    }

    templates[SERVICES.STIRATURA] = {
        satisfaction:'app/booking/modals/stiratura.satisfaction.html',
        products: 'app/booking/modals/stiratura.products.html',
        description: 'app/booking/modals/stiratura.description.html'
    }

    templates[SERVICES.TUTTOFARE] = {
        satisfaction:'app/booking/modals/tuttofare.satisfaction.html',
        products: 'app/booking/modals/tuttofare.products.html',
        description: 'app/booking/modals/tuttofare.description.html'
    }
    
    templates[SERVICES.SERVIZI_ELETTRICI] = {
        satisfaction:'app/booking/modals/elettricista.satisfaction.html',
        products: 'app/booking/modals/elettricista.products.html',
        description: 'app/booking/modals/elettricista.description.html'
    }
    
    templates[SERVICES.SERVIZI_IDRAULICI] = {
        satisfaction:'app/booking/modals/idraulico.satisfaction.html',
        products: 'app/booking/modals/idraulico.products.html',
        description: 'app/booking/modals/idraulico.description.html'
    }

    templates[SERVICES.CHECKIN_CHECKOUT] = {
        satisfaction:'app/booking/modals/checkincheckout.satisfaction.html',
        description: 'app/booking/modals/checkincheckout.description.html'
    }

    templates[SERVICES.COLF_BNB] = {
        satisfaction:'app/booking/modals/colfbnb.satisfaction.html',
        products: 'app/booking/modals/colfbnb.products.html',
        description: 'app/booking/modals/colfbnb.description.html'
    }

    function satisfaction (service) {
        getModal(service, 'satisfaction');
    }

    function products (service) {
        getModal(service, 'products');
    }

    function description (service) {
        getModal(service, 'description');
    }

    function getModal (service, template) {
        console.log('Showing modal: ',service,template);
        ngDialog.closeAll();
        ngDialog.open({
            template: templates[service][template],
            className: 'ngdialog-theme-default',
            showClose: true,
            controller: () => {}
        });
    }

    function chooseCarnet (serviceId, disabledCarnet, callback) {
        ngDialog.closeAll();
        ngDialog.open({
            template: 'app/booking/modals/choose-carnet.html',
            className: 'ngdialog-theme-default',
            showClose: true,
            controller: ($scope, $timeout, ngDialog) => {
                "ngInject";
                $scope.ctrl = this;
                this.disabledCarnet = disabledCarnet;
                this.serviceId = serviceId;
                this.onChooseCarnet = function (carnet) {
                    ngDialog.closeAll();
                    console.debug('Carnet choosen', carnet);

                    if (_.isFunction(callback)) $timeout(() => { callback(carnet) });
                }
            }
        });
    }

    function addNewBillingAddress (userId) {
        const deferred = $q.defer();
        ngDialog.closeAll();
        ngDialog.open({
            template: 'app/booking/modals/new-billing-address.html',
            className: 'ngdialog-theme-default',
            showClose: true,
            controller: ($scope, $timeout, ngDialog, Addresses, $state) => {
                "ngInject";
                $scope.error = {
                  message: '',
                }

                $scope.mv = {
                    addressBillingInfo: {
                        sameUserInfo: true,
                        nome: '',
                        cognome: '',
                        codiceFiscale: '',
                        cap: '',
                        citta: '',
                        numeroCivico: '',
                        provincia: '',
                        via: ''
                    }
                }

                $scope.saveAddress = function(valid){
                  if(valid){
                    var info = $scope.mv.addressBillingInfo;
                    info.tipo = 'Fatturazione';
                    var added = Addresses.parseAndAdd(info, userId);
                    added.then(function(data){
                        ngDialog.closeAll();
                        deferred.resolve(data);
                      //$state.reload('main');
                    }, function(error){
                      showError(error);
                    });
                  }
                }

                function showError(error){
                  $scope.error.message = error;
                }

                function resetError(){
                  $scope.error.message = '';
                }
            }
        });
        return deferred.promise;
    }

    return {
        satisfaction,
        description,
        products,
        chooseCarnet,
        addNewBillingAddress
    }
}
