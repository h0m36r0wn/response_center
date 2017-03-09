$(document).ready(function(){
	reports.init();
})

var reports = (function(){
	var $table = $('#incidentTbl');
	var $tbl;
	var $resolveBtn = $('.resolve');
	var init = function(){
		$tbl = displayTable();		
		resolveReport();
	}
	var $tblBody = $('#incidentTbl tbody');

	var displayTable = function(){

		return $table.DataTable({
			ajax:'/admin/get_reports',
			aoColumns:[
				{'data':'name'},
				{'data':'mobile_num'},
				{'data':'report_type'},
				{
					'data':'date_reported',
					render:function(data, type, row){
						return moment(new Date(data)).format("MMMM D, YYYY");
					}
				},
				{

					render:function(data,type, row){
						var resolveBtn = '<a data-action="resolve" class="action btn btn-default  btn-success btn-sm" data-objid="'+row._id+'"><i class="material-icons">&#xE5CA;</i></a>';
						var rejectBtn = '<adata-action="remove"  class="action btn btn-default btn-danger btn-sm" data-objid="'+row._id+'"><i class="material-icons">&#xE5CD;</i></a>';
						return resolveBtn+' '+ rejectBtn;
					}
				}
			]
		})
	}
	var resolveReport = function(){
		$('#incidentTbl tbody').unbind().on('click','.action', function(){
			var objId = $(this).data('objid');
			var thisRow = $(this).closest('tr').get(0);
			var action = $(this).data('action');
			confirmAction(objId, action)
				.then(
					function(){
						removeRow(thisRow);
						showNotif('Report successfuly resolve');
					},
					function(err){
						showNotif(err)
					}
				)
		})
	}

	
	var removeRow = function(row){
		$tbl.row(row).remove().draw();
	}

	var confirmAction = function(reportId, type){
		return new Promise(function(resolve, reject) {
			$('body').overhang({
				type:'confirm',
				primary:'#40D47E',
				accent:'#27AE60',
				message:type == 'resolve' ? 'resolve this report ?' : 'remove this report ?',
				yesMessage: type == 'resolve' ? 'resolve now' : 'remove now' ,
				noMessage:'cancel it',
				callback(data){
					if(data){
						sendAction({type:type, reportId:reportId})
							.then(
								function(){ resolve()},
								function(err){ reject(err) }
							)
					}
				}
			})
		})
	}

	var sendAction = function(data){
		return $.ajax({
			url:'/admin/report_action',
			type:'POST',
			data:{ type:data.type, reportId:data.reportId }
		})
	}

	var showNotif = function(toastContent){
		var opts = {
			style:'toast',
			content:toastContent,
			timeOut:2000
		}
		$.snackbar(opts);
	}
	return { init:init }

}())