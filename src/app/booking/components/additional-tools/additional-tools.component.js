'use strict';

export const AdditionalTools = {
    bindings: {
        tools: '=',
        selected: '=',
        onToolClick: '&'
    },
    controller: function() {
        var ctrl = this;
        ctrl.disableToggle = false;
        ctrl.isSelected = function(additionalToolId) {
            if (_.isArray(ctrl.selected)) {
                return _.includes(ctrl.selected, additionalToolId);
            } else if (_.isString(ctrl.selected)) {
                return additionalToolId === ctrl.selected;
            }
        }
    },
    controllerAs: 'AdditionalTools',
    templateUrl: 'app/booking/components/additional-tools/additional-tools.component.html'
}
