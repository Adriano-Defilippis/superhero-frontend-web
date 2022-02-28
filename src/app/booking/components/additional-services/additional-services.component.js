'use strict';

export const AdditionalServices = {
    bindings: {
        twoColumnsLayout: '=',
        services: '=',
        selected: '=',
        onServiceClick: '&'
    },
    controller: function() {
        var ctrl = this;
        ctrl.disableToggle = _.isString(ctrl.selected);
        ctrl.isSelected = function(additionalServiceId) {
            if (_.isArray(ctrl.selected)) {
                return _.includes(ctrl.selected, additionalServiceId);
            } else if (_.isString(ctrl.selected)) {
                return additionalServiceId === ctrl.selected;
            }
        }
    },
    controllerAs: 'AdditionalServices',
    templateUrl: 'app/booking/components/additional-services/additional-services.component.html'
}
