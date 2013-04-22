###!
filmstripCarousel v1.0.5 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license
http://www.opensource.org/licenses/mit-license.php
###

((factory) ->

  # use AMD or browser globals to create a jQuery plugin.
  if typeof define is 'function' and define.amd
    define [ 'jquery' ], factory
  else
    factory jQuery

) ($) ->

  'use strict'

  pluginName = 'filmstripCarousel'

  # default plugin options
  defaults =
    autoplay: false
    autoplaySpeed: 5000
    autoplayPauseOnHover: true
    itemsToShow: 3
    linkEntireItem: false
    navigation: true
    navigationPosition: 'Outside' # Inline or Outside
    counter: false
    pagination: true
    paginationEvent: 'click' # click or mouseover

  # plugin constructor
  class Plugin

    constructor: (@element, options) ->
      @options = $.extend({}, defaults, options)
      @_defaults = defaults
      @_name = pluginName
      @el = $(@element)
      @container = @el.children('.filmstripWindow').children('ul')
      @items = @container.find('> li')
      @itemCount = @items.size()
      @itemWidth = @items.outerWidth()
      @itemsToShow = @options.itemsToShow
      @containerWidth = (@itemWidth * @itemCount)
      @windowWidth = @itemWidth * @itemsToShow
      @itemGroups = Math.ceil(@itemCount / @itemsToShow)
      @itemGroupShowing = 1
      @showControls = @options.navigation or @options.pagination
      @init()

    # initialize plugin
    init: ->

      # nothing to do if pagination & navigation are disabled
      return if not @showControls

      # nothing to do if number of items is equal or less than amount to show
      return if @itemCount <= @itemsToShow

      # adjust width of filmstrip list to contain all the items
      @container.width @containerWidth

      # if navigation or pagination is enabled
      if @showControls
        @navigationInit() if @options.navigation
        @paginationInit() if @options.navigation
        @renderControls()
        @bindEvents()

      # linkEntireItem enabled
      @wrapItem() if @options.linkEntireItem

    play: ->

    pause: ->

    move: (thing) ->
      @itemGroupShowing++
      @updateCounter() if @options.counter
      console.log(thing)

    bindEvents: ->

      @el.on('click', 'a', (e) =>

        target = $(e.target)

        # advance strip
        @move('next') if target.hasClass('filmstripNext') unless target.hasClass('disabled')

        # recede strip
        @move('previous') if target.hasClass('filmstripPrevious') unless target.hasClass('disabled')

        # jump to group
        @move(target.data('filmstripGroup')) if target.hasClass('paginationButton')

      )

    navigationInit: ->

      # add some class names to filmstrip
      @el
        .addClass('filmstripNavigationShow')
        .addClass('filmstripNavigation' + @options.navigationPosition)

    paginationInit: ->

      # add some class names to filmstrip
      @el
        .addClass('filmstripPaginationShow')

    # creates the navigation html
    buildNavigationHtml: ->

      return '' if !@options.navigation

      # previous button
      this.btnPrev = $('<a>', {
        class: 'filmstripPrevious disabled'
        href: '#'
        title: 'Previous'
        text: 'Previous'
      })

      # next button
      this.btnNext = $('<a>', {
        class: 'filmstripNext'
        href: '#'
        title: 'Next'
        text: 'Next'
      })

      return this

    # creates the counter html
    buildCounterHtml: ->

      return '' if !@options.counter

      counter = $('<div>', {
        class: 'filmstripNavigationCounter',
        html: '<span class="filmstripNavigationCounterCurrent">' +
              @itemGroupShowing + '</span>' + ' of ' +
              '<span class="filmstripNavigationCounterTotal">' +
              @itemGroups + '</span>'
      })

      return counter

    # updates the counter
    updateCounter: ->

      @el
        .find('.filmstripNavigationCounterCurrent')
        .text(@itemGroupShowing)

    # creates the pagination html
    buildPaginationHtml: ->

      return '' if !@options.pagination

      paginationItems = []
      className = ['active']
      i = 0

      while i < @itemGroups
        paginationItems.push '<a href="#" class="paginationButton ' +
          (className[i] or '') + '" data-filmstrip-group="' + i + '">' +
          (i + 1) + '</a>'
        i++

      pagination = $('<span/>',
        class: 'filmstripPagination'
        html: paginationItems
      )

      return pagination

    # appends controls to dom
    renderControls: ->

      controls = {
        outer: $('<div/>', { class: 'filmstripControls' })
        counter: @buildCounterHtml()
        navigation: @buildNavigationHtml()
        pagination: @buildPaginationHtml()
      }

      html = controls.outer
        .append(controls.navigation.btnPrev)
        .append(controls.counter)
        .append(controls.pagination)
        .append(controls.navigation.btnNext)

      @el.append(html)

    # wrap inner href around entire item
    wrapItem: ->

      item = undefined
      href = undefined
      html = undefined

      @items.each (i) =>
        item = @items.eq(i)
        href = item.find('a').attr('href')
        html = '<a href="' + href + '">'
        item.contents().wrapAll html if typeof href isnt 'undefined'

  # wrapper around the constructor that prevents multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(@, 'plugin_#{pluginName}')
        $.data(@, 'plugin_#{pluginName}', new Plugin(@, options))
      return
  return