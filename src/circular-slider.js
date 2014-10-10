/*! The MIT License (MIT)

Copyright (c) 2014 Prince John Wesley

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

(function ($, undefined) {
 
	"use strict";
    $.fn.CircularSlider = function( options ) { 
 
		var slider = this;
		
		if(slider.find('div.jcs-panel').length !== 0) throw "Already Created!!!";
		
		var defaults = {
			radius: 200,
			min: 0,
			max: 359,
			value: 0,
			clockwise: true,
			labelSuffix: "",
			labelPrefix: "",
			slide: function(value) {},
			formLabel : undefined
		};
 
        var settings = $.extend({}, defaults, options );

		var validateSettings = function() {
		
			if(!Number.isInteger(settings.min)) throw "Invalid min value : " + settings.min;
			if(!Number.isInteger(settings.max)) throw "Invalid max value : " + settings.max;
			if(settings.max < settings.min) throw "Invalid range : " + settings.max + "<" + settings.min;
		
			if(!settings.labelSuffix) settings.labelSuffix = defaults.labelSuffix;
			if(!settings.labelPrefix) settings.labelPrefix = defaults.labelPrefix;
			if(settings.formLabel && !$.isFunction(settings.formLabel)) settings.formLabel = defaults.formLabel;
		};

		validateSettings();
		
		var range = settings.max - settings.min + 1;
						
		var jcsPanel = $('<div class="jcs-panel"><div class="jcs"><span class="jcs-value"></span></div><div class="jcs-indicator"> </div></div>');
		jcsPanel.appendTo(slider);
		
		var radius = Math.abs(parseInt(settings.radius)) || defaults.radius;		 
		var jcs = jcsPanel.find('div.jcs');
		var jcsIndicator = jcsPanel.find('div.jcs-indicator');
		jcs.width(radius);
		jcs.height(radius);

		var jcsValue = jcsPanel.find('span.jcs-value');
		var jcsPosition = jcs.position();	
		var jcsOuterArea = jcs.outerWidth() - jcs.innerWidth();
		var jcsBallOuterArea = jcsIndicator.outerWidth() - jcsIndicator.innerWidth();
		var jcsRadius = (jcs.width() + jcsOuterArea) / 2;
		var jcsBallRadius = (jcsIndicator.width() + jcsBallOuterArea) / 2;
		var jcsCenter = { x : jcsPosition.left + jcsRadius, y : jcsPosition.top + jcsRadius };        
		
		// calculate jcs-value position
		
		jcsValue.width(radius / 2);
		jcsValue.height(radius / 2);
		jcsValue.css({ 
			'font-size' : (radius / 8) + "px",
			'top' : (radius / 4) + "px",
			'left': (radius / 4) + "px",
		});
		
		// event binding
		var mouseDown = false;
		jcs.on('mousedown', function(e) { mouseDown = true; });
		jcs.on('mouseup', function(e) { mouseDown = false; });
		jcs.on('mousemove', function(e) {
			if(!mouseDown) return;

			var cursor = { x : e.offsetX, y : e.offsetY };
			
			var dx = cursor.x - jcsCenter.x;        
			var dy = cursor.y - jcsCenter.y;
			
			var rad = Math.atan2(dy, dx);
			var deg = rad * 180 / Math.PI;
			var rdeg = parseInt(deg);
			var d360 = (parseInt(deg < 0 ? 360 + deg : deg) + 90) % 360;
			
			// change coordinate
			
			var x = jcsCenter.x + jcsRadius * Math.cos(rad) - jcsBallRadius;
			var y = jcsCenter.y + jcsRadius * Math.sin(rad) - jcsBallRadius;
			
			jcsIndicator.css( { 'top' : y + "px", 'left' : x + "px" });			
			
			var val = settings.clockwise ? deg2Val(d360) : (settings.max - deg2Val(d360));
			jcsValue.html(buildLabel(val));
			if(settings.slide && $.isFunction(settings.slide)) settings.slide(val);
        
		});	
		
		var buildLabel = function(value) {
			return settings.labelPrefix + (settings.formLabel ? settings.formLabel(value) : value) + settings.labelSuffix;
		};
		
		var deg2Val = function(deg) {
			if(deg < 0 || deg > 359) 
				throw "Invalid angle " + deg;
				
			return Math.round(deg * ( range / 360) + settings.min);
		};
		 
		var val2Deg = function(value) {
			if(value < settings.min || value > settings.max)
				throw "Invalid range " + value;
						
			var nth =  value - settings.min;
			
			return Math.round(nth * (360 / range));	
		};
		
 
		var setValue = function(value) {
		
			if(!Number.isInteger(value)) throw "Invalid input (expected integer) : " + value;
		
			var val = settings.clockwise ? value : (settings.max - value);
					
			var d360 = val2Deg(val);
			var rad = ((d360 - 90) % 360) * Math.PI / 180;
			
			var x = jcsCenter.x + jcsRadius * Math.cos(rad) - jcsBallRadius;
			var y = jcsCenter.y + jcsRadius * Math.sin(rad) - jcsBallRadius;
			
			jcsIndicator.css('top', y + "px");
			jcsIndicator.css('left', x + "px");			
			jcsValue.html(buildLabel(value));

			if(settings.slide && $.isFunction(settings.slide)) settings.slide(val);

		};
 
		// default position
		setValue(settings.value || settings.min);
 
		return $.extend({}, this, {
			"setValue" : setValue,
		});
				
    };
 
}(jQuery));

