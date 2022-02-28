'use strict';

export const ChooseCarnet = {
    bindings: {
        serviceId: '=',
        disabledCarnet: '=',
        onChooseCarnet: '&'
    },
    controller: ChooseCarnetController,
    controllerAs: 'ChooseCarnet',
    templateUrl: 'app/booking/components/choose-carnet/choose-carnet.component.html'
}

function ChooseCarnetController (SERVICES, Carnet, $ngRedux) {
    "ngInject";

    let ctrl = this;

    console.debug('Showing carnet options for ', ctrl.serviceId);

    this.carnet = {};
    this.SERVICES = SERVICES;
    _.forEach(SERVICES, _service => {
        if (_service !== SERVICES.PERSONALTRAINER) {
            ctrl.carnet[_service] = _.filter(Carnet.byParent(_service), (_carnet) => _carnet.isHidden === false);
        }
    });

    if (_.isString(ctrl.disabledCarnet) && ctrl.disabledCarnet !== '') {
        _.forEach(ctrl.carnet, (_serviceCarnet, serviceId) => {
            _serviceCarnet.filter(_carnet => !_.includes(ctrl.disabledCarnet, _carnet.id) && _carnet.isHidden === false);
        });
    }

    const selectedDates = $ngRedux.getState().booking.steps.dates.confirmedDates;
    if (selectedDates && selectedDates.length > 0 && selectedDates[0].hero && !selectedDates[0].hero.hasVat) {
        _.forEach(ctrl.carnet, (_serviceCarnet, serviceId) => {
            ctrl.carnet[serviceId] = _serviceCarnet.filter(_carnet => 
                _carnet.type === 'Small' || _carnet.type === 'Medium' || _carnet.type === '5sed' || _carnet.type === '10sed');
        });
    }

}
