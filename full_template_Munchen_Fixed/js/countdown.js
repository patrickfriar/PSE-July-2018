@@ -13,8 +13,10 @@ var createDigits = function(where, options) {
    // Iterate each startTime digit, if it is not a digit
    // we'll asume that it's a separator
    var mFirstPos, sFirstPos;
 -  // reset digits array.
 +  // reset digits and intervals array.
    digits = [];
 +  intervals = [];
 +
    for (var i = 0; i < options.startTime.length; i++) {
      if (parseInt(options.startTime[i]) >= 0) {
        elem = $('<div id="cnt_' + counter + '" class="cntDigit" />').css({
 @@ -214,7 +216,10 @@ jQuery.fn.countdown = function(userOptions) {
      delete userOptions.endTime;
    }
    $.extend(options, userOptions);
 -  createDigits(this, options);
 -  intervals.main = setInterval(function(){ moveDigit(digits.length - 1, options); },
 -                               1000);
 +  if (this.length) {
 +    clearInterval(intervals.main);
 +    createDigits(this, options);
 +    intervals.main = setInterval(function(){ moveDigit(digits.length - 1, options); },
 +                                 1000);
 +  }
  };