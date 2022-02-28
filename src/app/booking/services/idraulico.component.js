'use strict';

export const BookingServiceIdraulico = {
    bindings: {
        serviceId: '=',
        additionalServices: '=',
        additionalTools: '=',
        selectedAdditionalServices: '=',
        selectedAdditionalTools: '=',
        serviceNotes: '=',
        onTwoTuttofare: '&',
        onClickAdditionalService: '&',
        onClickSpecificService: '&',
        onClickAdditionalTool: '&',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/idraulico.component.html',
    controller: function($ngRedux) {
        "ngInject";
        var ctrl = this;
        let state = $ngRedux.getState()
        ctrl.twoTuttofare = state.booking.steps.service.isMultipleSuperheroes;
    },
    controllerAs: 'Idraulico'
}