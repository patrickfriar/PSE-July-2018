      //Start purchase Grid
          function k_combinations(set, k) {
        var i, j, combs, head, tailcombs;
        
        if (k > set.length || k <= 0) {
            return [];
        }
        
        if (k == set.length) {
            return [set];
        }
        
        if (k == 1) {
            combs = [];
            for (i = 0; i < set.length; i++) {
                combs.push([set[i]]);
            }
            return combs;
        }
        
        // Assert {1 < k < set.length}
        
        combs = [];
        for (i = 0; i < set.length - k + 1; i++) {
            head = set.slice(i, i+1);
            tailcombs = k_combinations(set.slice(i + 1), k - 1);
            for (j = 0; j < tailcombs.length; j++) {
                combs.push(head.concat(tailcombs[j]));
            }
        }
        return combs;
    }
    function combinations(set){
        var k, i, combs, k_combs;
        combs = [];
        // Calculate all non-empty k-combinations
        for (k = 1; k <= set.length; k++) {
            k_combs = k_combinations(set, k);
            for (i = 0; i < k_combs.length; i++) {
                combs.push(k_combs[i]);
            }
        }
        return combs;
    }

function sortOptions(nth){
values = [];
$(".option>li:nth-child("+nth+")").each(function(){
if($.inArray($(this).text().trim(),values) == -1){
values.push($(this).text().trim());
}
});
values = values.sort();

$(values).each(function(i,x){
    $(".option").each(function(){
        if($(this).text().indexOf(x) > -1){
        $(".purchasegrid").append($(this));
        }
    });
});
}

function output(publish,fieldNames){
$("body").append("<div class='gridDrawer'><p class='h2'></p><div class='h3'></div><div class='price'></div><div class='sku'></div></div>");
    output = "";

            output = "<div class='purchasegrid _"+OptionGroup.length+"'>";
                $(fieldNames).each(function(a,x){
                    nth = a+4;
                    output = output;
                });
            output = output;

        $(publish).each(function(a,b){
            output = output + "<span class='option'>";    
            
            for (i = 0; i < b.length; i++){
               
                if($.isArray(b[i]) === true){
                output = output + "<span class='optionValue'>"+b[i][1]+"</span>";
                }
                else{
                    if(i == 2){
                    output = output + "<span class='addToCartAttr'>"+b[i]+"</span>";
                    }
                    if(i == 3){
                    output = output + "<span class='stock'>"+b[i]+"</span>";
                    }
                     if(i == 4){
                    output = output + "<span class='image'>"+b[i]+"</span>";
                    }
                    if(i == 5){
                     output = output + "<span class='price'>"+b[i]+"</span>";   
                    }
                     if(i == 6){
                     output = output + "<span class='sku'>"+b[i]+"</span>";   
                    }

                }
            }
            output = output + "</span>";
            });
            output = output + "</div>";
            array = new Array;

    nextthing = $.when($(".productAttributeList").html(output)).then(function(){
            array = new Array;
            $(".option li:nth-child(4)").each(function(){
                array.push($(this).text());
                unique(array);
            });
            //orders by size
        $('.option').each(function() {
            var txt1 = $(this).children('.optionValue:nth-child(2)').text();
            $(this).data('name', txt1);
        });
        var items = $('.option');
        items.sort(function(a, b) {
            var chA = $(a).data('name');
            var chB = $(b).data('name');
            if (chA < chB) return -1;
            if (chA > chB) return 1;
            return 0;
        });
        var grid = $('.productAttributeList');
        $(grid).append(items);
        });
        //orders by color
        $('.option').each(function() {
            var txt1 = $(this).children('.optionValue:nth-child(1)').text();
            $(this).data('name', txt1);
        });
        var items = $('.option');
        items.sort(function(a, b) {
            var chA = $(a).data('name');
            var chB = $(b).data('name');
            if (chA < chB) return -1;
            if (chA > chB) return 1;
            return 0;
        });
        
      //wraps colors in div
        wraps = [];
        $(".option .optionValue:first-child").each(function(i,x) {
            txt=$(x).text(); 
     
            wraps[i] = txt;
        });
        unique(wraps);
        

        $(wraps).each(function(i,x){
             cleanTxt = x.replace(/ /g, '').replace('/', '');
           
            $(".option:contains('" + x + "')").wrapAll("<div class='sizeWrap "+cleanTxt+"'></div>");
        });

    $(".productAddToCartRight").slideDown("slow");

window.setTimeout(cleanUp, 500);
}


function purchaseGrid(){
    if($("select.validation").length !== 0){
    $(".productAddToCartRight").before("<div class='loadwheel' style='clear:both; text-align:center'><img src='http://cdn3.bigcommerce.com/s-b12ipdx9/templates/__custom/images/loader.gif'></div>");
    $(".productAddToCartRight").hide();
    $(".Label.QuantityInput").hide();
    $(".productAttributeList").addClass("table");

    sku = $(".VariationProductSKU").text().trim();

    OptionGroup = new Array();
    fieldNames = [];
    combinations = [];
    attributes = [];
    publish = [];
    $("select.validation").each(function(){
        var obj = {};
        var options = [];
        fieldName = $(this).parents(".productAttributeRow").find(".name").text().trim().replace(":","");
        fieldNames.push(fieldName);
        attribute = $(this).attr("name");
        attributes.push(attribute);
        var key = fieldName;
        $(this).find("option").each(function(){
            if($(this).val().length > 0){
                var item =[$(this).text(),attribute + "=" + $(this).val()];
                combinations.push(attribute + "=" + $(this).val());
                options.push(item);
            }
        });
        obj[key] = options;
        OptionGroup.push(obj);
    });

    array = [];
    for (a = 0; a < OptionGroup.length; a++){
        $(OptionGroup[a][fieldNames[a]]).each(function(i,x){
            array.push(x[1]+"|"+fieldNames[a]+"="+x[0]);
        });
    }


    combinations = k_combinations(array,OptionGroup.length);
        all = 0;
        processed = 0;
    var each = $(combinations).each(function(i,x){
    
        score = 0;
        check = x.join("&");

        $(attributes).each(function(a,b){
            if(check.indexOf(b) !== -1){
                score++;
            }
        });
        
        if(score == OptionGroup.length){
            all = all +1;
            getData = "?product_id=" + productId+'&w=getProductAttributeDetails&'+check;
            pass =  productId+"&"+check;
            pass = pass.split("&");
            $(pass).each(function(i,x){
                o = x.split("|");
                pass[i] = o[0];
            });
            var pass1 = pass.join("&");

            $.get('../remote.php'+getData,function(data){
                
                if(data.details.purchasable == true && sku !== data.details.sku){
                    
                    values = [];
                    $(combinations[i]).each(function(a,b){
                        info = b.split("|")[1].split("=");
                        values.push(info);
                    });

                    publish.push(values);
                    values.push(pass1);
                    values.push(data.details.instock);
                    values.push(data.details.image);
                    values.push(data.details.price);
                    values.push(data.details.sku);
                }    
            }).done(function(){
                processed = processed + 1;
                if(all == processed){

                    output(publish,fieldNames);        
                $(".loadwheel").slideUp();
                
                $(".DetailRow.qty").remove();
                qtyBox ="<input type='text' name='qty' size='4'  placeholder='0'>";
                 $(".option").append(qtyBox);

                 $("input[name='qty']").change(function(){
                    normURL = $(".singleAddToCart").attr("href");
                    if(normURL.indexOf("qty[]") > 0){
                        explode = normURL.split("&qty[]");
                        explode.pop();
                        newURL = explode.join("&");
                        newURL = newURL + "&qty[]="+$(this).val(); 
                        
                    }
                    else{
                        newURL = normURL + "&qty[]="+$(this).val();
                    }
                        $(this).next(".singleAddToCart").attr("href",newURL);
                });
                    $(".btn#addToCart").click(function(e){     
                        add = new Array;
                        e.preventDefault();
                        $(".option input[name='qty']").each(function(){
                        qty = $(this).val();
                        addToCartVar = $(this).parent().find(".addToCartAttr").text().trim()+"&qty[]="+qty;
                            if(qty > 0){
                                add.push("/cart.php?action=add&product_id="+addToCartVar);
                            }
                        });
                    addtocart = $(add).each(function(){
                    $.ajax({
                             url:    this,
                             success: function(result) {
                                          if(result.isOk == false)
                                              alert(result.message);
                                      },
                             async:   false
                        });         
                    });
                    $.when(addtocart).then(function(){
                        window.location.href = "/cart.php";
                    });
                    });
                }
            });
        }
    });
    $(".AddCartButton").val("ADD SELECTED TO CART");
    $(".AddCartButton").show();
}
else{
    $("h2:contains('Product Options')").hide();
}



}







//CleanUp Function
  cleanUp =   function(){
        size = [];
        color = [];
        $(".productAttributeList").prepend("<div class='optionHeader'><span class='size'></span></div>");
        $(".productAttributeList > .sizeWrap .option").each(function(i,x){
            var sizeValue = $(this).find(".optionValue:nth-child(2)").text();
            size[i] = sizeValue;
            // $(".optionHeader").append("<span class='color'>" + sizeValue + "</span>");
        });
        $(".sizeWrap .option:last-child").each(function(i,x){
            var colorValue = $(this).find(".optionValue:first-child").text();
            color[i] = colorValue;
           $(this).parent().prepend("<span class='size'>" + colorValue + "</span>");
        });

        color = unique(color);
        size = unique(size);
        cols = size.length;
        rows = Number($(".sizeWrap").length);
        for (i = 0; i < rows; i++) { 
            check = $(".sizeWrap").eq(i).find(".option>.optionValue:nth-child(2)").length;
            if(check == cols){
            $(".sizeWrap").eq(i).find(".option>.optionValue:nth-child(2)").each(function(k,v){
                size[k] = $(v).text();
             $(".optionHeader").append("<span class='color'>" + $(v).text() + "</span>"); 
            });
                break;  
            }
        }

        active = [];
        for (i = 0; i < rows; i++) { 
            check = $(".sizeWrap").eq(i).find(".option").length;
            if(check == cols){

            }
            else{
                newRow = "";
                active[i] = size.slice();
                missing = size.slice();
                $(".sizeWrap").eq(i).find(".option>.optionValue:nth-child(2)").each(function(key,value){
                    checkValue = $(value).text();
                    
                    pos = size.indexOf(checkValue);
                    if(pos > -1){
                        active[i][pos] = "<span class='option'>"+$(value).parent().html()+"</span>";                
                        removeItem = checkValue;
                       
                        missing = $.grep(missing, function(val) {
                              return val != removeItem;
                            });
                    }
                       

                    $(missing).each(function(a,b){
                        pos = size.indexOf(b);
                        active[i][pos] = "<div class='option "+b+" disabled'><input type=\"text\" name=\"qty\" size=\"4\" placeholder=\"&#216;\" disabled></div>";
                    });

                    newRow =  active[i].join("");
                    newRow = newRow + "<span class='size'>"+$(".sizeWrap").eq(i).find(".size").text()+"</span>";
                      $(".sizeWrap").eq(i).html(newRow);
                });

                $(".sizeWrap>.size").each(function(){
                        $(this).parent().prepend($(this));
                });

            }
        }

        $(".stock:contains('false')").parent().find("input").attr("placeholder","Ø");
        $(".stock:contains('false')").parent().find("input").attr("disabled", true);
        $(".stock:contains('false')").parent().addClass("disabled");


$(".option>input").focus(function(){
    $(".gridDrawer .h2").text($(this).parent().parent().find(".size").text());
     $(".gridDrawer .h3").text("Size: " + $(this).parent().find(".optionValue").last().text());
     $(".gridDrawer .price").text($(this).parent().find(".price").last().text());
     $(".gridDrawer .sku").text($(this).parent().find(".sku").last().text());
     $(".gridDrawer").slideDown();
});
$(".option>input").focusout(function(){
    $(".gridDrawer").slideUp();
});

    }

if ($(".custyGroup:contains('Wholesale')").length>-1){
    if ($(window).width() > 650) {
        purchaseGrid();
    };
};

function unique(array) {
    return $.grep(array, function(el, index) {
        return index == $.inArray(el, array);
    });
}