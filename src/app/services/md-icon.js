var config = {
    defaultIconSize: 24
};

const MdIconProvider = function MdIconProvider() { }

MdIconProvider.prototype = {
    icon : function icon(id, url, iconSize) {
        if ( id.indexOf(':') == -1 ) id = '$default:' + id;

        config[id] = new ConfigurationItem(url, iconSize );
        return this;
    },

    iconSet : function iconSet(id, url, iconSize) {
        config[id] = new ConfigurationItem(url, iconSize );
        return this;
    },

    defaultIconSet : function defaultIconSet(url, iconSize) {
        var setName = '$default';

        if ( !config[setName] ) {
            config[setName] = new ConfigurationItem(url, iconSize );
        }

        config[setName].iconSize = iconSize || config.defaultIconSize;

        return this;
    },

    defaultIconSize : function defaultIconSize(iconSize) {
        config.defaultIconSize = iconSize;
        return this;
    },

    preloadIcons: function ($templateCache) {
        var iconProvider = this;
        var svgRegistry = [
            {
                id : 'tabs-arrow',
                url: 'tabs-arrow.svg',
                svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><polygon points="15.4,7.4 14,6 8,12 14,18 15.4,16.6 10.8,12 "/></g></svg>'
            },
            {
                id : 'close',
                url: 'close.svg',
                svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/></g></svg>'
            },
            {
                id:  'cancel',
                url: 'cancel.svg',
                svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M12 2c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm5 13.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z"/></g></svg>'
            },
            {
                id:  'menu',
                url: 'menu.svg',
                svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100"><path d="M 50 0 L 100 14 L 92 80 L 50 100 L 8 80 L 0 14 Z" fill="#b2b2b2"></path><path d="M 50 5 L 6 18 L 13.5 77 L 50 94 Z" fill="#E42939"></path><path d="M 50 5 L 94 18 L 86.5 77 L 50 94 Z" fill="#B72833"></path><path d="M 50 7 L 83 75 L 72 75 L 65 59 L 50 59 L 50 50 L 61 50 L 50 26 Z" fill="#b2b2b2"></path><path d="M 50 7 L 17 75 L 28 75 L 35 59 L 50 59 L 50 50 L 39 50 L 50 26 Z" fill="#fff"></path></svg>'
            },
            {
                id:  'toggle-arrow',
                url: 'toggle-arrow-svg',
                svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 48 48"><path d="M24 16l-12 12 2.83 2.83 9.17-9.17 9.17 9.17 2.83-2.83z"/><path d="M0 0h48v48h-48z" fill="none"/></svg>'
            }
        ];

        svgRegistry.forEach(function(asset){
            iconProvider.icon(asset.id,  asset.url);
            $templateCache.put(asset.url, asset.svg);
        });

    },

    $get : ['$http', '$q', '$log', '$templateCache', function($http, $q, $log, $templateCache) {
        this.preloadIcons($templateCache);
        return new MdIconService(config, $http, $q, $log, $templateCache);
    }]
};

/**
*  Configuration item stored in the Icon registry; used for lookups
*  to load if not already cached in the `loaded` cache
*/
function ConfigurationItem(url, iconSize) {
    this.url = url;
    this.iconSize = iconSize || config.defaultIconSize;
}

function MdIconService(config, $http, $q, $log, $templateCache) {
    var iconCache = {};
    var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;

    Icon.prototype = { clone : cloneSVG, prepare: prepareAndStyle };

    return function getIcon(id) {
        id = id || '';

        // If already loaded and cached, use a clone of the cached icon.
        // Otherwise either load by URL, or lookup in the registry and then load by URL, and cache.

        if ( iconCache[id]         ) return $q.when( iconCache[id].clone() );
        if ( urlRegex.test(id)     ) return loadByURL(id).then( cacheIcon(id) );
        if ( id.indexOf(':') == -1 ) id = '$default:' + id;

        return loadByID(id)
        .catch(loadFromIconSet)
        .catch(announceIdNotFound)
        .catch(announceNotFound)
        .then( cacheIcon(id) );
    };

    /**
    * Prepare and cache the loaded icon for the specified `id`
    */
    function cacheIcon( id ) {

        return function updateCache( icon ) {
            iconCache[id] = isIcon(icon) ? icon : new Icon(icon, config[id]);

            return iconCache[id].clone();
        };
    }

    /**
    * Lookup the configuration in the registry, if !registered throw an error
    * otherwise load the icon [on-demand] using the registered URL.
    *
    */
    function loadByID(id) {
        var iconConfig = config[id];

        return !iconConfig ? $q.reject(id) : loadByURL(iconConfig.url).then(function(icon) {
            return new Icon(icon, iconConfig);
        });
    }

    /**
    *    Loads the file as XML and uses querySelector( <id> ) to find
    *    the desired node...
    */
    function loadFromIconSet(id) {
        var setName = id.substring(0, id.lastIndexOf(':')) || '$default';
        var iconSetConfig = config[setName];

        return !iconSetConfig ? $q.reject(id) : loadByURL(iconSetConfig.url).then(extractFromSet);

        function extractFromSet(set) {
            var iconName = id.slice(id.lastIndexOf(':') + 1);
            var icon = set.querySelector('#' + iconName);
            return !icon ? $q.reject(id) : new Icon(icon, iconSetConfig);
        }
    }

    /**
    * Load the icon by URL (may use the $templateCache).
    * Extract the data for later conversion to Icon
    */
    function loadByURL(url) {
        return $http
        .get(url, { cache: $templateCache })
        .then(function(response) {
            return angular.element('<div>').append(response.data).find('svg')[0];
        });
    }

    /**
    * User did not specify a URL and the ID has not been registered with the $mdIcon
    * registry
    */
    function announceIdNotFound(id) {
        var msg;

        if (angular.isString(id)) {
            msg = 'icon ' + id + ' not found';
            $log.warn(msg);
        }

        return $q.reject(msg || id);
    }

    /**
    * Catch HTTP or generic errors not related to incorrect icon IDs.
    */
    function announceNotFound(err) {
        var msg = angular.isString(err) ? err : (err.message || err.data || err.statusText);
        $log.warn(msg);

        return $q.reject(msg);
    }

    /**
    * Check target signature to see if it is an Icon instance.
    */
    function isIcon(target) {
        return angular.isDefined(target.element) && angular.isDefined(target.config);
    }

    /**
    *  Define the Icon class
    */
    function Icon(el, config) {
        if (el.tagName != 'svg') {
            el = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(el)[0];
        }

        // Inject the namespace if not available...
        if ( !el.getAttribute('xmlns') ) {
            el.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        }

        this.element = el;
        this.config = config;
        this.prepare();
    }

    /**
    *  Prepare the DOM element that will be cached in the
    *  loaded iconCache store.
    */
    function prepareAndStyle() {
        var iconSize = this.config ? this.config.iconSize : config.defaultIconSize;
        angular.forEach({
            'fit'   : '',
            'height': '100%',
            'width' : '100%',
            'preserveAspectRatio': 'xMidYMid meet',
            'viewBox' : this.element.getAttribute('viewBox') || ('0 0 ' + iconSize + ' ' + iconSize)
        }, function(val, attr) {
            this.element.setAttribute(attr, val);
        }, this);

        angular.forEach({
            'pointer-events' : 'none',
            'display' : 'block'
        }, function(val, style) {
            this.element.style[style] = val;
        }, this);
    }

    /**
    * Clone the Icon DOM element.
    */
    function cloneSVG(){
        return this.element.cloneNode(true);
    }
}

export default MdIconProvider;

// provider $mdIcon
// directive mdIcon

export function mdIconDirective( $mdIcon ) {
    "ngInject";

  return {
    scope: {
      fontIcon: '@mdFontIcon',
      svgIcon: '@mdSvgIcon',
      svgSrc: '@mdSvgSrc'
    },
    restrict: 'E',
    template: getTemplate,
    link: postLink
  };

  function getTemplate(element, attr) {
    return attr.mdFontIcon ? '<span class="md-font" ng-class="fontIcon"></span>' : '';
  }

  /**
   * Directive postLink
   * Supports embedded SVGs, font-icons, & external SVGs
   */
  function postLink(scope, element, attr) {

    var ariaLabel = attr.alt || scope.fontIcon || scope.svgIcon;
    var attrName = attr.$normalize(attr.$attr.mdSvgIcon || attr.$attr.mdSvgSrc || '');

    if (attrName) {
      // Use either pre-configured SVG or URL source, respectively.
      attr.$observe(attrName, function(attrVal) {

        element.empty();
        if (attrVal) {
          $mdIcon(attrVal).then(function(svg) {
            element.append(svg);
          });
        }

      });
    }
  }
}
