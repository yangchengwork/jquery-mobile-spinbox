/*
 * jQuery Mobile Framework : plugin to provide number spinbox.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notification.
 * https://github.com/jtsage/jquery-mobile-spinbox
 */

(function($) {
	$.widget( "mobile.spinbox", $.mobile.widget, {
		options: {
			// All widget options, including some internal runtime details
			dmin: false,
			dmax: false,
			step: false,
			theme: false,
			repButton: true,
			version: '1.4.3-2014080200',
			initSelector: "input[data-role='spinbox']",
			clickEvent: 'vclick',
			type: 'horizontal', // or vertical
		},
		_sbox_run: function () {
			var w = this,
				timer = 150;
				
			if ( w.g.cnt > 10 ) { timer = 100; }
			if ( w.g.cnt > 30 ) { timer = 50; }
			if ( w.g.cnt > 60 ) { timer = 20; }
			
			w.g.didRun = true;
			w._offset(this, w.g.delta);
			w.g.cnt++;
			w.runButton = setTimeout(function() {w._sbox_run();}, timer);
		},
		_offset: function(obj, direction) {
			var w = this,
				o = this.options;
				
			if ( !w.disabled ) {
				if ( direction < 1 ) {
					tmp = parseInt(w.d.input.val(),10) - o.step;
					if ( tmp >= o.dmin ) { 
						w.d.input.val(tmp);
						w.d.input.trigger('change');
					}
				} else {
					tmp = parseInt(w.d.input.val(),10) + o.step;
					if ( tmp <= o.dmax ) { 
						w.d.input.val(tmp);
						w.d.input.trigger('change');
					}
				}
			}
		},
		_create: function() {
			var w = this, tmp, mini,
				o = $.extend(this.options, this.element.jqmData('options')),
				d = {
					input: this.element,
					inputWrap: this.element.parent()
				},
				touch = ( typeof window.ontouchstart !== 'undefined' ),
				drag =  {
					eStart : (touch ? 'touchstart' : 'mousedown')+'.spinbox',
					eMove  : (touch ? 'touchmove' : 'mousemove')+'.spinbox',
					eEnd   : (touch ? 'touchend' : 'mouseup')+'.spinbox',
					eEndA  : (touch ? 'mouseup.spinbox touchend.spinbox touchcancel.spinbox touchmove.spinbox' : 'mouseup.spinbox'),
					move   : false,
					start  : false,
					end    : false,
					pos    : false,
					target : false,
					delta  : false,
					tmp    : false,
					cnt    : 0
				};
				
			w.d = d;
			w.g = drag;
			
			if ( o.theme === false ) {
				o.theme = $(this).closest('[data-theme]').attr('data-theme');
				if ( typeof o.theme === 'undefined' ) { o.theme = 'a'; }
			}
			
			if ( o.dmin === false ) { o.dmin = ( typeof w.d.input.attr('min') !== 'undefined' ) ? parseInt(w.d.input.attr('min'),10) : Number.MAX_VALUE * -1; }
			if ( o.dmax === false ) { o.dmax = ( typeof w.d.input.attr('max') !== 'undefined' ) ? parseInt(w.d.input.attr('max'),10) : Number.MAX_VALUE; }
			if ( o.step === false) { o.step = (typeof w.d.input.attr('step') !== 'undefined' ) ? parseInt(w.d.input.attr('step'),10) : 1; }
			
			mini = ( w.d.input.jqmData('mini') === true );
			
			w.d.wrap = $('<div>', {'data-role': 'controlgroup', 'data-type': o.type, 'data-mini': mini, 'data-theme': o.theme})
				.insertBefore(w.d.inputWrap)
				.append(w.d.inputWrap);
			
			w.d.inputWrap.addClass('ui-btn');
			w.d.input.css({'textAlign': 'center'});
			
			if ( o.type === "horizontal" ) {
				w.d.inputWrap.css({'padding': mini ? '1px 0' : '4px 0 3px'});
				w.d.input.css({'width': mini ? '40px' : '50px'});
			} else {
				w.d.wrap.css({'width': 'auto'});
				w.d.inputWrap.css({'padding': 0});
			}
			
			w.d.up = $('<div>').html('&nbsp;').buttonMarkup({icon: 'plus', iconpos: 'notext'});
			w.d.down = $('<div>').html('&nbsp;').buttonMarkup({icon: 'minus', iconpos: 'notext'});
			
			if ( o.type === 'horizontal' ) {
				w.d.down.prependTo(w.d.wrap); w.d.up.appendTo(w.d.wrap);
				w.d.down.addClass('ui-last-child'); w.d.up.addClass('ui-first-child');
			} else {
				w.d.up.prependTo(w.d.wrap); w.d.down.appendTo(w.d.wrap);
				w.d.up.addClass('ui-last-child'); w.d.down.addClass('ui-first-child');
			}
			
			w.d.wrap.controlgroup();
			
			if ( o.repButton === false ) {
				w.d.up.on(o.clickEvent, function(e) { e.preventDefault(); w._offset(e.currentTarget, 1); });
				w.d.down.on(o.clickEvent, function(e) { e.preventDefault(); w._offset(e.currentTarget, -1); });
			} else {
				console.log(w.g);
				w.d.up.on(w.g.eStart, function(e) {
					w.d.input.blur();
					w._offset(e.currentTarget, 1);
					w.g.move = true;
					w.g.cnt = 0;
					w.g.delta = 1;
					if ( !w.runButton ) {
						w.g.target = e.currentTarget;
						w.runButton = setTimeout(function() {w._sbox_run();}, 500);
					}
				});
				w.d.down.on(w.g.eStart, function(e) {
					w.d.input.blur();
					w._offset(e.currentTarget, -1);
					w.g.move = true;
					w.g.cnt = 0;
					w.g.delta = -1;
					if ( !w.runButton ) {
						w.g.target = e.currentTarget;
						w.runButton = setTimeout(function() {w._sbox_run();}, 500);
					}
				});
				w.d.up.on(w.g.eEndA, function(e) {
					if ( w.g.move ) {
						e.preventDefault();
						clearTimeout(w.runButton);
						w.runButton = false;
						w.g.move = false;
					}
				});
				w.d.down.on(w.g.eEndA, function(e) {
					if ( w.g.move ) {
						e.preventDefault();
						clearTimeout(w.runButton);
						w.runButton = false;
						w.g.move = false;
					}
				});
			}
			
			if ( typeof $.event.special.mousewheel !== 'undefined' ) { // Mousewheel operation, if plugin is loaded
				w.d.input.on('mousewheel', function(e,d) {
					e.preventDefault();
					if ( !w.disabled ) {
						tmp = parseInt(w.d.input.val(),10) + ((d<0)?-1:1);
						if ( tmp >= o.dmin && tmp <= o.dmax ) { 
							w.d.input.val(tmp); 
							w.d.input.trigger('change');
						}
					}
				});
			}
		},
		disable: function(){
			// Disable the element
			this.d.input.attr("disabled",true);
			this.d.input.addClass("ui-disabled").blur();
			this.disabled = true;
		},
		enable: function(){
			// Enable the element
			this.d.input.attr("disabled", false);
			this.d.input.removeClass("ui-disabled");
			this.disabled = false;
		}
	});
	  
	$( document ).bind( "pagecreate create", function( e ){
		$( ":jqmData(role='spinbox')", e.target ).each(function() {
			var defed = typeof ($(this).data('mobile-spinbox'));
			if ( defed === "undefined" ) {
				$(this).spinbox();
			}
		});
	});
})( jQuery );
