$(document).ready(function(){
	annoucement.init();
});



var annoucement = (function(){

	var $table = $('#annoucementsTbl');
	var $editBtn = $('#editAnn');
	var $deleteBtn = $('#deleteAnn');
	var $previewBtn = $('#previewAnn');	
	var tbl;

	
	var init = function(){
		showSnackbar();
		selection();
		showToolTips();
		editAnnoucement();
		previewAnnoucement();
		deleteAnnoucement();
		tbl = createTbl();
	}

	var createTbl = function(){
		return $table.DataTable({
			ajax:'/admin/get_all_annoucenments',
			aoColumns:[
				{"data" : "post_title"},
				{
					"data":"is_published",
					"render":function(data, type, row){
						
						return data ? "Published" : "Draft"
					}
				},
				{
					"data":"post_date",
					render:function(data){
						return moment(new Date(data)).format("MMMM D, YY")
					}
				}
			],
			createdRow:function(row, data, dataIndex){
				$(row).attr('data-objId',data._id);
			}
		});
	}

	


	var showSnackbar = function(){
		var opts = {
			content:toastMsg,
			style:'toast',
			timeout:5000
		}
		if(toastMsg.length > 0 ){
			$.snackbar(opts);
		}
	}
	
	var selection = function(){
		$('#annoucementsTbl tbody').unbind().on('click', 'tr', function(){
			if($(this).hasClass('selected')){
				$(this).removeClass('selected');
			}else{
				$('#annoucementsTbl tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		})
	}

	var editAnnoucement = function(){
		$editBtn.unbind().click(function(){
			var $tblBody =  $("#annoucementsTbl tbody tr");
			if($tblBody.hasClass('selected')){
				var annoucementId = $('tr.selected').data('objid');
				window.location.href="http://localhost:3000/admin/edit_post/"+annoucementId;
			}else{
				actionNotif();
			}
		})
	}

	var previewAnnoucement = function(){
		$previewBtn.unbind().click(function(){
			var $tblBody =  $("#annoucementsTbl tbody tr");
			if($tblBody.hasClass('selected')){
				var annoucementId = $('tr.selected').data('objid');
				getAnnouncementDetails(annoucementId).then(function(data){
					var newWindow = window.open('http://localhost:3000/admin/app_preview');
					newWindow.postData = {
						postTitle:data.annoucementDetails.post_title,
						postContent:data.annoucementDetails.content,
						postCategory:data.annoucementDetails.post_category,
						postCover:data.annoucementCover
					}
				})
			}else{
				actionNotif();				
			}
		})
	}

	var actionNotif = function(){
		var actionOpt  = {
			content:"Please select an annoucement in the table",
			timeout:5000
		} 
		$.snackbar(actionOpt);
	}
	var showToolTips = function(){
		$('[data-toggle="tooltip"]').tooltip();
	}

	var getAnnouncementDetails= function(postId){
		return $.ajax({
			type:'GET',
			url:'/admin/get_annoucement/'+postId
		})
	}

	var deleteAnnoucement = function(){
		$deleteBtn.unbind().click(function(){
		var $tblBody =  $("#annoucementsTbl tbody tr");

			if($tblBody.hasClass('selected')){
				var annoucementId = $('tr.selected').data('objid');
				$('body').overhang({
					type:'confirm',
					message:'Are you sure you want to delete this annoucement',
					yesMessage:'Yes please',
					noMessage:'No, cancel it',
					callback:function(data){
						if(data){
							deletePost(annoucementId).then(function(){
								tbl.row('.selected').remove().draw( false );
							})
						}
					}
				});
			}else{
				actionNotif();
			}
			
		})
		
	}

	var deletePost = function(postId){
		return $.ajax({
			type:'GET',
			url:'/admin/delete_annoucement/'+postId
		})
	}
	return { 
		init: init
	}
	
}());