/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function LocalStorageAlertService (
    AssetsStore, $compile, $timeout
){
    "ngInject";

    var self = this;

    self.show = function(scope){
      var template = '<div ng-include="\'app/components/storage-alert/local-storage-alert.html\'"></div>';
      var el = $compile(template)(scope);
      setBanner(el);
    }

    function setBanner(data){
      $('body').append(data);
      $timeout(function(){
        var bannerHeight = $('.storage-banner').outerHeight(true);
        $('body').css('padding-bottom', bannerHeight);
      }, 200);

    }

}
