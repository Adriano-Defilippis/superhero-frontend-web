// Generated by CoffeeScript 1.6.2
(function() {
  var countdown, moment, _ref, _ref1,
    __slice = [].slice;

  countdown = (_ref = typeof require === "function" ? require('Countdown') : void 0) != null ? _ref : this.countdown;

  moment = (_ref1 = typeof require === "function" ? require('moment') : void 0) != null ? _ref1 : this.moment;

  moment.fn.countdown = function() {
    var args, other;

    other = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return countdown.apply(null, [this.toDate(), moment(other).toDate()].concat(__slice.call(args)));
  };

}).call(this);
