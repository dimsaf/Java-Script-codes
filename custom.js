var $window;

$(document).ready(function(){
	var modals = $('.modal');
	for(var i=0; i<modals.length; i++){
		if ($(modals[i]).find('.close').hasClass('cross-outer')) {
			//alert ("внешний крест имеет модалка №" + i);
			$(modals[i]).removeClass('for-inner-cross').addClass('for-outer-cross');
		}
		if ($(modals[i]).find('.close').hasClass('cross-inner')) {
			//alert ("внутренный крест имеет модалка №" + i);
			$(modals[i]).removeClass('for-outer-cross').addClass('for-inner-cross');
		}
	}
	// up arrow
	$('#scrollup').click( function vverh(){
		window.scrollBy(0,-$(document).height()/4); // чем меньше значение по оси Y, тем выше скорость перемещения
		//if (window.pageYOffset > 0) {requestAnimationFrame(vverh);} // плавная скорость перемещения (может потом понадобиться)
		return false;
	});
	$(window).scroll(function(){
		if ( $(document).scrollTop() > 0 ) {
			$('#scrollup').fadeIn('fast');
		} else {
			$('#scrollup').fadeOut('fast');
		}
	});

	// Special action
	if ($('#special img').size()){
		var specialInterval = setInterval(function(){
			var specTop = $(window).height()/2- $('#special').height()/2;
			$('.special-wrapper-descr').textfill({ maxFontPixels: 55, ourText: $('#special-descr') });
			$('.special-wrapper-link').textfill({ maxFontPixels: 25, ourText: $('#special-link') });
			$('#special').animate({'top': specTop}, 2000, 'swing');
			clearInterval(specialInterval);
		}, 10*1000);
	}

	$(".inputCountMask").inputmask();

});

$(function(){

	$window = $(window);

// detect mobile OS and choose properly link
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	var mobileAppHref = "";
	var mobileClass = "";
	if (isMobile.Android()) {
		mobileAppHref = "https://goo.gl/uI23dh";
		mobileClass = "apps-google";
	}
	if (isMobile.iOS()) {
		mobileAppHref = "https://itunes.apple.com/ru/app/мир-суши-2/id1232492982?l=ru&ls=1&mt=8";
		mobileClass = "apps-apple";
	}
	if (!isMobile.Android() && !isMobile.iOS()) {
		$("#download-app").remove();
	}
	if ($("#download-app").size()) {
		$("#download-app").attr('href', mobileAppHref).find('.apps').addClass(mobileClass);
	}


	var posY;
	$('#header-slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 6000,
		arrows: true,
		dots: true
	});
	$('#header-slider-xs').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 6000,
		arrows: false,
		dots: true
	});
	$(".header-slider-nav-left a, .header-slider-left a").click(function(e){
		e.preventDefault();
		$('#header-slider').slick('slickPrev');
		$('#header-slider-xs').slick('slickPrev');
	});
	$(".header-slider-nav-right a, .header-slider-right a").click(function(e){
		e.preventDefault();
		$('#header-slider').slick('slickNext');
		$('#header-slider-xs').slick('slickNext');
	});

	$('#about-page-slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		autoplaySpeed: 2000,
		arrows: false,
		fade:true,
		dots: false
	});
	$(".about-page-slider-nav-left a, .about-slider-left a").click(function(e){
		e.preventDefault();
		$('#about-page-slider').slick('slickPrev');
	});
	$(".about-page-slider-nav-right a, .about-slider-right a").click(function(e){
		e.preventDefault();
		$('#about-page-slider').slick('slickNext');
	});


	$('.main-cat-frame').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		autoplaySpeed: 2000,
		arrows: false,
		dots: false,
		draggable:false,
		asNavFor: '.main-cat-nav-slider',
		fade: true
	});
	$('.main-cat-nav-slider').slick({
		slidesToShow: 7,
		slidesToScroll: 1,
		asNavFor: '.main-cat-frame',
		dots: false,
		draggable:false,
		centerMode: true,
		focusOnSelect: true,
		responsive: [
			{
				breakpoint: 1190,
				settings: {
				  slidesToShow: 5,
				  slidesToScroll: 1
				}
			},
			{
				breakpoint: 992,
				settings: {
				  slidesToShow: 3,
				  slidesToScroll: 1
				}
			},
			{
				breakpoint: 558,
				settings: {
				  slidesToShow: 1,
				  slidesToScroll: 1
				}
			}
		]
	});
	$(".main-cat-box-blur-left").click(function(e){
		e.preventDefault();
		$('.main-cat-nav-slider').slick('slickPrev');
	});
	$(".main-cat-box-blur-right").click(function(e){
		e.preventDefault();
		$('.main-cat-nav-slider').slick('slickNext');
	});
	$(".main-cat-nav-slider-text").click(function(e){
		e.preventDefault();
		var link = window.location.protocol + "//" + window.location.hostname + "/" + $(this).data("link");
		window.history.pushState("", null, link);
		ms.loaderShow();
		location.href = link;
	});
	var $thisSlide, $currentSlide;
	$(".main-cat-nav.slide-down .main-cat-nav-slider-text").hover(function(e){
		e.preventDefault();
		var thisLink = $(this).data("link");
		//alert (thisLink);
		$thisSlide = $(this).parents(".main-cat").find(".container-fluid .slick-slide a[href = '" + thisLink + "']").closest(".slick-slide");
		$currentSlide = $(this).parents(".main-cat").find(".container-fluid .slick-slide.slick-current");
		if (!$thisSlide.hasClass("slick-current")) {
			$thisSlide.css("opacity", "1");
			$currentSlide.css("opacity", "0");
		}
	},	function(e) {
		e.preventDefault();
		if (!$thisSlide.hasClass("slick-current")) {
			$currentSlide.css("opacity", "1");
			$thisSlide.css("opacity", "0");
		}
	});

	$(document).on("click",".mm-city-link",function(e){
		e.preventDefault();
		$(this).parent().toggleClass('active');
	});
	$(document).on("mousemove",".searchbar.moved",function(e){
		e.preventDefault();
		$(this).addClass('active');
	});
	$(document).on("mouseleave",".searchbar.moved",function(e){
		e.preventDefault();
		$(this).removeClass('active');
	});
	$(document).on("mousemove",".social.moved",function(e){
		e.preventDefault();
		$(this).addClass('active');
	});
	$(document).on("mouseleave",".social.moved",function(e){
		e.preventDefault();
		$(this).removeClass('active');
	});
	$(document).on("click",".cat-item-footer a", function(e){
		e.preventDefault();
		$(this).parent().find("a").removeClass('active');
		$(this).addClass('active');
	});
	$(document).on("mousemove",".login.inside",function(e){
		e.preventDefault();
		$(this).addClass('active');
	});
	$(document).on("mouseleave",".login.inside",function(e){
		e.preventDefault();
		$(this).removeClass('active');
	});
	$(document).on("mousemove",".timer",function(e){
		e.preventDefault();
		$(this).addClass('active');
	});
	$(document).on("mouseleave",".timer",function(e){
		e.preventDefault();
		$(this).removeClass('active');
	});

	$(document).on('touchend', function(e) {
		if (e.target !== $("a.open-side-nav-social")[0] &&
			e.target !== $("a.social-item")[0]) {
			$(document).find(".social.moved").removeClass('active');
		}
	});

	$(document).on('click','.catalog-nav-inside-T a',function(e) {
		e.preventDefault();
		$(this).parent().parent().find("ul").slideToggle(300);
		$(this).parent().find("i").toggleClass('icon-dropdown_left');
	});

	$(document).on('click', '.cart-delivery-check-box-container-T a', function(e) {
		e.preventDefault();
		$(this).parent().parent().find("ul").fadeToggle(200);
	});
	$(document).on('click', '.order-second-step-reduse-T a', function(e) {
		e.preventDefault();
		$(this).toggleClass('active');
		$(this).parents('.cart-outer').find(".cart-outer-container").slideToggle(200);
	});
	$(document).on('change', '#starterCity', function(e) {
		$href = $(this).val();
		$target = $($(document).find('.starter-page-container-box-link a'));
		$target.attr('href', $href);
	});

	// modal fix
	$(document).on("show.bs.modal", function(e){
		var $bodyWidth = $("body").width();
		var b;
		$("body").css({'overflow-y': "hidden"}).css({'padding-right': (b = $("body").width()-$bodyWidth)});
		$(".mm-fixed-top").css({'padding-right': b});
		$("#goUp").css({'right': 20 + b});
		$(".cart-xs").css({'right': 15});
		$(".mm-container-inside").css('padding-right', '0');
		$('.modal-wrapper').css('visibility', 'visible');
		if ($(window).width() < 768) {
			$(".cart-xs").css({'right': 15 + b});
		}
		//alert ("Мои отступы:" + $('#callback-modal').offsetLeft + " и " + $('#callback-modal').offsetRight);
	});
	$(document).on("hidden.bs.modal", function(){
		$("body").css({'padding-right': "0", 'overflow-y': "auto"});
		$(".mm-fixed-top").css({'padding-right': "0"});
		$("#goUp").css({'right': "20px"});
		$(".cart-xs").css({'right': "15px"});
		$(".mm-container-inside").css('padding-right', '0');
		$('.modal-wrapper').css('visibility', 'hidden');
	});
	$(document).on('click', '.goToRegisterModal', function(e) {
		e.preventDefault();
		setTimeout(function(){
			$("#login").modal("show");
			$("#login").find(".modal-login-tabnav a[href='#register-tab']").trigger('click');
		},600);
	});
	$(document).on('click', '.goToLoginModal', function(e) {
		e.preventDefault();
		setTimeout(function(){
			$("#login").modal("show");
			$("#login").find(".modal-login-tabnav a[href='#login-tab']").trigger('click');
		},600);
	});
	$(document).on('click', '.goToHelpModal', function(e) {
		e.preventDefault();
		setTimeout(function(){
			$("#help-modal").modal("show");
		},600);
	});
	// open tovar modal from surprise modal
	$(document).on('click', '.goToItemModal', function(e) {
		e.preventDefault();
		$target = $(this).data('target');
		setTimeout(function(){
			$($target).modal("show");
		},600);
	});

	// modal-backdrop & close button
	$(document).on('click', '.modal-backdrop', function(){
		$(this).hide();
		var $mod=$('.modal.fade.zoom.in');
		$mod.modal('hide');
	});

	$(document).on('click', '.special-cross', function(){
		$("#special").addClass("hidden");
	});

	// $(document).on('click', '.stock-page-item-textbox-content.stock-modal a', function(e) {
	// 	e.preventDefault();
	// 	$target = $(this).data('target');
	// 	setTimeout(function(){
	// 		$($target).modal("show");
	// 	},600);
	// });
    $window.on({
    	'resize':function() {

    	},
    	'load':function() {
    		textCrop();
    	}
    });

    // input mask
    $("#inputDateBirthMask").inputmask({
    	skipInputEvent:true,
      	skipKeyPressEvent:true,
      	clearIncomplete: false,
	    placeholder: "__.__.__",
	    greedy: false,
    	mask:"99.99.99"
    });
    $(".inputDateBirthMask").inputmask({
    	skipInputEvent:true,
      	skipKeyPressEvent:true,
      	clearIncomplete: false,
	    placeholder: "__.__.____",
	    greedy: false,
    	mask:"99.99.9999"
    });
    $(".inputPhoneMask").inputmask({
    	skipInputEvent:true,
      	skipKeyPressEvent:true,
      	clearIncomplete: false,
	    placeholder: "8 ___-___-__-__",
	    greedy: false,
    	mask:"8 999-999-99-99"
    });
    $(".inputCodeMask").inputmask({
    	skipInputEvent:true,
      	skipKeyPressEvent:true,
      	clearIncomplete: false,
	    placeholder: "____",
	    greedy: false,
    	mask:"9999"
    });
    $(document).on("click", ".bonus-page-question-box a",function(e){
    	e.preventDefault();
    	$(this).parent().find("i").toggleClass('open');
    	$(this).parent().parent().find('ul').fadeToggle(400);
    });

    $(document).on('click', '.basket-demo', function(event) {
    	event.preventDefault();
    	/* Act on the event */
    	$(".basket-count").addClass('add');
    	setTimeout(function(){
    		$(".basket-count").removeClass('add');
    	},1500);
    });


    $(document).on('click', function(e) {
    	if ($(e.target).closest(".mm-city").length) return;
		$(document).find('.mm-city-link').parent().removeClass('active');
    });

// smooth scrolling to any element, for example to the menu on the mobile version
	$('a[href^="##"]').click(function () {
		var elementClick = $(this).attr("href");
		var $anchor = $("[name='" + elementClick + "']");
		var destination = $anchor.offset().top + $anchor.height() - $('#mm-nav').height();
		$('html, body').animate({scrollTop: destination}, 1000);
		return false;
	});
	// select gift modal
	$(document).on('click', 'a[data-target="#gift-modal"]', function () {
		textCrop();
	});


});

$(function(){
    var wrapper = $( ".file_upload" ),
        inp = wrapper.find("input"),
        btn = wrapper.find("button");

    // Yep, it works!
    btn.click(function(){
        inp.click();
    });

    var file_api = ( window.File && window.FileReader && window.FileList && window.Blob ) ? true : false;

    inp.change(function(){

        var file_name;
        if( file_api && inp[ 0 ].files[ 0 ] )
            file_name = inp[ 0 ].files[ 0 ].name;
        else
            file_name = inp.val().replace( "C:\\fakepath\\", '' );
        if( ! file_name.length )
            return;

        btn.text( file_name );
    }).change();

});

// text croping
function textCrop() {
	var $this;
	var $newsContent = $('.cat-item-text, .mob-cat-item-text');

	$.each($newsContent, function () {
		$this        = $(this);
		var size     = $this.data('crop');
		var newsText = $this.text();

		if (newsText.length > size) {
			$this.text(newsText.slice(0, size) + '...');
		}
	});
}
function stylerInit() {
	setTimeout(function() {
		$('select').styler({
			selectPlaceholder: ""
		});
	}, 100);
}
function preloaderKill() {
	setTimeout(function(){
		$(".preloader-box").fadeOut(300);
	},1500);
}

// count-down timer
function updateClock(){
	if ($(".side-nav .timer").size()) {
		var clock = $(".side-nav #timer-num");
		var minutes = $(".side-nav #timer-minutes");
		// остаток в минутах
		var t = [];
		t = getTimeRemaining(remainTime);
		clock.html(t.minutes);
		minutes.html(getMinutes(t.minutes));
		if (remainTime == -2) {
			clearInterval(timeinterval);
			ms.getOrderTimer();
		}
		--remainTime;
	}
}

function getTimeRemaining(t){
	var minutes = Math.ceil(t / 60);
	var seconds = Math.floor(t % 60);
	return {
		'total': t,
		'minutes': minutes,
		'seconds': seconds
	};
}
function getMinutes(m){
	if (m < 11 || m > 14) {
		m = m.toString();
		switch (m[m.length-1]) {
			case '1':
				return 'минута';
			case '2':
			case '3':
			case '4':
				return 'минуты';
			default:
				return 'минут';
		}
	} else return 'минут';
}

// copy to clipboard
function toclipboard(){
	var copyEmailBtn = document.querySelector('.js-copybtn');
	copyEmailBtn.addEventListener('click', function(event) {
		// Выборка ссылки
		var codeLink = document.querySelector('.js-codelink');
		var range = document.createRange();
		range.selectNode(codeLink);
		window.getSelection().addRange(range);
		//alert (range);
		try {
			// Теперь, когда мы выбрали текст ссылки, выполним команду копирования
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copy email command was ' + msg);
		} catch(err) {
			console.log('Oops, unable to copy');
		}
		// Снятие выделения - ВНИМАНИЕ: вы должны использовать
		// removeRange(range) когда это возможно
		window.getSelection().removeAllRanges();
	});
}

// font size for flexible (special action)
(function($) {
	$.fn.textfill = function(options) {
		var fontSize = options.maxFontPixels;
		var ourText = options.ourText;
		var maxWidth = $(this).width();
		var maxHeight = $(this).height();
		var textHeight;
		var textWidth;
		do {
			ourText.css('font-size', fontSize);
			textWidth = ourText.width();
			textHeight = ourText.height();
			fontSize = fontSize - 1;
		} while ((textWidth > maxWidth || textHeight > maxHeight) && fontSize > 5);
		return this;
	}
})(jQuery);
