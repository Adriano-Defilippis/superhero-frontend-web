'use strict';

export default function UserFormService (
    $rootScope, RestService, FileUploader, ngDialog, $timeout
){
    "ngInject";

    var self = this;

    self.imgFileUploader = function($scope){
      var uploader =  new FileUploader({
      });

      uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
        }
      });

      uploader.filters.push({
        name: 'replaceItem',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          if(uploader.queue.length > 0){
            uploader.queue.length = 0;
          }
          return true;
        }
      });

      uploader.onAfterAddingFile = function(item) {
        // $scope.croppedImage = '';
        item.croppedImage = '';
        var reader = new FileReader();
        reader.onload = function(event) {
          $scope.$apply(function(){
            item.image = event.target.result;
          });
        };
        reader.readAsDataURL(item._file);
      };

      uploader.onBeforeUploadItem = function(item) {
        var blob = dataURItoBlob(item.croppedImage);
        item._file = blob;
      };

      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(status === 200) {
          var newUrl = response.url;
          if(_.isFunction($scope.closeThisDialog)) $scope.closeThisDialog();
        }
      };

      uploader.onErrorItem = function(fileItem, response, status, headers) {
        if(_.isFunction($scope.closeThisDialog)) $scope.closeThisDialog();
      };

      return uploader;
    };

    self.newBillingAddress = function(userID){
      ngDialog.open({
        template: 'app/booking/billing-address.html',
        class: '',
        data: {
          userId: userID,
        },
        controller: 'BillingAddressCtrl'
      });
    }

    self.registerUser = function(obj){
      var clean = cleanData(obj);
      return RestService.createNewCustomer(clean);
    }

    self.createAddressObj = function(address){
      var obj = {};
      obj.formatted = address.formatted_address;
      obj.googleMapsId = address.place_id;
      obj.location = address.geometry.location;
      address.address_components.forEach(function(comp){
        obj[comp.types[0]] = comp.short_name;
      });
      return obj;
    }

    function cleanData(dirtyData){
      // Indirizzi
      var indirizzi = [];
      var addressResidence;
      if(dirtyData.addressInfo) {
        addressResidence = {
          cap: dirtyData.addressInfo.postal_code,
          citta: dirtyData.addressInfo.locality,
          metratura: 50,
          nomeCitofono: dirtyData.addressInfo.citofono,
          numeroCivico: dirtyData.addressInfo.street_number,
          piano: dirtyData.addressInfo.piano,
          provincia: dirtyData.addressInfo.administrative_area_level_2,
          scala: dirtyData.addressInfo.scala,
          tipo: 'Residenza',
          via: dirtyData.addressInfo.route,
          latitudine: dirtyData.addressInfo.location.lat,
          longitudine: dirtyData.addressInfo.location.lng,
          googleMapsId: dirtyData.addressInfo.googleMapsId
        }
        indirizzi.push(addressResidence);
      }


      if(dirtyData.addressBillingIsSame){
        var addressBilling = _.cloneDeep(addressResidence);
        addressBilling.tipo = 'Fatturazione';
        indirizzi.push(addressBilling);
      } else {
        var addressBilling = {
          cap: dirtyData.addressBillingInfo.cap,
          citta: dirtyData.addressBillingInfo.citta,
          numeroCivico: dirtyData.addressBillingInfo.numeroCivico,
          provincia: dirtyData.addressBillingInfo.provincia,
          tipo: 'Fatturazione',
          via: dirtyData.addressBillingInfo.via
        }
        indirizzi.push(addressBilling);
      }

      var obj = {
        email: dirtyData.userInfo.email,
        nome: dirtyData.userInfo.nome,
        cognome: dirtyData.userInfo.cognome,
        cellulare: dirtyData.userInfo.cellulare,
        codiceFiscale: dirtyData.userInfo.codiceFiscale,
        photoUrl: dirtyData.userInfo.photoUrl,
        indirizzi: indirizzi,
        tipo: 'Privato',
        newsLetter: dirtyData.userInfo.newsletter
      };

      return obj;
    }

    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };

}
