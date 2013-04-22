/*!
filmstripCarousel v1.0.5 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license
http://www.opensource.org/licenses/mit-license.php
*/


(function() {
  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery'], factory);
    } else {
      return factory(jQuery);
    }
  })(function($) {
    'use strict';
    var Plugin, defaults, pluginName;

    pluginName = 'filmstripCarousel';
    defaults = {
      autoplay: false,
      autoplaySpeed: 5000,
      autoplayPauseOnHover: true,
      itemsToShow: 3,
      linkEntireItem: false,
      navigation: true,
      navigationPosition: 'Outside',
      counter: false,
      pagination: true,
      paginationEvent: 'click'
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.el = $(this.element);
        this.container = this.el.children('.filmstripWindow').children('ul');
        this.items = this.container.find('> li');
        this.itemCount = this.items.size();
        this.itemWidth = this.items.outerWidth();
        this.itemsToShow = this.options.itemsToShow;
        this.containerWidth = this.itemWidth * this.itemCount;
        this.windowWidth = this.itemWidth * this.itemsToShow;
        this.itemGroups = Math.ceil(this.itemCount / this.itemsToShow);
        this.itemGroupShowing = 1;
        this.showControls = this.options.navigation || this.options.pagination;
        this.init();
      }

      Plugin.prototype.init = function() {
        if (!this.showControls) {
          return;
        }
        if (this.itemCount <= this.itemsToShow) {
          return;
        }
        this.container.width(this.containerWidth);
        if (this.showControls) {
          if (this.options.navigation) {
            this.navigationInit();
          }
          if (this.options.navigation) {
            this.paginationInit();
          }
          this.renderControls();
          this.bindEvents();
        }
        if (this.options.linkEntireItem) {
          return this.wrapItem();
        }
      };

      Plugin.prototype.play = function() {};

      Plugin.prototype.pause = function() {};

      Plugin.prototype.move = function(thing) {
        this.itemGroupShowing++;
        if (this.options.counter) {
          this.updateCounter();
        }
        return console.log(thing);
      };

      Plugin.prototype.bindEvents = function() {
        var _this = this;

        return this.el.on('click', 'a', function(e) {
          var target;

          target = $(e.target);
          if (!target.hasClass('disabled') ? target.hasClass('filmstripNext') : void 0) {
            _this.move('next');
          }
          if (!target.hasClass('disabled') ? target.hasClass('filmstripPrevious') : void 0) {
            _this.move('previous');
          }
          if (target.hasClass('paginationButton')) {
            return _this.move(target.data('filmstripGroup'));
          }
        });
      };

      Plugin.prototype.navigationInit = function() {
        return this.el.addClass('filmstripNavigationShow').addClass('filmstripNavigation' + this.options.navigationPosition);
      };

      Plugin.prototype.paginationInit = function() {
        return this.el.addClass('filmstripPaginationShow');
      };

      Plugin.prototype.buildNavigationHtml = function() {
        if (!this.options.navigation) {
          return '';
        }
        this.btnPrev = $('<a>', {
          "class": 'filmstripPrevious disabled',
          href: '#',
          title: 'Previous',
          text: 'Previous'
        });
        this.btnNext = $('<a>', {
          "class": 'filmstripNext',
          href: '#',
          title: 'Next',
          text: 'Next'
        });
        return this;
      };

      Plugin.prototype.buildCounterHtml = function() {
        var counter;

        if (!this.options.counter) {
          return '';
        }
        counter = $('<div>', {
          "class": 'filmstripNavigationCounter',
          html: '<span class="filmstripNavigationCounterCurrent">' + this.itemGroupShowing + '</span>' + ' of ' + '<span class="filmstripNavigationCounterTotal">' + this.itemGroups + '</span>'
        });
        return counter;
      };

      Plugin.prototype.updateCounter = function() {
        return this.el.find('.filmstripNavigationCounterCurrent').text(this.itemGroupShowing);
      };

      Plugin.prototype.buildPaginationHtml = function() {
        var className, i, pagination, paginationItems;

        if (!this.options.pagination) {
          return '';
        }
        paginationItems = [];
        className = ['active'];
        i = 0;
        while (i < this.itemGroups) {
          paginationItems.push('<a href="#" class="paginationButton ' + (className[i] || '') + '" data-filmstrip-group="' + i + '">' + (i + 1) + '</a>');
          i++;
        }
        pagination = $('<span/>', {
          "class": 'filmstripPagination',
          html: paginationItems
        });
        return pagination;
      };

      Plugin.prototype.renderControls = function() {
        var controls, html;

        controls = {
          outer: $('<div/>', {
            "class": 'filmstripControls'
          }),
          counter: this.buildCounterHtml(),
          navigation: this.buildNavigationHtml(),
          pagination: this.buildPaginationHtml()
        };
        html = controls.outer.append(controls.navigation.btnPrev).append(controls.counter).append(controls.pagination).append(controls.navigation.btnNext);
        return this.el.append(html);
      };

      Plugin.prototype.wrapItem = function() {
        var href, html, item,
          _this = this;

        item = void 0;
        href = void 0;
        html = void 0;
        return this.items.each(function(i) {
          item = _this.items.eq(i);
          href = item.find('a').attr('href');
          html = '<a href="' + href + '">';
          if (typeof href !== 'undefined') {
            return item.contents().wrapAll(html);
          }
        });
      };

      return Plugin;

    })();
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_#{pluginName}')) {
          $.data(this, 'plugin_#{pluginName}', new Plugin(this, options));
        }
      });
    };
  });

}).call(this);
