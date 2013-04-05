/*!
filmstripCarousel v1.0.5 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
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
      itemsToShow: 3,
      linkEntireItem: false,
      navigation: true,
      navigationPosition: 'Outside',
      pagination: true,
      paginationEvent: 'click',
      verboseClasses: true
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.el = $(this.element);
        this.init();
      }

      Plugin.prototype.init = function() {
        var autoplay, className, controls, filmstrip, filmstripWindowWidth, href, i, item, itemCount, itemGroupShowing, itemGroups, itemWidth, items, itemsContainer, itemsContainerWidth, itemsToShow, moveStrip, navigation, o, pagination, paginationGroupIndex, paginationItems, showControls;

        o = this.options;
        filmstrip = $(this.element);
        itemsContainer = filmstrip.children('.filmstripWindow').children('ul');
        items = itemsContainer.find('> li');
        itemCount = items.size();
        itemWidth = items.outerWidth();
        itemsToShow = o.itemsToShow;
        itemsContainerWidth = itemWidth * itemCount;
        itemGroups = Math.ceil(itemCount / itemsToShow);
        itemGroupShowing = 0;
        filmstripWindowWidth = itemWidth * itemsToShow;
        showControls = o.navigation || o.pagination;
        itemsContainer.width(itemsContainerWidth);
        autoplay = {
          start: function() {
            this.timer = setInterval($.proxy(this.triggerSlide, this), o.autoplaySpeed);
            return true;
          },
          triggerSlide: function() {
            if ((itemGroupShowing + 1) === itemGroups) {
              itemGroupShowing = -1;
            }
            return filmstrip.trigger('filmstrip.move', 'next');
          },
          stop: function() {
            return clearTimeout(this.timer);
          }
        };
        if (o.linkEntireItem) {
          item = void 0;
          href = void 0;
          items.each(function(i) {
            item = items.eq(i);
            href = item.find('a').attr('href');
            if (typeof href !== 'undefined') {
              return item.contents().wrapAll('<a href="' + href + '">');
            }
          });
        }
        if (showControls) {
          if (itemCount <= itemsToShow) {
            return;
          }
          controls = $('<div/>', {
            "class": 'filmstripControls'
          });
          pagination = void 0;
          navigation = {
            btnNext: '',
            btnPrev: ''
          };
          if (o.pagination) {
            paginationGroupIndex = 0;
            paginationItems = [];
            className = ['active'];
            i = 0;
            while (i < itemGroups) {
              paginationItems.push('<a href="#" class="' + (className[i] || ' ') + '" data-filmstrip-group="' + i + '">' + (i + 1) + '</a>');
              i++;
            }
            pagination = $('<span/>', {
              "class": 'filmstripPagination'
            }).on(o.paginationEvent, 'a', function(e) {
              e.preventDefault();
              if (o.autoplay) {
                autoplay.stop();
              }
              paginationGroupIndex = $(this).data('filmstripGroup');
              filmstrip.trigger('filmstrip.move', paginationGroupIndex);
              if (o.autoplay) {
                return autoplay.start();
              }
            }).append(paginationItems.join(''));
          }
          if (o.navigation) {
            navigation.btnPrev = $('<a>', {
              "class": 'filmstripPrevious disabled',
              href: '#',
              title: 'Previous',
              text: 'Previous'
            }).on('click', function(e) {
              e.preventDefault();
              if (o.autoplay) {
                autoplay.stop();
              }
              if (!$(this).hasClass('disabled')) {
                filmstrip.trigger('filmstrip.move', 'previous');
              }
              if (o.autoplay) {
                return autoplay.start();
              }
            });
            navigation.btnNext = $('<a>', {
              "class": 'filmstripNext',
              href: '#',
              title: 'Next',
              text: 'Next'
            }).on('click', function(e) {
              e.preventDefault();
              if (o.autoplay) {
                autoplay.stop();
              }
              if (!$(this).hasClass('disabled')) {
                filmstrip.trigger('filmstrip.move', 'next');
              }
              if (o.autoplay) {
                return autoplay.start();
              }
            });
          }
          controls.append(navigation.btnPrev).append(pagination).append(navigation.btnNext);
          moveStrip = function(e, direction) {
            var mover, selectDot;

            mover = function() {
              return itemsContainer.css('left', -filmstripWindowWidth * itemGroupShowing);
            };
            selectDot = function(index) {
              var tmp;

              tmp = pagination.find('a');
              tmp.removeClass('active');
              return tmp.eq(index).addClass('active');
            };
            if (typeof direction === 'number') {
              if (o.pagination) {
                selectDot(direction);
                itemGroupShowing = direction;
                mover();
              }
            } else {
              if (direction === 'previous' && itemGroupShowing > 0) {
                itemGroupShowing--;
                mover();
              }
              if (direction === 'next' && itemGroupShowing < itemGroups - 1) {
                itemGroupShowing++;
                mover();
              }
              if (o.pagination) {
                selectDot(itemGroupShowing);
              }
            }
            if (o.navigation) {
              if (itemGroupShowing === 0) {
                navigation.btnPrev.addClass('disabled');
              } else {
                navigation.btnPrev.removeClass('disabled');
              }
              if (itemGroupShowing === itemGroups - 1) {
                return navigation.btnNext.addClass('disabled');
              } else {
                return navigation.btnNext.removeClass('disabled');
              }
            }
          };
          if (o.verboseClasses) {
            filmstrip.addClass('filmstripNavigationShow').addClass('filmstripNavigation' + o.navigationPosition);
          }
          filmstrip.append(controls).on('filmstrip.move', moveStrip);
        }
        if (itemCount === 0) {
          filmstrip.remove();
          return;
        }
        if (o.autoplay) {
          return autoplay.start();
        }
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
