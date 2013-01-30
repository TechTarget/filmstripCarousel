

    // autoplay object
    var autoplay = {

      // initialize autoplay
      start: function() {
        this.timer = setTimeout(
          $.proxy(this.getNextSlide, this),
          o.autoplaySpeed
        );
      },

      // determine the next item to select
      getNextSlide: function(){

        // increment the next item index or reset if at end of list
        nextSlide = (nextSlide === slideCount - 1) ? 0 : nextSlide + 1;

        // select next item in list
        slides.eq(nextSlide).trigger('click');

      },

      // stop autoplay
      stop: function() {
        clearTimeout(this.timer);
      }

    };

    // @todo
    slides.on('click', function (e) {
      e.preventDefault();
      if (o.autoplay) { autoplay.stop(); }
      slides.removeClass('active');
      var $this = $(this);
      $this.addClass('active');
      var index = $this.index();
      currentSlide = index;
      nextSlide = index;
      projections.css('z-index', 0);
      projections.eq(index).css({'z-index': 1, 'top': 0});
      // restart autplay
      if (o.autoplay) { autoplay.start(); }
    });

    // @todo
    projections.on('click', function (e) {
      e.preventDefault();
      var link = $(this).find('a');
      var openIn = !!link.attr('target') ? '_blank' : '_self';
      window.open( link.attr('href'), openIn );
    });

    // if there are more slides than the amount set in slidesToShow, add navigation to slides
    if (slideCount > o.slidesToShow) {
      addNavigation();
    }

    // restart autplay
    if (o.autoplay) { autoplay.start(); }