"use strict";

// Class Definition
var KTLoginV1 = function () {

	var login = $('#kt_login');

	var showErrorMsg = function (form, type, msg) {
		var alert = $('<div class="kt-alert kt-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

		form.find('.alert').remove();
		alert.prependTo(form);
		//alert.animateClass('fadeIn animated');
		KTUtil.animateClass(alert[0], 'fadeIn animated');
		alert.find('span').html(msg);
	}

	// Private Functions

	var handleSignInFormSubmit = function () {
		$('#kt_login_signin_submit').click(function (e) {
			e.preventDefault();
			var btn = $(this);
			var form = $('.kt-form');

			form.validate({
				rules: {
					u: {
						required: true
					},
					p: {
						required: true
					}
				}
			});

			if (!form.valid()) {
				return;
			}

			btn.addClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', true);

			form.ajaxSubmit({
				url: api_url+'/api/auth/login',
				type: 'POST',
				success: function (response, status, xhr, $form) {
					showErrorMsg(form, response.status==1?'success':'danger', response.message);
					
					if(response.status==1){
						gotoAdmin(response.data);
					}

					// similate 2s delay
					setTimeout(function () {
						btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
					}, 2000);
				},
				error: function(e){
					btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
					showErrorMsg(form, 'danger', 'Kesalahan sistem.');
				}
			});
		});
	}

	var gotoAdmin = function(r) {
		// redirect
		window.location = base_url+'/wh';
		// form.ajaxSubmit({
		// 	url: 'http://api.smm.co.id/api/auth/login',
		// 	type: 'POST',
		// 	success: function (response, status, xhr, $form) {
		// 		showErrorMsg(form, response.status==1?'success':'danger', response.message);
				
		// 		if(response.status==1){
		// 			gotoAdmin(response.data);
		// 		}

		// 		// similate 2s delay
		// 		setTimeout(function () {
		// 			btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
		// 		}, 2000);
		// 	},
		// 	error: function(e){
		// 		btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
		// 		showErrorMsg(form, 'danger', 'Kesalahan sistem.');
		// 	}
		// });
	}

	// Public Functions
	return {
		// public functions
		init: function () {
			handleSignInFormSubmit();
		}
	};
}();

// Class Initialization
jQuery(document).ready(function () {
	KTLoginV1.init();
});