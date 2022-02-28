'use strict';

import AutoFillHeightDirective from './autofillheight';
import HeroProfileDirective from './hero-profile';
import MenuDirective from './menu';
import RangeSliderDirective from './rangeslider';
import StickyDirective from './sticky';
import SideNavButtonDirective from './side-nav-button';
import StepsDirective from './steps';

import { AgeFilter, RegistrationDateFilter, DataOraFilter, DataOraSecondiFilter, LimitToNewFilter, Comma2DecimalFilter, Decimal2CommaFilter } from './filters';

export default angular.module('ilmiosupereroe.directives', ['ilmiosupereroe.services'])
    .directive('heroProfile', HeroProfileDirective)
    .directive('autoFillHeight', AutoFillHeightDirective)
    .directive('menu', MenuDirective)
    .directive('rangeSlider', RangeSliderDirective)
    .directive('sticky', StickyDirective)
    .directive('sideNavButton', SideNavButtonDirective)
    .directive('steps', StepsDirective)

    .filter('ageFilter', AgeFilter)
    .filter('registrationDate', RegistrationDateFilter)
    .filter('dataOra', DataOraFilter)
    .filter('dataOraSecondi', DataOraSecondiFilter)
    .filter('limitToNew', LimitToNewFilter)
    .filter('comma2decimal', Comma2DecimalFilter)
    .filter('decimal2comma', Decimal2CommaFilter);
