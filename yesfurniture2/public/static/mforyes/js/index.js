(function ($) {
    var banner = new Swiper('#banner .swiper-container', {
        grabCursor: true,
        spaceBetween: 10,
        scrollbar: {
            el: '#banner .swiper-scrollbar',
        },
    });
    var example = new Swiper('#example .swiper-container', {
        grabCursor: true,
        spaceBetween: 10,
        slidesOffsetBefore : 10,
        slidesPerView: 1.2,
        scrollbar: {
            el: '#example .swiper-scrollbar',
        },
    });
})(jQuery);