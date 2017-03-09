$(document).ready(function(){
	post.init();
});


var post = (function(){

	var $form = $('#postForm');
	var $file = $('#cover_file');
	var $fileInput = $('#cover_photo');
	var $previewBtn = $('#previewApp');
	var $postStatus = $('#postStatus');
	var $draftBtn = $('#saveDraft');
	var $publishBtn = $('#publishPost');


	var init = function(){
		valiateForm();
		populateBase64();
		previewPost();
		saveDraft();
		publishPost();
		showToolTips();
	}

	var valiateForm = function(){
		$form.validate({
			rules:{
				post_title:"required",
				content:"required",
				post_category:"required",
				cover_photo:"required"
			}
		})
	}

	var getBase64 = function (file, cb) {
	   var reader = new FileReader();

	    reader.readAsDataURL(file.files[0]);

	  	reader.onload = function (e) {
	      cb(null, reader.result)
	   };

	   reader.onerror = function (error) {
	     cb(error, null)
	   };
	}

	var rescaleImg = function(base64){
		return new Promise(function(resolve) {
			var canvas = document.createElement("canvas");
			canvas.width = 360;
			canvas.height = 250;
			var context = canvas.getContext('2d');
			$('<img/>').attr('src',base64).on('load',function(){
				context.scale(360/this.width, 250/this.height);
				context.drawImage(this, 0, 0);
				resolve(canvas.toDataURL());
			})
		})
	}

	var populateBase64 = function(){
		$file.unbind().change(function(){
			getBase64(this, function(err, base64){
				if(base64){
					rescaleImg(base64).then(function(rescaledImg) {
						$fileInput.val(rescaledImg);
					})
				}
			})
		})
	}
	
	var previewPost = function(){
		$previewBtn.unbind().click(function(){

			var isFormFilledUp = $form.valid();
			if(isFormFilledUp){				
				var formData = getPostData($form.serializeArray());
				var newWindow = window.open('http://localhost:3000/admin/app_preview');
				newWindow.postData = {
					postTitle:formData.post_title,
					postContent:formData.content,
					postCategory:formData.post_category,
					postCover:formData.cover_photo
				}
			}else{
				filledUpNotif();
			}
		})

	}

	var filledUpNotif = function(){
		var notifOpt = {
			content:"Please fillup the annoucement form",
			timeout:5000
		}
		$.snackbar(notifOpt);
	}
	var getPostData = function($arr){
		if(typeof $arr.length !== undefined) {
			var serializedArray  = {};			
			$arr.forEach(function(obj){
				serializedArray[obj.name] = obj.value
			})
			return serializedArray;
		}
	}
	var saveDraft = function(){
		$draftBtn.unbind().click(function(){
			if(!$form.valid()) filledUpNotif();
			$postStatus.val('false');
		})
	}
	var publishPost = function(){
		$publishBtn.unbind().click(function(){
			if(!$form.valid()) filledUpNotif();
			$postStatus.val('true');
		})
	}


	var showToolTips = function(){
		$('[data-toggle="tooltip"]').tooltip();
	}
	return {
		init:init
	}

}())


