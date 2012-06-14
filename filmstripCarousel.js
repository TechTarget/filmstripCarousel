/*!
 * Filmstrip Carousel v0.7 (http://okize.github.com/)
 * Copyright (c) 2012 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
 */

/*
 * Plugin: Filmstrip Carousel
 * Version: 0.7 (June 11th 2012)
 * Description:
 * Author: Morgan Wigmanich, TechTarget
 * Options:
 *   autoPlay: boolean; this will automagically rotate through the content list
 *   autoPlaySpeed: integer; the speed (in ms) at which the autoplay will rotate through the items
 *   mouseEvent: string; which mouse event will trigger the content switch; currently supported: hover & click
 *   switchSpeed: integer; the speed (0 - ∞ in ms) that it takes to switch to displaying a new contentItem
 *   equalizeHeights: boolean; equalizes the heights of the content container and navigation list to whichever is largest
 * Dependencies: none
 */


;(function ( $, window, undefined ) {

	'use strict';

	// the default settings
	var pluginName = 'filmstripCarousel';
	var defaults = {
		navigation: true,
		pagination: true,
		speed: 500
	};

	// plugin constructor
	function Plugin( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype.init = function () {

		// plugin vars
		var o = this.options;
		var filmstrip = $(this.element);
		
	};

	// a lightweight plugin wrapper around the constructor preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
			}
		});
	};

}(jQuery, window));