/*global $:false, angular:false, console:false, _:false */
'use strict';

export default function CookiePolicyService (
    AssetsStore, $compile, $rootScope
){
    "ngInject";

    var self = this;

    self.showBanner = function(scope){
      var authorised = getAccepted(); //Cookies.get('cookie-policy');
      if(!authorised && !scope.isApp){
        var template = '<div ng-include="\'app/components/cookie/cookie-banner.html\'"></div>';

        scope.ctrl = {
          accept: function(){
            acceptBanner();
          },
          informativa: AssetsStore.PDF('cliente.informazioniPrivacy')
        }

        var el = $compile(template)(scope);
        setBanner(el);

      }
    }

    function hideBanner(){
      $('.cookie-banner').remove();
    }

    function getAccepted(){
      var acc = Cookies.get('cookie-policy');
      if(acc == 'true') return true;
      else return false;
    }

    function setAccepted(){
      var year = new Date();
      year.setMonth(year.getMonth() + 12);
      Cookies.set('cookie-policy', true, { expires: year });
    }

    function setBanner(data){
      $('body').append(data);

      var self = $('.cookie-banner');
      $(document).bind('click.cookie-banner', function (e) {
        if (!self.is(e.target) && (!self.find(e.target).length > 0) ) {
          acceptBanner();
          $(document).unbind('click.cookie-banner');
        }
      });
      var N = 1;
      $(document).bind('scroll.cookie-banner', function(e){
        var scrollTop = $(document).scrollTop();
        if(scrollTop > N) {
          acceptBanner();
          $(document).unbind('scroll.cookie-banner');
        }
      });
    }

    function acceptBanner(){
      // unbind events
      $(document).unbind('scroll.cookie-banner');
      $(document).unbind('click.cookie-banner');
      setAccepted();
      hideBanner();
    }

}
