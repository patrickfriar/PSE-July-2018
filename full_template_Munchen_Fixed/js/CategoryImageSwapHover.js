$(document).ready(function(){

  reFire();

  $(document).ajaxComplete(function() {reFire(); });

    function reFire(){

      if ($('.ProductImage').length > 0) {

      $('.ProductImage').each(function() { //Looks for any element with the class of ProductImage.
        var image = $(this).find('img'); // The Image inside ProductImage
        var theHref = window.location.href;
        var useHref;

      if (theHref.indexOf("ps://") > 0) {
        var grabRef = $(this).find('a').attr('href');
        var newRef = grabRef.replace("http://" , "https://")
        useHref = newRef;
      }

      else {
        useHref = $(this).find('a').attr('href');
      }

      if ($(this).hasClass("hoverPend") == false) {

        $(this).addClass("hoverPend");

        $.ajax({
          context: 'this',
          url: useHref, // Get the URL inside the element ProductImage (product URL)
          type: "GET", //GET METHOD
          success: function(data) { //If successful
            image.attr('data-image',image.attr('src'));
            if (data.indexOf("ThumbURLs[1]") > -1) { //Checks to see if there is another image.

              var image2 = "https://" + data.match(/ThumbURLs\[1\] = "(.*?)"/);  //Regular Expression to grab the second image

              var alt = image2.split(',');
              var altImage = alt[0].split(' = "');
              if(typeof  altImage[1] != 'undefined'){
              var secondImage = altImage[1].replace('"','').replace(/\\\//g, "/");

                image.attr('data-alt-image',secondImage); //Sets the second image as the alt image.
              }
            };
          }
        });
      }

      $(this).hover( //When the ProductImage is hovered show the alt image.
        function() {
          if(image.attr('data-alt-image')) {
            image.attr('src',image.attr('data-alt-image'));
          };
        },
        function() {
          image.attr('src',image.attr('data-image')); //Show normal image for non-hover state.
        }
      );

    });

    }
  }
});