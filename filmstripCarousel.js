/*!
 * Filmstrip Carousel v0.7 (http://okize.github.com/)
 * Copyright (c) 2012 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
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
		var filmstripWindow = filmstrip.children('.filmstripWindow');
		var filmstripWidth = filmstripWindow.outerWidth();
		var itemsContainer = filmstripWindow.children('ul');
		var items = itemsContainer.find('> li');
		var itemWidth = items.outerWidth();
		var itemCount = items.size();
		var itemsContainerWidth = itemWidth * itemCount;
		
		//var firstItem = items[0];
		//var lastItem = items[itemCount - 1];
		//var filmstripIsMoving = false;
		
		// depending on where on the page the filmstrip is located, it will display a different amount of items
		// this is determined by dividing the width of the filmstrip window by the width of the items and rounding up a bit
		var itemsToShow = Math.round(filmstripWidth/itemWidth);
		
		// @todo; I don't understand why this is necessary, but filmstripWidth was off by 80px when there was only one item showing
		// probably related to the width of the nav buttons; also note: changing filmstripWidth to filmstrip.outerWidth() fixes the issue
		// but screws up the widths in carousels with multiple items showing
		filmstripWidth = (itemsToShow === 1) ? itemWidth : filmstripWindow.outerWidth();
				
		//var movement = itemsToShow * itemWidth;
		var itemGroups = Math.ceil(itemCount/itemsToShow);
		var itemGroupToShow = 0;
				
		var navigation = {}; // the navigation object
		var pagination = {}; // the pagination object

		// creates the html that compromises the navigation elements
		// inserts itself into dom and binds event handlers to button elements
		var addNavigation = function() {
			
			// @todo
			navigation.btnPrev = $('<a>', {
				'class': 'filmstripPrevious disabled',
				href: '#',
				title: 'Previous',
				text: 'Previous'
			}).on('click', function (e) {
				e.preventDefault();
				if ( !$(this).hasClass('disabled') ) {
					filmstrip.trigger('filmstrip.move', 'previous');
				}
			});

			// @todo
			navigation.btnNext = $('<a>', {
				'class': 'filmstripNext',
				href: '#',
				title: 'Next',
				text: 'Next'
			}).on('click', function (e) {
				e.preventDefault();
				if ( !$(this).hasClass('disabled') ) {
					filmstrip.trigger('filmstrip.move', 'next');
				}
			});
			
			// @todo
			navigation.container = $('<div/>', {
				'class': 'filmstripNavigation'
			}).append(navigation.btnPrev, navigation.btnNext);

			// @todo
			filmstrip.append(navigation.container);

		};
		
		// @todo
		var addPagination = function() {
			
			var groupIndex = 0;
			
			var items = [];
			var className = ['active'];

			// @todo
			for (var i = 0; i < itemGroups; i++) {
				items.push('<a href="#" class="' + (className[i] || ' ') + '" data-filmstrip-group="' + i + '">' + (i+1) + '</a>');
			}
			
			pagination.container = $('<div/>', {
				'class': 'filmstripPagination'
			}).on('click', 'a', function (e) {
				groupIndex = $(this).data('filmstripGroup');
				e.preventDefault();
				filmstrip.trigger('filmstrip.move', groupIndex);
			});
			
			pagination.items = $(items);
			
			// @todo
			filmstrip.append(pagination.container.append(items.join('')));
			
		};
		
		// @todo
		var moveStrip = function(e, direction) {
			
			// @todo
			var mover = function() {
				itemsContainer.css('left', -filmstripWidth*itemGroupToShow);
			};
			
			// @todo
			var selectDot = function(index) {
					
					// @todo fix var name
					var tmp = pagination.container.find('a');
					tmp.removeClass('active');
					tmp.eq(index).addClass('active');
	
			};
			
			// direction is overloaded & can either be a number (item group index) or a string (next/previous)
			if (typeof direction === 'number') {
													
				// @todo
				if (o.pagination) {
					selectDot(direction);
					itemGroupToShow = direction;
					mover();
				}
				
			} else {
					
				// this prevents queue buildup as the filmstrip is shifting position
				//if (!filmstripIsMoving) {
							
					if (direction === 'previous' && itemGroupToShow > 0) {
						//filmstripIsMoving = true;
						itemGroupToShow--;
						mover();
					}
					
					if (direction === 'next' && itemGroupToShow < itemGroups - 1) {
						//filmstripIsMoving = true;
						itemGroupToShow++;
						mover();
					}
					
					
					if (o.pagination) {
						selectDot(itemGroupToShow);
					}
				
				//}
				
			}
			
			// @todo this sucks; rewrite this next
			if (o.navigation) {

				if (itemGroupToShow === 0) {
					navigation.btnPrev.addClass('disabled');
				} else {
					navigation.btnPrev.removeClass('disabled');
				}
				if (itemGroupToShow === itemGroups - 1) {
					navigation.btnNext.addClass('disabled');
				} else {
					navigation.btnNext.removeClass('disabled');
				}
			}

		};
		
		// initialize plugin:
		
		// if there are no items, there is nothing to be done
		if (itemCount === 0) {
			filmstrip.remove();
			return;
		}
		
		// adjust width of filmstrip list to contain all the items
		itemsContainer.width(itemsContainerWidth);
		
		// if navigation is enabled add nav object to the dom
		// if disabled add class to container to indicate such (for css styling purposes)
		if (o.navigation) {
			addNavigation();
		} else {
			filmstrip.addClass('filmstripNoNav');
		}
		
		// if pagination is enabled add nav object to the dom
		// if disabled add class to container to indicate such (for css styling purposes)
		if (o.pagination) {
			addPagination();
		} else {
			filmstrip.addClass('filmstripNoPagination');
		}
			
		// bind handlers
		filmstrip.on('filmstrip.move', moveStrip);
			
				
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