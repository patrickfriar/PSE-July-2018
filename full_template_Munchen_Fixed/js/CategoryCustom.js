/*
## category swatches
*/

$(document).ready(function(){
  getSwatch();

  $(window).scroll(throttle(getSwatch, 250));

  $('.swatch ').find('input').each(function(){
    $(this).attr('id', '');
  });

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
        $(this).find('input').attr('id', '');
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
                  }
              },
              function() {
                  image.attr('src', image.data('image')); //Show normal image for non-hover state.
              }
              );

               if (swatchoptions != 'none') {
                   // console.log(product);
                   product.find(".ProductDetails").append(swatchoptions);

                   product.find('li.swatch').live('click', swatchSwapImage).click(swatchSwapImage);
                   product.find('li.swatch').each(function(){
                    $(this).find('input').attr('id', '');

                    if ($(this).find('.textureContainer').css('background-color') == 'rgb(255, 255, 255)') {
                      $(this).find('.textureContainer').css('border', '1px solid #aaa').css('box-sizing', 'border-box');
                    }
                  });
                 }
                 return;
               }
               $(this).find('input').attr('id', '');
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
                  }
                },
                function() {
                    image.attr('src', image.data('image')); //Show normal image for non-hover state.
                }
                );

                //Options add
                swatchOptions = $(".productOptionPickListSwatch", data.content); //Swatch Options
                swatchOptions.find('span.name').remove();
                product.find('.ProductDetails').append(swatchOptions);
                $(this).find('input').attr('id', '');

                localStorage['swatchOptions'+pid] = swatchOptions[0] ? swatchOptions[0].outerHTML : 'none';

                product.find('li.swatch').live('click', swatchSwapImage).click(swatchSwapImage);
                product.find('li.swatch').each(function(){
                  if ($(this).find('.textureContainer').css('background-color') == 'rgb(255, 255, 255)') {
                    $(this).find('.textureContainer').css('border', '1px solid #aaa').css('box-sizing', 'border-box');
                  }
                });
              }
              );
           });

}

function swatchSwapImage(e){

    e.preventDefault();
    var swatch = $(this);
    var productImage = $(this).parents('#CategoryContent .ProductList>li').children('.ProductImage').find('img');
    // console.log(swatch.find('input').attr('value'));
    // console.log(swatch.find('input').attr('name'));

    swatch.parents('.productOptionPickListSwatch').find('.textureContainer').removeClass('active');
    swatch.find('.textureContainer').addClass('active');

    if (typeof(swatch.data('thumb')) == 'undefined') {
        postData = {};
        postData.action = 'add';
        postData.w = 'getProductAttributeDetails';
        postData['qty[]'] = 1;
        postData.product_id = swatch.parents('#CategoryContent .ProductList>li').children('.ProductImage').data('product');
        var attribute_id = swatch.find('input').attr('name');
        postData[attribute_id] = swatch.find('input').attr('value');
        //postData[swatch.c] = swatch.find('input').attr('value'); --> Than's stuff

        var localStorageString = 'thumb'+postData.product_id+swatch.find('input').attr('name')+swatch.find('input').attr('value');
        if (typeof(localStorage[localStorageString]) == 'undefined') {
            $.post('/remote.php', postData, function(data){
                if(data.success == 1) {
                    if (data.details.thumb) {
                        var thumb = data.details.thumb;
                      // console.log(thumb);
                    } else {
                        var thumb = data.details.baseThumb;
                     //   console.log(thumb);

                    }
                    localStorage['thumb'+postData.product_id+swatch.find('input').attr('name')+swatch.find('input').attr('value')] = thumb;
                    swatch.data('thumb', thumb);
                    productImage.attr('src', thumb);
                    productImage.data('image', thumb);
                }
            });
        } else {
            var thumb = localStorage[localStorageString];
          //  console.log(thumb);
            swatch.data('thumb', thumb);
            productImage.attr('src', thumb);
            productImage.data('image', thumb);
        }
    } else {
        var thumb = swatch.data('thumb');
       // console.log(thumb);
      //  console.log(productImage.data);
        productImage.attr('src', thumb);
        productImage.data('image', thumb);
    }

}

/*
## category image swap on hover
*/
$(document).ready(function(){function t(){$("#CategoryContent .ProductImage").length>0&&$("#CategoryContent .ProductImage").each(function(){var t,a=$(this).find("img"),e=window.location.href;if(e.indexOf("ps://")>0){var i=$(this).find("a").attr("href"),n=i.replace("http://","https://");t=n}else t=$(this).find("a").attr("href");0==$(this).hasClass("hoverPend")&&($(this).addClass("hoverPend"),$.ajax({context:"this",url:t,type:"GET",success:function(t){if(a.attr("data-image",a.attr("src")),t.indexOf("ThumbURLs[1]")>-1){var e="https://"+t.match(/ThumbURLs\[1\] = "(.*?)"/),i=e.split(","),n=i[0].split(' = "');if("undefined"!=typeof n[1]){var r=n[1].replace('"',"").replace(/\\\//g,"/");a.attr("data-alt-image",r)}}}})),$(this).hover(function(){a.attr("data-alt-image")&&a.attr("src",a.attr("data-alt-image"))},function(){a.attr("src",a.attr("data-image"))})})}t(),$(document).ajaxComplete(function(){t()})});

/*
## Modal Swatch input fix
*/
// $('#ModalContainer .swatchTexture').live('click', function(){ $(this).parent().parent().parent().find('input').click();});

// Price Range
setTimeout(function(){
// declare price array object
var priceArray = {};
//cycle through each product and get the id
setTimeout(function(){

$('.ProductImage').each(function(){
var pid = $(this).data('product');
getProductDetails(pid);

});
}, 1000);

function getProductDetails(pid) {
    // store the prices for this product
    priceArray[pid] = [];
// if there is not already a sessionStorage in place then run through the product to get the prices
  if(typeof sessionStorage['pidRange'+pid] == 'undefined'){
    // go into quick view
    $.get('/remote.php', {w : 'getproductquickview', pid: pid}, getPriceRange(pid) );
}
else{
// if there is no - in the sessionStorage then don't change the price front end else show the range price
    if(sessionStorage['pidRange'+pid].indexOf('-') != -1){
       $('.ProductImage[data-product="'+pid+'"]').parent().find('.p-price').text(sessionStorage['pidRange'+pid]);
   }
}
}

function getPriceRange(pid) {

    return function (data){
        // declare the object json you want to pass through to the next function
        var post_data = {};
        post_data.action = 'add';
        post_data.w = 'getProductAttributeDetails';
        post_data['qty[]'] = 1;
        post_data.product_id = pid;

        var size_select = $('span.name:contains("Size")', data.content).parents('.productAttributeRow ').find('input');
        var swatch_select = $('span.name:contains("Color")', data.content).parents('.productAttributeRow').find('input');
        var attribute_id = size_select.attr('name');
        var swatch_id = swatch_select.attr('name');
        // go through each combination of size and color
        size_select.each(function(){
          post_data[attribute_id] = $(this).val();  swatch_select.each(function(){ post_data[swatch_id] = $(this).val(); getOptionPrice(post_data);  });
        });
    }
}
// function to get the actual price of the combination selection
function getOptionPrice(post_data) {
    $.post('/remote.php', post_data, handleOptionPrice(post_data.product_id));
}

function handleOptionPrice(pid) {
    return function (data) {

        if(typeof data.details != 'undefined'){
        // console.log(data.details);
        var optPrice = data.details.price.replace('$', '');
        var convert = parseFloat(optPrice);
        priceArray[pid].push(convert);
        // grab the highest price form the array
        var highest = Math.max.apply(Math, priceArray[pid]);
        // grab the lowest price from the array
        var lowest =  Math.min.apply(Math, priceArray[pid]);
   // set the initial sessionstorage
   sessionStorage['pidRange'+pid] = data.details.price;
   // if the lowest price and highest price are not equal to one another then that means there is a difference
     if(lowest != highest){
        if($('.ProductImage[data-product="'+pid+'"]').parent().find('.p-price').text().length > 0){
            $('.ProductImage[data-product="'+pid+'"]').parent().find('.p-price').text('$' + lowest.toFixed(2) + " - " + '$' + highest.toFixed(2));
            sessionStorage['pidRange'+pid] = '$' + lowest.toFixed(2) + " - " + '$' + highest.toFixed(2);
        }

        else{
        $('.ProductImage[data-product="'+pid+'"]').parent('div').find('.ProductPriceRating em').text('$' + lowest.toFixed(2) + " - " + '$' + highest.toFixed(2));
        sessionStorage['pidRange'+pid] = '$' + lowest.toFixed(2) + " - " + '$' + highest.toFixed(2);

    }

    }
}

    }
}

showPrice();
function showPrice(){
  $('.ProductPriceRating em').fadeIn('fast');
}
}, 2000);

/*
## category badges
*/
function tagSale(){$(".ProductList>li").each(function(){var s=$(this).find("strike").closest(".ProductList>li");s.addClass("sale")})}function processTags(){tagSale(),$(".ProductList>li").each(function(s,t){var a=$(this),i=a.find(".Summary").text().trim(),e=i.indexOf("***"),n=i.indexOf("***",e+3);if(0==e&&-1!=n)for(var r=i.substring(e+3,n),c=r.split(", "),o=c.length-1;o>=0;o--){var d=c[o];a.addClass(d)}})}$(document).ready(processTags);$(document).ajaxComplete(processTags);

/*
## lightslider
*/
!function(a,b){"use strict";var c={item:3,autoWidth:!1,slideMove:1,slideMargin:10,addClass:"",mode:"slide",useCSS:!0,cssEasing:"ease",easing:"linear",speed:400,auto:!1,loop:!1,slideEndAnimation:!0,pause:2e3,keyPress:!1,controls:!0,prevHtml:"",nextHtml:"",rtl:!1,adaptiveHeight:!1,vertical:!1,verticalHeight:500,vThumbWidth:100,thumbItem:10,pager:!0,gallery:!1,galleryMargin:5,thumbMargin:5,currentPagerPosition:"middle",enableTouch:!0,enableDrag:!0,freeMove:!0,swipeThreshold:40,responsive:[],onBeforeStart:function(a){},onSliderLoad:function(a){},onBeforeSlide:function(a,b){},onAfterSlide:function(a,b){},onBeforeNextSlide:function(a,b){},onBeforePrevSlide:function(a,b){}};a.fn.lightSlider=function(b){if(0===this.length)return this;if(this.length>1)return this.each(function(){a(this).lightSlider(b)}),this;var d={},e=a.extend(!0,{},c,b),f={},g=this;d.$el=this,"fade"===e.mode&&(e.vertical=!1);var h=g.children(),i=a(window).width(),j=null,k=null,l=0,m=0,n=!1,o=0,p="",q=0,r=e.vertical===!0?"height":"width",s=e.vertical===!0?"margin-bottom":"margin-right",t=0,u=0,v=0,w=0,x=null,y="ontouchstart"in document.documentElement,z={};return z.chbreakpoint=function(){if(i=a(window).width(),e.responsive.length){var b;if(e.autoWidth===!1&&(b=e.item),i<e.responsive[0].breakpoint)for(var c=0;c<e.responsive.length;c++)i<e.responsive[c].breakpoint&&(j=e.responsive[c].breakpoint,k=e.responsive[c]);if("undefined"!=typeof k&&null!==k)for(var d in k.settings)k.settings.hasOwnProperty(d)&&(("undefined"==typeof f[d]||null===f[d])&&(f[d]=e[d]),e[d]=k.settings[d]);if(!a.isEmptyObject(f)&&i>e.responsive[0].breakpoint)for(var g in f)f.hasOwnProperty(g)&&(e[g]=f[g]);e.autoWidth===!1&&t>0&&v>0&&b!==e.item&&(q=Math.round(t/((v+e.slideMargin)*e.slideMove)))}},z.calSW=function(){e.autoWidth===!1&&(v=(o-(e.item*e.slideMargin-e.slideMargin))/e.item)},z.calWidth=function(a){var b=a===!0?p.find(".lslide").length:h.length;if(e.autoWidth===!1)m=b*(v+e.slideMargin);else{m=0;for(var c=0;b>c;c++)m+=parseInt(h.eq(c).width())+e.slideMargin}return m},d={doCss:function(){var a=function(){for(var a=["transition","MozTransition","WebkitTransition","OTransition","msTransition","KhtmlTransition"],b=document.documentElement,c=0;c<a.length;c++)if(a[c]in b.style)return!0};return e.useCSS&&a()?!0:!1},keyPress:function(){e.keyPress&&a(document).on("keyup.lightslider",function(b){a(":focus").is("input, textarea")||(b.preventDefault?b.preventDefault():b.returnValue=!1,37===b.keyCode?(g.goToPrevSlide(),clearInterval(x)):39===b.keyCode&&(g.goToNextSlide(),clearInterval(x)))})},controls:function(){e.controls&&(g.after('<div class="lSAction"><a class="lSPrev">'+e.prevHtml+'</a><a class="lSNext">'+e.nextHtml+"</a></div>"),e.autoWidth?z.calWidth(!1)<o&&p.find(".lSAction").hide():l<=e.item&&p.find(".lSAction").hide(),p.find(".lSAction a").on("click",function(b){return b.preventDefault?b.preventDefault():b.returnValue=!1,"lSPrev"===a(this).attr("class")?g.goToPrevSlide():g.goToNextSlide(),clearInterval(x),!1}))},initialStyle:function(){var a=this;"fade"===e.mode&&(e.autoWidth=!1,e.slideEndAnimation=!1),e.auto&&(e.slideEndAnimation=!1),e.autoWidth&&(e.slideMove=1,e.item=1),e.loop&&(e.slideMove=1,e.freeMove=!1),e.onBeforeStart.call(this,g),z.chbreakpoint(),g.addClass("lightSlider").wrap('<div class="lSSlideOuter '+e.addClass+'"><div class="lSSlideWrapper"></div></div>'),p=g.parent(".lSSlideWrapper"),e.rtl===!0&&p.parent().addClass("lSrtl"),e.vertical?(p.parent().addClass("vertical"),o=e.verticalHeight,p.css("height",o+"px")):o=g.outerWidth(),h.addClass("lslide"),e.loop===!0&&"slide"===e.mode&&(z.calSW(),z.clone=function(){if(z.calWidth(!0)>o){for(var b=0,c=0,d=0;d<h.length&&(b+=parseInt(g.find(".lslide").eq(d).width())+e.slideMargin,c++,!(b>=o+e.slideMargin));d++);var f=e.autoWidth===!0?c:e.item;if(f<g.find(".clone.left").length)for(var i=0;i<g.find(".clone.left").length-f;i++)h.eq(i).remove();if(f<g.find(".clone.right").length)for(var j=h.length-1;j>h.length-1-g.find(".clone.right").length;j--)q--,h.eq(j).remove();for(var k=g.find(".clone.right").length;f>k;k++)g.find(".lslide").eq(k).clone().removeClass("lslide").addClass("clone right").appendTo(g),q++;for(var l=g.find(".lslide").length-g.find(".clone.left").length;l>g.find(".lslide").length-f;l--)g.find(".lslide").eq(l-1).clone().removeClass("lslide").addClass("clone left").prependTo(g);h=g.children()}else h.hasClass("clone")&&(g.find(".clone").remove(),a.move(g,0))},z.clone()),z.sSW=function(){l=h.length,e.rtl===!0&&e.vertical===!1&&(s="margin-left"),e.autoWidth===!1&&h.css(r,v+"px"),h.css(s,e.slideMargin+"px"),m=z.calWidth(!1),g.css(r,m+"px"),e.loop===!0&&"slide"===e.mode&&n===!1&&(q=g.find(".clone.left").length)},z.calL=function(){h=g.children(),l=h.length},this.doCss()&&p.addClass("usingCss"),z.calL(),"slide"===e.mode?(z.calSW(),z.sSW(),e.loop===!0&&(t=a.slideValue(),this.move(g,t)),e.vertical===!1&&this.setHeight(g,!1)):(this.setHeight(g,!0),g.addClass("lSFade"),this.doCss()||(h.fadeOut(0),h.eq(q).fadeIn(0))),e.loop===!0&&"slide"===e.mode?h.eq(q).addClass("active"):h.first().addClass("active")},pager:function(){var a=this;if(z.createPager=function(){w=(o-(e.thumbItem*e.thumbMargin-e.thumbMargin))/e.thumbItem;var b=p.find(".lslide"),c=p.find(".lslide").length,d=0,f="",h=0;for(d=0;c>d;d++){"slide"===e.mode&&(e.autoWidth?h+=(parseInt(b.eq(d).width())+e.slideMargin)*e.slideMove:h=d*(v+e.slideMargin)*e.slideMove);var i=b.eq(d*e.slideMove).attr("data-thumb");if(f+=e.gallery===!0?'<li style="width:100%;'+r+":"+w+"px;"+s+":"+e.thumbMargin+'px"><a href="#"><img src="'+i+'" /></a></li>':'<li><a href="#">'+(d+1)+"</a></li>","slide"===e.mode&&h>=m-o-e.slideMargin){d+=1;var j=2;e.autoWidth&&(f+='<li><a href="#">'+(d+1)+"</a></li>",j=1),j>d?(f=null,p.parent().addClass("noPager")):p.parent().removeClass("noPager");break}}var k=p.parent();k.find(".lSPager").html(f),e.gallery===!0&&(e.vertical===!0&&k.find(".lSPager").css("width",e.vThumbWidth+"px"),u=d*(e.thumbMargin+w)+.5,k.find(".lSPager").css({property:u+"px","transition-duration":e.speed+"ms"}),e.vertical===!0&&p.parent().css("padding-right",e.vThumbWidth+e.galleryMargin+"px"),k.find(".lSPager").css(r,u+"px"));var l=k.find(".lSPager").find("li");l.first().addClass("active"),l.on("click",function(){return e.loop===!0&&"slide"===e.mode?q+=l.index(this)-k.find(".lSPager").find("li.active").index():q=l.index(this),g.mode(!1),e.gallery===!0&&a.slideThumb(),clearInterval(x),!1})},e.pager){var b="lSpg";e.gallery&&(b="lSGallery"),p.after('<ul class="lSPager '+b+'"></ul>');var c=e.vertical?"margin-left":"margin-top";p.parent().find(".lSPager").css(c,e.galleryMargin+"px"),z.createPager()}setTimeout(function(){z.init()},0)},setHeight:function(a,b){var c=null,d=this;c=e.loop?a.children(".lslide ").first():a.children().first();var f=function(){var d=c.outerHeight(),e=0,f=d;b&&(d=0,e=100*f/o),a.css({height:d+"px","padding-bottom":e+"%"})};f(),c.find("img").length?c.find("img")[0].complete?(f(),x||d.auto()):c.find("img").load(function(){setTimeout(function(){f(),x||d.auto()},100)}):x||d.auto()},active:function(a,b){this.doCss()&&"fade"===e.mode&&p.addClass("on");var c=0;if(q*e.slideMove<l){a.removeClass("active"),this.doCss()||"fade"!==e.mode||b!==!1||a.fadeOut(e.speed),c=b===!0?q:q*e.slideMove;var d,f;b===!0&&(d=a.length,f=d-1,c+1>=d&&(c=f)),e.loop===!0&&"slide"===e.mode&&(c=b===!0?q-g.find(".clone.left").length:q*e.slideMove,b===!0&&(d=a.length,f=d-1,c+1===d?c=f:c+1>d&&(c=0))),this.doCss()||"fade"!==e.mode||b!==!1||a.eq(c).fadeIn(e.speed),a.eq(c).addClass("active")}else a.removeClass("active"),a.eq(a.length-1).addClass("active"),this.doCss()||"fade"!==e.mode||b!==!1||(a.fadeOut(e.speed),a.eq(c).fadeIn(e.speed))},move:function(a,b){e.rtl===!0&&(b=-b),this.doCss()?a.css(e.vertical===!0?{transform:"translate3d(0px, "+-b+"px, 0px)","-webkit-transform":"translate3d(0px, "+-b+"px, 0px)"}:{transform:"translate3d("+-b+"px, 0px, 0px)","-webkit-transform":"translate3d("+-b+"px, 0px, 0px)"}):e.vertical===!0?a.css("position","relative").animate({top:-b+"px"},e.speed,e.easing):a.css("position","relative").animate({left:-b+"px"},e.speed,e.easing);var c=p.parent().find(".lSPager").find("li");this.active(c,!0)},fade:function(){this.active(h,!1);var a=p.parent().find(".lSPager").find("li");this.active(a,!0)},slide:function(){var a=this;z.calSlide=function(){m>o&&(t=a.slideValue(),a.active(h,!1),t>m-o-e.slideMargin?t=m-o-e.slideMargin:0>t&&(t=0),a.move(g,t),e.loop===!0&&"slide"===e.mode&&(q>=l-g.find(".clone.left").length/e.slideMove&&a.resetSlide(g.find(".clone.left").length),0===q&&a.resetSlide(p.find(".lslide").length)))},z.calSlide()},resetSlide:function(a){var b=this;p.find(".lSAction a").addClass("disabled"),setTimeout(function(){q=a,p.css("transition-duration","0ms"),t=b.slideValue(),b.active(h,!1),d.move(g,t),setTimeout(function(){p.css("transition-duration",e.speed+"ms"),p.find(".lSAction a").removeClass("disabled")},50)},e.speed+100)},slideValue:function(){var a=0;if(e.autoWidth===!1)a=q*(v+e.slideMargin)*e.slideMove;else{a=0;for(var b=0;q>b;b++)a+=parseInt(h.eq(b).width())+e.slideMargin}return a},slideThumb:function(){var a;switch(e.currentPagerPosition){case"left":a=0;break;case"middle":a=o/2-w/2;break;case"right":a=o-w}var b=q-g.find(".clone.left").length,c=p.parent().find(".lSPager");"slide"===e.mode&&e.loop===!0&&(b>=c.children().length?b=0:0>b&&(b=c.children().length));var d=b*(w+e.thumbMargin)-a;d+o>u&&(d=u-o-e.thumbMargin),0>d&&(d=0),this.move(c,d)},auto:function(){e.auto&&(x=setInterval(function(){g.goToNextSlide()},e.pause))},touchMove:function(a,b){if(p.css("transition-duration","0ms"),"slide"===e.mode){var c=a-b,d=t-c;if(d>=m-o-e.slideMargin)if(e.freeMove===!1)d=m-o-e.slideMargin;else{var f=m-o-e.slideMargin;d=f+(d-f)/5}else 0>d&&(e.freeMove===!1?d=0:d/=5);this.move(g,d)}},touchEnd:function(a){if(p.css("transition-duration",e.speed+"ms"),clearInterval(x),"slide"===e.mode){var b=!1,c=!0;t-=a,t>m-o-e.slideMargin?(t=m-o-e.slideMargin,e.autoWidth===!1&&(b=!0)):0>t&&(t=0);var d=function(a){var c=0;if(b||a&&(c=1),e.autoWidth)for(var d=0,f=0;f<h.length&&(d+=parseInt(h.eq(f).width())+e.slideMargin,q=f+c,!(d>=t));f++);else{var g=t/((v+e.slideMargin)*e.slideMove);q=parseInt(g)+c,t>=m-o-e.slideMargin&&g%1!==0&&q++}};a>=e.swipeThreshold?(d(!1),c=!1):a<=-e.swipeThreshold&&(d(!0),c=!1),g.mode(c),this.slideThumb()}else a>=e.swipeThreshold?g.goToPrevSlide():a<=-e.swipeThreshold&&g.goToNextSlide()},enableDrag:function(){var b=this;if(!y){var c=0,d=0,f=!1;p.find(".lightSlider").addClass("lsGrab"),p.on("mousedown",function(b){return o>m&&0!==m?!1:void("lSPrev"!==a(b.target).attr("class")&&"lSNext"!==a(b.target).attr("class")&&(c=e.vertical===!0?b.pageY:b.pageX,f=!0,b.preventDefault?b.preventDefault():b.returnValue=!1,p.scrollLeft+=1,p.scrollLeft-=1,p.find(".lightSlider").removeClass("lsGrab").addClass("lsGrabbing"),clearInterval(x)))}),a(window).on("mousemove",function(a){f&&(d=e.vertical===!0?a.pageY:a.pageX,b.touchMove(d,c))}),a(window).on("mouseup",function(g){if(f){p.find(".lightSlider").removeClass("lsGrabbing").addClass("lsGrab"),f=!1,d=e.vertical===!0?g.pageY:g.pageX;var h=d-c;Math.abs(h)>=e.swipeThreshold&&a(window).on("click.ls",function(b){b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopImmediatePropagation(),b.stopPropagation(),a(window).off("click.ls")}),b.touchEnd(h)}})}},enableTouch:function(){var a=this;if(y){var b={},c={};p.on("touchstart",function(a){c=a.originalEvent.targetTouches[0],b.pageX=a.originalEvent.targetTouches[0].pageX,b.pageY=a.originalEvent.targetTouches[0].pageY,clearInterval(x)}),p.on("touchmove",function(d){if(o>m&&0!==m)return!1;var f=d.originalEvent;c=f.targetTouches[0];var g=Math.abs(c.pageX-b.pageX),h=Math.abs(c.pageY-b.pageY);e.vertical===!0?(3*h>g&&d.preventDefault(),a.touchMove(c.pageY,b.pageY)):(3*g>h&&d.preventDefault(),a.touchMove(c.pageX,b.pageX))}),p.on("touchend",function(){if(o>m&&0!==m)return!1;var d;d=e.vertical===!0?c.pageY-b.pageY:c.pageX-b.pageX,a.touchEnd(d)})}},build:function(){var a=this;a.initialStyle(),this.doCss()&&(e.enableTouch===!0&&a.enableTouch(),e.enableDrag===!0&&a.enableDrag()),a.pager(),a.controls(),a.keyPress()}},d.build(),z.init=function(){z.chbreakpoint(),e.vertical===!0?(o=e.item>1?e.verticalHeight:h.outerHeight(),p.css("height",o+"px")):o=p.outerWidth(),e.loop===!0&&"slide"===e.mode&&z.clone(),z.calL(),"slide"===e.mode&&g.removeClass("lSSlide"),"slide"===e.mode&&(z.calSW(),z.sSW()),setTimeout(function(){"slide"===e.mode&&g.addClass("lSSlide")},1e3),e.pager&&z.createPager(),e.adaptiveHeight===!0&&e.vertical===!1&&g.css("height",h.eq(q).outerHeight(!0)),e.adaptiveHeight===!1&&("slide"===e.mode?e.vertical===!1?d.setHeight(g,!1):d.auto():d.setHeight(g,!0)),e.gallery===!0&&d.slideThumb(),"slide"===e.mode&&d.slide(),e.autoWidth===!1?h.length<=e.item?p.find(".lSAction").hide():p.find(".lSAction").show():z.calWidth(!1)<o&&0!==m?p.find(".lSAction").hide():p.find(".lSAction").show()},g.goToPrevSlide=function(){if(q>0)e.onBeforePrevSlide.call(this,g,q),q--,g.mode(!1),e.gallery===!0&&d.slideThumb();else if(e.loop===!0){if(e.onBeforePrevSlide.call(this,g,q),"fade"===e.mode){var a=l-1;q=parseInt(a/e.slideMove)}g.mode(!1),e.gallery===!0&&d.slideThumb()}else e.slideEndAnimation===!0&&(g.addClass("leftEnd"),setTimeout(function(){g.removeClass("leftEnd")},400))},g.goToNextSlide=function(){var a=!0;if("slide"===e.mode){var b=d.slideValue();a=b<m-o-e.slideMargin}q*e.slideMove<l-e.slideMove&&a?(e.onBeforeNextSlide.call(this,g,q),q++,g.mode(!1),e.gallery===!0&&d.slideThumb()):e.loop===!0?(e.onBeforeNextSlide.call(this,g,q),q=0,g.mode(!1),e.gallery===!0&&d.slideThumb()):e.slideEndAnimation===!0&&(g.addClass("rightEnd"),setTimeout(function(){g.removeClass("rightEnd")},400))},g.mode=function(a){e.adaptiveHeight===!0&&e.vertical===!1&&g.css("height",h.eq(q).outerHeight(!0)),n===!1&&("slide"===e.mode?d.doCss()&&(g.addClass("lSSlide"),""!==e.speed&&p.css("transition-duration",e.speed+"ms"),""!==e.cssEasing&&p.css("transition-timing-function",e.cssEasing)):d.doCss()&&(""!==e.speed&&g.css("transition-duration",e.speed+"ms"),""!==e.cssEasing&&g.css("transition-timing-function",e.cssEasing))),a||e.onBeforeSlide.call(this,g,q),"slide"===e.mode?d.slide():d.fade(),setTimeout(function(){a||e.onAfterSlide.call(this,g,q)},e.speed),n=!0},g.play=function(){clearInterval(x),g.goToNextSlide(),x=setInterval(function(){g.goToNextSlide()},e.pause)},g.pause=function(){clearInterval(x)},g.refresh=function(){z.init()},g.getCurrentSlideCount=function(){var a=q;if(e.loop){var b=p.find(".lslide").length,c=g.find(".clone.left").length;a=c-1>=q?b+(q-c):q>=b+c?q-b-c:q-c}return a+1},g.getTotalSlideCount=function(){return p.find(".lslide").length},g.goToSlide=function(a){q=e.loop?a+g.find(".clone.left").length-1:a,g.mode(!1),e.gallery===!0&&d.slideThumb()},setTimeout(function(){e.onSliderLoad.call(this,g)},10),a(window).on("resize orientationchange",function(a){setTimeout(function(){a.preventDefault?a.preventDefault():a.returnValue=!1,z.init()},200)}),this}}(jQuery);

/*
## featherlight
*/
!function(e){"use strict";function t(e,n){if(!(this instanceof t)){var r=new t(e,n);return r.open(),r}this.id=t.id++,this.setup(e,n),this.chainCallbacks(t._callbackChain)}if("undefined"==typeof e)return void("console"in window&&window.console.info("Too much lightness, Featherlight needs jQuery."));var n=[],r=function(t){return n=e.grep(n,function(e){return e!==t&&e.$instance.closest("body").length>0})},o=function(e,t){var n={},r=new RegExp("^"+t+"([A-Z])(.*)");for(var o in e){var i=o.match(r);if(i){var a=(i[1]+i[2].replace(/([A-Z])/g,"-$1")).toLowerCase();n[a]=e[o]}}return n},i={keyup:"onKeyUp",resize:"onResize"},a=function(n){e.each(t.opened().reverse(),function(){return n.isDefaultPrevented()||!1!==this[i[n.type]](n)?void 0:(n.preventDefault(),n.stopPropagation(),!1)})},s=function(n){if(n!==t._globalHandlerInstalled){t._globalHandlerInstalled=n;var r=e.map(i,function(e,n){return n+"."+t.prototype.namespace}).join(" ");e(window)[n?"on":"off"](r,a)}};t.prototype={constructor:t,namespace:"featherlight",targetAttr:"data-featherlight",variant:null,resetCss:!1,background:null,openTrigger:"click",closeTrigger:"click",filter:null,root:"body",openSpeed:250,closeSpeed:250,closeOnClick:"background",closeOnEsc:!0,closeIcon:"&#10005;",loading:"",persist:!1,otherClose:null,beforeOpen:e.noop,beforeContent:e.noop,beforeClose:e.noop,afterOpen:e.noop,afterContent:e.noop,afterClose:e.noop,onKeyUp:e.noop,onResize:e.noop,type:null,contentFilters:["jquery","image","html","ajax","iframe","text"],setup:function(t,n){"object"!=typeof t||t instanceof e!=!1||n||(n=t,t=void 0);var r=e.extend(this,n,{target:t}),o=r.resetCss?r.namespace+"-reset":r.namespace,i=e(r.background||['<div class="'+o+"-loading "+o+'">','<div class="'+o+'-content">','<span class="'+o+"-close-icon "+r.namespace+'-close">',r.closeIcon,"</span>",'<div class="'+r.namespace+'-inner">'+r.loading+"</div>","</div>","</div>"].join("")),a="."+r.namespace+"-close"+(r.otherClose?","+r.otherClose:"");return r.$instance=i.clone().addClass(r.variant),r.$instance.on(r.closeTrigger+"."+r.namespace,function(t){var n=e(t.target);("background"===r.closeOnClick&&n.is("."+r.namespace)||"anywhere"===r.closeOnClick||n.closest(a).length)&&(r.close(t),t.preventDefault())}),this},getContent:function(){if(this.persist!==!1&&this.$content)return this.$content;var t=this,n=this.constructor.contentFilters,r=function(e){return t.$currentTarget&&t.$currentTarget.attr(e)},o=r(t.targetAttr),i=t.target||o||"",a=n[t.type];if(!a&&i in n&&(a=n[i],i=t.target&&o),i=i||r("href")||"",!a)for(var s in n)t[s]&&(a=n[s],i=t[s]);if(!a){var c=i;if(i=null,e.each(t.contentFilters,function(){return a=n[this],a.test&&(i=a.test(c)),!i&&a.regex&&c.match&&c.match(a.regex)&&(i=c),!i}),!i)return"console"in window&&window.console.error("Featherlight: no content filter found "+(c?' for "'+c+'"':" (no target specified)")),!1}return a.process.call(t,i)},setContent:function(t){var n=this;return(t.is("iframe")||e("iframe",t).length>0)&&n.$instance.addClass(n.namespace+"-iframe"),n.$instance.removeClass(n.namespace+"-loading"),n.$instance.find("."+n.namespace+"-inner").not(t).slice(1).remove().end().replaceWith(e.contains(n.$instance[0],t[0])?"":t),n.$content=t.addClass(n.namespace+"-inner"),n},open:function(t){var r=this;if(r.$instance.hide().appendTo(r.root),!(t&&t.isDefaultPrevented()||r.beforeOpen(t)===!1)){t&&t.preventDefault();var o=r.getContent();if(o)return n.push(r),s(!0),r.$instance.fadeIn(r.openSpeed),r.beforeContent(t),e.when(o).always(function(e){r.setContent(e),r.afterContent(t)}).then(r.$instance.promise()).done(function(){r.afterOpen(t)})}return r.$instance.detach(),e.Deferred().reject().promise()},close:function(t){var n=this,o=e.Deferred();return n.beforeClose(t)===!1?o.reject():(0===r(n).length&&s(!1),n.$instance.fadeOut(n.closeSpeed,function(){n.$instance.detach(),n.afterClose(t),o.resolve()})),o.promise()},chainCallbacks:function(t){for(var n in t)this[n]=e.proxy(t[n],this,e.proxy(this[n],this))}},e.extend(t,{id:0,autoBind:"[data-featherlight]",defaults:t.prototype,contentFilters:{jquery:{regex:/^[#.]\w/,test:function(t){return t instanceof e&&t},process:function(t){return this.persist!==!1?e(t):e(t).clone(!0)}},image:{regex:/\.(png|jpg|jpeg|gif|tiff|bmp|svg)(\?\S*)?$/i,process:function(t){var n=this,r=e.Deferred(),o=new Image,i=e('<img src="'+t+'" alt="" class="'+n.namespace+'-image" />');return o.onload=function(){i.naturalWidth=o.width,i.naturalHeight=o.height,r.resolve(i)},o.onerror=function(){r.reject(i)},o.src=t,r.promise()}},html:{regex:/^\s*<[\w!][^<]*>/,process:function(t){return e(t)}},ajax:{regex:/./,process:function(t){var n=e.Deferred(),r=e("<div></div>").load(t,function(e,t){"error"!==t&&n.resolve(r.contents()),n.fail()});return n.promise()}},iframe:{process:function(t){var n=new e.Deferred,r=e("<iframe/>").hide().attr("src",t).css(o(this,"iframe")).on("load",function(){n.resolve(r.show())}).appendTo(this.$instance.find("."+this.namespace+"-content"));return n.promise()}},text:{process:function(t){return e("<div>",{text:t})}}},functionAttributes:["beforeOpen","afterOpen","beforeContent","afterContent","beforeClose","afterClose"],readElementConfig:function(t,n){var r=this,o=new RegExp("^data-"+n+"-(.*)"),i={};return t&&t.attributes&&e.each(t.attributes,function(){var t=this.name.match(o);if(t){var n=this.value,a=e.camelCase(t[1]);if(e.inArray(a,r.functionAttributes)>=0)n=new Function(n);else try{n=e.parseJSON(n)}catch(s){}i[a]=n}}),i},extend:function(t,n){var r=function(){this.constructor=t};return r.prototype=this.prototype,t.prototype=new r,t.__super__=this.prototype,e.extend(t,this,n),t.defaults=t.prototype,t},attach:function(t,n,r){var o=this;"object"!=typeof n||n instanceof e!=!1||r||(r=n,n=void 0),r=e.extend({},r);var i,a=r.namespace||o.defaults.namespace,s=e.extend({},o.defaults,o.readElementConfig(t[0],a),r);return t.on(s.openTrigger+"."+s.namespace,s.filter,function(a){var c=e.extend({$source:t,$currentTarget:e(this)},o.readElementConfig(t[0],s.namespace),o.readElementConfig(this,s.namespace),r),l=i||e(this).data("featherlight-persisted")||new o(n,c);"shared"===l.persist?i=l:l.persist!==!1&&e(this).data("featherlight-persisted",l),c.$currentTarget.blur(),l.open(a)}),t},current:function(){var e=this.opened();return e[e.length-1]||null},opened:function(){var t=this;return r(),e.grep(n,function(e){return e instanceof t})},close:function(e){var t=this.current();return t?t.close(e):void 0},_onReady:function(){var t=this;t.autoBind&&(e(t.autoBind).each(function(){t.attach(e(this))}),e(document).on("click",t.autoBind,function(n){n.isDefaultPrevented()||"featherlight"===n.namespace||(n.preventDefault(),t.attach(e(n.currentTarget)),e(n.target).trigger("click.featherlight"))}))},_callbackChain:{onKeyUp:function(t,n){return 27===n.keyCode?(this.closeOnEsc&&e.featherlight.close(n),!1):t(n)},onResize:function(e,t){if(this.$content.naturalWidth){var n=this.$content.naturalWidth,r=this.$content.naturalHeight;this.$content.css("width","").css("height","");var o=Math.max(n/parseInt(this.$content.parent().css("width"),10),r/parseInt(this.$content.parent().css("height"),10));o>1&&this.$content.css("width",""+n/o+"px").css("height",""+r/o+"px")}return e(t)},afterContent:function(e,t){var n=e(t);return this.onResize(t),n}}}),e.featherlight=t,e.fn.featherlight=function(e,n){return t.attach(this,e,n)},e(document).ready(function(){t._onReady()})}(jQuery);

/*
## continue shopping button closes modal and stays on page
## NOT WORKING YET
*/
// $('#fastCartContainer .btn.KeepShopping').click(function() {
//   preventDefault();
//   modal.close();
// });
