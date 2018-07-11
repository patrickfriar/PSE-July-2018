$(document).ready(function(){
    getSwatch();

    $(window).scroll(throttle(getSwatch, 250));
});

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

function getSwatch() {
    var first = $('#CategoryContent .ProductList>li').index($('#CategoryContent .ProductList>li:in-viewport').first());  //Find index of first image in view
    var slice = first < 16 ? $('#CategoryContent .ProductList>li').slice(first, first + 16) : $('#CategoryContent .ProductList>li').slice(first - 6, first + 16);

    slice.each(function(index, value) { //Looks for li elements in .ProductList
        var image = $(this).find('.ProductImage img'); // The Image inside li
        var product = $(this);

        if ( product.hasClass('alt-loaded') ) {
            return; //Return if image already has been loaded
        }

        product.addClass('alt-loaded'); //Mark as loaded
        var pid = $(this).find('div.ProductImage').data('product'); //Find product ID
        var parentwidth = image.width(); //Find original width
        if (localStorage) {
            if (localStorage['alt-image'+pid] && localStorage['swatchOptions'+pid]) {
                image.data('image', image.attr('src'));//Store original image src
                altimage = localStorage['alt-image'+pid];
                swatchoptions = localStorage['swatchOptions'+pid];
                if (altimage != 'none') {
                    image.attr('data-alt-image', altimage);
                }
                product.children('.ProductImage').hover( //When the ProductImage is hovered show the alt image.
                    function() {
                        if( image.data('alt-image') ) {
                            image.attr('src',image.attr('data-alt-image'));
                        };
                    },
                    function() {
                        image.attr('src', image.data('image')); //Show normal image for non-hover state.
                    }
                );
                if (swatchoptions != 'none') {
                    product.find(".ProductDetails").append(swatchoptions);
            
                    product.find('li.swatch').off('click', swatchSwapImage).click(swatchSwapImage);
                    product.find('li.swatch').each(function(){

                       if ($(this).find('.swatchColour').css('background-color') == 'rgb(255, 255, 255)') {
                            $(this).find('.swatchColour').css('border', '1px solid #aaa').css('box-sizing', 'border-box');
                       }
                    });
                }
                return;
            }
        }

        $.get('/remote.php', {w : 'getproductquickview', pid: pid},
            function(data) { //If successful
                //Image swap
                image.data('image', image.attr('src'));//Store original image src
                //Get alt image
                if ($('.ProductTinyImageList li', data.content).length > 1) { //Checks to see if there is another image.
                    var rel = JSON.parse( $('.ProductTinyImageList li', data.content).eq(1).find('a').attr('rel') );
                    var image2 = rel.smallimage;  //Regular Expression to grab the second image
                    image.attr('data-alt-image',image2); //Sets the second image as the alt image.
                    if (localStorage) {
                        localStorage['alt-image'+pid] = image2;
                    }
                } else {
                    if (localStorage) {
                        localStorage['alt-image'+pid] = 'none';
                    }
                }
                product.children('.ProductImage').hover( //When the ProductImage is hovered show the alt image.
                    function() {
                        if( image.data('alt-image') ) {
                            image.attr('src',image.attr('data-alt-image'));
                        };
                    },
                    function() {
                        image.attr('src', image.data('image')); //Show normal image for non-hover state.
                    }
                );

                //Options add
                swatchOptions = $(".productOptionPickListSwatch", data.content); //Swatch Options
                swatchOptions.find('span.name').remove();
                product.find('.ProductDetails').append(swatchOptions);

                localStorage['swatchOptions'+pid] = swatchOptions[0] ? swatchOptions[0].outerHTML : 'none';

                product.find('li.swatch').off('click', swatchSwapImage).click(swatchSwapImage);
                product.find('li.swatch').each(function(){
                    if ($(this).find('.swatchColour').css('background-color') == 'rgb(255, 255, 255)') {
                        $(this).find('.swatchColour').css('border', '1px solid #aaa').css('box-sizing', 'border-box');
                    }
                });
            }
        );
    });
}

function swatchSwapImage(e){


   // e.preventDefault();
    var swatch = $(this);
    var productImage = $(this).parents('#CategoryContent .ProductList>li').children('.ProductImage').find('img');

    swatch.parents('.productOptionPickListSwatch').find('.swatchColours').removeClass('active');
    swatch.find('.swatchColours').addClass('active');

    if (typeof(swatch.data('thumb')) == 'undefined') {
        postData = {};
        postData.action = 'add';
        postData.w = 'getProductAttributeDetails';
        postData['qty[]'] = 1;
        postData.product_id = swatch.parents('#CategoryContent .ProductList>li').children('.ProductImage').data('product');
        postData[swatch.find('input').attr('name')] = swatch.find('input').attr('value');

        var localStorageString = 'thumb'+postData.product_id+swatch.find('input').attr('name')+swatch.find('input').attr('value');
        if (typeof(localStorage[localStorageString]) == 'undefined') {
            $.post('/remote.php', postData, function(data){
                if(data.success == 1) {
                    if (data.details.thumb) {
                        var thumb = data.details.thumb;
                    } else {
                        var thumb = data.details.baseThumb;
                    }
                    localStorage['thumb'+postData.product_id+swatch.find('input').attr('name')+swatch.find('input').attr('value')] = thumb;
                    swatch.data('thumb', thumb);
                    productImage.attr('src', thumb);
                    productImage.data('image', thumb);
                }
            });
        } else {
            var thumb = localStorage[localStorageString];
            swatch.data('thumb', thumb);
            productImage.attr('src', thumb);
            productImage.data('image', thumb);
        }
    } else {
        var thumb = swatch.data('thumb');

        productImage.attr('src', thumb);
        productImage.data('image', thumb);
    }

}