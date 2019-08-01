(function ($) {

      let $allPanels = $('.nested').hide();
      let $elements = $('.treeview-animated-element');

      $('.treeview-animated-items').click(function () {
        $this = $(this);
        $target = $this.siblings('.nested');
        $pointerPlus = $this.children('.fa-caret-right');
        $pointerMinus = $this.children('.fa-caret-down');
        $pointerPasteClose = $this.children('.fa-folder');
        $pointerPasteOpen = $this.children('.fa-folder-open');
        $pointerEnvelopeClose = $this.children('.fa-envelope');
        $pointerEnvelopeOpen = $this.children('.fa-envelope-open-text');

        $pointerPlus.removeClass('fa-caret-right');
        $pointerPlus.addClass('fa-caret-down');
        
        $pointerMinus.removeClass('fa-caret-down');
        $pointerMinus.addClass('fa-caret-right');
        
        $pointerPasteClose.removeClass('fas fa-folder');
        $pointerPasteClose.addClass('far fa-folder-open');
        
        $pointerPasteOpen.removeClass('far fa-folder-open');
        $pointerPasteOpen.addClass('fas fa-folder');
        
        $pointerEnvelopeClose.removeClass('fas fa-envelope');
        $pointerEnvelopeClose.addClass('fas fa-envelope-open-text');
        
        $pointerEnvelopeOpen.removeClass('fas fa-envelope-open-text');
        $pointerEnvelopeOpen.addClass('fas fa-envelope');
        
        $this.toggleClass('open')
        if (!$target.hasClass('active')) {
          $target.addClass('active').slideDown();
        } else {
          $target.removeClass('active').slideUp();
        }

        return false;
      });
      $elements.click(function () {
        $this = $(this);

        if ($this.hasClass('opened')) {

          $elements.removeClass('opened');
        } else {

          $elements.removeClass('opened');
          $this.addClass('opened');
        }
      })
    })(jQuery);
