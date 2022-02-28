/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function RecruiterService (
    ngDialog, $log, RestService, $state
){
    "ngInject";

    var self = this;

    self.archiveApplication = function(id) {
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div ng-show="!loaded && !isLoading"><h3>Archivia candidatura</h3><p>Sei sicuro di voler archiviare la candidatura?</p></div>'+
          '<div ng-show="!loaded && isLoading"><h3>Elaborazione</h3><p>Archiviazione candidatura in corso..</p></div>'+
          '<div ng-show="loaded && success"><h3>Archiviato!</h3><p>L\'Archiviazione è avvenuta con successo.</p></div>'+
          '<div ng-show="loaded && !success"><h3>Errore!</h3><p>C\'è stato un errore nell\'archiviazione del profilo.</p></div>'+
          '<div ng-show="!loaded" class="section center">'+
            '<a ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Annulla</a>&nbsp;'+
            '<a ng-click="archiveHero()" class="waves-effect waves-light main-orange btn">Archivia</a>'+
          '</div>'+
          '<div ng-show="loaded"  class="section center">'+
            '<a ng-click="close()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
        '</div>',
        plain: true,
        className: 'ngdialog-theme-default',
        controller: ['$scope', function($scope) {
          $scope.isLoading = false;
          $scope.loaded = false;
          $scope.success = false;
          $scope.archiveHero = function(){
            $scope.isLoading = true;
            var p = RestService.deleteHero(id);
            p.then(function(data){
              $scope.loaded = true;
              if(data.status !== 400 && data.status !== 404) {
                $scope.success = true;
                $scope.close();
              } else {
                $scope.success = false;
              }
            });
          };
          $scope.close = function(){
            $scope.closeThisDialog();
            $state.go($state.current, {}, {reload: true});
          };
        }]

      });
    };

    self.restoreHero = function(id) {
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div ng-show="!loaded && !isLoading"><h3>Ripristina eroe archiviato</h3><p>Sei sicuro di voler ripristinare la candidatura archiviata?</p></div>'+
          '<div ng-show="!loaded && isLoading"><h3>Ripristino</h3><p>Ripristino candidatura in corso..</p></div>'+
          '<div ng-show="loaded && success"><h3>Ripristinato!</h3><p>Il ripristino è avvenuta con successo.</p></div>'+
          '<div ng-show="loaded && !success"><h3>Errore!</h3><p>C\'è stato un errore nel ripristino del profilo.</p></div>'+
          '<div ng-show="!loaded" layout="row" layout-fill layout-align="space-around end" class="padding-top big">'+
            '<md-button class="btn-big md-default-theme" ng-click="closeThisDialog()">Annulla</md-button>'+
            '<md-button class="btn-big md-default-theme" ng-click="restoreHero()">Archivia</md-button>'+
          '</div>'+
          '<div ng-show="loaded" layout="row" layout-fill layout-align="space-around end" class="padding-top big">'+
            '<md-button class="btn-big md-default-theme" ng-click="close()">Chiudi</md-button>'+
          '</div>'+
        '</div>',
        plain: true,
        className: 'ngdialog-theme-default',
        controller: ['$scope', function($scope) {
          $scope.isLoading = false;
          $scope.loaded = false;
          $scope.success = false;
          $scope.restoreHero = function(){
            $scope.isLoading = true;
            //var p = RestService.deleteHero(id);
            p.then(function(data){
              $scope.loaded = true;
              if(data.status !== 400 && data.status !== 404) {
                $scope.success = true;
                $scope.close();
              } else {
                $scope.success = false;
              }
            });
          };
          $scope.close = function(){
            $state.go($state.current, {}, {reload: true});
          };
        }]

      });
    };

    self.approveHero = function(heroInfo){
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div ng-show="!loaded && !isLoading"><h3 class="center">Registra Collaboratore</h3><p>Sei sicuro di voler registrare il collaboratore?</p></div>'+
          '<div ng-show="!loaded && isLoading"><h3 class="center">Elaborazione</h3><p>Registrazione collaboratore in corso..</p></div>'+
          '<div ng-show="loaded && success && !photoZones"><h3 class="center">Registrato!</h3><p>La registrazione è avvenuta con successo.</p></div>'+
          '<div ng-show="loaded && !success && !photoZones"><h3 class="center">Errore!</h3><p>C\'è stato un errore nella registrazione del profilo.</p></div>'+
          '<div ng-show="loaded && photoZones"><h3 class="center">Attenzione</h3><p>Per approvare una candidatura sono necessari la foto e le zone di disponbilità</p></div>'+
          '<div ng-show="!loaded" class="section center">'+
            '<a ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Annulla</a>&nbsp;'+
            '<a ng-click="approveHero()" class="waves-effect waves-light main-orange btn">Registra</a>'+
          '</div>'+
          '<div ng-show="loaded && success"  class="section center">'+
            '<a ng-click="close()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
          '<div ng-show="loaded && photoZones"  class="section center">'+
            '<a ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
        '</div>',
        plain: true,
        className: 'ngdialog-theme-default',
        controller: ['$scope', function($scope) {
          $scope.isLoading = false;
          $scope.loaded = false;
          $scope.success = false;

          $scope.approveHero = function(){
            if(heroInfo.photoUrl && heroInfo.zone.length > 0){
              $scope.isLoading = true;
              var p = RestService.approveHero(heroInfo.id);
              p.then(function(data){
                $scope.loaded = true;
                if(data.status === 200 || data.status === 201)
                  $scope.success = true;
                else
                  $scope.success = false;
              });
            } else {
              $scope.loaded = true;
              $scope.photoZones = true;
            }
          };
          $scope.close = function(){
            $state.go($state.current, {}, {reload: true});
          };
        }]

      });
    };

    self.disableHero = function (heroId)
    {
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div ng-show="!loaded && !isLoading"><h3 class="center">Disabilita Collaboratore</h3><p>Sei sicuro di voler disabilitare il collaboratore?</p></div>'+
          '<div ng-show="!loaded && isLoading"><h3 class="center">Elaborazione</h3><p>Disabilitazione collaboratore in corso..</p></div>'+
          '<div ng-show="loaded && success && !photoZones"><h3 class="center">Disabilitato</h3><p>Disabilitazione è avvenuta con successo.</p></div>'+
          '<div ng-show="loaded && !success && !photoZones"><h3 class="center">Errore!</h3><p>C\'è stato un errore.</p></div>'+
          '<div ng-show="!loaded" class="section center">'+
            '<a ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Annulla</a>&nbsp;'+
            '<a ng-click="disableHero()" class="waves-effect waves-light main-orange btn">Conferma</a>'+
          '</div>'+
          '<div ng-show="loaded && success"  class="section center">'+
            '<a ng-click="close()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
          '<div ng-show="loaded && photoZones"  class="section center">'+
            '<a ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
        '</div>',
        plain: true,
        className: 'ngdialog-theme-default',
        controller: ['$scope', function($scope) {
          $scope.isLoading = false;
          $scope.loaded = false;
          $scope.success = false;

          $scope.disableHero = function(){
              $scope.isLoading = true;

              var p = RestService.disableHero(heroId);
              p.then(function(data){
                  $scope.loaded = true;
                  $scope.success = true;
              }, function(){
                  $scope.loaded = true;
                  $scope.success = false;
              });
          };

          $scope.close = function(){
            $state.go($state.current, {}, {reload: true});
          };
        }]

      });
    };

    self.reenableHero = function (heroId)
    {
      ngDialog.open({
        template:
        '<div layout="column">'+
          '<div ng-show="!loaded && !isLoading"><h3 class="center">Riabilita Collaboratore</h3><p>Sei sicuro di voler riabilitare il collaboratore?</p></div>'+
          '<div ng-show="!loaded && isLoading"><h3 class="center">Elaborazione</h3><p>Riabilitazione collaboratore in corso..</p></div>'+
          '<div ng-show="loaded && success && !photoZones"><h3 class="center">Riabilitato</h3><p>Il collaboratore è ora attivo.</p></div>'+
          '<div ng-show="loaded && !success && !photoZones"><h3 class="center">Errore!</h3><p>C\'è stato un errore.</p></div>'+
          '<div ng-show="!loaded" class="section center">'+
            '<a ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Annulla</a>&nbsp;'+
            '<a ng-click="reenableHero()" class="waves-effect waves-light main-orange btn">Conferma</a>'+
          '</div>'+
          '<div ng-show="loaded && success"  class="section center">'+
            '<a ng-click="close()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
          '<div ng-show="loaded && photoZones"  class="section center">'+
            '<a ng-click="closeThisDialog()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
        '</div>',
        plain: true,
        className: 'ngdialog-theme-default',
        controller: ['$scope', function($scope) {
          $scope.isLoading = false;
          $scope.loaded = false;
          $scope.success = false;

          $scope.reenableHero = function(){
              $scope.isLoading = true;

              var p = RestService.reenableHero(heroId);
              p.then(function(data){
                  $scope.loaded = true;
                  $scope.success = true;
              }, function(){
                  $scope.loaded = true;
                  $scope.success = false;
              });
          };

          $scope.close = function(){
            $state.go($state.current, {}, {reload: true});
          };
        }]

      });
    };

    self.selectPicture = function(id, callback){
      ngDialog.open({
        template:
        '<div class="center">'+
          '<div><h3>Seleziona una immagine</h3><p>Puoi selezionare solo file formato .jpg, .png e .gif</p></div>'+
          '<input type="file" nv-file-select uploader="uploader" ng-show="uploader.queue < 1" class="margin-top" />'+
          '<div ng-repeat="item in uploader.queue">'+
            '<div class="cropArea">'+
              '<img-crop image="item.image" result-image="item.croppedImage"></img-crop>'+
            '</div>'+
            '<a type="button" ng-click="item.upload()" class="waves-effect waves-light main-orange btn" ng-disabled="item.isReady || item.isUploading || item.isSuccess">Carica</a>&nbsp;'+
          '</div>'+
        '</div>',
        plain: true,
        className: 'ngdialog-theme-default',
        controller: ['$scope', 'FileUploader', function($scope, FileUploader) {
          var uploader = $scope.uploader = new FileUploader({
            url: RestService.getPhotoUploadUrl(id),
            method: 'POST',
          });

          uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
              var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
              return '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
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
              callback(newUrl);
              $scope.closeThisDialog();
            }
          };

          uploader.onErrorItem = function(fileItem, response, status, headers) {
            $scope.closeThisDialog();
          };

        }],

      });
    }

    self.selectCv = function(id, callback){
      ngDialog.open({
        template:
        '<div class="center">'+
          '<div><h3>Seleziona il CV</h3><p>Puoi selezionare solo file formato .pdf, .doc, .docx, .odt e .txt</p></div>'+
          '<input type="file" nv-file-select uploader="uploader" ng-show="uploader.queue < 1" class="section" />'+
          '<div ng-repeat="item in uploader.queue" layout="column" layout-align="space-around center" layout-padding>'+
            '<a type="button" ng-click="item.upload()" class="waves-effect waves-light main-orange btn" ng-disabled="item.isReady || item.isUploading || item.isSuccess">Carica</a>&nbsp;'+
        '</div>',
        plain: true,
        className: 'ngdialog-theme-default',
        controller: ['$scope', 'FileUploader', function($scope, FileUploader) {
          var uploader = $scope.uploader = new FileUploader({
            url: RestService.getCvUploadUrl(id),
            method: 'POST',
          });

          uploader.filters.push({
            name: 'cvFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                $log.debug('[FILE_UPLOADER] ', item);

                if (item.type != "") {
                    var type = '|' + item.type + '|'; // .doc .docx .txt .odt .pdf
                    $log.debug('[FILE_UPLOADER] MIME type is', type);
                    return '|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|text/plain|application/pdf|application/vnd.oasis.opendocument.text|'.indexOf(type) !== -1;
                } else {
                    // get file extension
                    var dots = item.name.split(".");
                    //get the part AFTER the LAST period.
                    var fileType = dots[dots.length-1];
                    $log.debug('[FILE_UPLOADER] No MIME specified, relating on file extension: ', '.'+fileType);
                    var allowed = '.doc.docx.txt.odt.pdf';
                    return (allowed.indexOf(fileType) != -1);
                }
            }
          });

          uploader.onAfterAddingFile = function(item) {
            $log.debug('[FILE_UPLOADER] ', item);
          };

          uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if(status === 200) {
              var newUrl = response.url;
              callback(newUrl);
              $scope.closeThisDialog();
            }
          };

          uploader.onErrorItem = function(fileItem, response, status, headers) {
            $scope.closeThisDialog();
          };

        }],

      });
    }

    self.saveConfirmed = function(error, validation){
      var content = '<div><h3>Modifiche salvate!</h3><p>Modifiche salvate con successo.</p></div>';
      if(error)
        content = '<div><h3>Errore!</h3><p>C\'è stato un errore inaspettato.</p></div>';
      if(error && validation)
        content = '<div><h3>Errore validazione!</h3><p>Errore nella validazione dei dati. Ricontrolla i dati e riprova.</p></div>';

      ngDialog.open({
        template:
        '<div>'+
          content+
          '<div class="section center">'+
            '<a type="button" ng-click="close()" class="waves-effect waves-light main-orange btn">Chiudi</a>&nbsp;'+
          '</div>'+
        '</div>',
        className: 'ngdialog-theme-default',
        plain: true,
        controller: ['$scope', function($scope){
          $scope.close = function(){
            $scope.closeThisDialog();
            $state.go($state.current, {}, {reload: true});
          };
        }]
      });
    };

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
