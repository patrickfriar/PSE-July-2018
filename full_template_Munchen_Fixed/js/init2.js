var JQZOOM_OPTIONS = {
	zoomType: 'innerzoom',
	preloadImages: false,
	title: false
};

/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {
    
    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    
    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    
    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    
    $.extend($.expr[':'], {
        "below-the-fold": function(a, i, m) {
            return $.belowthefold(a, {threshold : 0});
        },
        "above-the-top": function(a, i, m) {
            return $.abovethetop(a, {threshold : 0});
        },
        "left-of-screen": function(a, i, m) {
            return $.leftofscreen(a, {threshold : 0});
        },
        "right-of-screen": function(a, i, m) {
            return $.rightofscreen(a, {threshold : 0});
        },
        "in-viewport": function(a, i, m) {
            return $.inviewport(a, {threshold : 0});
        }
    });

    
})(jQuery);


$(document).ready(function() {
	
	// Clear Search Field
	$('.autobox').autobox();
	
	
	$('.phoneIcon a span').each(function() {
		if ($(this).text().length < 3) {
			$(this).parent().hide();
		}
	});
	
	$('#HeaderLower #PagesMenu .First').remove();
	var catHTML = $('#HeaderLower .CategoryList > .BlockContent > ul').html();
	var pageHTML = $('#HeaderLower .PagesMenu > .BlockContent > ul').html();
	$('#HeaderLower #Menu > ul').append(catHTML);
	$('#HeaderLower #Menu > ul').append(pageHTML);
	$('#HeaderLower .CategoryList').remove();
	$('#HeaderLower #PagesMenu').remove();
	
	
	$('#HeaderLower  .Block > .BlockContent > ul').addClass('parent');
	$('#HeaderLower  .Block > .BlockContent > ul > li > ul').addClass('child');
	$('#HeaderLower  .Block > .BlockContent > ul > li > ul > li > ul').addClass('grandChild');
	$('#HeaderLower  .Block > .BlockContent > ul > li > ul > li > ul > li > ul').addClass('grandGrandChild');
	
	
	
	

	$('#prodAccordion .Block h2').click(function() {
		$(this).css('outline','none');
		
		if($(this).parent().hasClass('current')) {
			$(this).siblings('div').slideUp('slow',function() {
				$(this).parent().removeClass('current');
			});
		} else {
			$('#prodAccordion .Block .prodAccordionContent').slideUp('slow',function() {
				$(this).parent().removeClass('current');
			});
			$(this).siblings('div').slideToggle('slow',function() {
				$(this).parent().toggleClass('current');
				var vPort = $(this).is(":in-viewport");
				if(vPort == false) {
					topAcc = $(this).offset().top;
					$('html, body').animate({ scrollTop:  topAcc - 50}, 600);
				}

			});
		}
		
		

		return false;
	});
	
	if (  $(window).height() < 768) {
		$('#prodAccordion .Block h2').first().trigger('click');
	}
	
	
	
	//menu
	$('#HeaderLower li').hover(function() {
		$(this).addClass('over');
		if($(this).find('ul').size() != 0) {
			var subRight = $(this).find('ul').offset().left + $(this).find('ul').outerWidth(true);
			var wrapRight = $('#Wrapper').offset().left + $('#Wrapper').width();
			
			
			if ( subRight > wrapRight) {
				$(this).addClass('overWrapParent');
				$(this).find('ul').addClass('overWrap'); 
			} else {
				
			}
			
			
		}
		
		
		return false;
	},
	function() {
		$(this).removeClass('over');
	});
	
	
	$('#HeaderLower li').each(function() {
		if ($(this).find('ul li').length != 0) {
			$(this).addClass('hasSub').children('a').addClass('hasSub').parent().prepend('<span class="sub-indicator"> </span>');	
		}
	});
	
	var num = $('#HeaderLower  li').size(); 

	$('#HeaderLower  li').each(function(i) {
        $(this).css('z-index', num - i);
  	});

	
	//currency display
   var currentCurrency = $('#currencyPrices span').html();
   currentCurrency = currentCurrency.substring(0,currentCurrency.length);
   $('#SideCurrencySelector .selCurr').html(currentCurrency);
   
   var currentCurrencyF = $('.CurrencyList').find('.Sel').html();
   $('.selected-currency').html(currentCurrencyF);	
   
	
	if ($('.ChooseCurrencyBox').size() !=0 ) {
		$('.changeCurr').click(function() {
			
			if ($(this).closest('.CurrencyChooser').find(".CurrencyList").is(':hidden') == true) {
				$(this).find('i').attr('class', 'icon-caret-up');
				$(this).closest('.CurrencyChooser').find(".CurrencyList").show();	
			} else {
				$(this).closest('.CurrencyChooser').find(".CurrencyList").hide();	
				$(this).find('i').attr('class', 'icon-caret-down');
			}
			return false;
			
			
		
		});
	}
	$('.productAttributeLabel .name').each(function() { 
		$(this).text($(this).text().replace(':', '')); 
	});	
	
	$('.ProductList li').not('.ListView').each(function() {
		var title = $(this).find('.ProductName a').text();
		if (title.length > 75 ) {
		var shortText = $.trim(title).substring(0, 75).trim(this) + "..."; 
		$(this).find('.ProductName a').text(shortText);
		}
	});
	
	
	
	resizeMe();
});


$(window).load(function() {
	resizeMe();
	if ($('.WishListButton:visible').size() != 0) {
		
		$('html').click(function() {
			$('#SideProductAddToWishList .BlockContent').slideUp(300);
		 });
		
		
		$('.WishListButton').click(function(event){
			event.stopPropagation();
			var x = $('.WishListButton').offset().left;
			var y = $('.WishListButton').offset().top;
			$('#SideProductAddToWishList').css('top', y).css('left', x).css('position', 'absolute').show();
			$('#SideProductAddToWishList .BlockContent').slideToggle(300);
		});
		$('#SideProductAddToWishList .BlockContent').click(function(event){
			event.stopPropagation();
		});	
	}
	$('.prodAccordion > div > h2').click(function(){
		$('#SideProductAddToWishList .BlockContent').slideUp(300);
 	});		
	
	
});	


var resizeTimer;
$(window).resize(function () {
// prevents multiple ie fire resize	
   clearTimeout(resizeTimer);
   resizeTimer = setTimeout(resizeMe, 600);
	
});

window.addEventListener("orientationchange", function() {
	resizeMe();
	
}, false)

function resizeMe() {
	win = $(window).width();
	wrap = $('#Wrapper').width();
	marg = 0 - (($(window).width() - $('#Wrapper').width()) / 2);
	
	$('.custom-quickview').css('margin-left', marg).css('margin-right', marg);
	if ($('.WishListButton').size() != 0) {
		var x = $('.WishListButton').offset().left;
		var y = $('.WishListButton').offset().top;
		$('#SideProductAddToWishList').css('top', y).css('left', x).css('position', 'absolute').show();
	}
}