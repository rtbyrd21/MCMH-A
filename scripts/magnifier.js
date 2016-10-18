/*!
 * jQuery Magnify Plugin v1.6.10 by Tom Doan (http://thdoan.github.io/magnify/)
 * Based on http://thecodeplayer.com/walkthrough/magnifying-glass-for-images-using-jquery-and-css3
 *
 * jQuery Magnify by Tom Doan is licensed under the MIT License.
 * Read a copy of the license in the LICENSE file or at
 * http://choosealicense.com/licenses/mit
 */

(function($) {
  $.fn.magnify = function(oOptions) {

    var $that = this, // Preserve scope
      oSettings = $.extend({
        /* Default options */
        speed: 100,
        timeout: -1,
        onload: function(){}
      }, oOptions),
      init = function(el) {
        // Initiate
        var $image = $(el),
          $anchor = $image.closest('a'),
          $container,
          $lens,
          oContainerOffset,
          nContainerWidth,
          nContainerHeight,
          nImageWidth,
          nImageHeight,
          nLensWidth,
          nLensHeight,
          nMagnifiedWidth = 0,
          nMagnifiedHeight = 0,
          sImgSrc = $image.attr('data-magnify-src') || oSettings.src || $anchor.attr('href') || '',
          hideLens = function() {
            if ($lens.is(':visible')) $lens.fadeOut(oSettings.speed, function() {
              $('html').removeClass('magnifying').trigger('magnifyend'); // Reset overflow-x
            });
          };
        // Disable zooming if no valid zoom image source
        if (!sImgSrc) return;

        // Save any inline styles for resetting
        $image.data('originalStyle', $image.attr('style'));

        // Activate magnification:
        // 1. Try to get zoom image dimensions
        // 2. Proceed only if able to get zoom image dimensions OK

        // [1] Calculate the native (magnified) image dimensions. The zoomed
        // version is only shown after the native dimensions are available. To
        // get the actual dimensions we have to create this image object.
        var elImage = new Image();
        $(elImage).on({
          load: function() {
            // [2] Got image dimensions OK

            // Fix overlap bug at the edges during magnification
            $image.css('display', 'block');
            // Create container div if necessary
            if (!$image.parent('.magnify').length) {
              $image.wrap('<div class="magnify"></div>');
            }
            $container = $image.parent('.magnify');
            // Create the magnifying lens div if necessary
            if ($image.prev('.magnify-lens').length) {
              $container.children('.magnify-lens').css('background-image', 'url(\'' + sImgSrc + '\')');
            } else {
              $image.before('<div class="magnify-lens loading" style="background:url(\'' + sImgSrc + '\') no-repeat 0 0"></div>');
            }
            $lens = $container.children('.magnify-lens');
            // Remove the "Loading..." text
            $lens.removeClass('loading');
            // Cache offsets and dimensions for improved performance
            // NOTE: This code is inside the load() function, which is
            // important. The width and height of the object would return 0 if
            // accessed before the image is fully loaded.
            nMagnifiedWidth = elImage.width;
            nMagnifiedHeight = elImage.height;
            oContainerOffset = $container.offset();
            nContainerWidth = $container.width();
            nContainerHeight = $container.height();
            nImageWidth = $image.innerWidth(); // Correct width with padding
            nImageHeight = $image.innerHeight(); // Correct height with padding
            nLensWidth = $lens.width();
            nLensHeight = $lens.height();
            // Store dimensions for mobile plugin
            $image.data('zoomSize', {
              width: nMagnifiedWidth,
              height: nMagnifiedHeight
            });
            // Clean up
            elImage = null;
            // Execute callback
            oSettings.onload();

            // Handle mouse movements
            $container.on('mousemove touchmove', function(e) {
              e.preventDefault();
              // x/y coordinates of the mouse pointer or touch point
              // This is the position of .magnify relative to the document.
              //
              // We deduct the positions of .magnify from the mouse or touch
              // positions relative to the document to get the mouse or touch
              // positions relative to the container (.magnify).
              var nX = (e.pageX || e.originalEvent.touches[0].pageX) - oContainerOffset.left,
                nY = (e.pageY || e.originalEvent.touches[0].pageY) - oContainerOffset.top;
              // Toggle magnifying lens
              if (!$lens.is(':animated')) {
                if (nX<nContainerWidth && nY<nContainerHeight && nX>0 && nY>0) {
                  if ($lens.is(':hidden')) {
                    $('html').addClass('magnifying').trigger('magnifystart'); // Hide overflow-x while zooming
                    $lens.fadeIn(oSettings.speed);
                  }
                } else {
                  hideLens();
                }
              }
              if ($lens.is(':visible')) {
                // Move the magnifying lens with the mouse
                var nPosX = nX - nLensWidth/2,
                  nPosY = nY - nLensHeight/2;
                if (nMagnifiedWidth && nMagnifiedHeight) {
                  // Change the background position of .magnify-lens according
                  // to the position of the mouse over the .magnify-image image.
                  // This allows us to get the ratio of the pixel under the
                  // mouse pointer with respect to the image and use that to
                  // position the large image inside the magnifying lens.
                  var nRatioX = Math.round(nX/nImageWidth*nMagnifiedWidth - nLensWidth/2)*-1,
                    nRatioY = Math.round(nY/nImageHeight*nMagnifiedHeight - nLensHeight/2)*-1,
                    sBgPos = nRatioX + 'px ' + nRatioY + 'px';
                }
                // Now the lens moves with the mouse. The logic is to deduct
                // half of the lens's width and height from the mouse
                // coordinates to place it with its center at the mouse
                // coordinates. If you hover on the image now, you should see
                // the magnifying lens in action.
                $lens.css({
                  top: Math.round(nPosY) + 'px',
                  left: Math.round(nPosX) + 'px',
                  backgroundPosition: sBgPos || ''
                });
              }
            });

            // Prevent magnifying lens from getting "stuck"
            $container.mouseleave(hideLens);
            if (oSettings.timeout>=0) {
              $container.on('touchend', function() {
                setTimeout(hideLens, oSettings.timeout);
              });
            }
            // Ensure lens is closed when tapping outside of it
            $('body').not($container).on('touchstart', hideLens);

            if ($anchor.length) {
              // Make parent anchor inline-block to have correct dimensions
              $anchor.css('display', 'inline-block');
              // Disable parent anchor if it's sourcing the large image
              if ($anchor.attr('href') && !($image.attr('data-magnify-src') || oSettings.src)) {
                $anchor.click(function(e) {
                  e.preventDefault();
                });
              }
            }

          },
          error: function() {
            // Clean up
            elImage = null;
          }
        });

        elImage.src = sImgSrc;
      },
      // Simple debounce
      nTimer = 0,
      refresh = function() {
        clearTimeout(nTimer);
        nTimer = setTimeout(function() {
          $that.destroy();
          $that.magnify(oSettings);
        }, 100);
      };

    // Turn off zoom and reset to original state
    this.destroy = function() {
      this.each(function() {
        var $this = $(this),
          sStyle = $this.data('originalStyle');
        if (sStyle) $this.attr('style', sStyle);
        else $this.removeAttr('style');
        $this.unwrap('.magnify').prevAll('.magnify-lens').remove();
      });
      // Unregister event handler
      $(window).off('resize', refresh);
      return $that;
    }

    // Handle window resizing
    $(window).resize(refresh);

    

     var newMessageHandler = function(e){
      console.log(e);
    }

    $(document).on("newMessage", newMessageHandler);

    return this.each(function() {
      // Initiate magnification powers
      init(this);
    });

  };
}(jQuery));