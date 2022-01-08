(function ($) {
    var related = new Swiper('#related .swiper-container', {
        grabCursor: true,
        spaceBetween: 10,
        slidesPerView: 2.5,
        slidesOffsetBefore: 10,
        slidesOffsetAfter: 10,
        scrollbar: {
            el: '#related .swiper-scrollbar',
        },
    });
})(jQuery);