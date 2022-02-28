/*global google:true, angular:true, console:true, document: true, */
'use strict';

export default function GuestSignupController (
    $scope, UserForm, uiGmapGoogleMapApi, RestService, $timeout
){
    "ngInject";

    var self = this,
        timer = null;

    self.mv = {
      address: '',
      googleResults: [],
      selectedAddress: null,
      addressInfo: {},
      userInfo: {}
    }

    self.imgUploader = UserForm.imgFileUploader($scope);

    uiGmapGoogleMapApi.then(function(maps) {
      var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631));

      var input = document.getElementById('address');
      var options = {
        bounds: defaultBounds
      };


      var autocomplete = new google.maps.places.Autocomplete(input, options);

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        self.addressChanged();
      });

    });

    self.addressChanged = function(){
      $timeout.cancel(timer);
      timer = $timeout(function(){
        var p = RestService.getAddressLatLng(self.mv.address);
        p.then(function(data){
          self.mv.googleResults.length = 0;
          self.mv.googleResults.push.apply(self.mv.googleResults, data.data.results)
        });
      }, 500);
    }

    self.selectAddress = function(address){
      self.mv.selectedAddress = address;
      self.mv.addressInfo.location = address.geometry.location;
      self.mv.addressInfo.formatted = address.formatted_address;
      address.address_components.forEach(function(comp){
        self.mv.addressInfo[comp.types[0]] = comp.short_name;
      });
    }

    self.submitForm = function(isValid){
      if(isValid){
        self.isLoading = true;
        var p = UserForm.registerUser(self.mv);
        p.then(function(data){
          if(data.status !== 400 && data.status !== 404){
            var newCustomerId = data.data.id;

            if(self.imgUploader.queue.length > 0){
              uploadImg(newCustomerId, function(){
                successForm();
              });
            } else {
              successForm();
            }
          }
        }, function(data){
          // var content = ApplicationForm.getErrorContent(data.data);
          // NotifyService.modal({ title: 'Errore nella validazione dei dati', content: content });
          self.isLoading = false;
        });

      } else {
        self.showRequiredError = true;
      }
    };

    function successForm(){
      self.isLoading = false;
    }

    function uploadImg(newCustomerId, callback){
      if(self.imgUploader !== undefined && self.imgUploader.queue.length > 0) {
        self.imgUploader.queue.forEach(function(item){
          item.url = RestService.getCustomerPhotoUploadUrl(newCustomerId);
          item.onSuccess = function(){
            callback();
            //NotifyService.modalRefresh({title:"Nuova candidatura creata!", content:"La candidatura è stata creata con successo. È possibile modificarla nella seziona Visualizza Candidature."});
          }
          item.upload();
        });
      }
    }

  }
