'use strict';

// set to true when not connected to drone
var TEST_MODE = false;

var Leap = require('leapjs');
var arDrone = require('ar-drone');
var debug = require('debug')('app');

var controller = new Leap.Controller();
var drone = arDrone.createClient();

var active = false;
var y0 = 0;
var pitch0 = 0;
var roll0 = 0;
var yaw0 = 0;

var waiting = false;

var cap = function(n, mult) {
  mult = mult || 0.5;
  n = Math.min(n, 1);
  n = Math.max(n, -1);
  n *= mult;
  return n;
};

controller.on('frame', function(frame) {
  if (waiting && !TEST_MODE) return;

  if (frame.hands.length) {
    var hand = frame.hands[0];

    if (hand.grabStrength > 0.9) {
      if (active) {
        debug('LAND');
        active = false;
        waiting = true;
        drone.land(function() {
          waiting = false;
        });
      }
    } else {
      if (!active) {
        // first open fist
        debug('TAKE OFF');
        active = true;
        y0 = hand.palmPosition[1];
        pitch0 = hand.pitch();
        roll0 = hand.roll();
        yaw0 = hand.yaw();
        waiting = true;
        drone.takeoff(function() {
          waiting = false;
        });
      }

      var y = hand.palmPosition[1] - y0;
      y /= 200;
      y = cap(y, 1);
      if (y > 0) {
        debug('up');
        drone.up(y);
      } else {
        debug('down');
        drone.down(-y);
      }

      var pitch = cap(hand.pitch() - pitch0); // forward (-1) and back (+1)
      var roll = cap(hand.roll() - roll0); // left (+1) and right (-1)
      var yaw = cap(hand.yaw() - yaw0); // rotation left (-1) and right (+1)

      if (pitch > 0) {
        debug('back');
        drone.back(pitch);
      } else {
        debug('forward');
        drone.front(-pitch);
      }
      if (roll > 0) {
        debug('left');
        drone.left(roll);
      } else {
        debug('right');
        drone.right(-roll);
      }
      if (yaw > 0) {
        debug('turn right');
        drone.clockwise(yaw);
      } else {
        debug('turn left');
        drone.clockwise(-yaw);
      }
    }
  }
});

controller.connect();
