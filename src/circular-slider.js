/*! The MIT License (MIT)

Copyright (c) 2014 Prince John Wesley <princejohnwesley@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/
(function($, undefined) {

    "use strict";
    $.fn.CircularSlider = function(options) {

        var slider = this;

        if (slider.find('div.jcs-panel').length !== 0) throw "Already Created!!!";

        var shapes = {
            "Circle": {
                drawShape: function(jcs, jcsIndicator, jcsValue, radius) {
                    var rpx = radius + "px";
                    jcs.css({
                        'width': rpx,
                        'height': rpx,
                        'border-radius': rpx
                    });

                    jcsIndicator.css({
                        'width': (radius / 10) + "px",
                        'height': (radius / 10) + "px",
                    });

                    jcsValue.css({
                        'width': (radius / 2) + "px",
                        'height': (radius / 2) + "px",
                        'font-size': (radius / 8) + "px",
                        'top': (radius / 5) + "px",
                        'left': (radius / 5) + "px",
                    });
                },
                getCenter: function(jcsPosition, jcsRadius) {
                    return {
                        x: jcsPosition.left + jcsRadius,
                        y: jcsPosition.top + jcsRadius,
                        r: jcsRadius
                    };
                },
                deg2Val: function(deg) {
                    if (deg < 0 || deg > 359)
                        throw "Invalid angle " + deg;

                    deg = (deg + 90) % 360;
                    return Math.round(deg * (range / 360.0)) + settings.min;
                },
                val2Deg: function(value) {
                    if (value < settings.min || value > settings.max)
                        throw "Invalid range " + value;

                    var nth = value - settings.min;

                    return (Math.round(nth * (360.0 / range)) - 90) % 360;
                },
            },
            "Half Circle": {
                drawShape: function(jcs, jcsIndicator, jcsValue, radius) {
                    jcs.css({
                        'width': radius + "px",
                        'height': (radius * 0.5) + "px",
                        'border-radius': radius + "px " + radius + "px 0 0",
                        'border-bottom': 'none'
                    });

                    jcsIndicator.css({
                        'width': (radius / 10) + "px",
                        'height': (radius / 10) + "px",
                    });

                    jcsValue.css({
                        'width': (radius / 2) + "px",
                        'height': (radius / 2) + "px",
                        'font-size': (radius / 8) + "px",
                        'top': (radius / 5) + "px",
                        'left': (radius / 5) + "px",
                    });
                },
                getCenter: function(jcsPosition, jcsRadius) {
                    return {
                        x: jcsPosition.left + jcsRadius,
                        y: jcsPosition.top + jcsRadius,
                        r: jcsRadius
                    };
                },
                deg2Val: function(deg) {
                    if (deg < 0 || deg > 359)
                        throw "Invalid angle " + deg;

                    deg = (deg + 180) % 360;
                    return Math.round(deg * (range / 180.0)) + settings.min;
                },
                val2Deg: function(value) {
                    if (value < settings.min || value > settings.max)
                        throw "Invalid range " + value;

                    var nth = value - settings.min;

                    return (Math.round(nth * (180.0 / range)) - 180) % 360;
                },
            },
            "Half Circle Left": {
                drawShape: function(jcs, jcsIndicator, jcsValue, radius) {
                    jcs.css({
                        'height': radius + "px",
                        'width': (radius * 0.5) + "px",
                        'border-radius': radius + "px 0 0 " + radius + "px",
                        'border-right': 'none'
                    });

                    jcsIndicator.css({
                        'width': (radius / 10) + "px",
                        'height': (radius / 10) + "px",
                    });

                    jcsValue.css({
                        'width': (radius / 2) + "px",
                        'height': (radius / 2) + "px",
                        'font-size': (radius / 8) + "px",
                        'top': (radius / 5) + "px",
                        'left': (radius / 5) + "px",
                    });
                },
                getCenter: function(jcsPosition, jcsRadius) {
                    return {
                        x: jcsPosition.left + jcsRadius * 2,
                        y: jcsPosition.top + jcsRadius * 2,
                        r: jcsRadius * 2
                    };
                },
                deg2Val: function(deg) {
                    if (deg < 0 || deg > 359)
                        throw "Invalid angle " + deg;

                    deg = (deg - 90) % 360;
                    return Math.round(deg * (range / 180.0)) + settings.min;
                },
                val2Deg: function(value) {
                    if (value < settings.min || value > settings.max)
                        throw "Invalid range " + value;

                    var nth = value - settings.min;

                    return (Math.round(nth * (180.0 / range)) + 90) % 360;
                },
            },

            "Half Circle Right": {
                drawShape: function(jcs, jcsIndicator, jcsValue, radius) {
                    jcs.css({
                        'height': radius + "px",
                        'width': (radius * 0.5) + "px",
                        'border-radius': "0 " + radius + "px " + radius + "px 0",
                        'border-left': 'none'
                    });

                    jcsIndicator.css({
                        'width': (radius / 10) + "px",
                        'height': (radius / 10) + "px",
                    });

                    jcsValue.css({
                        'width': (radius / 2) + "px",
                        'height': (radius / 2) + "px",
                        'font-size': (radius / 8) + "px",
                        'top': (radius / 5) + "px",
                        'left': "-" + (radius / 5) + "px",
                    });
                },
                getCenter: function(jcsPosition, jcsRadius) {
                    return {
                        x: jcsPosition.left,
                        y: jcsPosition.top + jcsRadius * 2,
                        r: jcsRadius * 2
                    };
                },
                deg2Val: function(deg) {
                    if (deg < 0 || deg > 359)
                        throw "Invalid angle " + deg;
						
					deg = (deg + 90) % 360;
                    return Math.round(deg * (range / 180.0)) + settings.min;
                },
                val2Deg: function(value) {
                    if (value < settings.min || value > settings.max)
                        throw "Invalid range " + value;

                    var nth = value - settings.min;

                    return (Math.round(nth * (180.0 / range)) - 90 ) % 360;
                },
            },
            "Half Circle Bottom": {
                drawShape: function(jcs, jcsIndicator, jcsValue, radius) {
                    jcs.css({
                        'width': radius + "px",
                        'height': (radius * 0.5) + "px",
                        'border-radius': "0 0 " + radius + "px " + radius + "px",
                        'border-top': 'none'
                    });

                    jcsIndicator.css({
                        'width': (radius / 10) + "px",
                        'height': (radius / 10) + "px",
                    });

                    jcsValue.css({
                        'width': (radius / 2) + "px",
                        'height': (radius / 2) + "px",
                        'font-size': (radius / 8) + "px",
                        'top': "-" + (radius / 5) + "px",
                        'left': (radius / 5) + "px",
                    });
                },
                getCenter: function(jcsPosition, jcsRadius) {
                    return {
                        x: jcsPosition.left + jcsRadius,
                        y: jcsPosition.top,
                        r: jcsRadius
                    };
                },
                deg2Val: function(deg) {
                    if (deg < 0 || deg > 359)
                        throw "Invalid angle " + deg;

                    return Math.round(deg * (range / 180.0)) + settings.min;
                },
                val2Deg: function(value) {
                    if (value < settings.min || value > settings.max)
                        throw "Invalid range " + value;

                    var nth = value - settings.min;

                    return Math.round(nth * (180.0 / range));
                },
            }
        };

        var defaults = {
            radius: 150,
            min: 0,
            max: 359,
            value: 0,
            clockwise: true,
            labelSuffix: "",
            labelPrefix: "",
            shape: "Circle",
			touch: true,
            slide: function(ui, value) {},
            formLabel: undefined
        };

        var settings = $.extend({}, defaults, options);

        var validateSettings = function() {

            if ((settings.min |0) !== settings.min) throw "Invalid min value : " + settings.min;
            if ((settings.max |0) !== settings.max) throw "Invalid max value : " + settings.max;
            if (settings.max < settings.min) throw "Invalid range : " + settings.max + "<" + settings.min;

            if (!settings.labelSuffix) settings.labelSuffix = defaults.labelSuffix;
            if (!settings.labelPrefix) settings.labelPrefix = defaults.labelPrefix;
            if (settings.formLabel && !$.isFunction(settings.formLabel)) settings.formLabel = defaults.formLabel;

            if (!settings.shape) settings.shape = defaults.shape;
            if (!shapes[settings.shape]) throw "Invalid shape : " + settings.shape;
        };

        validateSettings();

        var range = settings.max - settings.min;

        var jcsPanel = $('<div class="jcs-panel"><div class="jcs"><span class="jcs-value"></span></div><div class="jcs-indicator"> </div></div>');
        jcsPanel.appendTo(slider);

        var radius = Math.abs(parseInt(settings.radius)) || defaults.radius;
        var jcs = jcsPanel.find('div.jcs');
        var jcsIndicator = jcsPanel.find('div.jcs-indicator');
        var jcsValue = jcsPanel.find('span.jcs-value');

        shapes[settings.shape].drawShape(jcs, jcsIndicator, jcsValue, radius);

        var jcsPosition = jcs.position();
        var jcsOuterArea = jcs.outerWidth() - jcs.innerWidth();
        var jcsBallOuterArea = jcsIndicator.outerWidth() - jcsIndicator.innerWidth();
        var jcsRadius = (jcs.width() + jcsOuterArea) / 2;
        var jcsBallRadius = (jcsIndicator.width() + jcsBallOuterArea) / 2;
        var jcsCenter = shapes[settings.shape].getCenter(jcsPosition, jcsRadius);


        // event binding
        var mouseDown = false;
        jcs.on('mousedown', function(e) {
            mouseDown = true;
        });
        jcs.on('mouseup', function(e) {
            mouseDown = false;
        });
        jcs.on('mousemove', function(e) {
            if (!mouseDown) return;

            var cursor = {
                x: e.offsetX || e.originalEvent.layerX,
                y: e.offsetY || e.originalEvent.layerY
            };

            var dx = cursor.x - jcsCenter.x;
            var dy = cursor.y - jcsCenter.y;

            var rad = Math.atan2(dy, dx);
            var deg = rad * 180 / Math.PI;
            var rdeg = parseInt(deg);
            var d360 = (parseInt(deg < 0 ? 360 + deg : deg)) % 360;

            // change coordinate

            var x = jcsCenter.x + jcsCenter.r * Math.cos(rad) - jcsBallRadius;
            var y = jcsCenter.y + jcsCenter.r * Math.sin(rad) - jcsBallRadius;

            jcsIndicator.css({
                'top': y + "px",
                'left': x + "px"
            });

            var d2v = shapes[settings.shape].deg2Val(d360);
            var val = settings.clockwise ? d2v : (settings.max - d2v);
            jcsValue.html(buildLabel(val));
            if (settings.slide && $.isFunction(settings.slide)) settings.slide(slider, val);

        });

        var buildLabel = function(value) {
            settings.value = value;
            return settings.labelPrefix + (settings.formLabel ? settings.formLabel(value) : value) + settings.labelSuffix;
        };

        var setValue = function(value) {

            if (((value | 0) !== value)) throw "Invalid input (expected integer) : " + value;

            var val = settings.clockwise ? value : (settings.max - value);

            var d360 = shapes[settings.shape].val2Deg(val);
            var rad = d360 * Math.PI / 180;

            var x = jcsCenter.x + jcsCenter.r * Math.cos(rad) - jcsBallRadius;
            var y = jcsCenter.y + jcsCenter.r * Math.sin(rad) - jcsBallRadius;

            jcsIndicator.css('top', y + "px");
            jcsIndicator.css('left', x + "px");
            jcsValue.html(buildLabel(value));

            if (settings.slide && $.isFunction(settings.slide)) settings.slide(slider, val);

        };

        var getValue = function() {
            return settings.value;
        };


        var getSupportedShapes = function() {
            return Object.keys();
        };

		
		var touchHandler = function(e) {
			var touches = e.changedTouches;
			
			// Ignore multi-touch
			if(touches.length > 1) return;
			
			var touch = touches[0];
			var events = ["touchstart", "touchmove", "touchend"];
			var mouseEvents = ["mousedown", "mousemove", "mouseup"];
			var ev = events.indexOf(e.type); 
			
			if( ev == -1) return;
			
			var type = mouseEvents(ev);
			
			var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              touch.screenX, touch.screenY, 
                              touch.clientX, touch.clientY, false, 
                              false, false, false, 0, null);
			touch.target.dispatchEvent(simulatedEvent);
			e.preventDefault();
		};
		
		// bind touch events to mouse events
		if(settings.touch) {
			
			document.addEventListener("touchstart", touchHandler, true);
			document.addEventListener("touchmove", touchHandler, true);
			document.addEventListener("touchend", touchHandler, true);
			document.addEventListener("touchcancel", touchHandler, true);

		}
		
        // default position
        setValue(settings.value || settings.min);

        return $.extend({}, this, {
            "setValue": setValue,
            "getValue": getValue,
            "getSupportedShapes": getSupportedShapes,
        });

    };

}(jQuery));
