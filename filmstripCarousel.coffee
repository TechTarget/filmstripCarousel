###!
filmstripCarousel v1.0.5 (http://okize.github.com/)
Copyright (c) 2013 | Licensed under the MIT license - http://www.opensource.org/licenses/mit-license.php
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
    itemsToShow: 3
    linkEntireItem: false
    navigation: true
    navigationPosition: 'Outside' # Inline or Outside
    pagination: true
    paginationEvent: 'click' # click, mouseover
    verboseClasses: true

  # plugin constructor
  class Plugin

    constructor: (@element, options) ->
      @options = $.extend({}, defaults, options)
      @_defaults = defaults
      @_name = pluginName
      @el = $(@element)
      @init()

    # initialize plugin
    init: ->

      o = @options
      filmstrip = $(@element)
      itemsContainer = filmstrip.children('.filmstripWindow').children('ul')
      items = itemsContainer.find('> li')
      itemCount = items.size()
      itemWidth = items.outerWidth()
      itemsToShow = o.itemsToShow
      itemsContainerWidth = (itemWidth * itemCount)
      itemGroups = Math.ceil(itemCount / itemsToShow)
      itemGroupShowing = 0
      filmstripWindowWidth = itemWidth * itemsToShow
      showControls = o.navigation or o.pagination

      # adjust width of filmstrip list to contain all the items
      itemsContainer.width itemsContainerWidth

      # autoplay object
      autoplay =

        # initialize autoplay
        start: ->
          @timer = setInterval($.proxy(@triggerSlide, this), o.autoplaySpeed)
          return true

        # trigger slide
        triggerSlide: ->

          # temp kludge
          itemGroupShowing = -1  if (itemGroupShowing + 1) is itemGroups
          filmstrip.trigger 'filmstrip.move', 'next'


        # stop autoplay
        stop: ->
          clearTimeout @timer


      # if linkSlide enabled, wrap the contents of the slide in an href
      if o.linkEntireItem
        item = undefined
        href = undefined
        items.each (i) ->
          item = items.eq(i)
          href = item.find('a').attr('href')
          item.contents().wrapAll '<a href="' + href + '">'  if typeof href isnt 'undefined'


      # check if navigation or pagination is enabled
      if showControls

        # bail if navigation or pagination is unnecessary (ie. not enough items)
        return  if itemCount <= itemsToShow

        # dom element that contains the filmstrip controls
        controls = $('<div/>',
          class: 'filmstripControls'
        )

        # the pagination object
        pagination = undefined

        # the navigation object
        navigation =
          btnNext: ''
          btnPrev: ''


        # if pagination is enabled, build the markup to display it
        if o.pagination

          # @todo
          paginationGroupIndex = 0

          # @todo
          paginationItems = []

          # @todo
          className = ['active']

          # @todo
          i = 0

          while i < itemGroups
            paginationItems.push '<a href="#" class="' + (className[i] or ' ') + '" data-filmstrip-group="' + i + '">' + (i + 1) + '</a>'
            i++

          # append pagination items to pagination object
          pagination = $('<span/>',
            class: 'filmstripPagination'
          ).on(o.paginationEvent, 'a', (e) ->
            e.preventDefault()
            autoplay.stop()  if o.autoplay
            paginationGroupIndex = $(this).data('filmstripGroup')
            filmstrip.trigger 'filmstrip.move', paginationGroupIndex
            autoplay.start()  if o.autoplay
          ).append(paginationItems.join(''))

        # if navigation is enabled, build the markup to display it
        if o.navigation

          # previous button
          navigation.btnPrev = $('<a>',
            class: 'filmstripPrevious disabled'
            href: '#'
            title: 'Previous'
            text: 'Previous'
          ).on('click', (e) ->
            e.preventDefault()
            autoplay.stop()  if o.autoplay
            filmstrip.trigger 'filmstrip.move', 'previous'  unless $(this).hasClass('disabled')
            autoplay.start()  if o.autoplay
          )

          # next button
          navigation.btnNext = $('<a>',
            class: 'filmstripNext'
            href: '#'
            title: 'Next'
            text: 'Next'
          ).on('click', (e) ->
            e.preventDefault()
            autoplay.stop()  if o.autoplay
            filmstrip.trigger 'filmstrip.move', 'next'  unless $(this).hasClass('disabled')
            autoplay.start()  if o.autoplay
          )

        # add the navigation buttons to controls
        controls.append(navigation.btnPrev).append(pagination).append navigation.btnNext

        # @todo
        moveStrip = (e, direction) ->

          # @todo
          mover = ->
            itemsContainer.css 'left', -filmstripWindowWidth * itemGroupShowing


          # @todo
          selectDot = (index) ->

            # @todo fix var name
            tmp = pagination.find('a')
            tmp.removeClass 'active'
            tmp.eq(index).addClass 'active'


          # direction is overloaded & can either be a number (item group index) or a string (next/previous)
          if typeof direction is 'number'

            # @todo
            if o.pagination
              selectDot direction
              itemGroupShowing = direction
              mover()
          else

            # this prevents queue buildup as the filmstrip is shifting position
            #if (!filmstripIsMoving) {
            if direction is 'previous' and itemGroupShowing > 0

              #filmstripIsMoving = true;
              itemGroupShowing--
              mover()
            if direction is 'next' and itemGroupShowing < itemGroups - 1

              #filmstripIsMoving = true;
              itemGroupShowing++
              mover()
            selectDot itemGroupShowing  if o.pagination

          #}

          # @todo this sucks; rewrite this next
          if o.navigation
            if itemGroupShowing is 0
              navigation.btnPrev.addClass 'disabled'
            else
              navigation.btnPrev.removeClass 'disabled'
            if itemGroupShowing is itemGroups - 1
              navigation.btnNext.addClass 'disabled'
            else
              navigation.btnNext.removeClass 'disabled'


        # add class names for styling
        filmstrip.addClass('filmstripNavigationShow').addClass 'filmstripNavigation' + o.navigationPosition  if o.verboseClasses

        # add controls to the dom & bind handlers
        filmstrip.append(controls).on 'filmstrip.move', moveStrip

      # if there are no items, remove container from dom
      if itemCount is 0
        filmstrip.remove()
        return

      # autoplay
      # this whole plugin needs to be rewritten
      autoplay.start()  if o.autoplay

  # lightweight wrapper around the constructor that prevents multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(@, 'plugin_#{pluginName}')
        $.data(@, 'plugin_#{pluginName}', new Plugin(@, options))
      return
  return