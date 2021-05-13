/* eslint-disable */
import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';

/**
 * European websites must notify users of cookies to comply with European Union law.
 * This will alert shoppers that this website uses cookies.
 */
export default function () {
    /*
    // Here you can override the default browser alert box by hooking to the 'cookie-privacy-notification' hook.
    utils.hooks.on('cookie-privacy-notification', (event, privacyMessage) => {
        // You can make your own custom modal or alert box appear in your theme using the privacyMessage provided
        myCustomAlert(privacyMessage);

        // Call event.preventDefault() to prevent the default browser alert from occurring in stencil-utils
        event.preventDefault();
    });
    */

    utils.hooks.on('cookie-privacy-notification', (event) => {
        event.preventDefault();

        const $privacyDialog = $('.cookieMessage');
		const $effectIn =  $privacyDialog.data("effectin");
		const $effectOut = $privacyDialog.data("effectout"); 
        $privacyDialog.show();
		
		cookieMessageEffect($effectOut);
		
        $('body').on('click', '[data-privacy-accept]', () => {
            utils.hooks.emit('cookie-privacy-accepted');
			$privacyDialog.hide();
        });
    });
	function cookieMessageEffect(x) {
		const $privacyDialog = $('.cookieMessage');
		$privacyDialog.addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		  $(this).removeClass(x + ' animated');
		});
	};
	
}
