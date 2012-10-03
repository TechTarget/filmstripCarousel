/*!
* Filmstrip Carousel v0.8 (http://okize.github.com/)
* Copyright (c) 2012 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
*/

;(function ( $, window, undefined ) {

	'use strict';

	// the default settings
	var pluginName = 'filmstripCarousel';
	var defaults = {
		itemsToShow: 3,
		navigation: true,
		navigationPosition: 'Outside', // Inline, Outside
		pagination: true,
		verboseClasses: true
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
		var itemsContainer = filmstrip.children('.filmstripWindow').children('ul');
		var items = itemsContainer.find('> li');
		var itemCount = items.size();
		var itemWidth = items.outerWidth();
		var itemsToShow = o.itemsToShow;
		var itemsContainerWidth = (itemWidth * itemCount);
		var itemGroups = Math.ceil(itemCount/itemsToShow);
		var itemGroupShowing = 0;
		var filmstripWindowWidth = itemWidth * itemsToShow;
		var showControls = o.navigation || o.pagination;

		// adjust width of filmstrip list to contain all the items
		itemsContainer.width(itemsContainerWidth);

		// check if navigation or pagination is enabled
		if (showControls) {

			// bail if navigation or pagination is unnecessary (ie. not enough items)
			if (itemCount <= itemsToShow) {
				return;
			}

			// dom element that contains the filmstrip controls
			var controls = $('<div/>', {
				'class': 'filmstripControls'
			});

			// the pagination object
			var pagination;

			// the navigation object
			var navigation = {
				btnNext: '',
				btnPrev: ''
			};

			// if pagination is enabled, build the markup to display it
			if (o.pagination) {

				// @todo
				var paginationGroupIndex = 0;

				// @todo
				var paginationItems = [];

				// @todo
				var className = ['active'];

				// @todo
				for (var i = 0; i < itemGroups; i++) {
					paginationItems.push('<a href="#" class="' + (className[i] || ' ') + '" data-filmstrip-group="' + i + '">' + (i+1) + '</a>');
				}

				// append pagination items to pagination object
				pagination = $('<span/>', {
					'class': 'filmstripPagination'
				}).on('click', 'a', function (e) {
					paginationGroupIndex = $(this).data('filmstripGroup');
					e.preventDefault();
					filmstrip.trigger('filmstrip.move', paginationGroupIndex);
				}).append(paginationItems.join(''));

			}

			// if navigation is enabled, build the markup to display it
			if (o.navigation) {

				// previous button
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

				// next button
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

			}

			// add the navigation buttons to controls
			controls
				.append(navigation.btnPrev)
				.append(pagination)
				.append(navigation.btnNext);

			// @todo
			var moveStrip = function(e, direction) {

				// @todo
				var mover = function() {
					itemsContainer.css('left', -filmstripWindowWidth*itemGroupShowing);
				};

				// @todo
				var selectDot = function(index) {

						// @todo fix var name
						var tmp = pagination.find('a');
						tmp.removeClass('active');
						tmp.eq(index).addClass('active');

				};

				// direction is overloaded & can either be a number (item group index) or a string (next/previous)
				if (typeof direction === 'number') {

					// @todo
					if (o.pagination) {
						selectDot(direction);
						itemGroupShowing = direction;
						mover();
					}

				} else {

					// this prevents queue buildup as the filmstrip is shifting position
					//if (!filmstripIsMoving) {

						if (direction === 'previous' && itemGroupShowing > 0) {
							//filmstripIsMoving = true;
							itemGroupShowing--;
							mover();
						}

						if (direction === 'next' && itemGroupShowing < itemGroups - 1) {
							//filmstripIsMoving = true;
							itemGroupShowing++;
							mover();
						}


						if (o.pagination) {
							selectDot(itemGroupShowing);
						}

					//}

				}

				// @todo this sucks; rewrite this next
				if (o.navigation) {

					if (itemGroupShowing === 0) {
						navigation.btnPrev.addClass('disabled');
					} else {
						navigation.btnPrev.removeClass('disabled');
					}
					if (itemGroupShowing === itemGroups - 1) {
						navigation.btnNext.addClass('disabled');
					} else {
						navigation.btnNext.removeClass('disabled');
					}
				}

			};

			// add class names for styling
			if (o.verboseClasses) {
				filmstrip
					.addClass('filmstripNavigationShow')
					.addClass('filmstripNavigation' + o.navigationPosition);
			}

			// add controls to the dom & bind handlers
			filmstrip
				.append(controls)
				.on('filmstrip.move', moveStrip);

		}

		// if there are no items, remove container from dom
		if (itemCount === 0) {
			filmstrip.remove();
			return;
		}

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