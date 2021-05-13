/* eslint-disable */
import { hooks, api } from '@bigcommerce/stencil-utils';
import $ from 'jquery';
import _ from 'lodash';
import Url from 'url';
import urlUtils from './url-utils';
import modalFactory from '../global/modal';
import collapsibleFactory from './collapsible';
import { Validators } from './form-utils';
import nod from './nod';
import carousel from './carousel';
import 'jquery-countdown';
/**
 * Faceted search view component
 */
class FacetedSearch {
    /**
     * @param {object} requestOptions - Object with options for the ajax requests
     * @param {function} callback - Function to execute after fetching templates
     * @param {object} options - Configurable options
     * @example
     *
     * let requestOptions = {
     *      templates: {
     *          productListing: 'category/product-listing',
     *          sidebar: 'category/sidebar'
     *     }
     * };
     *
     * let templatesDidLoad = function(content) {
     *     $productListingContainer.html(content.productListing);
     *     $facetedSearchContainer.html(content.sidebar);
     * };
     *
     * let facetedSearch = new FacetedSearch(requestOptions, templatesDidLoad);
     */
    constructor(requestOptions, callback, options) {
        const defaultOptions = {
            accordionToggleSelector: '#facetedSearch .accordion-navigation, #facetedSearch .facetedSearch-toggle',
            blockerSelector: '#facetedSearch .blocker',
            clearFacetSelector: '#facetedSearch .facetedSearch-clearLink',
            componentSelector: '#facetedSearch-navList',
            facetNavListSelector: '#facetedSearch .navList',
            priceRangeErrorSelector: '#facet-range-form .form-inlineMessage',
            priceRangeFieldsetSelector: '#facet-range-form .form-fieldset',
            priceRangeFormSelector: '#facet-range-form',
            priceRangeMaxPriceSelector: '#facet-range-form [name=max_price]',
            priceRangeMinPriceSelector: '#facet-range-form [name=min_price]',
            showMoreToggleSelector: '#facetedSearch .accordion-content .toggleLink',
            facetedSearchFilterItems: '#facetedSearch-filterItems .form-input',
            modal: modalFactory('#modal')[0],
            modalOpen: false,
        };

        // Private properties
        this.requestOptions = requestOptions;
        this.callback = callback;
        this.options = _.extend({}, defaultOptions, options);
        this.collapsedFacets = [];
        this.collapsedFacetItems = [];

        // Init collapsibles
        collapsibleFactory();

        // Init price validator
        this.initPriceValidator();

        // Show limited items by default
        $(this.options.facetNavListSelector).each((index, navList) => {
            this.collapseFacetItems($(navList));
        });

        // Mark initially collapsed accordions
        $(this.options.accordionToggleSelector).each((index, accordionToggle) => {
            const $accordionToggle = $(accordionToggle);
            const collapsible = $accordionToggle.data('collapsibleInstance');

            if (collapsible.isCollapsed) {
                this.collapsedFacets.push(collapsible.targetId);
            }
        });

        // Collapse all facets if initially hidden
        // NOTE: Need to execute after Collapsible gets bootstrapped
        setTimeout(() => {
            if ($(this.options.componentSelector).is(':hidden')) {
                this.collapseAllFacets();
            }
        });

        // Observe user events
        this.onStateChange = this.onStateChange.bind(this);
        this.onToggleClick = this.onToggleClick.bind(this);
        this.onAccordionToggle = this.onAccordionToggle.bind(this);
        this.onClearFacet = this.onClearFacet.bind(this);
        this.onFacetClick = this.onFacetClick.bind(this);
        this.onRangeSubmit = this.onRangeSubmit.bind(this);
        this.onSortBySubmit = this.onSortBySubmit.bind(this);
        this.filterFacetItems = this.filterFacetItems.bind(this);

        this.bindEvents();
    }

    // Public methods
    refreshView(content) {
        if (content) {
            this.callback(content);
        }

        // Init collapsibles
        collapsibleFactory();

        // Init price validator
        this.initPriceValidator();

        // Restore view state
        this.restoreCollapsedFacets();
        this.restoreCollapsedFacetItems();

        // Bind events
        this.bindEvents();
		
		this.reinitView();
		this.productCountDown();
    }
	
	// Public Custom SB Themes
	 productCountDown() {
		const countDownProduct = $(".defaultCountdown");
		countDownProduct.each(function(i) {
			$('.defaultCountdown-'+$(this).data("countdown-id")).countdown($(this).data("timer"), function(event) {
				var $this = $(this).html(event.strftime(
					'<div class="time-item time-day"><div class="num-time">%D</div><div class="name-time">Day%!d </div></div>'
				   + '<div class="time-item time-hour"><div class="num-time">%H</div><div class="name-time">Hour%!H</div></div>'
				   + '<div class="time-item time-min"><div class="num-time">%M</div><div class="name-time">Min%!M </div></div>'
				   + '<div class="time-item time-sec"><div class="num-time">%S</div><div class="name-time">Sec%!S</div></div>'));
			});
		});
		
	}
	reinitView() {
		const viewAs = $('.filters-panel .view-mode').attr("data-reinitview");
		$('.product-card__gallery .item-img').on("mouseover touchstart", function (e) {
            $(this).addClass('thumb-active').siblings().removeClass('thumb-active');
            var thumb_src = $(this).attr("data-src");
            $(this).closest('.product-item-container').find('img.img-responsive').attr("src",thumb_src);
        }); 
		
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
			$('#product-listing-container .product-layout').attr('class', 'product-layout product-grid product-grid-2 col-lg-6 col-md-6 col-sm-6');
			localStorage.setItem('listview', 'grid-2');
		});

		// Product Grid 3
		$('#grid-view-3').click(function() {
			$('#product-listing-container .product-layout').attr('class', 'product-layout product-grid product-grid-3 col-lg-4 col-md-4 col-sm-6');
			localStorage.setItem('listview', 'grid-3');
		});

		// Product Grid 4
		$('#grid-view-4').click(function() {
			$('#product-listing-container .product-layout').attr('class', 'product-layout product-grid product-grid-4 col-lg-3 col-md-4 col-sm-6');
			localStorage.setItem('listview', 'grid-4');
		});

		// Product Table
		$('#table-view').click(function() {
			$('#product-listing-container .product-layout').attr('class', 'product-layout product-table col-sm-12');
			localStorage.setItem('listview', 'table');
		})
		
		//if(localStorage.getItem('listview')=== null) localStorage.setItem('listview', viewAs); Remove code
		
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
			$('#grid-view').trigger('click');
			
		}
		
		// Resonsive Sidebar aside
		$('.sidebar-overlay').removeClass('show');
		$('.sidebar-offcanvas').removeClass('active');
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
		
		$('.productCarousel').slick({
		  dots: false,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  responsive: [
			{
                "breakpoint": 1260,
                "settings": {
                    "slidesToScroll": 1,
                    "slidesToShow": 1
                }
            },
            {
                "breakpoint": 800,
                "settings": {
                    "slidesToScroll": 1,
                    "slidesToShow": 1
                }
            },
            {
                "breakpoint": 550,
                "settings": {
                    "slidesToScroll": 1,
                    "slidesToShow": 1
                }
            }
			
		  ]
		});
	}
	
    updateView() {
        $(this.options.blockerSelector).show();

        api.getPage(urlUtils.getUrl(), this.requestOptions, (err, content) => {
            $(this.options.blockerSelector).hide();

            if (err) {
                throw new Error(err);
            }

            // Refresh view with new content
            this.refreshView(content);
        });
    }

    expandFacetItems($navList) {
        const id = $navList.attr('id');

        // Remove
        this.collapsedFacetItems = _.without(this.collapsedFacetItems, id);
    }

    collapseFacetItems($navList) {
        const id = $navList.attr('id');
        const hasMoreResults = $navList.data('hasMoreResults');

        if (hasMoreResults) {
            this.collapsedFacetItems = _.union(this.collapsedFacetItems, [id]);
        } else {
            this.collapsedFacetItems = _.without(this.collapsedFacetItems, id);
        }
    }

    toggleFacetItems($navList) {
        const id = $navList.attr('id');

        // Toggle depending on `collapsed` flag
        if (_.includes(this.collapsedFacetItems, id)) {
            this.getMoreFacetResults($navList);

            return true;
        }

        this.collapseFacetItems($navList);

        return false;
    }

    getMoreFacetResults($navList) {
        const facet = $navList.data('facet');
        const facetUrl = urlUtils.getUrl();

        if (this.requestOptions.showMore) {
            api.getPage(facetUrl, {
                template: this.requestOptions.showMore,
                params: {
                    list_all: facet,
                },
            }, (err, response) => {
                if (err) {
                    throw new Error(err);
                }

                this.options.modal.open();
                this.options.modalOpen = true;
                this.options.modal.updateContent(response);
            });
        }

        this.collapseFacetItems($navList);

        return false;
    }

    filterFacetItems(event) {
        const $items = $('.navList-item');
        const query = $(event.currentTarget).val().toLowerCase();

        $items.each((index, element) => {
            const text = $(element).text().toLowerCase();
            if (text.indexOf(query) !== -1) {
                $(element).show();
            } else {
                $(element).hide();
            }
        });
    }

    expandFacet($accordionToggle) {
        const collapsible = $accordionToggle.data('collapsibleInstance');

        collapsible.open();
    }

    collapseFacet($accordionToggle) {
        const collapsible = $accordionToggle.data('collapsibleInstance');

        collapsible.close();
    }

    collapseAllFacets() {
        const $accordionToggles = $(this.options.accordionToggleSelector);

        $accordionToggles.each((index, accordionToggle) => {
            const $accordionToggle = $(accordionToggle);

            this.collapseFacet($accordionToggle);
        });
    }

    expandAllFacets() {
        const $accordionToggles = $(this.options.accordionToggleSelector);

        $accordionToggles.each((index, accordionToggle) => {
            const $accordionToggle = $(accordionToggle);

            this.expandFacet($accordionToggle);
        });
    }

    // Private methods
    initPriceValidator() {
        if ($(this.options.priceRangeFormSelector).length === 0) {
            return;
        }

        const validator = nod();
        const selectors = {
            errorSelector: this.options.priceRangeErrorSelector,
            fieldsetSelector: this.options.priceRangeFieldsetSelector,
            formSelector: this.options.priceRangeFormSelector,
            maxPriceSelector: this.options.priceRangeMaxPriceSelector,
            minPriceSelector: this.options.priceRangeMinPriceSelector,
        };

        Validators.setMinMaxPriceValidation(validator, selectors);

        this.priceRangeValidator = validator;
    }

    restoreCollapsedFacetItems() {
        const $navLists = $(this.options.facetNavListSelector);

        // Restore collapsed state for each facet
        $navLists.each((index, navList) => {
            const $navList = $(navList);
            const id = $navList.attr('id');
            const shouldCollapse = _.includes(this.collapsedFacetItems, id);

            if (shouldCollapse) {
                this.collapseFacetItems($navList);
            } else {
                this.expandFacetItems($navList);
            }
        });
    }

    restoreCollapsedFacets() {
        const $accordionToggles = $(this.options.accordionToggleSelector);

        $accordionToggles.each((index, accordionToggle) => {
            const $accordionToggle = $(accordionToggle);
            const collapsible = $accordionToggle.data('collapsibleInstance');
            const id = collapsible.targetId;
            const shouldCollapse = _.includes(this.collapsedFacets, id);

            if (shouldCollapse) {
                this.collapseFacet($accordionToggle);
            } else {
                this.expandFacet($accordionToggle);
            }
        });
    }

    bindEvents() {
        // Clean-up
        this.unbindEvents();

        // DOM events
        $(window).on('statechange', this.onStateChange);
        $(document).on('click', this.options.showMoreToggleSelector, this.onToggleClick);
        $(document).on('toggle.collapsible', this.options.accordionToggleSelector, this.onAccordionToggle);
        $(document).on('keyup', this.options.facetedSearchFilterItems, this.filterFacetItems);
        $(this.options.clearFacetSelector).on('click', this.onClearFacet);

        // Hooks
        hooks.on('facetedSearch-facet-clicked', this.onFacetClick);
        hooks.on('facetedSearch-range-submitted', this.onRangeSubmit);
        hooks.on('sortBy-submitted', this.onSortBySubmit);
    }

    unbindEvents() {
        // DOM events
        $(window).off('statechange', this.onStateChange);
        $(document).off('click', this.options.showMoreToggleSelector, this.onToggleClick);
        $(document).off('toggle.collapsible', this.options.accordionToggleSelector, this.onAccordionToggle);
        $(document).off('keyup', this.options.facetedSearchFilterItems, this.filterFacetItems);
        $(this.options.clearFacetSelector).off('click', this.onClearFacet);

        // Hooks
        hooks.off('facetedSearch-facet-clicked', this.onFacetClick);
        hooks.off('facetedSearch-range-submitted', this.onRangeSubmit);
        hooks.off('sortBy-submitted', this.onSortBySubmit);
    }

    onClearFacet(event) {
        const $link = $(event.currentTarget);
        const url = $link.attr('href');

        event.preventDefault();
        event.stopPropagation();

        // Update URL
        urlUtils.goToUrl(url);
    }

    onToggleClick(event) {
        const $toggle = $(event.currentTarget);
        const $navList = $($toggle.attr('href'));

        // Prevent default
        event.preventDefault();

        // Toggle visible items
        this.toggleFacetItems($navList);
    }

    onFacetClick(event) {
        const $link = $(event.currentTarget);
        const url = $link.attr('href');

        event.preventDefault();

        $link.toggleClass('is-selected');

        // Update URL
        urlUtils.goToUrl(url);

        if (this.options.modalOpen) {
            this.options.modal.close();
        }
    }

    onSortBySubmit(event) {
        const url = Url.parse(window.location.href, true);
        const queryParams = $(event.currentTarget).serialize().split('=');

        url.query[queryParams[0]] = queryParams[1];
        delete url.query.page;

        event.preventDefault();

        urlUtils.goToUrl(Url.format({ pathname: url.pathname, search: urlUtils.buildQueryString(url.query) }));
    }

    onRangeSubmit(event) {
        event.preventDefault();

        if (!this.priceRangeValidator.areAll(nod.constants.VALID)) {
            return;
        }

        const url = Url.parse(window.location.href);
        const queryParams = decodeURI($(event.currentTarget).serialize());

        urlUtils.goToUrl(Url.format({ pathname: url.pathname, search: `?${queryParams}` }));
    }

    onStateChange() {
        this.updateView();
    }

    onAccordionToggle(event) {
        const $accordionToggle = $(event.currentTarget);
        const collapsible = $accordionToggle.data('collapsibleInstance');
        const id = collapsible.targetId;

        if (collapsible.isCollapsed) {
            this.collapsedFacets = _.union(this.collapsedFacets, [id]);
        } else {
            this.collapsedFacets = _.without(this.collapsedFacets, id);
        }
    }
}

export default FacetedSearch;
