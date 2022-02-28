'use strict';

import StickyFooterDirective from './sticky-footer/sticky-footer';

import CookieBannerController from './cookie/cookie-banner';
import FooterController from './footer/footer';
import NavbarController from './navbar/navbar.controller';

import { HeroProfile } from './hero-profile/hero-profile.component';

export default angular.module('ilmiosupereroe.components', ['ilmiosupereroe.services'])
    .directive('stickyFooter', StickyFooterDirective)

    .controller('NavbarCtrl', NavbarController)
    .controller('FooterCtrl', FooterController)
    .controller('CookieCtrl', CookieBannerController)

    .component('heroProfile', HeroProfile);
