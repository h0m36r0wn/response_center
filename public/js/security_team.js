$(document).ready(function(){
	securityTeam.init();
});


var securityTeam = (function(){
	
	var $table = $('#securityTbl');
	var tbl

	var init = function(){
		tbl = displayData();
	}

	var displayData = function(){
		return $table.DataTable({
			ajax:'/admin/get_security_team',
			aoColumns:[
				{
					render:function(data,type,row){
						return row.first_name+' '+row.last_name
					}
				},
				{'data':'area'},
				{'data':function(){
					return '<span class="status"></span>'
				}}
			]
		})
	}



	return {
		init:init
	}
}())