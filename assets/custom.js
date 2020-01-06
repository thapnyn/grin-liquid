jQuery(document).ready(function($) {
    $('.banner-hero > .hero-slider').lightSlider({
        item: 3,
        autoWidth: true,
        slideMove: 1,
        slideMargin: 10,
        addClass: '',
        mode: "fade",
        useCSS: true,
        cssEasing: 'ease',
        easing: 'linear',
        speed: 400,
        auto: false,
        loop: false,
        pause: 2000,
    });
});