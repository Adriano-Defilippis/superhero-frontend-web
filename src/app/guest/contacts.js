'use strict';

export default function ContactsPageController (
    $scope, AssetsStore
) {
    "ngInject";

  	var self = this;

    self.model = {
      headerImage: AssetsStore.Image('home.pageHeaders.contacts'),
      sectionTagline : "Contattaci al servizio clienti o direttamente tramite i social network",
    }
  }
