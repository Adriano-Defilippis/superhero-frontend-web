/* globals FastClick:true */
$(function() {
    var needsClick = FastClick.prototype.needsClick;
    FastClick.prototype.needsClick = function(target) {
        // google auto complete fix
        if ( (target.className || '').indexOf('pac-item') > -1 ) {
            return true;
        } else if ( (target.parentNode.className || '').indexOf('pac-item') > -1) {
            return true;
        // full calendar fix
    } else if ( (target.className || '').indexOf('fc-widget-content') > -1 ) {
            return true;
        } else {
            return needsClick.apply(this, arguments);
        }
    };
});
