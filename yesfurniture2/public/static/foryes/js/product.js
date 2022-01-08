(function ($) {
	// $('#nav').addClass('scroll_nav');

	// 导航
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#nav').addClass('scroll_nav');
		} else {
			$('#nav').removeClass('scroll_nav');
		}
		if ($(this).scrollTop() > 50) {
			$('.top-arrow').hide();
		} else {
			$('.top-arrow').fadeIn('slow');
		}
	});

	var banner = new Swiper('#banner .swiper-container', {
		grabCursor: true,
		spaceBetween: 10,
		loop:true,
		pagination: {
			el: '#banner .swiper-pagination',
		},
		scrollbar: {
			el: '#banner .swiper-scrollbar',
		},
		navigation: {
			nextEl: '#banner .swiper-next',
			prevEl: '#banner .swiper-prev',
		},
	});

	//图片分组器
	$('.list-figure').mixItUp();

	$('.caption-fr li').on('click',function(){
		$(this).siblings().removeClass('current')
		$(this).addClass('current')
	})

})(jQuery);