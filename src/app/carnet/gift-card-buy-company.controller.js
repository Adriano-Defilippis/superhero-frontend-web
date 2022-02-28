'use strict';

export default function BuyGiftCardCompanyController (
    $scope, AssetsStore
){
    "ngInject";

    var self = this;

    self.headerImage = AssetsStore.Image('home.pageHeaders.regalaGiftCard');

    self.condizioniUtilizzoGiftCard = AssetsStore.PDF('cliente.condizioniUtilizzoGiftCard');

    self.services = [{
        icon: AssetsStore.Icon('service.one'),
        title: 'Colf',
        subtitle: 'Carnet Gift Card<br>Colf',
        content: '23 ore<br>Validità 2 mesi'
    },
    {
        icon: AssetsStore.Icon('service.two'),
        title: 'Badante',
        subtitle: 'Carnet Gift Card<br>Badante',
        content: '20 ore<br>Validità 2 mesi'
    },
    {
        icon: AssetsStore.Icon('service.three'),
        title: 'Baby Sitter',
        subtitle: 'Carnet Gift Card<br>Baby Sitter',
        content: '20 ore<br>Validità 2 mesi'
    }];

}
