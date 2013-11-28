###!
filmstripCarousel v1.0.7 (https://github.com/okize)
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
    counter: false
    pagination: true
    paginationEvent: 'click' # click or mouseover
    navigation: true
    navigationPosition: 'Outside' # Inline or Outside

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
      @itemGroupTotal = Math.ceil(@itemCount / @itemsToShow)
      @itemGroupShowing = 0
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

      # if autoplay enabled kick-start it here
      if @options.autoplay
        @autoplayStart()

        # pause the autoplay when users mouse is over the carousel
        if @options.autoplayPauseOnHover
          @el.on(
            mouseenter: =>
              @autoplayStop()
            ,
            mouseleave: =>
              @autoplayStart()
          )

    # initialize autoplay
    autoplayStart: ->
      @timer = setInterval(
        $.proxy(@autoplayMove, this ),
        @options.autoplaySpeed
      )
      return

    # trigger slide
    autoplayMove: ->
      if @itemGroupShowing < (@itemGroupTotal - 1)
        @itemGroupShowing++
      else
        @itemGroupShowing = 0
      @updateControlsState()
      @moveItems()

    # stop autoplay
    autoplayStop: ->
      clearTimeout @timer

    # event hooks for the controls
    bindEvents: ->

      @el.on 'click', 'a', (e) =>

        e.preventDefault()

        control = $(e.target)
        currentGroup = @itemGroupShowing

        # advance strip
        if not control.hasClass('disabled')
          if control.hasClass('filmstripNext')
            if @itemGroupShowing < (@itemGroupTotal - 1)
              @itemGroupShowing++

        # recede strip
        if not control.hasClass('disabled')
          if control.hasClass('filmstripPrevious')
            if @itemGroupShowing > 0
              @itemGroupShowing--

        # jump to group
        if control.hasClass('paginationButton')
          @itemGroupShowing = control.data('filmstripGroup')

        # if there's a change in item group then
        # update controls state and move items
        if @itemGroupShowing != currentGroup
          @updateControlsState()
          @moveItems()


    # move the "filmstrip"
    moveItems: ->

      @container.css 'left', -(@windowWidth * @itemGroupShowing)

    # add some class names to filmstrip
    navigationInit: ->

      @el
        .addClass('filmstripNavigationShow')
        .addClass('filmstripNavigation' + @options.navigationPosition)

    # add some class names to filmstrip
    paginationInit: ->

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
              (@itemGroupShowing + 1) +
              '</span> - <span class="filmstripNavigationCounterTotal">' +
              @itemGroupTotal + '</span>'
      })

      return counter

    # creates the pagination html
    buildPaginationHtml: ->

      return '' if !@options.pagination

      paginationItems = []
      className = ['active']
      i = 0

      while i < @itemGroupTotal
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

    # updates the ui state of the controls
    updateControlsState: ->

      # updates the navigation buttons
      if @options.navigation

        nav =
          @el.find('.filmstripPrevious, .filmstripNext').removeClass('disabled')

        # disable previous button
        if @itemGroupShowing is 0
          nav.eq(0).addClass('disabled')

        # disable next button
        else if @itemGroupShowing is (@itemGroupTotal - 1)
          nav.eq(1).addClass('disabled')

      # updates the pagination dots
      if @options.pagination
        @el
          .find('.paginationButton')
          .removeClass('active')
          .eq(@itemGroupShowing)
          .addClass('active')

      # updates the counter
      if @options.counter
        @el
          .find('.filmstripNavigationCounterCurrent')
          .text(@itemGroupShowing + 1)

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