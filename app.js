'use strict';

var Leap = require('leapjs');

var controller = new Leap.Controller();

var active = false;
var y0 = 0;

var cap = function(n) {
  n = Math.min(n, 1);
  n = Math.max(n, -1);
  return n;
};

controller.on('frame', function(frame) {
  if (frame.hands.length) {
    var hand = frame.hands[0];

    if (hand.grabStrength > 0.9) {
      active = false;
      // TODO stop drone
    } else {
      if (!active) {
        // first open fist
        active = true;
        y0 = hand.palmPosition[1];
      }

      var y = hand.palmPosition[1] - y0;
      y /= 200;
      y = cap(y);
      if (y > 0) {
        // TODO move drone up
      } else {
        // TODO move drone down
      }

      var pitch = cap(hand.pitch()); // forward (-1) and back (+1)
      var roll = cap(hand.roll()); // left (+1) and right (-1)
      var yaw = cap(hand.yaw()); // rotation left (-1) and right (+1)
    }
  }
});

controller.connect();
