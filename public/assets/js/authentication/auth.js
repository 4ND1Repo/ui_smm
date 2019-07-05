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
					btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
					
					if(response.status==1){
						gotoAdmin(response.data, form, btn);
					} else
						showErrorMsg(form, 'danger', response.message);
				},
				error: function(e){
					btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
					showErrorMsg(form, 'danger', 'Kesalahan sistem.');
				}
			});
		});
	}

	var gotoAdmin = function(r, form, btn) {
        // after succes get menu then 
		myStorage.set('auth');
		
		btn.addClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', true);
		$.ajax({
			url: api_url+'/api/auth/menu',
			type: 'POST',
			data: r,
			success: function(res){
				btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
				if(res.status == 1){
					if(res.data !== null){
						r['menu'] = res.data;
						r['page'] = res.data[0].menu_page;
						myStorage.store(JSON.stringify(r));
						window.location = base_url+'/'+r.page;
						showErrorMsg(form, 'success', 'Anda berhasil masuk');
					} else
						showErrorMsg(form, 'danger', "Tidak ada akses menu untuk anda.");
				} else {
					showErrorMsg(form, 'danger', "Gagal mengambil akses menu, silahkan ulangi.");
				}
			},
			error: function(){
				btn.removeClass('kt-spinner kt-spinner--right kt-spinner-md kt-spinner--light').attr('disabled', false);
				showErrorMsg(form, 'danger', "Gagal mengambil akses menu, silahkan ulangi.");
			}
		});
	}

	// Public Functions
	return {
		// public functions
		init: function () {
			handleSignInFormSubmit();
		}
	};
}();


var KTMenusV1 = function(){
	var menu_list, page, tmp_menu;

	var __constuctor = function() {
		myStorage.set("auth");
		var tmp = JSON.parse(myStorage.get());

		menu_list = tmp.menu;
		page = tmp.page;
		tmp_menu = "";
	}
	var generateMenu = function(tmp, lv){
		$.each(tmp, function(k,v){
			if(typeof v.children !== 'undefined')
				tmp_menu += '<li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"><a href="javascript:;" class="kt-menu__link kt-menu__toggle">';
			else
				tmp_menu += '<li class="kt-menu__item '+(lv>0?'kt-menu__item--submenu':'')+'" aria-haspopup="true"><a href="/'+v.menu_page+v.menu_url+'" title="'+v.menu_name+'" class="kt-menu__link kt-menu__page">';

			// add icon 
			if(v.menu_icon !== null)
				tmp_menu += '<span class="kt-menu__link-icon"><i class="'+v.menu_icon+'"></i></span>';
			else if(lv > 0)
				tmp_menu += '<i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>';
			else
				tmp_menu += '<span class="kt-menu__link-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect id="bound" x="0" y="0" width="24" height="24"></rect><path d="M11.7573593,15.2426407 L8.75735931,15.2426407 C8.20507456,15.2426407 7.75735931,15.6903559 7.75735931,16.2426407 C7.75735931,16.7949254 8.20507456,17.2426407 8.75735931,17.2426407 L11.7573593,17.2426407 L11.7573593,18.2426407 C11.7573593,19.3472102 10.8619288,20.2426407 9.75735931,20.2426407 L5.75735931,20.2426407 C4.65278981,20.2426407 3.75735931,19.3472102 3.75735931,18.2426407 L3.75735931,14.2426407 C3.75735931,13.1380712 4.65278981,12.2426407 5.75735931,12.2426407 L9.75735931,12.2426407 C10.8619288,12.2426407 11.7573593,13.1380712 11.7573593,14.2426407 L11.7573593,15.2426407 Z" id="Combined-Shape" fill="#000000" opacity="0.3" transform="translate(7.757359, 16.242641) rotate(-45.000000) translate(-7.757359, -16.242641) "></path><path d="M12.2426407,8.75735931 L15.2426407,8.75735931 C15.7949254,8.75735931 16.2426407,8.30964406 16.2426407,7.75735931 C16.2426407,7.20507456 15.7949254,6.75735931 15.2426407,6.75735931 L12.2426407,6.75735931 L12.2426407,5.75735931 C12.2426407,4.65278981 13.1380712,3.75735931 14.2426407,3.75735931 L18.2426407,3.75735931 C19.3472102,3.75735931 20.2426407,4.65278981 20.2426407,5.75735931 L20.2426407,9.75735931 C20.2426407,10.8619288 19.3472102,11.7573593 18.2426407,11.7573593 L14.2426407,11.7573593 C13.1380712,11.7573593 12.2426407,10.8619288 12.2426407,9.75735931 L12.2426407,8.75735931 Z" id="Combined-Shape-Copy" fill="#000000" transform="translate(16.242641, 7.757359) rotate(-45.000000) translate(-16.242641, -7.757359) "></path><path d="M5.89339828,3.42893219 C6.44568303,3.42893219 6.89339828,3.87664744 6.89339828,4.42893219 L6.89339828,6.42893219 C6.89339828,6.98121694 6.44568303,7.42893219 5.89339828,7.42893219 C5.34111353,7.42893219 4.89339828,6.98121694 4.89339828,6.42893219 L4.89339828,4.42893219 C4.89339828,3.87664744 5.34111353,3.42893219 5.89339828,3.42893219 Z M11.4289322,5.13603897 C11.8194565,5.52656326 11.8194565,6.15972824 11.4289322,6.55025253 L10.0147186,7.96446609 C9.62419433,8.35499039 8.99102936,8.35499039 8.60050506,7.96446609 C8.20998077,7.5739418 8.20998077,6.94077682 8.60050506,6.55025253 L10.0147186,5.13603897 C10.4052429,4.74551468 11.0384079,4.74551468 11.4289322,5.13603897 Z M0.600505063,5.13603897 C0.991029355,4.74551468 1.62419433,4.74551468 2.01471863,5.13603897 L3.42893219,6.55025253 C3.81945648,6.94077682 3.81945648,7.5739418 3.42893219,7.96446609 C3.0384079,8.35499039 2.40524292,8.35499039 2.01471863,7.96446609 L0.600505063,6.55025253 C0.209980772,6.15972824 0.209980772,5.52656326 0.600505063,5.13603897 Z" id="Combined-Shape" fill="#000000" opacity="0.3" transform="translate(6.014719, 5.843146) rotate(-45.000000) translate(-6.014719, -5.843146) "></path><path d="M17.9142136,15.4497475 C18.4664983,15.4497475 18.9142136,15.8974627 18.9142136,16.4497475 L18.9142136,18.4497475 C18.9142136,19.0020322 18.4664983,19.4497475 17.9142136,19.4497475 C17.3619288,19.4497475 16.9142136,19.0020322 16.9142136,18.4497475 L16.9142136,16.4497475 C16.9142136,15.8974627 17.3619288,15.4497475 17.9142136,15.4497475 Z M23.4497475,17.1568542 C23.8402718,17.5473785 23.8402718,18.1805435 23.4497475,18.5710678 L22.0355339,19.9852814 C21.6450096,20.3758057 21.0118446,20.3758057 20.6213203,19.9852814 C20.2307961,19.5947571 20.2307961,18.9615921 20.6213203,18.5710678 L22.0355339,17.1568542 C22.4260582,16.76633 23.0592232,16.76633 23.4497475,17.1568542 Z M12.6213203,17.1568542 C13.0118446,16.76633 13.6450096,16.76633 14.0355339,17.1568542 L15.4497475,18.5710678 C15.8402718,18.9615921 15.8402718,19.5947571 15.4497475,19.9852814 C15.0592232,20.3758057 14.4260582,20.3758057 14.0355339,19.9852814 L12.6213203,18.5710678 C12.2307961,18.1805435 12.2307961,17.5473785 12.6213203,17.1568542 Z" id="Combined-Shape-Copy-2" fill="#000000" opacity="0.3" transform="translate(18.035534, 17.863961) scale(1, -1) rotate(45.000000) translate(-18.035534, -17.863961) "></path></g></svg></span>';
			// end icon

			// label
			tmp_menu += '<span class="kt-menu__link-text">'+v.menu_name+'</span>';

			// menu arrow
			if(typeof v.children !== 'undefined')
				tmp_menu += '<i class="kt-menu__ver-arrow la la-angle-right"></i>';
			
			// end off link menu
			tmp_menu += '</a>';

			// looping process children
			if(typeof v.children !== 'undefined'){
				tmp_menu += '<div class="kt-menu__submenu"><ul class="kt-menu__subnav"><li class="kt-menu__item  kt-menu__item--parent" aria-haspopup="true"><span class="kt-menu__link"><span class="kt-menu__link-text">'+v.menu_name+'</span></span></li>';
				generateMenu(v.children, (lv+1));
				lv--;
				tmp_menu += "</ul></div>";
			}

			// end of menu link
			tmp_menu += "</li>";
		});
	}

	var menu = function() {
		generateMenu(menu_list,0);
		$('#kt_aside_menu').html('<ul class="kt-menu__nav">'+tmp_menu+'</ul>');
	}

	return {
		init: function () {
			__constuctor();
			menu();
		}
	};
}();

// Class Initialization
jQuery(document).ready(function () {
	myStorage.set("auth");

	// initiate menus after login
	if(myStorage.get() !== null){
		var auth = JSON.parse(myStorage.get());
		
		KTMenusV1.init();
	
		$(".kt-header__topbar-username, .kt-user-card__name").html(auth.nik);

		// change title
		$("a.kt-menu__link.kt-menu__page").click(function(){
			auth['title'] = $(this).attr('title');
			myStorage.store(JSON.stringify(auth));
		});

		if(typeof auth.title !== 'undefined')
			document.title = auth.title;

	}

	// logout button every page
	$('.btn-logout').click(function(e){
		e.preventDefault();

        myStorage.set('auth');
        myStorage.delete();
        if(myStorage.get()==null)
            window.location = base_url;
	});

	$('a.btn-back, button.btn-back, input[type=button].btn-back').click(function(){
		history.back(-1);
	});
});