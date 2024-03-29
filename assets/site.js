(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.NavigationView = (function(superClass) {
    extend(NavigationView, superClass);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.prototype.events = {
      'click .header-navigation .simple-dropdown > a': 'toggleNavigation',
      'click .header-navigation .has-mega-nav a': 'toggleNavigation',
      'click .header-navigation .close-category': 'toggleNavigation',
      'click .header-drawer .has-dropdown a': 'toggleNavigation',
      'click .header-tools .simple-dropdown > a': 'toggleNavigation'
    };

    NavigationView.prototype.initialize = function() {
      this.megaNav = this.$('.mega-nav');
      this.secondaryTier = this.megaNav.find('.secondary');
      return $(document.body).on('click', (function(_this) {
        return function(e) {
          if (!$(e.target).closest('.navigation').length) {
            _this.$('.navigation .open').removeClass('open');
            if (_this.megaNav.length) {
              return _this.resetMegaNav();
            }
          }
        };
      })(this));
    };

    NavigationView.prototype.toggleNavigation = function(e) {
      var category, megaNavHeight, target;
      target = $(e.target);
      if (target.parents().eq(1).hasClass('secondary')) {
        return;
      }
      megaNavHeight = this.megaNav.outerHeight();
      if (target.parent().hasClass('has-dropdown')) {
        e.preventDefault();
        if (target.hasClass('main-nav-item') && target.parent().hasClass('has-mega-nav')) {
          if (target.parent().hasClass('open')) {
            this.resetMegaNav();
            this.$('.navigation li').removeClass('open');
          } else {
            this.$('.navigation li').removeClass('open');
            target.parent().addClass('open');
          }
        } else if (target.hasClass('main-nav-item') && target.parent().hasClass('simple-dropdown')) {
          if (target.parent().hasClass('open')) {
            this.$('.navigation li').removeClass('open');
          } else {
            this.resetMegaNav();
            this.$('.navigation li').removeClass('open');
            target.parent().addClass('open');
          }
        } else {
          target.parent().toggleClass('open');
        }
      }
      if (target.closest('ul').hasClass('tertiary') || target.hasClass('close-category')) {
        category = target.data('category');
        return this.positionQuarternaryWrapper(target, category, megaNavHeight);
      }
    };

    NavigationView.prototype.positionQuarternaryWrapper = function(target, category, megaNavHeight) {
      var quarternaryWrapper, quarternaryWrapperHeight, secondaryTierHeight;
      quarternaryWrapper = this.megaNav.find(".tertiary a[data-category='" + category + "']").parent().find('.quarternary-wrapper');
      quarternaryWrapperHeight = quarternaryWrapper.outerHeight();
      secondaryTierHeight = this.secondaryTier.outerHeight();
      this.megaNav.height(megaNavHeight);
      if (target.parent().hasClass('has-dropdown')) {
        quarternaryWrapper.css({
          'top': megaNavHeight
        });
        this.secondaryTier.addClass('animating hide');
        this.megaNav.addClass('animating').height(quarternaryWrapperHeight);
        return setTimeout((function(_this) {
          return function() {
            _this.megaNav.removeClass('animating');
            return _this.secondaryTier.removeClass('animating');
          };
        })(this), 200);
      } else {
        this.secondaryTier.addClass('animating').removeClass('hide');
        this.megaNav.addClass('animating').height(secondaryTierHeight);
        return setTimeout(((function(_this) {
          return function() {
            _this.megaNav.removeClass('animating');
            _this.secondaryTier.removeClass('animating');
            return _this.$("a[data-category='" + category + "']").parent().removeClass('open');
          };
        })(this)), 200);
      }
    };

    NavigationView.prototype.resetMegaNav = function() {
      return setTimeout((function(_this) {
        return function() {
          _this.megaNav.height('auto');
          return _this.secondaryTier.removeClass('hide');
        };
      })(this), 200);
    };

    NavigationView.prototype.render = function() {};

    return NavigationView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.HeaderView = (function(superClass) {
    extend(HeaderView, superClass);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.events = {
      'click .header-search-toggle': 'openSearch',
      'blur .header-search-input': 'closeSearch',
      'click .drawer-toggle': 'toggleCollapsedNav'
    };

    HeaderView.prototype.initialize = function(options) {
      new NavigationView({
        el: $(document.body)
      });
      this.window = $(window);
      this.body = $(document.body);
      this.mainHeader = this.$el.find('.main-header');
      this.drawer = options.drawer;
      this.drawer.find('.drawer-toggle').on('click', (function(_this) {
        return function() {
          return _this.toggleCollapsedNav();
        };
      })(this));
      if (Theme.headerSticky && $('html').hasClass('no-touch')) {
        this.stickyHeader();
      } else {
        this.$el.removeClass('sticky-header');
        this.$('.header-navigation').removeClass('sticky-header');
      }
      if (Theme.headerNavigation) {
        this.calculateHeaderWidths();
        this.window.resize((function(_this) {
          return function() {
            return _this.fitHeader();
          };
        })(this));
      }
      if ($('html').hasClass('lt-ie9')) {
        this.verticallyCenterShopName();
        if (Theme.logo) {
          this.verticallyCenterLogo();
        }
      }
      if (this.$el.hasClass('full-bleed-slideshow')) {
        this.swapLogo();
        this.window.resize((function(_this) {
          return function() {
            return _this.swapLogo();
          };
        })(this));
        if (this.body.hasClass('navigation-below-header')) {
          this.body.removeClass('navigation-below-header');
          this.$('.main-header').addClass('collapsed-navigation');
        }
      }
      return this.window.resize((function(_this) {
        return function() {
          var windowWidth;
          windowWidth = window.innerWidth || _this.window.width();
          if (windowWidth > 720 && _this.body.hasClass('showing-drawer')) {
            if (_this.body.hasClass('navigation-below-header') || _this.body.hasClass('navigation-header') && !_this.$('.main-header').hasClass('collapsed-navigation')) {
              return _this.toggleCollapsedNav();
            }
          }
        };
      })(this));
    };

    HeaderView.prototype.swapLogo = function() {
      var regularLogo, retinaLogo, windowWidth;
      windowWidth = window.innerWidth || this.window.width();
      regularLogo = this.$('.logo-regular');
      retinaLogo = this.$('.logo-retina');
      if (!regularLogo.data('original')) {
        regularLogo.data('original', regularLogo.attr('src'));
        retinaLogo.data('original', retinaLogo.attr('src'));
      }
      if (windowWidth <= 720) {
        regularLogo.attr('src', regularLogo.data('regular'));
        return retinaLogo.attr('src', retinaLogo.data('retina'));
      } else {
        regularLogo.attr('src', regularLogo.data('original'));
        return retinaLogo.attr('src', retinaLogo.data('original'));
      }
    };

    HeaderView.prototype.stickyHeader = function() {
      if (theme.isHome && this.$el.hasClass('full-bleed-slideshow')) {
        return this.window.on('scroll', (function(_this) {
          return function(e) {
            var scrollPosition;
            scrollPosition = _this.window.scrollTop();
            scrollPosition = scrollPosition < 0 ? 0 : scrollPosition;
            _this.$el.toggleClass('full-bleed-slideshow', scrollPosition === 0);
            return _this.$el.toggleClass('lower-than-slideshow', scrollPosition > 0);
          };
        })(this));
      }
    };

    HeaderView.prototype.calculateHeaderWidths = function() {
      return this.$el.imagesLoaded((function(_this) {
        return function() {
          var brandingWidth, toolsWidth;
          brandingWidth = _this.$('.branding').outerWidth(true);
          toolsWidth = _this.$('.header-tools').outerWidth(true);
          if (brandingWidth === 0 && _this.$('a.logo').length) {
            brandingWidth = _this.$('.branding a.logo img:first-child').width();
          }
          _this.combinedWidth = brandingWidth + toolsWidth;
          return _this.fitHeader();
        };
      })(this));
    };

    HeaderView.prototype.fitHeader = function() {
      var headerWidth;
      headerWidth = this.mainHeader.width();
      return this.mainHeader.toggleClass('collapsed-navigation', this.combinedWidth + 45 > headerWidth);
    };

    HeaderView.prototype.toggleCollapsedNav = function(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      this.body.toggleClass('showing-drawer');
      if (Modernizr.csstransitions) {
        return this.$el.one('transitionend', (function(_this) {
          return function() {
            return _this.body.toggleClass('drawer-visible');
          };
        })(this));
      } else {
        return this.body.toggleClass('drawer-visible');
      }
    };

    HeaderView.prototype.openSearch = function() {
      if (window.innerWidth <= 720) {
        window.location.href = '/search';
        return;
      }
      this.$('.header-search-wrapper').addClass('active').find('input').focus();
      return this.$('.header-search-wrapper').on('keyup.search', (function(_this) {
        return function(e) {
          if (e.keyCode === 27) {
            return _this.closeSearch();
          }
        };
      })(this));
    };

    HeaderView.prototype.closeSearch = function() {
      return this.$('.header-search-wrapper').removeClass('active').off('keyup.search');
    };

    HeaderView.prototype.verticallyCenterLogo = function() {
      return this.$el.imagesLoaded((function(_this) {
        return function() {
          var logoHeight;
          logoHeight = _this.$('.logo-regular').height();
          return _this.$('a.logo img').css({
            marginTop: -(logoHeight / 2)
          });
        };
      })(this));
    };

    HeaderView.prototype.verticallyCenterShopName = function() {
      var shopNameHeight;
      shopNameHeight = this.drawer.find('h1 a').height();
      return this.drawer.find('h1 a').css({
        marginTop: -(shopNameHeight / 2)
      });
    };

    HeaderView.prototype.render = function() {};

    return HeaderView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ZoomView = (function(superClass) {
    extend(ZoomView, superClass);

    function ZoomView() {
      return ZoomView.__super__.constructor.apply(this, arguments);
    }

    ZoomView.prototype.events = {
      'prepare-zoom': 'prepareZoom',
      'click': 'toggleZoom',
      'mouseout .product-image-zoom': 'toggleZoom',
      'mousemove .product-image-zoom': 'zoomImage'
    };

    ZoomView.prototype.initialize = function() {
      this.zoomArea = this.$('.product-image-zoom');
      return this.$el.imagesLoaded((function(_this) {
        return function() {
          return _this.prepareZoom();
        };
      })(this));
    };

    ZoomView.prototype.prepareZoom = function() {
      var newImage, photoAreaHeight, photoAreaWidth;
      photoAreaWidth = this.$el.width();
      photoAreaHeight = this.$el.height();
      newImage = new Image();
      $(newImage).on('load', (function(_this) {
        return function() {
          var ratio, ratios;
          _this.zoomImageWidth = newImage.width;
          _this.zoomImageHeight = newImage.height;
          ratios = new Array();
          ratios[0] = _this.zoomImageWidth / photoAreaWidth;
          ratios[1] = _this.zoomImageHeight / photoAreaHeight;
          ratio = Math.max.apply(Math, ratios);
          if (ratio < 1.4) {
            _this.$el.removeClass('zoom-enabled');
          } else {
            _this.$el.addClass('zoom-enabled');
            return _this.zoomArea.css({
              backgroundImage: "url(" + newImage.src + ")"
            });
          }
        };
      })(this));
      return newImage.src = this.$('img').attr('src');
    };

    ZoomView.prototype.toggleZoom = function(e) {
      if (this.$el.hasClass('zoom-enabled')) {
        if (e.type === 'mouseout') {
          this.zoomArea.removeClass('active');
          return;
        }
        if (this.zoomArea.hasClass('active')) {
          this.zoomArea.removeClass('active');
        } else {
          this.zoomArea.addClass('active');
        }
        return this.zoomImage(e);
      }
    };

    ZoomView.prototype.zoomImage = function(e) {
      var bigImageOffset, bigImageX, bigImageY, mousePositionX, mousePositionY, newBackgroundPosition, ratioX, ratioY, zoomHeight, zoomWidth;
      zoomWidth = this.zoomArea.width();
      zoomHeight = this.zoomArea.height();
      bigImageOffset = this.$el.offset();
      bigImageX = Math.round(bigImageOffset.left);
      bigImageY = Math.round(bigImageOffset.top);
      mousePositionX = e.pageX - bigImageX;
      mousePositionY = e.pageY - bigImageY;
      if (mousePositionX < zoomWidth && mousePositionY < zoomHeight && mousePositionX > 0 && mousePositionY > 0) {
        if (this.zoomArea.hasClass('active')) {
          ratioX = Math.round(mousePositionX / zoomWidth * this.zoomImageWidth - zoomWidth / 2) * -1;
          ratioY = Math.round(mousePositionY / zoomHeight * this.zoomImageHeight - zoomHeight / 2) * -1;
          if (ratioX > 0) {
            ratioX = 0;
          }
          if (ratioY > 0) {
            ratioY = 0;
          }
          if (ratioX < -(this.zoomImageWidth - zoomWidth)) {
            ratioX = -(this.zoomImageWidth - zoomWidth);
          }
          if (ratioY < -(this.zoomImageHeight - zoomHeight)) {
            ratioY = -(this.zoomImageHeight - zoomHeight);
          }
          newBackgroundPosition = ratioX + "px " + ratioY + "px";
          return this.zoomArea.css({
            backgroundPosition: newBackgroundPosition
          });
        }
      }
    };

    return ZoomView;

  })(Backbone.View);

}).call(this);

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ProductView = (function(superClass) {
    extend(ProductView, superClass);

    function ProductView() {
      this.selectCallback = bind(this.selectCallback, this);
      return ProductView.__super__.constructor.apply(this, arguments);
    }

    ProductView.prototype.events = {
      "change .product-options select": "updateVariantLabel",
      "click .product-thumbnails img": "updateProductImage",
      "submit .product-form": "addToCart"
    };

    ProductView.prototype.initialize = function() {
      var i, len, select, selectableOptions;
      this.addToCartButton = this.$(".add-to-cart input");
      this.priceArea = this.$(".product-price");
      this.homeSlideshow = this.$(".home-slideshow");
      this.options = window.productJSON.options;
      this.variants = window.productJSON.variants;
      if (!this.homeSlideshow.length) {
        this.noImageURL = this.$(".product-big-image").data("no-image-svg");
        if ($("html").hasClass("no-svg")) {
          this.noImageURL = this.$(".product-big-image").data("no-image-png");
        }
      }
      this.processing = false;
      if (this.variants.length > 1) {
        this.setupSelectors();
        if (this.options.length === 1) {
          this.singleSelector();
        }
        selectableOptions = this.$(".selector-wrapper select");
        for (i = 0, len = selectableOptions.length; i < len; i++) {
          select = selectableOptions[i];
          this.updateVariantLabel(null, select);
        }
      } else {
        this.setOptionsVisibility();
      }
      if (this.homeSlideshow.length) {
        new SlideshowView({
          el: this.$(".home-slideshow-wrapper")
        });
      }
      if (Theme.imageZoom && !this.homeSlideshow.length) {
        this.zoomView = new ZoomView({
          el: this.$(".product-big-image")
        });
      }
      if (Theme.currencySwitcher) {
        this.switchCurrency();
      }
      if (!this.homeSlideshow.length) {
        this.cacheImages();
      }
      return Shopify.onError = (function(_this) {
        return function(XMLHttpRequest) {
          return _this.handleErrors(XMLHttpRequest);
        };
      })(this);
    };

    ProductView.prototype.switchCurrency = function() {
      return $(document.body).trigger("reset-currency");
    };

    ProductView.prototype.cacheImages = function() {
      var i, image, imageSRC, images, len;
      this.cacheImages = [];
      images = this.$(".product-thumbnails img");
      for (i = 0, len = images.length; i < len; i++) {
        image = images[i];
        imageSRC = $(image).data("high-res").split("?v=")[0];
        this.cacheImages.push(imageSRC);
      }
      return Shopify.Image.preload(this.cacheImages, "master");
    };

    ProductView.prototype.updateProductImage = function(e, thumbnail) {
      var newAlt, newSrc, target;
      this.$(".product-thumbnails img").removeClass("active");
      target = e ? $(e.target) : this.$(".product-thumbnails img[src*='" + thumbnail + "']");
      newSrc = target.data("high-res");
      newAlt = target.attr("alt");
      target.addClass("active");
      this.$(".product-big-image img").removeClass("product-no-images").attr("src", newSrc).attr("alt", newAlt);
      if (Theme.imageZoom) {
        return this.$(".product-big-image").trigger("prepare-zoom");
      }
    };

    ProductView.prototype.setupSelectors = function() {
      var enableHistory, i, len, ref, selector;
      enableHistory = !$(document.body).hasClass("template-index");
      new Shopify.OptionSelectors("product-select", {
        product: window.productJSON,
        onVariantSelected: this.selectCallback,
        enableHistoryState: enableHistory
      });
      ref = this.$(".selector-wrapper");
      for (i = 0, len = ref.length; i < len; i++) {
        selector = ref[i];
        $(selector).find("select").wrap("<div class='select-wrapper' />").parent().prepend("<div class='select-text' />");
      }
      return this.setOptionsVisibility();
    };

    ProductView.prototype.setOptionsVisibility = function() {
      var visibility;
      visibility = window.productJSON.available ? "visible" : "hidden";
      this.$(".product-options").addClass(visibility);
      return this.$(".product-quantity").addClass(visibility);
    };

    ProductView.prototype.singleSelector = function() {
      return this.$(".selector-wrapper").prepend("<label>" + this.options[0] + "</label>");
    };

    ProductView.prototype.selectCallback = function(variant, selector) {
      var newImage, thumbImage;
      if (variant) {
        if (variant.available) {
          this.addToCartButton.val(Theme.addToCartText).removeClass("disabled").removeAttr("disabled");
        } else {
          this.addToCartButton.val(Theme.soldOutText).addClass("disabled").attr("disabled", "disabled");
        }
        if (variant.compare_at_price > variant.price) {
          this.priceArea.find(".money:first-child").html(Shopify.formatMoney(variant.price, Theme.moneyFormat));
          this.priceArea.find(".original").html(Shopify.formatMoney(variant.compare_at_price, Theme.moneyFormat)).show();
        } else {
          this.priceArea.find(".money").html(Shopify.formatMoney(variant.price, Theme.moneyFormat));
          this.priceArea.find(".original").hide();
        }
      } else {
        this.addToCartButton.val(Theme.unavailableText).addClass("disabled").attr("disabled", "disabled");
      }
      if (Theme.currencySwitcher) {
        this.switchCurrency();
      }
      if (variant && variant.featured_image) {
        newImage = variant.featured_image;
        thumbImage = Shopify.Image.getSizedImageUrl(newImage.src, "thumb");
        if (!this.$(".home-slideshow").length) {
          return this.updateProductImage(null, thumbImage);
        }
      }
    };

    ProductView.prototype.updateVariantLabel = function(e, select) {
      var label, renderedLabel, selectedVariant;
      select = e ? e.target : select;
      select = $(select);
      label = $(select).parents(".selector-wrapper").find("label").text();
      selectedVariant = select.find("option:selected").val();
      renderedLabel = "<strong>" + label + ":</strong>";
      return select.prev(".select-text").html(renderedLabel + " " + selectedVariant);
    };

    ProductView.prototype.addToCart = function(e) {
      var quantity, selectedVariant;
      if (Theme.disableAjax) {
        return;
      }
      e.preventDefault();
      if (this.processing) {
        return;
      }
      this.processing = true;
      if (Modernizr.cssanimations) {
        this.$(".add-to-cart").addClass("loading");
      } else {
        this.addToCartButton.val(Theme.processingText);
      }
      selectedVariant = this.$("#product-select").length ? this.$("#product-select").val() : this.$(".product-select").val();
      quantity = this.$("input[name='quantity']").val();
      if (quantity === "" || quantity === "0") {
        return setTimeout((function(_this) {
          return function() {
            _this.$("input[name='quantity']").addClass("error");
            _this.$(".product-add-error-message").text(Theme.setQuantityText);
            _this.$(".add-to-cart").removeClass("loading added-success").addClass("added-error");
            return _this.processing = false;
          };
        })(this), 500);
      } else {
        return Shopify.addItem(selectedVariant, quantity, (function(_this) {
          return function(cartItem) {
            return setTimeout(function() {
              if (theme.isHome && _this.$(".add-to-cart").hasClass("express")) {
                window.location.href = "/cart";
              } else {
                /*Shopify.getCart(function(cart) {
                  return $(".cart-link .cart-count").text(cart.item_count);
                });
                _this.$(".added-product-name").text(cartItem.title);
                _this.$("input[name='quantity']").removeClass("error");
                _this.$(".add-to-cart").removeClass("loading added-error").addClass("added-success");
                if (!Modernizr.cssanimations) {
                  _this.addToCartButton.val(Theme.addToCartText);
                }*/
                window.location.href = "/cart";
              }
              return _this.processing = false;
            }, 1000);
          };
        })(this));
      }
    };

    ProductView.prototype.handleErrors = function(errors) {
      var errorDescription, errorMessage, productTitle;
      errorMessage = $.parseJSON(errors.responseText);
      productTitle = this.$(".page-title").text();
      errorDescription = errorMessage.description;
      if (errorMessage.description.indexOf(productTitle) > -1) {
        errorDescription = errorDescription.replace(productTitle, "<em>" + productTitle + "</em>");
      }
      if (errorMessage.message === "Cart Error") {
        return setTimeout((function(_this) {
          return function() {
            _this.$("input[name='quantity']").removeClass("error");
            _this.$(".product-add-error-message").html(errorDescription);
            _this.$(".add-to-cart").removeClass("loading added-success").addClass("added-error");
            if (!Modernizr.cssanimations) {
              _this.addToCartButton.val(Theme.addToCartText);
            }
            return _this.processing = false;
          };
        })(this), 1000);
      }
    };

    return ProductView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.SlideshowView = (function(superClass) {
    extend(SlideshowView, superClass);

    function SlideshowView() {
      return SlideshowView.__super__.constructor.apply(this, arguments);
    }

    SlideshowView.prototype.events = {
      'click .home-slideshow-previous': 'previousSlide',
      'click .home-slideshow-next': 'nextSlide',
      'click .home-slideshow-pagination > span': 'specificSlide',
      'mouseenter': 'pauseLoop',
      'mouseleave': 'startLoop'
    };

    SlideshowView.prototype.initialize = function() {
      this.openingScreen = this.$el.hasClass('opening-screen');
      this.slideNavigation = this.$('.home-slideshow-navigation');
      this.slidePagination = this.$('.home-slideshow-pagination');
      this.ltIE9 = $('html').hasClass('lt-ie9');
      this.setupSlides();
      return this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
    };

    SlideshowView.prototype.setupSlides = function() {
      var paginationWidth, windowHeight, windowWidth;
      this.slides = this.$('.home-slide');
      this.slideCount = this.slides.length;
      this.$('.home-slideshow-pagination span:first').addClass('active');
      if (this.ltIE9) {
        paginationWidth = this.slidePagination.width();
        this.slidePagination.css({
          marginLeft: -(paginationWidth / 2)
        });
      }
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return this.$el.imagesLoaded((function(_this) {
        return function() {
          var i, image, imageHeight, j, len, ref, slide, slideHeight, slideID, slideText, textHeight, textWidth;
          ref = _this.slides;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            slide = ref[i];
            slide = $(slide);
            slideID = slide.attr('id');
            if (_this.openingScreen && windowWidth > 720) {
              imageHeight = windowHeight;
              slide.height(imageHeight);
              if (_this.ltIE9) {
                slide.css('background-image', '').find('img').show().height(imageHeight);
              }
            } else {
              image = slide.find('.slide-image');
              imageHeight = image.height();
            }
            slide.data('height', imageHeight);
            slideHeight = windowWidth <= 720 ? slide.height() : imageHeight;
            if (_this.ltIE9) {
              slideText = slide.find('.slide-text');
              textHeight = slideText.height();
              slideText.css({
                marginTop: -(textHeight / 2)
              });
              if (slide.hasClass('text-aligned-center')) {
                textWidth = slideText.outerWidth();
                slideText.css({
                  marginLeft: -(textWidth / 2)
                });
              }
            }
            if (i === 0) {
              slide.addClass('active');
              _this.$el.height(slideHeight);
              _this.slideNavigation.css({
                lineHeight: imageHeight + "px"
              });
              _this.resetPaginationPosition(imageHeight);
              _this.$el.attr('id', "viewing-" + slideID);
            }
            if (i + 1 === _this.slideCount) {
              _this.$el.addClass('slides-ready');
            }
          }
          $(window).on('resize', function() {
            return _this.resetSlideHeights();
          });
          if (Theme.slideshowAutoplay) {
            return _this.startLoop();
          }
        };
      })(this));
    };

    SlideshowView.prototype.resetSlideHeights = function() {
      var image, imageHeight, j, len, ref, results, slide, slideHeight, windowHeight, windowWidth;
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      windowHeight = window.innerHeight || document.documentElement.clientHeight;
      ref = this.slides;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        slide = ref[j];
        slide = $(slide);
        if (this.openingScreen && windowWidth > 720) {
          imageHeight = windowHeight;
          slide.height(imageHeight);
        } else {
          image = slide.find('.slide-image');
          imageHeight = image.height();
          slide.css('height', '');
        }
        slide.data('height', imageHeight);
        slideHeight = windowWidth <= 720 ? slide.height() : imageHeight;
        if (slide.hasClass('active')) {
          this.$el.height(slideHeight);
          this.slideNavigation.css({
            lineHeight: imageHeight + "px"
          });
          results.push(this.resetPaginationPosition(imageHeight));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SlideshowView.prototype.resetPaginationPosition = function(height) {
      var windowWidth;
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      if (windowWidth <= 720) {
        return this.slidePagination.css({
          bottom: 'auto',
          top: height - 50
        });
      } else {
        return this.slidePagination.css({
          bottom: 0,
          top: 'auto'
        });
      }
    };

    SlideshowView.prototype.previousSlide = function(e) {
      if (this.sliding) {
        return;
      }
      this.showNewSlide('prev');
      return e.preventDefault();
    };

    SlideshowView.prototype.nextSlide = function(e) {
      if (this.sliding) {
        return;
      }
      this.showNewSlide('next');
      if (e) {
        return e.preventDefault();
      }
    };

    SlideshowView.prototype.specificSlide = function(e) {
      var nextSlideID;
      if (!$(e.currentTarget).hasClass('active')) {
        nextSlideID = $(e.currentTarget).data('slide-id');
        return this.showNewSlide('next', nextSlideID);
      }
    };

    SlideshowView.prototype.updateSlidePagination = function(index) {
      this.slidePagination.find('.active').removeClass('active');
      return this.slidePagination.find('> span').eq(index).addClass('active');
    };

    SlideshowView.prototype.showNewSlide = function(type, specificSlide) {
      var activeSlide, called, direction, fallback, imageHeight, nextSlide, slideHeight, slideID, windowWidth;
      this.sliding = true;
      called = false;
      if (this.slides.length === 1) {
        this.sliding = false;
        return;
      }
      direction = type === 'next' ? 'left' : 'right';
      fallback = type === 'next' ? 'first' : 'last';
      activeSlide = this.$('.home-slideshow').find('.active');
      nextSlide = specificSlide ? this.$("#" + specificSlide) : activeSlide[type]();
      nextSlide = nextSlide.length ? nextSlide : this.slides[fallback]();
      nextSlide.addClass(type);
      nextSlide[0].offsetWidth;
      activeSlide.addClass(direction);
      nextSlide.addClass(direction);
      if ($('html').hasClass('lt-ie10')) {
        nextSlide.removeClass([type, direction].join(' ')).addClass('active');
        activeSlide.removeClass(['active', direction].join(' '));
        this.sliding = false;
      } else {
        nextSlide.one(this.transitionend, (function(_this) {
          return function() {
            called = true;
            nextSlide.removeClass([type, direction].join(' ')).addClass('active');
            activeSlide.removeClass(['active', direction].join(' '));
            return _this.sliding = false;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            if (!called) {
              return nextSlide.trigger(_this.transitionend);
            }
          };
        })(this), 300);
      }
      imageHeight = nextSlide.data('height');
      this.updateSlidePagination(nextSlide.index());
      this.resetPaginationPosition(imageHeight);
      this.slideNavigation.css({
        lineHeight: imageHeight + "px"
      });
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      slideHeight = windowWidth <= 720 ? nextSlide.height() : imageHeight;
      slideID = nextSlide.attr('id');
      this.$el.attr('id', "viewing-" + slideID);
      return this.$el.height(slideHeight);
    };

    SlideshowView.prototype.startLoop = function() {
      var delay;
      if (Theme.slideshowAutoplay) {
        delay = Theme.slideshowAutoplayDelay * 1000;
        return this.autoplay = setInterval((function(_this) {
          return function() {
            return _this.nextSlide();
          };
        })(this), delay);
      }
    };

    SlideshowView.prototype.pauseLoop = function() {
      return clearInterval(this.autoplay);
    };

    SlideshowView.prototype.render = function() {};

    return SlideshowView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.HomeView = (function(superClass) {
    extend(HomeView, superClass);

    function HomeView() {
      return HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.events = {};

    HomeView.prototype.initialize = function() {
      var videos;
      if (this.$('.home-order-now').length) {
        this.productView = new ProductView({
          el: this.$('.home-order-now')
        });
      }
      videos = this.$('.home-left-right-video, .home-full-width-video');
      videos.fitVids();
      if (this.$('.home-slideshow-wrapper').length) {
        this.slideshowView = new SlideshowView({
          el: this.$('.home-slideshow-wrapper')
        });
      }
      if ($(document.body).hasClass('template-index')) {
        this.headerBorderCheck();
      }
      if (Theme.showInstagramWidget) {
        return this.getInstagramImages();
      }
    };

    HomeView.prototype.headerBorderCheck = function() {
      var bodyBackground, headerBackground;
      if (Theme.headerSticky || this.$('.home-slideshow-wrapper').length || this.$('.home-hero').length) {
        return;
      }
      if ($(document.body).css('background-image') === !'none') {
        return;
      }
      headerBackground = $('.main-header-wrapper').css('background-color');
      bodyBackground = $(document.body).css('background-color');
      if (this.$('.home-module-wrapper:first-child').hasClass('default') && headerBackground === bodyBackground) {
        return $('.main-header-wrapper').addClass('show-border');
      }
    };

    HomeView.prototype.getInstagramImages = function() {
      var instagramWidget, photoContainer, url;
      instagramWidget = this.$('.home-instagram');
      photoContainer = this.$('.instagram-photos');
      if (Theme.showInstagramTag) {
        url = "https://api.instagram.com/v1/tags/" + Theme.instagramTag + "/media/recent?access_token=" + Theme.instagramAccessToken + "&count=6&callback=";
      } else {
        url = "https://api.instagram.com/v1/users/self/media/recent?access_token=" + Theme.instagramAccessToken + "&count=6&callback=";
      }
      return $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: url,
        success: (function(_this) {
          return function(response) {
            var i, len, photo, ref, results;
            if (response.meta.code === 200) {
              ref = response.data;
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                photo = ref[i];
                results.push(photoContainer.append("<a class='instagram-photo' target='_blank' href='" + photo.link + "'><img src='" + photo.images.low_resolution.url + "'/></a>"));
              }
              return results;
            } else {
              instagramWidget.remove();
              return console.log("Instagram error: " + response.meta.error_message);
            }
          };
        })(this),
        error: (function(_this) {
          return function(response) {
            instagramWidget.remove();
            return console.log("Instagram error: " + response.meta.error_message);
          };
        })(this)
      });
    };

    HomeView.prototype.render = function() {};

    return HomeView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.CollectionView = (function(superClass) {
    extend(CollectionView, superClass);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.events = {
      'change .collection-tag-selector select': 'browseByTag'
    };

    CollectionView.prototype.initialize = function() {};

    CollectionView.prototype.browseByTag = function(e) {
      var fallback, newTag, select;
      select = $(e.target);
      fallback = select.data('fallback-url');
      newTag = select.find(':selected').attr('name');
      if (newTag === 'reset') {
        return window.location.href = fallback;
      } else {
        return window.location.href = fallback + "/" + newTag;
      }
    };

    CollectionView.prototype.render = function() {};

    return CollectionView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ListCollectionsView = (function(superClass) {
    extend(ListCollectionsView, superClass);

    function ListCollectionsView() {
      return ListCollectionsView.__super__.constructor.apply(this, arguments);
    }

    ListCollectionsView.prototype.events = {};

    ListCollectionsView.prototype.initialize = function() {
      var collection, collectionDetails, collections, i, len, results;
      if ($('html').hasClass('lt-ie9')) {
        collections = this.$('.collection-list-item');
        results = [];
        for (i = 0, len = collections.length; i < len; i++) {
          collection = collections[i];
          collectionDetails = $(collection).find('.collection-details');
          results.push(this.verticallyAlignText(collectionDetails));
        }
        return results;
      }
    };

    ListCollectionsView.prototype.verticallyAlignText = function(collectionDetails) {
      var textHeight;
      textHeight = collectionDetails.height();
      return collectionDetails.css({
        marginTop: -(textHeight / 2)
      });
    };

    ListCollectionsView.prototype.render = function() {};

    return ListCollectionsView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.CartView = (function(superClass) {
    extend(CartView, superClass);

    function CartView() {
      return CartView.__super__.constructor.apply(this, arguments);
    }

    CartView.prototype.events = {
      'click .cart-item-decrease': 'updateQuantity',
      'click .cart-item-increase': 'updateQuantity',
      'click .cart-item-remove': 'removeProduct',
      'click .cart-undo': 'undoRemoval',
      'change .cart-instructions textarea': 'saveSpecialInstructions',
      'click .dismiss': 'closeModal',
      'click .get-rates': 'calculateShipping'
    };

    CartView.prototype.initialize = function() {
      this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
      if (Theme.shippingCalculator && Theme.customerLoggedIn && Theme.customerCountry.length) {
        this.calculateShipping();
      }
      this.modalWrapper = this.$('.cart-modal-wrapper');
      this.modalTitle = this.$('.cart-modal h3');
      this.modalMessage = this.$('.cart-modal-message');
      this.modalAction = this.$('.cart-modal-action');
      this.savedProducts = [];
      if (Theme.shippingCalculator && this.$('.cart-items').length) {
        this.shippingCalculator();
      }
      return Shopify.onError = (function(_this) {
        return function(XMLHttpRequest) {
          return _this.handleErrors(XMLHttpRequest);
        };
      })(this);
    };

    CartView.prototype.saveSpecialInstructions = function() {
      var newNote;
      newNote = $('.cart-instructions textarea').val();
      return Shopify.updateCartNote(newNote, function(cart) {});
    };

    CartView.prototype.updateQuantity = function(e) {
      var action, inventory, message, newQuantity, oldQuantity, productPrice, productQuantity, productRow, productTitle, title, variant;
      productRow = $(e.target).parents('tr');
      productTitle = productRow.find('.cart-title').text();
      productPrice = productRow.find('td.cart-item-total .money');
      productQuantity = productRow.find('.cart-item-quantity-display');
      variant = productRow.data('variant');
      inventory = parseInt(productRow.find('.cart-item-quantity').data('max'), 10);
      oldQuantity = parseInt(productQuantity.val(), 10);
      if ($(e.target).hasClass('cart-item-increase')) {
        newQuantity = oldQuantity + 1;
      } else {
        newQuantity = oldQuantity <= 1 ? 0 : oldQuantity - 1;
      }
      if (newQuantity === 0) {
        if (!(Theme.disableAjax || Theme.currencySwitcher)) {
          this.removeProduct(null, variant);
          return;
        }
      }
      if (newQuantity > inventory) {
        title = Theme.notAvailableText;
        message = Theme.stockLevelText;
        message = message.replace('{{ stock_count }}', inventory);
        action = "<span class='button dismiss'>" + Theme.okayText + "</span>";
        return this.openModal(title, message, action);
      }
      if (Theme.disableAjax || Theme.currencySwitcher) {
        return productRow.find('.cart-item-quantity-display').val(newQuantity);
      } else {
        return Shopify.changeItem(variant, newQuantity, (function(_this) {
          return function(cart) {
            var i, item, len, newProductPrice, ref;
            ref = cart.items;
            for (i = 0, len = ref.length; i < len; i++) {
              item = ref[i];
              if (item.id === variant) {
                newProductPrice = Shopify.formatMoney(item.line_price, Theme.moneyFormat);
                productPrice.html(newProductPrice);
                productRow.find('.cart-item-quantity-display').val(item.quantity);
              }
            }
            return _this.updateCart(cart);
          };
        })(this));
      }
    };

    CartView.prototype.removeProduct = function(e, variant) {
      var itemRow, itemRowContents, productTitle, productURL, swapProductText;
      if (Theme.disableAjax || Theme.currencySwitcher) {
        return;
      }
      if (variant) {
        itemRow = $(".variant-" + variant);
      } else {
        variant = $(e.target).parents('tr').data('variant');
        itemRow = $(e.target).parents('tr');
      }
      itemRowContents = itemRow.find('td');
      productTitle = itemRow.data('title');
      productURL = itemRow.data('url');
      this.savedProducts[variant] = {
        'id': variant,
        'content': itemRowContents,
        'quantity': itemRow.find('.cart-item-quantity-display').val()
      };
      swapProductText = function() {
        itemRow.html("<td class='cart-item-undo' colspan='5'><a href='" + productURL + "'>" + productTitle + "</a> has been removed from your cart. <span class='cart-undo' data-variant='" + variant + "'>Undo?</span>");
        return itemRow.removeClass('removing');
      };
      return Shopify.removeItem(variant, (function(_this) {
        return function(cart) {
          if (Modernizr.csstransitions) {
            itemRow.addClass('removing').one(_this.transitionend, function() {
              return swapProductText();
            });
          } else {
            swapProductText();
          }
          return _this.updateCart(cart);
        };
      })(this));
    };

    CartView.prototype.undoRemoval = function(e) {
      var savedProduct, variant;
      variant = $(e.target).data('variant');
      savedProduct = this.savedProducts[variant];
      $("tr.variant-" + variant).html(savedProduct.content);
      return Shopify.addItem(variant, savedProduct.quantity, (function(_this) {
        return function() {
          return Shopify.getCart(function(cart) {
            return _this.updateCart(cart);
          });
        };
      })(this));
    };

    CartView.prototype.updateCart = function(cart) {
      var newTotal;
      newTotal = Shopify.formatMoney(cart.total_price, Theme.moneyFormat);
      $('.cart-totals .cart-price .money').html(newTotal);
      if (Theme.currencySwitcher) {
        $(document.body).trigger("reset-currency");
      }
      return $('.cart-count').text(cart.item_count);
    };

    CartView.prototype.shippingCalculator = function() {
      var selectableOptions;
      Shopify.Cart.ShippingCalculator.show({
        submitButton: Theme.shippingSubmit,
        submitButtonDisabled: Theme.shippingWorking,
        customerIsLoggedIn: Theme.customerLoggedIn,
        moneyFormat: Theme.moneyFormat
      });
      selectableOptions = this.$('.cart-shipping-calculator select');
      setTimeout((function(_this) {
        return function() {
          var i, len, results, select;
          results = [];
          for (i = 0, len = selectableOptions.length; i < len; i++) {
            select = selectableOptions[i];
            results.push(_this.updateShippingLabel(select));
          }
          return results;
        };
      })(this), 500);
      return this.$('.cart-shipping-calculator select').change((function(_this) {
        return function(e) {
          var i, len, results, select;
          results = [];
          for (i = 0, len = selectableOptions.length; i < len; i++) {
            select = selectableOptions[i];
            results.push(_this.updateShippingLabel(select));
          }
          return results;
        };
      })(this));
    };

    CartView.prototype.calculateShipping = function() {
      var shippingAddress;
      $('.get-rates').val(Theme.shippingWorking);
      shippingAddress = {};
      shippingAddress.zip = $('.address-zip').val() || '';
      shippingAddress.country = $('.address-country').val() || '';
      shippingAddress.province = $('.address-province').val() || '';
      return Shopify.getCartShippingRatesForDestination(shippingAddress, function() {
        var address, firstRate, i, len, price, rate, rateValues, ratesFeedback, responseText, shippingCalculatorResponse;
        address = shippingAddress.zip + ", " + shippingAddress.province + ", " + shippingAddress.country;
        if (!shippingAddress.province.length) {
          address = shippingAddress.zip + ", " + shippingAddress.country;
        }
        if (!shippingAddress.zip.length) {
          address = shippingAddress.province + ", " + shippingAddress.country;
        }
        if (!(shippingAddress.province.length && shippingAddress.zip.length)) {
          address = shippingAddress.country;
        }
        shippingCalculatorResponse = $('.cart-shipping-calculator-response');
        shippingCalculatorResponse.empty().append("<p class='shipping-calculator-response message'/><ul class='shipping-rates'/>");
        ratesFeedback = $('.shipping-calculator-response');
        if (rates.length > 1) {
          firstRate = Shopify.Cart.ShippingCalculator.formatRate(rates[0].price);
          responseText = Theme.shippingCalcMultiRates.replace('{{ address }}', address).replace('{{ number_of_rates }}', rates.length).replace('{{ rate }}', "<span class='money'>" + firstRate + "</span>");
          ratesFeedback.html(responseText);
        } else if (rates.length === 1) {
          responseText = Theme.shippingCalcOneRate.replace('{{ address }}', address);
          ratesFeedback.html(responseText);
        } else {
          ratesFeedback.html(Theme.shippingCalcNoRates);
        }
        for (i = 0, len = rates.length; i < len; i++) {
          rate = rates[i];
          price = Shopify.Cart.ShippingCalculator.formatRate(rate.price);
          rateValues = Theme.shippingCalcRateValues.replace('{{ rate_title }}', rate.name).replace('{{ rate }}', "<span class='money'>" + price + "</span>");
          $('.shipping-rates').append("<li>" + rateValues + "</li>");
        }
        return $('.get-rates').val(Theme.shippingSubmit);
      });
    };

    CartView.prototype.updateShippingLabel = function(select) {
      var selectedOption;
      if (select) {
        select = $(select);
        selectedOption = select.find('option:selected').val();
        if (!selectedOption) {
          selectedOption = select.prev('.selected-text').data('default');
        }
        select.prev('.selected-text').text(selectedOption);
        return setTimeout((function(_this) {
          return function() {
            if (select.attr('name') === 'address[country]') {
              return _this.updateShippingLabel(_this.$('#address_province'));
            }
          };
        })(this), 500);
      }
    };

    CartView.prototype.openModal = function(title, message, action) {
      this.modalTitle.text(title);
      this.modalMessage.text(message);
      this.modalAction.html(action);
      return this.modalWrapper.addClass('active');
    };

    CartView.prototype.closeModal = function() {
      return this.modalWrapper.removeClass('active');
    };

    CartView.prototype.handleErrors = function(errors) {
      var errorMessage;
      errorMessage = $.parseJSON(errors.responseText);
      errorMessage = Theme.shippingCalcErrorMessage.replace('{{ error_message }}', errorMessage.zip);
      return $('.cart-shipping-calculator-response').html("<p>" + errorMessage + "</p>");
    };

    CartView.prototype.render = function() {};

    return CartView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.PostView = (function(superClass) {
    extend(PostView, superClass);

    function PostView() {
      return PostView.__super__.constructor.apply(this, arguments);
    }

    PostView.prototype.events = {};

    PostView.prototype.initialize = function() {
      var highlight, i, len, ref;
      this.setFeaturedImage();
      this.artDirection();
      this.wrapAllNodes();
      ref = this.$('.highlight');
      for (i = 0, len = ref.length; i < len; i++) {
        highlight = ref[i];
        this.fixOverlappingElements($(highlight));
      }
      return $(window).resize((function(_this) {
        return function() {
          var j, len1, ref1, results;
          _this.setFeaturedImage(true);
          if (window.innerWidth > 1020) {
            ref1 = _this.$('.highlight');
            results = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              highlight = ref1[j];
              results.push(_this.fixOverlappingElements($(highlight)));
            }
            return results;
          }
        };
      })(this));
    };

    PostView.prototype.wrapAllNodes = function() {
      var childNodes, i, len, node, results;
      childNodes = this.$('.rte')[0].childNodes;
      results = [];
      for (i = 0, len = childNodes.length; i < len; i++) {
        node = childNodes[i];
        if (node.nodeType === 3 && node.textContent.replace(/^\s+|\s+$/g, "")) {
          results.push($(node).replaceWith("<p>" + node.textContent + "</p>"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    PostView.prototype.fixOverlappingElements = function(highlight) {
      if (this.$('.post-meta').overlaps(highlight).length) {
        highlight.addClass('overlapping');
      }
      return highlight.addClass('processed');
    };

    PostView.prototype.setFeaturedImage = function(resize) {
      var contentWidth, featuredImage, parent, windowWidth;
      featuredImage = this.$('.featured-image');
      if (featuredImage.length) {
        parent = featuredImage.parent();
        windowWidth = $(window).width();
        contentWidth = this.$('.post-content').width();
        if (resize) {
          featuredImage.css({
            width: windowWidth,
            marginLeft: -(windowWidth - contentWidth) / 2
          });
          return;
        }
        featuredImage.detach().insertAfter('.page-title').css({
          width: windowWidth,
          marginLeft: -(windowWidth - contentWidth) / 2
        }).addClass('processed');
        if (parent.is(':empty')) {
          return parent.remove();
        }
      }
    };

    PostView.prototype.artDirection = function() {
      var images;
      images = this.$('.post-content').find('img');
      return images.imagesLoaded((function(_this) {
        return function() {
          var direction, i, image, imageAlt, imageParent, imageWidth, len, marginLeft, marginRight, results;
          results = [];
          for (i = 0, len = images.length; i < len; i++) {
            image = images[i];
            image = $(image);
            if (image.parent().hasClass('post-content')) {
              image.wrap('<div />');
            }
            imageParent = image.parent();
            if (image.css('float') !== 'none') {
              direction = image.css('float');
              imageParent.addClass("highlight highlight-" + direction);
              _this.fixOverlappingElements(imageParent);
            }
            imageWidth = image.width();
            imageAlt = image.attr('alt');
            if (imageAlt && imageAlt.length && imageParent.not('img')) {
              marginLeft = image.css('margin-left');
              marginRight = image.css('margin-right');
              results.push(imageParent.append("<div style='max-width: " + imageWidth + "px; margin-left: " + marginLeft + "; margin-right: " + marginRight + ";' class='photo-caption meta'>" + imageAlt + "</div>"));
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this));
    };

    return PostView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.BlogView = (function(superClass) {
    extend(BlogView, superClass);

    function BlogView() {
      return BlogView.__super__.constructor.apply(this, arguments);
    }

    BlogView.prototype.events = {};

    BlogView.prototype.initialize = function() {
      var i, len, post, ref, results;
      ref = this.$('.blog-post');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        post = ref[i];
        results.push(new PostView({
          el: post
        }));
      }
      return results;
    };

    BlogView.prototype.render = function() {};

    return BlogView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.AddressesView = (function(superClass) {
    extend(AddressesView, superClass);

    function AddressesView() {
      return AddressesView.__super__.constructor.apply(this, arguments);
    }

    AddressesView.prototype.events = {
      'click .delete-address': 'deleteAddress',
      'click .edit-address': 'editAddress',
      'click .cancel-edit': 'cancelEditing',
      'click .toggle-new-address': 'toggleNewAddress',
      'change .select-wrapper select': 'updateSelectedText'
    };

    AddressesView.prototype.initialize = function() {
      return this.prepareAddresses();
    };

    AddressesView.prototype.prepareAddresses = function() {
      var address, addressID, addresses, i, j, len, len1, results, select, selectableOptions;
      new Shopify.CountryProvinceSelector('address-country', 'address-province', {
        hideElement: 'address-province-container'
      });
      addresses = this.$('.customer-address');
      if (addresses.length) {
        for (i = 0, len = addresses.length; i < len; i++) {
          address = addresses[i];
          addressID = $(address).data('address-id');
          new Shopify.CountryProvinceSelector("address-country-" + addressID, "address-province-" + addressID, {
            hideElement: "address-province-container-" + addressID
          });
        }
      }
      selectableOptions = this.$('.select-wrapper select');
      results = [];
      for (j = 0, len1 = selectableOptions.length; j < len1; j++) {
        select = selectableOptions[j];
        results.push(this.updateSelectedText(null, select));
      }
      return results;
    };

    AddressesView.prototype.updateSelectedText = function(e, select) {
      var addressID, selectedValue;
      select = e ? $(e.target) : $(select);
      selectedValue = select.find('option:selected').text();
      if (selectedValue !== '') {
        select.prev('.selected-text').text(selectedValue);
      }
      if (select.attr('name') === 'address[country]') {
        addressID = $(select).attr('id').split('address-country-')[1];
        addressID = addressID ? "#address-province-" + addressID : '.new-address-province';
        return this.updateSelectedText(null, $(addressID));
      }
    };

    AddressesView.prototype.deleteAddress = function(e) {
      var addressID;
      addressID = $(e.target).parents('[data-address-id]').data('address-id');
      return Shopify.CustomerAddress.destroy(addressID);
    };

    AddressesView.prototype.editAddress = function(e) {
      var addressID;
      addressID = $(e.target).parents('[data-address-id]').data('address-id');
      $(".customer-address[data-address-id='" + addressID + "']").addClass('editing');
      return $(".customer-address-edit-form[data-address-id='" + addressID + "']").addClass('show');
    };

    AddressesView.prototype.cancelEditing = function(e) {
      var addressID;
      addressID = $(e.target).parents('[data-address-id]').data('address-id');
      $(".customer-address[data-address-id='" + addressID + "']").removeClass('editing');
      return $(".customer-address-edit-form[data-address-id='" + addressID + "']").removeClass('show');
    };

    AddressesView.prototype.toggleNewAddress = function() {
      this.$('.add-new-address').toggle();
      return this.$('.customer-new-address').toggleClass('show');
    };

    AddressesView.prototype.render = function() {};

    return AddressesView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.AccountView = (function(superClass) {
    extend(AccountView, superClass);

    function AccountView() {
      return AccountView.__super__.constructor.apply(this, arguments);
    }

    AccountView.prototype.events = {
      'click .toggle-forgetfulness span': 'recoverPassword'
    };

    AccountView.prototype.initialize = function() {
      if ($(document.body).hasClass('template-customers-addresses')) {
        this.addressesView = new AddressesView({
          el: $('.main-content')
        });
      }
      if ($(document.body).hasClass('template-customers-login')) {
        this.checkForReset();
      }
      if (window.location.hash === '#recover') {
        this.recoverPassword();
      }
      this.mobilifyTables();
      return $(window).resize((function(_this) {
        return function() {
          return _this.mobilifyTables();
        };
      })(this));
    };

    AccountView.prototype.recoverPassword = function() {
      this.$('.recover-password').toggle();
      return this.$('.customer-login').toggle();
    };

    AccountView.prototype.checkForReset = function() {
      if ($('.reset-check').data('successful-reset') === true) {
        return $('.successful-reset').show();
      }
    };

    AccountView.prototype.mobilifyTables = function() {
      return this.$('.orders').mobileTable();
    };

    AccountView.prototype.render = function() {};

    return AccountView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.RTEView = (function(superClass) {
    extend(RTEView, superClass);

    function RTEView() {
      return RTEView.__super__.constructor.apply(this, arguments);
    }

    RTEView.prototype.events = {
      'click .tabs li': 'switchTabs',
      'change .select-wrapper select': 'updateOption'
    };

    RTEView.prototype.initialize = function() {
      var i, len, select, selects;
      this.setupTabs();
      selects = this.$el.find('select');
      for (i = 0, len = selects.length; i < len; i++) {
        select = selects[i];
        if (!$(select).parent('.select-wrapper').length) {
          $(select).wrap('<div class="select-wrapper" />').parent().prepend('<span class="selected-text"></span>');
        }
        this.updateOption(null, select);
      }
      this.$el.fitVids();
      this.mobilifyTables();
      return $(window).resize((function(_this) {
        return function() {
          return _this.mobilifyTables();
        };
      })(this));
    };

    RTEView.prototype.switchTabs = function(e) {
      var position, tab;
      tab = $(e.currentTarget);
      position = tab.index();
      this.tabs.removeClass('active');
      this.tabsContent.removeClass('active');
      tab.addClass('active');
      return this.tabsContent.eq(position).addClass('active');
    };

    RTEView.prototype.setupTabs = function() {
      this.tabs = this.$('.tabs > li');
      this.tabsContent = this.$('.tabs-content > li');
      this.tabs.first().addClass('active');
      return this.tabsContent.first().addClass('active');
    };

    RTEView.prototype.updateOption = function(e, selector) {
      var newOption, select;
      select = e ? $(e.target) : $(selector);
      newOption = select.find('option:selected').text();
      return select.siblings('.selected-text').text(newOption);
    };

    RTEView.prototype.mobilifyTables = function() {
      return this.$el.find('table').mobileTable();
    };

    return RTEView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.FooterView = (function(superClass) {
    extend(FooterView, superClass);

    function FooterView() {
      return FooterView.__super__.constructor.apply(this, arguments);
    }

    FooterView.prototype.events = {};

    FooterView.prototype.initialize = function() {};

    FooterView.prototype.render = function() {};

    return FooterView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.NotFoundView = (function(superClass) {
    extend(NotFoundView, superClass);

    function NotFoundView() {
      return NotFoundView.__super__.constructor.apply(this, arguments);
    }

    NotFoundView.prototype.events = {};

    NotFoundView.prototype.initialize = function() {};

    NotFoundView.prototype.render = function() {};

    return NotFoundView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.CurrencyView = (function(superClass) {
    extend(CurrencyView, superClass);

    function CurrencyView() {
      return CurrencyView.__super__.constructor.apply(this, arguments);
    }

    CurrencyView.prototype.events = {
      'change [name=currencies]': 'convertAll',
      'switch-currency': 'switchCurrency',
      'reset-currency': 'resetCurrency'
    };

    CurrencyView.prototype.initialize = function() {
      var doubleMoney, i, j, len, len1, money, ref, ref1;
      Currency.format = Theme.currencySwitcherFormat;
      Currency.money_with_currency_format[Theme.currency] = Theme.moneyFormatCurrency;
      Currency.money_format[Theme.currency] = Theme.moneyFormat;
      this.defaultCurrency = Theme.defaultCurrency || Theme.currency;
      this.cookieCurrency = Currency.cookie.read();
      if (this.cookieCurrency) {
        this.$("[name=currencies]").val(this.cookieCurrency);
      }
      ref = this.$('span.money span.money');
      for (i = 0, len = ref.length; i < len; i++) {
        doubleMoney = ref[i];
        $(doubleMoney).parents('span.money').removeClass('money');
      }
      ref1 = this.$('span.money');
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        money = ref1[j];
        $(money).attr("data-currency-" + Theme.currency, $(money).html());
      }
      this.switchCurrency();
      return this.$('.selected-currency').text(Currency.currentCurrency);
    };

    CurrencyView.prototype.resetCurrency = function() {
      var attribute, i, j, len, len1, money, ref, ref1;
      ref = this.$('span.money');
      for (i = 0, len = ref.length; i < len; i++) {
        money = ref[i];
        ref1 = $(money)[0].attributes;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          attribute = ref1[j];
          if (attribute.name.indexOf('data-') > -1) {
            $(money).attr(attribute.name, '');
          }
        }
      }
      return this.switchCurrency();
    };

    CurrencyView.prototype.switchCurrency = function() {
      if (this.cookieCurrency === null) {
        if (Theme.currency === !this.defaultCurrency) {
          return Currency.convertAll(Theme.currency, this.defaultCurrency);
        } else {
          return Currency.currentCurrency = this.defaultCurrency;
        }
      } else if (this.$('[name=currencies]').size() && this.$('[name=currencies] option[value=' + this.cookieCurrency + ']').size() === 0) {
        Currency.currentCurrency = Theme.currency;
        return Currency.cookie.write(Theme.currency);
      } else if (this.cookieCurrency === Theme.currency) {
        return Currency.currentCurrency = Theme.currency;
      } else {
        return Currency.convertAll(Theme.currency, this.cookieCurrency);
      }
    };

    CurrencyView.prototype.convertAll = function(e, variant, selector) {
      var newCurrency;
      newCurrency = $(e.target).val();
      Currency.convertAll(Currency.currentCurrency, newCurrency);
      this.$('.selected-currency').text(Currency.currentCurrency);
      return this.cookieCurrency = newCurrency;
    };

    return CurrencyView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.MailingListModalView = (function(superClass) {
    extend(MailingListModalView, superClass);

    function MailingListModalView() {
      return MailingListModalView.__super__.constructor.apply(this, arguments);
    }

    MailingListModalView.prototype.events = {
      'click .dismiss': 'dismissModal'
    };

    MailingListModalView.prototype.initialize = function() {
      if (window.location.search === '?customer_posted=true') {
        this.successfulPost = true;
      }
      if (this.successfulPost) {
        return this.showModal();
      }
    };

    MailingListModalView.prototype.showModal = function() {
      return this.$el.addClass('active');
    };

    MailingListModalView.prototype.dismissModal = function() {
      return this.$el.removeClass('active');
    };

    return MailingListModalView;

  })(Backbone.View);

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.ThemeView = (function(superClass) {
    extend(ThemeView, superClass);

    function ThemeView() {
      return ThemeView.__super__.constructor.apply(this, arguments);
    }

    ThemeView.prototype.el = document.body;

    ThemeView.prototype.initialize = function() {
      var body;
      body = $(document.body);
      this.isHome = body.hasClass('template-index');
      this.isCollection = body.hasClass('template-collection');
      this.isListCollections = body.hasClass('template-list-collections');
      this.isProduct = body.hasClass('template-product');
      this.isCart = body.hasClass('template-cart');
      this.isPage = body.hasClass('template-page');
      this.isBlog = body.hasClass('template-blog') || body.hasClass('template-article');
      this.isAccount = body.attr('class').indexOf('-customers-') > 0;
      return this.is404 = body.hasClass('template-404');
    };

    ThemeView.prototype.render = function() {
      var i, len, ref, rte;
      this.headerView = new HeaderView({
        el: $('.main-header-wrapper'),
        drawer: $('.header-drawer')
      });
      this.headerView.render();
      this.footerView = new FooterView({
        el: $('footer')
      });
      this.footerView.render();
      ref = $('.rte');
      for (i = 0, len = ref.length; i < len; i++) {
        rte = ref[i];
        this.rteView = new RTEView({
          el: rte
        });
      }
      if (this.isHome) {
        this.homeView = new HomeView({
          el: this.$el
        });
        this.homeView.render();
      }
      if (this.isCollection) {
        this.collectionView = new CollectionView({
          el: this.$el
        });
        this.collectionView.render();
      }
      if (this.isListCollections) {
        this.listCollectionsView = new ListCollectionsView({
          el: $('.collections-list')
        });
        this.listCollectionsView.render();
      }
      if (this.isProduct) {
        this.productView = new ProductView({
          el: this.$el
        });
        this.productView.render();
      }
      if (this.isCart) {
        this.cartView = new CartView({
          el: this.$el
        });
        this.cartView.render();
      }
      if (this.isBlog) {
        this.blogView = new BlogView({
          el: this.$el
        });
        this.blogView.render();
      }
      if (this.isAccount) {
        this.accountView = new AccountView({
          el: this.$el
        });
        this.accountView.render();
      }
      if (this.is404) {
        this.notFoundView = new NotFoundView({
          el: this.$el
        });
        this.notFoundView.render();
      }
      if (Theme.currencySwitcher) {
        this.currencyView = new CurrencyView({
          el: this.$el
        });
      }
      if (Theme.mailingList) {
        this.mailingListModalView = new MailingListModalView({
          el: this.$('.modal-mailing-list')
        });
      }
      if ($('html').hasClass('lt-ie10')) {
        return this.inputPlaceholderFix();
      }
    };

    ThemeView.prototype.inputPlaceholderFix = function() {
      var i, input, len, placeholders, text;
      placeholders = $('[placeholder]');
      for (i = 0, len = placeholders.length; i < len; i++) {
        input = placeholders[i];
        input = $(input);
        if (!(input.val().length > 0)) {
          text = input.attr('placeholder');
          input.attr('value', text);
          input.data('original-text', text);
        }
      }
      placeholders.focus(function() {
        input = $(this);
        if (input.val() === input.data('original-text')) {
          return input.val('');
        }
      });
      return placeholders.blur(function() {
        input = $(this);
        if (input.val().length === 0) {
          return input.val(input.data('original-text'));
        }
      });
    };

    return ThemeView;

  })(Backbone.View);

}).call(this);

(function() {
  $(function() {
    window.theme = new ThemeView();
    return theme.render();
  });

}).call(this);

  $(document).ready(function() {
    $('ul.tabs').each(function(){
      var active, content, links = $(this).find('a');
      active = links.first().addClass('active');
      content = $(active.attr('href'));
      links.not(':first').each(function () {
        $($(this).attr('href')).hide();
      });
      $(this).find('a').click(function(e){
        active.removeClass('active');
        content.hide();
        active = $(this);
        content = $($(this).attr('href'));
        active.addClass('active');
        content.show();
        return false;
      });
    });
  });

$(document).ready( function() {
jQuery('a[href^="http"]').not('a[href^="'+$(location).attr('hostname')+'"]').attr('target', '_blank');
});
