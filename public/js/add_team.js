$(document).ready(function(){
	addTeam.init();
});



var addTeam = (function(){
	var $form =  $('#securityForm');

	var init = function(){
		validateForm();
	}

	var validateForm = function(){
		$form.validate({
			rules:{
				email:{
					required:true,
					email:true
				},
				password:"required",
				confirm_password:{
					required:true,
					equalTo:'#password'
				},
				first_name:"required",
				last_name:"required",
				area:"required"
			}
		})
	}

	return {
		init:init
	}
}())