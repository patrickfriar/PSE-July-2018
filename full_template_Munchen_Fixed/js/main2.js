


$(document).ready(function(){
	
	
	
    $('input[type=text]').focus(function(){
        clearText(this);  
    }).blur(function(){
        clearText(this);  
    });
    if($('.SortBox').size() == 0) {
		$('.ContentHead').addClass('noSort');
	}
	
	
	
	
	
    var GlobalFname = $('input#CustomerFirstName').val();
    if (GlobalFname!="" && GlobalFname!="Guest"){
        $("#FooterUpper li.create-account").remove();
        $("#FooterUpper li.sign-in").remove();
        $("#TopMenu ul").addClass("logged");
    }
    else{
        $("#FooterUpper li.my-account").remove();
        $("#FooterUpper li.sign-out").remove();
    }
     
	 
   
    
    var i = 0;
    $(".Content .ProductList li.item").each(function(){
        i++;
        if(i == 4 || $(this).is(':last-child')){
            $(this).after('<li class="custom-quickview" style="display:none;"></li>');
            i = 0;
        }
        
    });
    $(".Content .ProductList.List li").each(function(){
       $(this).after('<li class="custom-quickview" style="display:none;"></li>');
    });
    
   
   
    $('.QuickViewBtn').click(function(){
        
    });
    

    $('input[type=radio], input[type=checkbox], input[type=file]').not('.productOptionPickListSwatch input, .productOptionViewRectangle input').uniform();
    $('select').not("div:parent[class^='uniform-']").uniform();
    
    
    
    
	
	
	
    $('#TopMenu ul').clone().prependTo('.MobileMenuContent')
                    .wrap('<div class="MobileMenuLower"/>')
                    .find("li.CartLink").remove();
	$('#TopMenu .phoneIcon');
	var xPhone = $('.MobileMenuLower .phoneIcon').parent().html();
	$('.MobileMenuLower .phoneIcon').parent().remove();
				
					
	
	$('#HeaderLower #Menu').clone().prependTo('.MobileMenuContent');
		
	
	
	$('.MobileMenuContent').append(xPhone.replace('Call us on', ''));	
	$('.MobileMenuContent .phoneIcon').prepend('<i class="icon-phone"></i>');
	
	$('.footPhone').append(xPhone.replace('Call us on', ''));	
	$('.footPhone a').prepend('<i class="icon-phone"></i>');
	
	$('#currency-chooser').clone().appendTo('.MobileMenuContent');
	$('.MobileMenuLower').clone().appendTo('.MobileMenuContent');
	$('.MobileMenuLower').first().remove();
	
	$('.MobileMenuContent').prepend('<a class="homeLink" href="'+config.ShopPath+'"><i class="icon-home"></i> Home</a>');
	
	
	
	$('.MobileMenuLower .CurrencyChooser').appendTo('.MobileMenuContent ul.parent'); 
	
	
					
    var cs = parseInt($('#SideCartContents p > strong').text());
	               
   $('#Header').attr('class', 'cartItem'+cs);          
    if(cs > 0){
       $('.cartToggle').show().html('<span class="items">' + cs + '</span>');
	   
    }
    else{
       $('.cartToggle').html('');
	
	}
	
    
   
    
    $('.naviToggle').toggle(function (){
       	
		$('#Container').addClass("menuActive");
		$('.MobileMenu #Menu ul.parent ul').hide();
		$('.MobileMenu #Menu ul.parent').attr('id', '');
		
        
    }, function(){
		
		$('#Container').removeClass("menuActive");
		$('.MobileMenu #Menu ul.parent ul').hide();
		$('.MobileMenu #Menu ul.parent').attr('id', '');
		
        
    });
    
    $('.naviClose').click(function (){
		$('.naviToggle').trigger('click');	
	});	
	
	$('#search_query').focusout(function() {
  		$('#Header').removeClass('activeMe');
        $('.searchToggle').removeClass("activeToggle");
        
	});
	
    $('.searchToggle').click(function(){
        
        
		$('#Header').addClass('activeMe');
		$('.searchToggle').addClass("activeToggle");
		return false;
       
    
        
    });
	
	$('#SearchForm .closeIcon').click(function (){
		
		$('#SearchForm form').submit();	
	});	
	
	
    
    
    
	
	
	
	masonryMe();
	/*
	if (ShowImageZoomer == 1) {
		$(".image-container").click(function(){
			var img = $(this).children("img"),u=null;
			if(img.hasClass("active") == true) {
				swap_images(img);
				img.removeClass("active");
				img.parent().removeClass('activeBox');
				$(this).siblings().removeClass('inactive');
				
				masonryMe();
			} else {
				swap_images(img);
				img.addClass("active");
				img.parent().addClass('activeBox');
				$(this).siblings().addClass('inactive');
				
				masonryMe();
			}
		});
		if ($(".image-container").size() == 1) {
			$(".image-container").trigger('click');
		}
	} else {
		$('.ProductThumb').addClass('noZoom');
	}
	*/  
    $('.category-list li').each(function(){
        $(this).has("ul").addClass("parent");
    });
    $('.category-list li').first().addClass("First");
    $('.Breadcrumb li').each(function(){
       $(this).has("a").append('<span class="separator"> / </span>');
    });
    if($("#SideCartContents .cart-total strong").length > 0){
        var items = parseInt(($('.CartLink span.items').text()).replace(/[^0-9\.]+/g, ''));
        if(items == 1){
            $('.CartLink span.items').html(items + "<span> Item</span>")
        }
        else if(items > 0){
            $('.CartLink span.items').html(items + "<span> Items</span>")
        }
        $('.CartLink a').append(' / ' + '<span class="total">' + $("#SideCartContents .cart-total strong").text() + '</span>');
    }
    else{
        $('.CartLink a span.items').append("0 <span>Item</span>");
    }
	
	
    $('.MobileMenu li').each(function(){
		$(this).find('ul').removeClass('sub-page');
        var t = $(this).children("a:first").text();
        $(this).has("ul").find("a:first").addClass("parent-label");
        $(this).has("ul").children("ul").prepend('<li class="title">'+ t +'</li>');
       
    });
  
   
    $('.MobileMenu li .sub-indicator').click(function(){
       	$('.MobileMenu li ul').hide();
		
		
		
		$(this).siblings('ul').show();
		$(this).parents('ul').show();
	   var xLvl = $(this).siblings('ul').attr('class');
       $('.MobileMenu ul.parent').attr('id', xLvl); 
    		
			
			
			
			if (xLvl == 'child') {
				
				$('.MobileMenu #Menu').height($('.child:visible').outerHeight(true)); 
				
				
				
			}
			if (xLvl == 'grandChild') {
				$('.MobileMenu #Menu').height($('.grandChild:visible').outerHeight(true)); 
			}
			if (xLvl == 'grandGrandChild') {
				$('.MobileMenu #Menu').height($('.grandGrandChild:visible').outerHeight(true)); 
			}
			
			
			
				topAcc = $('li.title:visible').offset().top;
				$('html, body').animate({ scrollTop:  topAcc - 50}, 600);
			
		return false;
	});
	$('.MobileMenu .title').click(function(e){
		var yLvl = $('.MobileMenu ul.parent').attr('id');
		
		$(this).parent('ul').hide();
		if (yLvl == 'child') {
			$('.MobileMenu ul.parent').attr('id', '');	
			$('.MobileMenu #Menu').height('auto');
		}
		if (yLvl == 'grandChild') {
			$('.MobileMenu ul.parent').attr('id', 'child');	
			$('.MobileMenu #Menu').height($('.child:visible').outerHeight(true));
		}
		if (yLvl == 'grandGrandChild') {
			$('.MobileMenu ul.parent').attr('id', 'grandChild');	
			$('.MobileMenu #Menu').height($('.grandChild:visible').outerHeight(true));
		}
		 	
	});	
	$('.Left h2').each(function (){
			$(this).prepend('<span>-</span>');
	});		
	$('.Left h2').click(function (){
		
		if ($(this).next('.BlockContent').is(':hidden') == true) {
			$(this).stop().find('span').text('-').parent().next('.BlockContent').slideDown(300);
		} else {
			$(this).stop().find('span').text('+').parent().next('.BlockContent').slideUp(300);
		}
		
		
		return false;
	
	});
	
	
	
    $(".QuickView2").quickview2({
        buttonText: "Quick View",
        buttonColor: "#f7f7f7",
        gradientColor: "#dcdbdb",
        textColor: "#000000"
    });
    
    
    $(".Content .ProductList li.item, #SideCategoryList .SideCategoryListClassic li.parent").hover(
        function(){
            $(this).addClass("over");
        },
        function(){
            $(this).removeClass("over");
        }
    );
        
    $(".ProductCompareButton input, .ProductCompareButton label").click(function(){
        $(this).parent("div.ProductCompareButton").toggleClass("CompareSelected");
    });
    $('.ExpressCheckoutBlock .icon').click(function(){
        if($(this).parents('.ExpressCheckoutBlock').hasClass("ExpressCheckoutBlockCompleted")){
            $(this).siblings('.ChangeLink').trigger("click");

        }
    });
    $("#selectAllWishLists").click(function(){
        $.uniform.update($('#wishlistsform .CartContents input[type="checkbox"]'));
       
    });
    
    
	
	
	$("#HeaderLower  li").each(function() { 
		$(this).addClass('parent');
    
    	tallest = 0;
   	 	group =  $(this).find('ul');
    
		group.each(function() {
			thisHeight = $(this).height();
			if(thisHeight > tallest) {
				tallest = thisHeight;
			}
		});
		group.height(tallest);
	});
	$('.MobileMenu #Menu ul.parent').attr('id', 'grandGrandChild');
	//$('.MobileMenu #Menu ul.parent').attr('id', '');
   
});
 
    
$(document).ajaxComplete(function() {
    
   $('input[type=radio], input[type=checkbox], input[type=file]').not('.productOptionPickListSwatch input, .productOptionViewRectangle input, div:parent[class^="uniform-"]').uniform();
    $('select').not(".EstimateShipping select, div:parent[class^='uniform-']").uniform();
    $.uniform.restore(".EstimateShipping select");	
	$('.EstimateShipping select:visible').uniform();
   
   
});


$(window).load(function() {
	$('.MobileMenu #Menu ul.parent ul').hide();
		$('.MobileMenu #Menu ul.parent').attr('id', '');
    $(".ProductCompareButton input, .ProductCompareButton label").click(function(){
        $(this).parents("div.ProductCompareButton").toggleClass("CompareSelected");
    });
	/*
	if(jQuery.browser.mobile == true) {
		jQuery('body').class('mobileBrowser');
		
	}
	*/
});


var t;
$(window).resize(function() {
   clearTimeout(t);
	t = setTimeout(resizedMe, 600);
});


function resizedMe() {
		
	 $('.MobileMenu').height('auto');
	 //$('.MobileMenu .parent').attr('id', '');
	$('#QuickSearch').hide();	
}


window.addEventListener("orientationchange", function() {
	
	resizedMe();
}, false);


function clearText(field){
  if (field.defaultValue == field.value) field.value = '';
  else if (field.value == '') field.value = field.defaultValue;
}



function masonryMe() {
	

}
