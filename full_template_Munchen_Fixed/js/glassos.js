function lib_Envora() { this.BC_label = function(e, t, i) {
      function o(e) {
         var t = { list: [], label: "" };
         e = $.extend({}, t, e), $.each(a, function() { e.list.indexOf($("[data-product]", this).eq(0).attr("data-product")) > -1 ? $(".list_label", this).append("<div class='label_" + e.label + "'></div>") : $(".list_label", this).remove() }) }

      function s(e) {
         var t = { url: "/rss.php?type=rss", class_label: "label_new" };
         e = $.extend({}, t, e);
         var i = {};
         i.url = e.url, i.dataType = "html", i.success = function(t) { t = t.replace(/(\r\n|\n|\r)/gm, "");
            for (var i = [], s = [], a = /isc\:productid(.*?)isc\:productid/g; i = a.exec(t);) s.push(i[1].replace(/\D+/g, ""));
            o({ list: s, label: e.class_label }) }, $.ajax(i) }
      t || (t = ["new", "feature"]);
      var a = $(e).find(".ProductList>*");
      if ($(a).append("<div class='list_label'></div>"), i) {
         var n = {};
         n.url = config.ShopPath, n.success = function(e) {
            for (var i = { "new": ".new-product-owl.ProductList>*", feature: ".feature-product-owl.ProductList>*" }, s = { "new": [], feature: [] }, a = 0; a < t.length; a++) {
               var n = t[a];
               if (i[n]) {
                  var r = $(e).find(i[n]);
                  $.each(r, function() { s[n].push($("[data-product]", this).eq(0).attr("data-product")) }) } }
            for (var a = 0; a < t.length; a++) o({ list: s[t[a]], label: t[a] }) }, $.ajax(n) } else t.indexOf("new") > -1 && s({ url: "/rss.php?type=rss", class_label: "new" }), t.indexOf("feature") > -1 && s({ url: "/rss.php?action=popularproducts&type=rss", class_label: "feature" }) } }

function smallWindow() {
   return jQuery("#ToggleMenu").is(":visible") }

function initSaleLabel() { jQuery(".ProductList li").each(function() { jQuery(this).find(".SalePrice").length > 0 && jQuery(this).append("<span class='saleItem'></span>") }) }

function initSaleLabelSlide() { jQuery(".ProductList .p-price").each(function() { jQuery(this).find(".SalePrice").length > 0 && jQuery(this).parent().append("<span class='saleItem'></span>") }) }

function initBreadscrumb() {
   if (jQuery("#CategoryBreadcrumb").length > 0) {
      var e = jQuery("#CategoryBreadcrumb ul li:eq(1)").text();
      jQuery("#SideCategoryList ul > li > a").each(function() { jQuery(this).text() != e && jQuery(this).text() != e + " »" || jQuery(this).parent().addClass("active") }) } }

function loadMoreHomepage() {
   if (jQuery(".infinite-scrolling-homepage a").length > 0) {
      var e = 10;
      jQuery(".ProductList li");
      jQuery(".infinite-scrolling-homepage a").click(function() { jQuery(".ProductList li:hidden").length > 0 && (jQuery(".ProductList li:hidden:lt(" + e + ")").show(), jQuery("window").scroll(), 0 == jQuery(".ProductList li:hidden").length && jQuery(".infinite-scrolling-homepage a").text("No more products").addClass("disabled")) }) } }

function initBacktoTop() { jQuery("#back-top a").click(function() {
      return jQuery("body,html").animate({ scrollTop: 0 }, 800), !1 }) }

function hqCurrencyChange() { $(".currency-converter .Sel").each(function() { $(".currency-converter p span").attr("title") == $(this).find(".Text").html() && $(".currency-converter p").html($(this).html()) }) }

function hqAnimate() {
   var e = 0;
   $(".ProductListShow").children().each(function() { $(this).attr("data-wow-delay", 100 * e + "ms"), e++, 10 == e && (e = 0) }), $(".ProductList").children().each(function() { $(this).attr("data-wow-delay", 100 * e + "ms"), e++, 10 == e && (e = 0) }) }

function SideBarDropDown() {
   var e = (jQuery(".SideCategoryListFlyout").find("ul.sf-menu > li").addClass("HLMenuLevel1"), jQuery(".SideCategoryListFlyout").eq(2).find("ul.sf-menu"));
   e.removeClass("sf-menu"), e.find("li").unbind().has("ul").addClass("dropdown"), e.find("li.dropdown > a").after("<span class='toogleClick'>+</span>"), e.find("li ul").removeAttr("style").addClass("dropdown-menu");
   var t = e.find('a[href$="' + location.pathname + '"]');
   t.length > 0 && (t.addClass("active"), t.parents("ul.dropdown-menu").show(), t.parents("li.dropdown").addClass("ActivetoogleClick")), jQuery("span.toogleClick").click(function() { "+" == jQuery(this).text() ? (jQuery(this).parent().parent().find(" li ul.dropdown-menu").slideUp("slow"), jQuery(this).parent().parent().find(" li span.toogleClick").text("+"), jQuery(".ActivetoogleClick").removeClass("ActivetoogleClick"), jQuery(this).parent("li").children("ul.dropdown-menu").is(":animated") || (jQuery(this).parent("li").children("ul.dropdown-menu").find("span").removeClass("ClosetoogleClick"), jQuery(this).parent("li").children("ul.dropdown-menu").slideDown("slow"), jQuery(this).text("-"), jQuery(this).parent().addClass("ActivetoogleClick"))) : "-" == jQuery(this).text() && (jQuery(this).parent().parent().find(" li ul.dropdown-menu").is(":animated") || (jQuery(".sf-horizontal li").removeClass("ActivetoogleClick"), jQuery(".sf-horizontal li > a").removeClass("ClosetoogleClick"), jQuery(this).parent("li").removeClass("ActivetoogleClick").find("span").removeClass("ClosetoogleClick"), jQuery(this).parent().parent().find(" li ul.dropdown-menu").find("span").removeClass("ClosetoogleClick"), jQuery(this).parent().parent().find(" li ul.dropdown-menu").slideUp("slow"), jQuery(this).text("+"))) }) }

function hqShowSidebarLeft() { $(document).width() <= 990 ? $(".Left .HL_ContentLeft").hide() : $(".Left .HL_ContentLeft").show() }

function SlideBannerTop() { jQuery(".SlideBannerTop .slides").length > 0 && jQuery(".SlideBannerTop .slides").owlCarousel({ items: 5, itemsCustom: !1, itemsDesktop: [1199, 5], itemsDesktopSmall: [980, 4], itemsTablet: [768, 2], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"] }) }

function HomeNewProducts() { jQuery("#HomeNewProducts .ProductList").length > 0 && jQuery("#HomeNewProducts .ProductList").owlCarousel({ items: 5, itemsCustom: !1, itemsDesktop: [1199, 4], itemsDesktopSmall: [980, 3], itemsTablet: [768, 2], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"], beforeInit: function() { Envora.BC_label($("#HomeNewProducts"), "new") } }) }

function HomeFeaturedProducts() { jQuery("#HomeFeaturedProducts .ProductList").length > 0 && jQuery("#HomeFeaturedProducts .ProductList").owlCarousel({ items: 5, itemsCustom: !1, itemsDesktop: [1199, 4], itemsDesktopSmall: [980, 3], itemsTablet: [768, 2], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"], beforeInit: function() { Envora.BC_label($("#HomeFeaturedProducts"), "new") } }) }

function SimilarMultiProductsByCustomerViews() { jQuery("#SimilarMultiProductsByCustomerViews .ProductList").length > 0 && jQuery("#SimilarMultiProductsByCustomerViews .ProductList").owlCarousel({ items: 5, itemsCustom: !1, itemsDesktop: [1199, 4], itemsDesktopSmall: [980, 2], itemsTablet: [768, 2], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"], beforeInit: function() { Envora.BC_label($("#SimilarMultiProductsByCustomerViews"), "new") } }) }

function SideRelatedProducts() { jQuery(".SideRelatedProducts .ProductList").length > 0 && jQuery(".SideRelatedProducts .ProductList").owlCarousel({ items: 4, itemsCustom: !1, itemsDesktop: [1199, 3], itemsDesktopSmall: [980, 2], itemsTablet: [768, 2], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"], beforeInit: function() { Envora.BC_label($(".SideRelatedProducts"), "new") } }) }

function SimilarProductsByCustomerViews() { jQuery("#SimilarProductsByCustomerViews .ProductList").length > 0 && jQuery("#SimilarProductsByCustomerViews .ProductList").owlCarousel({ items: 4, itemsCustom: !1, itemsDesktop: [1199, 3], itemsDesktopSmall: [980, 2], itemsTablet: [768, 2], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"], beforeInit: function() { Envora.BC_label($("#SimilarProductsByCustomerViews"), "new") } }) }
var Envora = new lib_Envora;
jQuery(window).scroll(function() { jQuery(this).scrollTop() > 100 ? jQuery("#back-top").fadeIn() : jQuery("#back-top").fadeOut() }), jQuery(document).ready(function() {
   var e = jQuery(".header").outerHeight();
   jQuery(window).scroll(function() {
      var t = jQuery(this).scrollTop();
      t > e + 200 ? (jQuery(".header").addClass("on fadeInDown"), jQuery("body").addClass("bodyfixed"), jQuery("body.bodyfixed .main").css("margin-top", e)) : (jQuery(".header").removeClass("on fadeInDown"), jQuery("body").removeClass("bodyfixed"), jQuery("body .main").css("margin-top", "0px")) }) }), $("#HomeProducts a").click(function(e) { $('#HomeProducts a[href="#profile"]').tab("show"), $("#HomeProducts a:first").tab("show"), $("#HomeProducts a:last").tab("show"), e.preventDefault(), $(this).tab("show") }), $(".tabNavigation a").click(function(e) { $('.tabNavigation a[href="#profile"]').tab("show"), $(".tabNavigation a:first").tab("show"), $(".tabNavigation a:last").tab("show"), e.preventDefault(), $(this).tab("show") }), jQuery(document).ready(function() { $("#CategoryContent .ProductList").removeClass("List"), $("#CategoryContent .ProductList > li").removeClass("ListView"), $("#CategoryContent.ProductList").hasClass("List") ? $("#CategoryContent #List").addClass("ActionMode") : $("#Grid").addClass("ActionMode"), $("#Grid").on("click", function() { $("#CategoryContent .ProductList").removeClass("List"), $("#CategoryContent .ProductList > li").removeClass("ListView"), $(".Show").removeClass("ActionMode"), $(this).addClass("ActionMode") }), $("#List").on("click", function() { $("#CategoryContent .ProductList").addClass("List"), $("#CategoryContent .ProductList > li").addClass("ListView"), $(".Show").removeClass("ActionMode"), $(this).addClass("ActionMode") }) }), jQuery(document).ready(function() { initBreadscrumb(), initBacktoTop(), SideBarDropDown(), loadMoreHomepage(), smallWindow(), SimilarMultiProductsByCustomerViews(), SideRelatedProducts(), SimilarProductsByCustomerViews(), HomeFeaturedProducts(), HomeNewProducts(), SlideBannerTop(), hqCurrencyChange(), /*hqAnimate(),*/ hqShowSidebarLeft(), $(".Left .HL_mobileshow").on("click", function(e) { $(document).width() <= 990 && ($(".Left .HL_ContentLeft").hasClass("active") ? $(".Left .HL_ContentLeft").removeClass("active") : $(".Left .HL_ContentLeft").addClass("active"), $(".Left .HL_ContentLeft").toggle()) }) }), jQuery(document).ready(function() { jQuery(".side-menu > ul > li").has("ul").addClass("menu-parent"), jQuery(".PageMenu .CategoryList > div > div > ul > li").children("ul").addClass("menu-container-level-1") }), jQuery(document).ready(function() { jQuery(".BrandsSlider").length > 0 && jQuery(".BrandsSlider").owlCarousel({ items: 1, itemsCustom: !1, itemsDesktop: [1199, 5], itemsDesktopSmall: [980, 4], itemsTablet: [768, 3], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"] }) }), jQuery(document).ready(function() { jQuery("#home #SideTopSellers .ProductList").length > 0 && jQuery("#home #SideTopSellers .ProductList").owlCarousel({ items: 1, itemsCustom: !1, itemsDesktop: [1199, 1], itemsDesktopSmall: [991, 3], itemsTablet: [768, 2], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"], beforeInit: function() { Envora.BC_label($("#home #SideTopSellers"), "new") } }) }), jQuery(document).ready(function() {
   function e() {
      return jQuery(".Left #SideTopSellers .ProductList").length > 0 }
   jQuery("#SideTopSellers .ProductList").length > 0 && jQuery("#SideTopSellers .ProductList").owlCarousel({ items: 1, itemsCustom: !1, itemsDesktop: [1199, 1], itemsDesktopSmall: [991, 1], itemsTablet: [768, 1], itemsTabletSmall: !1, itemsMobile: [479, 1], singleItem: !1, itemsScaleUp: !1, navigation: !0, navigationText: ["prev", "next"], autoHeight: e(), beforeInit: function() { Envora.BC_label($("#SideTopSellers"), "new") } }) }), jQuery(document).ready(function() { jQuery(".ProductDetailsGrid div.PriceRow").has("strike").addClass("DetailSalePrice"), jQuery(".top-menu-search").click(function(e) { $(this).hasClass("top-search-expanded") ? ($(this).removeClass("top-search-expanded"), $(".TopHeader > .container #SearchForm").remove()) : ($(this).addClass("top-search-expanded"), $(".header-secondary #SearchForm").clone().prependTo(".TopHeader > .container")) }), Envora.BC_label($("#CategoryContent"), "new"), Envora.BC_label($(".SearchContainer"), "new"), initSaleLabelSlide() });
jQuery(document).ready(function($) {
   if (!jQuery('#CategoryContent .ProductList').children().length > 0) {
      jQuery('.product-nav').hide();
      jQuery('#CategoryContent').hide();
   }
});
