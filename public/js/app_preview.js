$(document).ready(function(){
	appPreview.init();
});

var appPreview = (function(){
	
	var $postTitle  = $('#postTitle');
	var $imageContainer = $('#imageContainer');
	var $contentBody = $('#contentBody');

	var init = function(){
		var postData = window.postData;
		var imageElem = '<img src="'+postData.postCover+'">';
		$postTitle.html(postData.postTitle);
		$imageContainer.append(imageElem);
		$contentBody.html(postData.postContent);
	}

	return {
		init:init
	}

}());