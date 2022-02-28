'use strict';

export const BookingServiceTuttofare = {
    bindings: {
        serviceId: '=',
        additionalServices: '=',
        additionalTools: '=',
        specificServices: '=',
        selectedSpecificService: '=',
        selectedAdditionalServices: '=',
        selectedAdditionalTools: '=',
        serviceNotes: '=',
        onTwoTuttofare: '&',
        onClickAdditionalService: '&',
        onClickSpecificService: '&',
        onClickAdditionalTool: '&',
        onNotesChanged: '&'
    },
    templateUrl: 'app/booking/services/tuttofare.component.html',
    controller: function($ngRedux) {
        "ngInject";
        var ctrl = this;
        let state = $ngRedux.getState()
        ctrl.twoTuttofare = state.booking.steps.service.isMultipleSuperheroes;
    },
    controllerAs: 'Tuttofare'
}