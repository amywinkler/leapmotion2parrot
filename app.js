'use strict';

var Leap = require('leapjs');

var controller = new Leap.Controller();

var active = false;
var y0 = 0;
var pitch0 = 0;
var roll0 = 0;
var yaw0 = 0;

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
        pitch0 = hand.pitch();
        roll0 = hand.roll();
        yaw0 = hand.yaw();
      }

      var y = hand.palmPosition[1] - y0;
      y /= 200;
      y = cap(y);
      if (y > 0) {
        console.log('up');
      } else {
        console.log('down');
      }

      var pitch = cap(hand.pitch() - pitch0); // forward (-1) and back (+1)
      var roll = cap(hand.roll() - roll0); // left (+1) and right (-1)
      var yaw = cap(hand.yaw() - yaw0); // rotation left (-1) and right (+1)

      if (pitch > 0) {
        console.log('back');
      } else {
        console.log('forward');
      }
      if (roll > 0) {
        console.log('left');
      } else {
        console.log('right');
      }
      if (yaw > 0) {
        console.log('turn right');
      } else {
        console.log('turn left');
      }
    }
  }
});

controller.connect();
