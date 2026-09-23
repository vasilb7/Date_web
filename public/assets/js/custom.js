$(function () {

    // Header Scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 60) {
            $("header").addClass("fixed-header");
        } else {
            $("header").removeClass("fixed-header");
        }
    });


    // Featured Owl Carousel
    if ($('.featured-projects-slider .owl-carousel').length && typeof $.fn.owlCarousel !== 'undefined') {
        $('.featured-projects-slider .owl-carousel').owlCarousel({
            center: true,
            loop: true,
            margin: 30,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                },
                1200: {
                    items: 4
                }
            }
        });
    }


    // Count
    if ($('.count').length) {
        $('.count').each(function () {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 1000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
    }


    // ScrollToTop
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const btn = document.getElementById("scrollToTopBtn");
    if (btn) {
        btn.addEventListener("click", scrollToTop);
    }

    const originalScrollHandler = window.onscroll;
    window.onscroll = function (e) {
        if (typeof originalScrollHandler === 'function') {
            originalScrollHandler(e);
        }
        const scrollBtn = document.getElementById("scrollToTopBtn");
        if (scrollBtn) {
            if (document.documentElement.scrollTop > 100 || document.body.scrollTop > 100) {
                scrollBtn.style.display = "flex";
            } else {
                scrollBtn.style.display = "none";
            }
        }
    };


    // Aos
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
        });
    }

});
