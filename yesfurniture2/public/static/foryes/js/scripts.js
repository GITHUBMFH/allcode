(function ($) {

	// 懒加载
	$("img.lazy").lazyload({
		// placeholder: "img/grey.gif", //用图片提前占位
		// placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
		effect: "fadeIn",
		// effect(特效),值有show(直接显示),fadeIn(淡入),slideDown(下拉)等,常用fadeIn
		threshold: 200, // 提前开始加载
		container: $(".container"),
		failurelimit: 3
	});

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
	// 导航
	//页面动画
	AOS.init({
		duration: 1000,
		easing: "ease-in-out-back"
	});

	//图片分组器
	$('.work_all_item').mixItUp();

	//图片预览器
	$('.lightbox').venobox({
		numeratio: true,
		infinigall: true
	});

	// banner图轮播
	jQuery(document).ready(function () {
		var lock = false;
		var bgColor = ["rgb(179, 189, 196)", "rgb(180, 183, 166)", "rgb(140, 152, 187)"]; //设置背景色
		var banner = new Swiper('.banner', {
			speed: 1300,
			allowTouchMove: true, //禁止触摸滑动
			parallax: true, //文字位移视差
			spaceBetween: 30,
			effect: 'fade',
			autoplay: {
				delay: 3000,
				stopOnLastSlide: false,
				disableOnInteraction: true,
			},
			loop: true,
			navigation: {
				nextEl: '.button-next',
				prevEl: '.button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				type: 'progressbar', //fraction,progressbar
				clickable: true,
			},
			lazy: true,
			keyboard: true,
			on: {
				init: function () {
					swiperAnimateCache(this); //隐藏动画元素 
					swiperAnimate(this); //初始化完成开始动画
				},
				slideChangeTransitionEnd: function () {
					swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
					// this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); //动画只展现一次，去除ani类名
				},

			}
		});

		// end banner图轮播

		// 关于公司
		// 跳转到指定轮播页面
		$('#about_us .gallery-thumbs .swiper-wrapper .swiper-slide').hover(function () {
			galleryTop.slideTo($(this).index());
			$(this).siblings().removeClass('active_swiper');
			$(this).addClass('active_swiper');
		})
		var galleryThumbs = new Swiper('.gallery-thumbs', {
			// spaceBetween: 10,
			slidesPerView: 4,
			freeMode: true,
			allowTouchMove: false,
			direction: 'vertical',
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
		});
		var galleryTop = new Swiper('.gallery-top', {
			spaceBetween: 20,
			loop: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			thumbs: {
				swiper: galleryThumbs,
			},
		});
		// 关于公司

		// end 合作商
		var cooperation = new Swiper('.cooperation', {
			slidesPerView: 5,
			spaceBetween: 30,
			slidesPerGroup: 3,
			autoplay: {
				delay: 3000,
				stopOnLastSlide: false,
				disableOnInteraction: true,
			},
			loop: true,
			centeredSlides: true,
			navigation: {
				nextEl: '#cooperation .arrow_next',
				prevEl: '#cooperation.arrow_pre',
			},
		});
		cooperation.el.onmouseover = function () {
			cooperation.autoplay.stop();
		}

		//鼠标离开开始自动切换
		cooperation.el.onmouseout = function () {
			cooperation.autoplay.start();
		}

		// end 合作商

		// 案例
		var effect = 2 //1是缩放 2是y轴位移，3是旋转，4是背景色
		var example = new Swiper('.example', {
			loop: true,
			// speed: 1500,
			slidesPerView: 4,
			spaceBetween: 30,
			centeredSlides: true,
			watchSlidesProgress: true,
			grabCursor: true,
			autoplay: {
				delay: 3000,
				stopOnLastSlide: false,
				disableOnInteraction: true,
			},
			on: {
				setTranslate: function () {
					slides = this.slides
					for (i = 0; i < slides.length; i++) {
						slide = slides.eq(i)
						progress = slides[i].progress
						//slide.html(progress.toFixed(2)); 看清楚progress是怎么变化的
						slide.css({
							'opacity': '',
							'background': ''
						});
						slide.transform(''); //清除样式

						if (effect == 1) {
							slide.transform('scale(' + (1 - Math.abs(progress) / 8) + ')');
						} else if (effect == 2) {
							slide.css('opacity', (1 - Math.abs(progress) / 6));
							slide.transform('translate3d(0,' + Math.abs(progress) * 20 + 'px, 0)');
						} else if (effect == 3) {
							slide.transform('rotate(' + progress * 30 + 'deg)');
						} else if (effect == 4) {
							slide.css('background', 'rgba(' + (255 - Math.abs(progress) * 20) + ',' + (127 + progress * 32) + ',' + Math.abs(progress) * 64 + ')');
						}

					}
				},
				setTransition: function (transition) {
					for (var i = 0; i < this.slides.length; i++) {
						var slide = this.slides.eq(i)
						slide.transition(transition);
					}
				},
			},
			navigation: {
				nextEl: '#example .arrow_next',
				prevEl: '#example .arrow_pre',
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});

	})

	// 案例

	// 动态按钮
	document.querySelectorAll('.active_button').forEach(button => {

		let div = document.createElement('div'),
			letters = button.textContent.trim().split('');

		function elements(letter, index, array) {

			let element = document.createElement('span'),
				part = (index >= array.length / 2) ? -1 : 1,
				position = (index >= array.length / 2) ? array.length / 2 - index + (array.length / 2 - 1) : index,
				move = position / (array.length / 2),
				rotate = 1 - move;

			element.innerHTML = !letter.trim() ? ' ' : letter;
			element.style.setProperty('--move', move);
			element.style.setProperty('--rotate', rotate);
			element.style.setProperty('--part', part);

			div.appendChild(element);

		}

		letters.forEach(elements);

		button.innerHTML = div.outerHTML;

		button.addEventListener('mouseenter', e => {
			if (!button.classList.contains('out')) {
				button.classList.add('in');
			}
		});

		button.addEventListener('mouseleave', e => {
			if (button.classList.contains('in')) {
				button.classList.add('out');
				setTimeout(() => button.classList.remove('in', 'out'), 950);
			}
		});

	});
	// 动态按钮

	// 动态箭头
	$('.arrow').on('click touch', function (e) {

		e.preventDefault();

		let arrow = $(this);

		if (!arrow.hasClass('animate')) {
			arrow.addClass('animate');
			setTimeout(() => {
				arrow.removeClass('animate');
			}, 1600);
		}

	});
	// 动态箭头

})(jQuery);