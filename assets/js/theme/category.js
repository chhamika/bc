/* eslint-disable */
import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import $ from 'jquery';
import FacetedSearch from './common/faceted-search';

export default class Category extends CatalogPage {
    loaded() {
        $('#verticalCategories').removeClass('is-open');
        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }
        this.SubcategoryCol();
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                    
                },
                    products: {
                    top_sellers: {
                        limit: productsPerPage,
                    },
                    
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }
    
    // ------------------------------------------------------------------------
    // Subcategory  Column
    // ------------------------------------------------------------------------
    SubcategoryCol(){
        console.log(this.context.settings_subcategory_col);
        const catalog_refine_number = this.context.settings_subcategory_col;
        const text_refine_more = this.context.text_refine_more;
        const text_refine_less = this.context.text_refine_less;
        if(catalog_refine_number <= $('.refine-search__content > .refine-search__subitem').length)
        $('.refine-search__content').append('<div class="refine-loadmore"><i class="fa fa-plus"></i> <span class="more-view"> '+text_refine_more+' </span></div>');

        const show_catalog_refine_number = catalog_refine_number-1 ;
        $('.refine-search__content > .refine-search__subitem').each(function(i){
            if(i>show_catalog_refine_number){
                $(this).css('display', 'none');
            }
        });

        $(".refine-search__content .refine-loadmore").click(function(){
            if($(this).hasClass('open')){
                $('.refine-search__content .refine-search__subitem').each(function(i){
                    if(i>show_catalog_refine_number){
                        $(this).slideUp(200);
                        $(this).css('display', 'none');
                    }
                });
                $(this).removeClass('open');
                $('.refine-loadmore').html('<i class="fa fa-plus"></i> <span class="more-view">'+text_refine_more+' </span>');

            }else{
                $('.refine-search__content .refine-search__subitem').each(function(i){
                    if(i>show_catalog_refine_number){
                        $(this).slideDown(200);
                    }
                });
                $(this).addClass('open');
                $('.refine-loadmore').html('<i class="fa fa-minus"></i> <span class="more-view">'+text_refine_less+' </span>');
            }
        }); 
     }
    
}
