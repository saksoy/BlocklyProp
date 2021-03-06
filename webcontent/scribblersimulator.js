/**
 * Scribbler simulator
 *
 * Copyright 2014 Creating Future.
 * http://www.creatingfuture.eu/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var wheelRadius = 10;
var wheelCircumference = 31.4;
var wheelDistanceFromCenter = 15;

ScribblerSim = function() {

    this.paper = null;
    this.scribbler = null;
    this.init = function(enclosingSelector) {
        this.paper = Raphael(enclosingSelector, 400, 400);
        this.scribbler = this.paper.image("images/lg_scribbler.gif", 190, 190, 20, 20);
        scribblerSim.move(50, 50, 1000, function() {
            scribblerSim.move(90, -20, 1000, function() {
                scribblerSim.move(10, 10, 1000, function() {
                    scribblerSim.move(-20, 90, 1000, function() {
                    });
                });
            });
        });


//        this.scribbler.animate({transform: "r" + 15 + ",190,180"}, 1000, null, function() {
//            //scribblerSim.reset();
//            scribblerSim.move(100, 100, 1000);
//        });

    };
    this.reset = function() {
        this.scribbler.remove();
        this.scribbler = this.paper.image("images/lg_scribbler.gif", 190, 190, 20, 20);
//        this.scribbler.animate({x: 190, y: 190}, 0, null, function() {
//
//        });
    };
    this.move = function(leftMotor, rightMotor, time, readyCallback) {
        var x = this.scribbler.attr("x") + 10;
        var y = this.scribbler.attr("y") + 10;
        var r = this.scribbler.attr("r");
        var screenX = Math.cos(r);
        var screenY = Math.sin(r);
        if (leftMotor === rightMotor) {
            var diffX = (leftMotor / 100) * screenX * (time / 10);
            var diffY = (leftMotor / 100) * screenY * (time / 10);
            this.scribbler.animate({x: x + diffX, y: y + diffY}, time, null, readyCallback);
        } else if (leftMotor === -rightMotor) {
            this.scribbler.animate({transform: "r" + (leftMotor * time) / 1000 + "," + x + ", " + y}, time, null, readyCallback);
        } else {
            // References
            // http://rossum.sourceforge.net/papers/DiffSteer/
            // http://planning.cs.uiuc.edu/node659.html
            // http://rossum.sourceforge.net/papers/CalculationsForRobotics/CompendiumForKinematics.htm
            var leftDistance = wheelCircumference * (leftMotor * Math.PI / 180) * (time / 1000);
            var rightDistance = wheelCircumference * (rightMotor * Math.PI / 180) * (time / 1000);
            var angleDegrees = wheelRadius / (wheelDistanceFromCenter * 2) * (leftMotor - rightMotor) * (time / 1000);
            var angleRadians = angleDegrees * Math.PI / 180;
            var distanceFromLeftWheel = leftDistance / angleRadians;
            var distanceFromCenter = ((leftDistance > rightDistance) ? (rightDistance / angleDegrees) : (leftDistance / angleDegrees));// + wheelDistanceFromCenter;
            var distanceFromRightWheel = rightDistance / angleRadians;


            console.log("angle degrees: " + angleDegrees);
            console.log("angle radians: " + angleRadians);
            console.log("left distance: " + leftDistance);
            console.log("right distance: " + rightDistance);
            console.log("distance from center: " + distanceFromCenter);
            console.log("distance from left wheel: " + distanceFromLeftWheel);
            console.log("distance from right wheel: " + distanceFromRightWheel);

            var centerX = 0;
            var centerY = 0;
            if (leftDistance > rightDistance) {
                // turn right
                centerX = x + screenY * distanceFromCenter;
                centerY = y + screenX * distanceFromCenter;
            } else {
                // turn left
                centerX = x - screenY * distanceFromCenter;
                centerY = y + screenX * distanceFromCenter;
            }
            this.scribbler.animate({transform: "r" + angleDegrees + "," + centerX + ", " + centerY}, time, null, readyCallback);

        }
    };
};