'use strict';

export default function PressReviewDirective (

        $log,
        AssetsStore

    ) {
        "ngInject";

        var links = [
            { name: 'Corriere Innovazione', logo: AssetsStore.Press('corriereInnovazione'), className: 'corriereInnovazione' },
            { name: 'Vanity Fair', logo: AssetsStore.Press('vanityFair'), className: 'vanity' },
            { name: 'TGCOM 24', logo: AssetsStore.Press('tgcom24'), className: 'tgcom' },
            { name: 'OGGI', logo: AssetsStore.Press('oggi'), className: 'oggi' },
            { name: 'RDS', logo: AssetsStore.Press('rds') },
        ];

        var mobileLinks = [links[0], links[1], links[2], links[3], links[4]];

        return {
            restrict: 'EA',
            templateUrl: 'app/guest/press-review/press-review.directive.html',
            link: linkFunction
        }

        function linkFunction (scope, elem, attrs, ctrl)
        {
            if (Modernizr.touch) scope.links = mobileLinks;
            else scope.links = links;
        }


    }
