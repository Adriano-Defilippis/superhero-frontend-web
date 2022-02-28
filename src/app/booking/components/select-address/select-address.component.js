'use strict';

export const SelectAddress =  {
    bindings: {
        addresses: '=',
        selected: '=',
        hideButton: '=',
        onlyInternal: '=',
        hideIcon: '=',
        onSelectAddress: '&',
        onAddNewAddress: '&',
    },
    controller: function() {
        var ctrl = this;
        console.log(ctrl.onlyInternal);
        ctrl.addressesFilter = (address) => {
            if (ctrl.onlyInternal === true) return address.type === 'INTERNAL';
            else return true;
        }
    },
    controllerAs: 'SelectAddress',
    templateUrl: 'app/booking/components/select-address/select-address.component.html'
}
