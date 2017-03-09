$(document).ready(function(){
	login.init();
})


var login = (function(){
	var $form = $('#loginForm');
	var $formContainer = $('#login-section');

	var init = function(){
		validateForm();
		notif();
	}

	var notif = function(){
		if(message.length > 0 ){
			$formContainer.overhang({
				type:'warn',
				duration:3,
				message:message
			})
		}
	}
	var validateForm = function(){
		$form.validate({
			rules:{
				email:{
					required:true,
					email:true
				},
				password:"required"
			}
		})
	}

	return { init:init };
}())