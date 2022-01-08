(function ($) {
	var hot_product = new Swiper('#hot_product .swiper-container', {
		grabCursor: true,
		spaceBetween: 10,
		slidesOffsetBefore: 10,
		slidesPerView: 1.2,
		pagination: {
			el: '.swiper-pagination',
		},
		scrollbar: {
			el: '.swiper-scrollbar',
		},
	});
	var product_nav = new Swiper('#product_nav .swiper-container', {
		grabCursor: true,
		spaceBetween: 10,
		slidesPerView: 4,
		freeMode: true,
		slidesOffsetBefore: 10,
		slidesOffsetAfter: 100,
		on: {
			click: function () {
				product_nav.slideTo(this.clickedIndex - 1);
				$('#product_nav .swiper-container .swiper-slide').siblings().removeClass('selected')
				$('#product_nav .swiper-container .swiper-slide').eq(this.clickedIndex).addClass('selected')
			},
		},
	});

	$('.caption-filter').on('click', function () {
		$('.shortselectbm').fadeIn();
		$('body').css({
			"overflow-x": "hidden",
			"overflow-y": "hidden"
		});
		if($('#product_nav').hasClass('fixed-info-container')){
			$('.shortselectbm').css("top","3.583989rem");
		}else{
			var t = $('#product_lst').offset().top;
			var h = $('#product_nav').height();
			var hh =$(document).scrollTop();
			$('.shortselectbm').css("top",t-hh);
		}
		return false;
	})
	$('.shortselectbm').on('click', function () {
		$('.shortselectbm').hide();
		$('body').css({ 
			　　"overflow-x":"auto",
			　　"overflow-y":"auto"
			});
		return false;
	})
	$('body').on('click', function () {
		$('.shortselectbm').hide();
		$('body').css({ 
			　　"overflow-x":"auto",
			　　"overflow-y":"auto"
			});
		return false;
	})
	$('.shortselectbm li').on('click', function () {
		$(this).siblings().removeClass('selected-current');
		$(this).addClass('selected-current');
		var index = $(this).index();
		product_nav.slideTo(index-1);
		$('#product_nav .swiper-container .swiper-slide').siblings().removeClass('selected')
		$('#product_nav .swiper-container .swiper-slide').eq(index).addClass('selected')
		$('.shortselectbm').hide();
		$('body').css({ 
			　　"overflow-x":"auto",
			　　"overflow-y":"auto"
			});
		return false;
	})

	var height = $('.min-pic').offset().top-40;

	$(window).scroll(function () {
		console.log(height);
		if ($(this).scrollTop() > height) {
			$('#product_nav').addClass('fixed-info-container');
		} else {
			$('#product_nav').removeClass('fixed-info-container');
		}
	});

})(jQuery);