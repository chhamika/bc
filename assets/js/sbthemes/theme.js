/* eslint-disable */
import $ from 'jquery';
import carousel from '../theme/common/carousel';
import utils from '@bigcommerce/stencil-utils';
import collapsibleFactory from '../theme/common/collapsible';
import 'jquery-countdown';
export default function (context) {
  
    // ========================================================================
    // Show Back To Top
    // ========================================================================
    function backScrollToTop() {
        const backtotop = $('.back-totop');
        const backPanelToggle = $('.back-panel-toggle');
        const backPanelShares = $('.back-panel-shares');
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
         backtotop.addClass("hidden-top");
        $(window).scroll(function () {
            if ($(this).scrollTop() === 0) {
                backtotop.addClass("hidden-top")
            } else {
                backtotop.removeClass("hidden-top")
            }
        });

        backtotop.click(function () {
            $('body,html').animate({scrollTop:0}, 500);
            return false;
        });
        backPanelToggle.on('click',function() {
            $(this).toggleClass('active');
            backPanelShares.toggleClass('active');
        });
        if (windowWidth > 1200 ) {
            backPanelToggle.removeClass('active');
            backPanelShares.removeClass('active');
        }else{
            backPanelToggle.addClass('active');
            backPanelShares.addClass('active');
        }
        
    }
     $(window).resize(function() {
         //alert(2);
        //backScrollToTop();
    });
    $(document).ready(function () {
        backScrollToTop();
    });
    
	// ------------------------------------------------------------------------
    // Product CountDown
    // ------------------------------------------------------------------------
    function productCountDown() {
		const countDownProduct = $(".defaultCountdown");
		countDownProduct.each(function(i) {
			$('.defaultCountdown-'+$(this).data("countdown-id")).countdown($(this).data("timer"), function(event) {
				var $this = $(this).html(event.strftime(
					'<div class="time-item time-day"><div class="num-time">%D</div><div class="name-time">Day%!d </div></div>'
				   + '<div class="time-item time-hour"><div class="num-time">%H</div><div class="name-time">Hour%!H</div></div>'
				   + '<div class="time-item time-min"><div class="num-time">%M</div><div class="name-time">Min%!M </div></div>'
				   + '<div class="time-item time-sec"><div class="num-time">%S</div><div class="name-time">Sec%!S</div></div>'));
				$this.on('finish.countdown', function(event){
					$(this).hide();
				});
			});
			/*$('.defaultCountdown-'+$(this).data("countdown-id")).countdown('stop');*/
		});
		
	}
    productCountDown();
    // ========================================================================
    // Show Fade out image gradually while scrolling
    // ========================================================================
    const fadeImage = $('[data-fade-image]');
    const banners = fadeImage.find("img").fadeTo(0, 0);
    function fadeBanners(){
        banners.each(function(i) {
            const a = $(this).offset().top  ;
            const b = $(window).scrollTop() + $(window).height();
            if (a < b) $(this).fadeTo('fast',1);
        });
    }
    
    $(window).load(function(d,h){
        fadeBanners();
    });
    
    $(window).scroll(function(d,h) {
       fadeBanners();
    });
    
    // ========================================================================
    // Show ReinitView
    // ========================================================================
    reinitView();

    function reinitView() {
        const viewAs = $('.filters-panel .view-mode').attr("data-reinitview");
        $('.view-mode .list-view button').bind("click", function() {
            $(this).parent().find('button').removeClass('active');
            $(this).addClass('active');
        }); 
        // Product List
        $('#list-view').click(function() {
            $('#product-listing-container .product-layout').attr('class', 'product-layout product-list col-sm-12');
            localStorage.setItem('listview', 'list');
        });

        // Product Grid
        $('#grid-view').click(function() {
            var cols = $('.left_column , .right_column ').length;

            if (cols == 2) {
                $('#product-listing-container .product-layout').attr('class', 'product-layout product-grid col-lg-6 col-md-6 col-12 ');
            } else if (cols == 1) {
                $('#product-listing-container .product-layout').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-12 ');
            } else {
                $('#product-listing-container .product-layout').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-12 ');
            }
            
            localStorage.setItem('listview', 'grid');
        });

        // Product Grid 2
        $('#grid-view-2').click(function() {
            $('#product-listing-container .product-layout').attr('class', 'product-layout product-grid product-grid-2 col-lg-6 col-md-6 col-12');
            localStorage.setItem('listview', 'grid-2');
        });

        // Product Grid 3
        $('#grid-view-3').click(function() {
            $('#product-listing-container .product-layout').attr('class', 'product-layout product-grid product-grid-3 col-lg-4 col-md-4 col-12');
            localStorage.setItem('listview', 'grid-3');
        });

        // Product Grid 4
        $('#grid-view-4').click(function() {
            $('#product-listing-container .product-layout').attr('class', 'product-layout product-grid product-grid-4 col-lg-3 col-md-4 col-12');
            localStorage.setItem('listview', 'grid-4');
        });

        // Product Table
        $('#table-view').click(function() {
            $('#product-listing-container .product-layout').attr('class', 'product-layout product-table col-sm-12');
            localStorage.setItem('listview', 'table');
        })
        
        if(localStorage.getItem('listview')=== null) localStorage.setItem('listview', viewAs);
        
        if (localStorage.getItem('listview') == 'table') {
            $('#table-view').trigger('click');
        } else if (localStorage.getItem('listview') == 'grid'){
            $('#grid-view').trigger('click');
        } else if (localStorage.getItem('listview') == 'grid-2'){
            $('#grid-view-2').trigger('click');
        } else if (localStorage.getItem('listview') == 'grid-3'){
            $('#grid-view-3').trigger('click');
        }else if (localStorage.getItem('listview') == 'grid-4'){
            $('#grid-view-4').trigger('click');
        } else if (localStorage.getItem('listview') == 'list'){
            $('#list-view').trigger('click');
        }else {
            $('#grid-view-4').trigger('click');
            
        }
        
		
         // Resonsive Header Top
        $(".collapsed-block .expander").click(function (e) {
            var collapse_content_selector = $(this).parent().next();
            var expander = $(this).parent();
            
            if (!$(collapse_content_selector).hasClass("open")) {
                expander.addClass("open") ;
            }
            else expander.removeClass("open");
            
            if (!$(collapse_content_selector).hasClass("open")) $(collapse_content_selector).addClass("open").slideDown("normal");
            else $(collapse_content_selector).removeClass("open").slideUp("normal");
            e.preventDefault()
        })
        
        // Resonsive Sidebar aside
        $(".open-sidebar").click(function(e){
            e.preventDefault();
            
            $(".sidebar-overlay").toggleClass("show");
            $(".sidebar-offcanvas").toggleClass("active");
        });
          
        $(".sidebar-overlay").click(function(e){
            e.preventDefault();
            $(".sidebar-overlay").toggleClass("show");
            $(".sidebar-offcanvas").toggleClass("active");
        });
        $('#close-sidebar').click(function() {
            $('.sidebar-overlay').removeClass('show');
            $('.sidebar-offcanvas').removeClass('active');
            
        }); 
    }
    
    // ========================================================================
    // Show On Top Header
    // ========================================================================
    const stickyHeader = $('[data-sticky-header]');
    
    function topPanel() {
        var duration = {headerTransform: 500},
        $window = $(window),
        $header = stickyHeader,
        $wrapper = $("body"),
        active = false,
        headerStaticHeight = $header.outerHeight(),
        headerHeight = $header.outerHeight(),
        latent = $window.scrollTop() >= headerHeight;
        var $heightNew = $header.outerHeight();
        var windowWidth = window.innerWidth || document.documentElement.clientWidth; 
        var positionHeader = - $header.height();
        
        var reculcPosHeader = function () {
            var headerCompact = false;
            if (!$header.hasClass("navbar-compact")) {
                headerCompact = true;
                $header.addClass("navbar-compact");
            }
            positionHeader = - $header.height() - 100;
            if (headerCompact) $header.removeClass("navbar-compact");
            if (parseInt($header.css("top")) < -1) $header.css("top", positionHeader + "px");
        };
        
        if (windowWidth > 1200 ) {
            $window.scroll(function () {
                if (!latent && $window.scrollTop() >= headerStaticHeight) {
                    $header.addClass("navbar-compact");
                    reculcPosHeader();
                    $header.css("top", positionHeader + "px");
                    //push the header giving it a top-margin
                    $wrapper.css("margin-top", headerStaticHeight + "px");
                    latent = true;
                    if (!$(".navbar-switcher-container").length){
                        active = !active;
                        $header.animate({
                            top: active ? "0" : positionHeader
                        }, {
                            duration: duration.headerTransform
                        })
                    }
                } else if (latent && $window.scrollTop() < headerStaticHeight) {
                    //push the header giving it a top-margin
                    $wrapper.css("margin-top", "0px");
                    $header.removeClass("navbar-compact");
                    $header.css("top", "0px");
                    active = false;
                    latent = false;
                }
                
            });
            
        }else{
            $window.scroll(function () {
                $wrapper.css("margin-top", "0px");
                $header.removeClass("navbar-compact");
                $header.css("top", "0px");
            });
        }
    }
    
    const allImage = $('[data-size-image]').find("img");
    const logoImage = $('.header-logo').find("img");
    function addSizeImage(){
        var windowWidth = window.innerWidth || document.documentElement.clientWidth; 
        if (windowWidth > 1200 ) {
            allImage.each(function(i) {
                if($(this).width()!='0') $(this).attr({ width: $(this).width()+'px', height: $(this).height()+'px' });
            });
            logoImage.attr({ width: logoImage.width()+'px', height: logoImage.height()+'px' });
        }else{
            allImage.each(function(i) {
                $(this).removeAttr('height width');
            });
            logoImage.removeAttr('height width');
        }
    }
    
    $(window).resize(function() {
        topPanel();
        addSizeImage();
    });
    topPanel();
    addSizeImage();
    
    // ========================================================================
    // SB Theme - CardGallery
    // ========================================================================
    function cardGallery() {
        $('.product-card__gallery .item-img').on("mouseover touchstart", function (e) {
            $(this).addClass('thumb-active').siblings().removeClass('thumb-active');
            var thumb_src = $(this).attr("data-src");
            $(this).closest('.product-item-container').find('img.img-responsive').attr("src",thumb_src);
        }); 
    }
    cardGallery();
   
    // ========================================================================
    // SB Theme - getPage Ajax Product
    // ========================================================================
    function getPage($placeholder, tmpl, urlKey = 'itemsSblisting') {
        let template = tmpl;
        if ($placeholder.data('urltemplate')) { template = $placeholder.data('urltemplate'); }
        let url = $placeholder.data(urlKey);
        url = url.replace(/https?:\/\/[^\/]+/, ''); 

        utils.api.getPage(url, { template }, (err, resp) => {
            $placeholder.html(resp);
           
            // init products carousel
            $('[data-slick]', $placeholder)
            .slick();
            cardGallery();
            productCountDown();
			addSizeImage();
        });
    }
    
	
	
    // ========================================================================
    // SB Theme -  Ajax load Deals
    // ========================================================================
    function initAjaxDeals() {
        const template = 'sbthemes/module/sb_deals/default/default_deals_item';
        const urlKey = 'productsByCategoryTabs';
        $('[data-products-by-category-tabs]').each((i, placeholder) => {
            getPage($(placeholder), template, urlKey);
          
        });
        
    }
    initAjaxDeals();
    
    
    // ========================================================================
    // Ajax load  in sb listing tabs
    // - Only load products in active tab (has class .is-active)
    // - Ajax load products when a tab is open
    // ========================================================================
    function initAjaxListingTabs() {
        const template = 'sbthemes/module/sb_listing_tabs/default_items';
        const urlKey = 'itemsSblisting';

        // Ajax request loading products in the active tab
        $('.is-active[data-items-sblisting]').each((i, placeholder) => {
            getPage($(placeholder), template, urlKey);
        });

        $('[data-tab-sblisting]').on('toggled', (event, tab) => {
            getPage($($('a', tab).attr('href')), template, urlKey);
        });
    }
    initAjaxListingTabs();
	
	
    // ------------------------------------------------------------------------
    // collapsibles categories on sidebar
    // ------------------------------------------------------------------------
    const $navListToggle = $('.navList .navList-toggle');
    const $curMenuItem = $('.navList .is-current');
    const collapsibles = [];

    if ($curMenuItem.hasClass('has-subMenu')) {
        collapsibles.push($curMenuItem.parent('.navList-item').children('[data-collapsible]'));
    }

    $navListToggle.parents('.navList-subMenu-item, .navList-item').children('[data-collapsible]').each((i, el) => {
        collapsibles.push(el);
    });

    $.each(collapsibleFactory(collapsibles), (i, o) => {
        o.close();
    });
    
    // ========================================================================
    // SB Theme -  Show Megamenu
    // ========================================================================
    const itemver = $('[data-collapsible-limit]').data("collapsible-limit");
    const textmore = $('[data-collapsible-limit]').data("collapsible-textmore");
    const textclose = $('[data-collapsible-limit]').data("collapsible-textclose");
    
    function showMega() {
        var verticalMega =$(".verticalCategories ul.navPages-list > li");
        if(itemver <= $(verticalMega).length) $('.verticalCategories ul.navPages-list').append('<li class="navPages-item loadmore"><div class="navPages-action"><i class="fa fa-plus-circle"></i><span class="more-view"> '+textmore+'</span> </div></li>');
        var show_itemver = itemver-1 ;
        $(verticalMega).each(function(i){
            if(i>show_itemver){
                $(this).css('display', 'none');
            }
        });
        
        $(".verticalCategories .loadmore").click(function(){
            if($(this).hasClass('open')){
                $(verticalMega).each(function(i){
                    if(i>show_itemver){
                        $(this).slideUp(200);
                        $(this).css('display', 'none');
                    }
                });
                $(this).removeClass('open');
                $('.loadmore').html('<div class="navPages-action"><i class="fa fa-plus-circle"></i> <span class="more-view">' +textmore+ '</span></div>');
            }else{
                $(verticalMega).each(function(i){
                    if(i>show_itemver){
                        $(this).slideDown(200);
                    }
                });
                $(this).addClass('open');
                $('.loadmore').html('<div class="navPages-action"><i class="fa fa-minus-circle"></i> <span class="more-view">'+textclose+'</span></div>');
            }
        });
        
        var wd_width = $(window).width();
        if (wd_width <= 1200) {
            $('.megamenuToogle-wrapper').on('touchstart', function(e){
                e.preventDefault();
                e.stopPropagation();
                if (!$(this).next().hasClass("is-open")) {
                    $(this).next().addClass("is-open");
                    
                }else{
                    $(this).next().removeClass("is-open");
                }
                
            });
           
        }
    }
    
    showMega();
    collapsibleFactory();
    // ========================================================================
    // FBMessage
    // ========================================================================
    function fbMessage(){
        $(document).on('click', '.sb-fb-ms-bottom', function() {
            $(this).prev('.sb-fb-ms-inner').show();
            $(this).hide();
        })

        $(document).on('click', '.offline_heading', function() {
            $(this).parent('.sb-fb-ms-inner').hide();
            $(this).parent().next('.sb-fb-ms-bottom').show();
        })
    }
    fbMessage();
    
    // ========================================================================
    // SB Theme - BONUS PAGE  
    // ========================================================================
    function showAccordion(){
        
        $("ul.yt-accordion li").each(function() {
            if($(this).index() > 0) {
                $(".yt-accordion-inner").hide();
                $(".enable+.yt-accordion-inner").show();
                $(".enable+.yt-accordion-inner").addClass("active");
            }
            else {
                $(".enable").addClass('active');
            }
            var ua = navigator.userAgent,
            event = (ua.match(/iPad/i)) ? "touchstart" : "click";
            $(this).children(".accordion-heading").bind(event, function() {
                
                if($(this).hasClass("active"))
                {
                    $(this).removeClass("active");
                    $(this).siblings(".yt-accordion-inner").removeClass("active");
                    $(this).siblings(".yt-accordion-inner").slideUp(350);
                }
                else
                {
                    $(this).addClass("active");
                    $(this).siblings(".yt-accordion-inner").addClass("active");
                    $(this).siblings(".yt-accordion-inner").slideDown(350);
                }
                
                $(this).parent().siblings("li").children(".yt-accordion-inner").slideUp(350);
                $(this).parent().siblings("li").find(".active").removeClass("active");
            });
        });
        
    }

    showAccordion();
	
	 // ========================================================================
    // SB Theme - Cpanel
    // ========================================================================
	 function urlParam(name){
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results==null){return null;}
		else{return decodeURI(results[1]) || 0;}
	}
	if(urlParam('layoutStyle')=='boxed'){
		$('body').addClass("overlay--pattern1");
		$('#wrapper').addClass("wrapper-boxed");
	}
	
	
}
