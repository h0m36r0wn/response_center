$(document).ready(function(){

	stats.init();
})

var stats = (function(){
	var $sorter = $('#sorter');
	var date = new Date(), y = date.getFullYear(), m = date.getMonth(), t = date.getTime();
	var $table = $('#dateAndTypesTbl');
	var byDataArr;
	var byTypeArr;

	var init = function(){
		protos();
		getData();
		var dates = getLastSevenDays();
		initData(dates);
	}
	var initData = function(dates){
		fetchData(dates)
			.then(function(resp){
				createBarChart(barChartData(resp.data));
				createTbl(resp.data);
				var byTypeData = groupByTypes(resp.data);
				var byDayData =  groupDataByDay(resp.data);
				createChart(createByDayData(byDayData), 'emergencyPerDay','Reports per day');
				createChart(createByTypesData(byTypeData), 'emergencyTypes','Report types per day');
			})
	}
	var getData = function(){
		$sorter.change(function() {
			var dates = getDates($(this).val());
			fetchData(dates)
				.then(function(resp){
					createBarChart(barChartData(resp.data));
					createTbl(resp.data);
					var byTypeData = groupByTypes(resp.data);
					var byDayData =  groupDataByDay(resp.data);
					createChart(createByDayData(byDayData), 'emergencyPerDay','Reports per day');
					createChart(createByTypesData(byTypeData), 'emergencyTypes','Report types per day');
				})
		})
	}

	var barChartData = function(data){
		var emergencyTypes =  {emergency:0, fire:0, earthquake:0, flood:0,
				medical_emergency:0, burglary:0, intimidation:0, heinous_crime:0,
				accident:0, other:0 };
		var typesData = [['Report Type', 'Report Number',{role:'style'}]];
		data.forEach(function(item) {
			emergencyTypes[item.report_type] += 1;
		})
		Object.keys(emergencyTypes).forEach(function(key){
			var metaData = getTypeLblName(key);
			typesData.push([metaData.label, emergencyTypes[key], 'color:'+metaData.color])
		})
		
		return typesData;
	}
	var getTypeLblName = function(reportType){
		switch(reportType){
			case 'emergency': return {label:'Emergency', color:'#F44336'};break;
			case 'fire': return {label:'Fire', color:'#795548'} ;break;
			case 'earthquake': return {label:'Earthquake', color:'#03A9F4'}; break;
			case 'flood': return {label:'Flood', color:'#E91E63'}; break;
			case 'medical_emergency': return {label:'Medical Emergency', color:'#283593'}; break;
			case 'burglary': return {label:'Burglary', color:'#263238'}; break;
			case 'intimidation': return {label:'Intimidation', color:'#FF5722'}; break;
			case 'heinous_crime': return {label:'Heinous Crime', color:'#F44336'}; break;
			case 'accident': return {label:'Accident', color:'#FFFF00'}; break;
			case 'other': return {label:'Other', color:'#009688'}; break;
		}
	}
	var createTbl = function(data){
		var $tbl = $table.DataTable();
		$tbl.clear().draw();
		$.each(data, function(ind, obj){
			$tbl.row.add([obj.name, obj.report_type, moment(obj.date_reported).format
				('MM D, YYYY')]).draw();
		})
	}
	var createByTypesData = function(byTypeData){
		var typesData = [['Date', 'Emergency', 'Fire', 'Earthquake', 'Flood',
		'Medical Emergency', 'Burglary', 'Intimidation', 'Heinous Crime','Accident',
		'Other']];
		Object.keys(byTypeData).forEach(function(obj, ind){
			typesData.push([moment.unix(obj).format('MMM D, YYYY'), byTypeData
				[obj].emergency, byTypeData[obj].fire, byTypeData[obj].earthquake,
				byTypeData[obj].flood, byTypeData[obj].medical_emergency, byTypeData
				[obj].burglary, byTypeData[obj].intimidation, byTypeData[obj].heinous_crime,
				byTypeData[obj].accident, byTypeData[obj].other ]);
		})
		return typesData;
	}
	var createByDayData = function(data){
		var daysData = [['Date','Validated Reports']];
		Object.keys(data).forEach(function(obj, ind) {
			daysData.push([moment.unix(obj).format('MMM D YYYY'), data[obj].length]);
		})
		return daysData;
	}
	var groupDataByDay = function(data){
		var byday = {};
		data.map(function(value){
			var d = moment(new Date(value['date_reported']).withoutTime()).format('MM-DD-YY');
			d = moment(new Date(d)).unix();
			byday[d] = byday[d] || [];
			byday[d].push(value);
		})
		return byday;
	}
	var groupByTypes = function(data){
		var byTypes = {};
		
		data.map(function(value){
			var d = moment(new Date(value['date_reported']).withoutTime()).format('MM-DD-YY');
			d = moment(new Date(d)).unix();
			if(byTypes[d] == undefined) {
				byTypes[d] = {emergency:0, fire:0, earthquake:0, flood:0,
				medical_emergency:0, burglary:0, intimidation:0, heinous_crime:0,
				accident:0, other:0 }
			}
			byTypes[d][value.report_type] += 1;

		})
		
		return byTypes;
	}
	var createChart = function(chartData, elem, chartTitle){
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(function(){
			drawChart(chartData, elem,chartTitle)
		});
	}

	var drawChart = function(chartData, elem, chartTitle){
		var data = google.visualization.arrayToDataTable(chartData)
		var options = {
          title: chartTitle,
          curveType: 'function',
          legend: { position: 'bottom' },
          pointSize: "5",
          animation:{
          	duration: 1000,
          }
        };

        var chart = new google.visualization.LineChart(document.getElementById
        	(elem));

		 chart.draw(data, options);
	}
	var createBarChart = function(chartData){
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(function(){ drawBarChart(chartData)});
	}
	var drawBarChart =function(chartData){
		var data = google.visualization.arrayToDataTable(chartData);
		var opts = {
			title:'Emergency Alerts Recieved',
			height:350,
			bars:'horizontal',
			animation: {
	          duration: 1000,
	          easing: 'out',
	          startup: true
		    }
		}
		var chart = new google.visualization.ColumnChart(document.getElementById('emergencyBar'));
		chart.draw(data, opts);
	}
	var getDates = function(dateType){
		switch(dateType){
			case 'last_month' :
				return  getLastMonth();
				break;
			case 'this_month' :
				return getThisMonth();
				break;
			case 'last_seven_days':
				return getLastSevenDays();
				break;
		}
	}
	var fetchData = function(dates){
		return $.ajax({
			url:'/admin/get_stats?startDate='+dates.startDate+'&endDate='+dates.endDate,
			type:'GET'
		})
	}
	var protos = function(){
		Date.prototype.addDays = function(days) {
		    var dat = new Date(this.valueOf())
		    dat.setDate(dat.getDate() + days);
		    return dat;
		}
		Date.prototype.subtractDays = function(days) {
		    var dat = new Date(this.valueOf())
		    dat.setDate(dat.getDate() - days);
		    return dat;
		}
		Date.prototype.withoutTime = function () {
		    var d = new Date(this);
		    d.setHours(0, 0, 0, 0);
		    return d;
		}
	}
	var getLastMonth = function(){
		var startDate = new Date(y, m - 1, 1).withoutTime();
		var endDate = new Date(y, m, 0).withoutTime();
		return { startDate:startDate, endDate:endDate };
	}

	var getThisMonth = function(){
		var startDate = new Date(y, m, 1).withoutTime();
		var endDate = new Date(y, m + 1, 0).withoutTime();
		return { startDate:startDate, endDate:endDate };
	}

	var getLastSevenDays = function(){
		var startDate = new Date();
		var endDate = startDate.subtractDays(7).withoutTime();
		return { startDate:endDate, endDate:startDate };
	}

	var getBetweenDates = function (range){
		var dates = [];
		var currentDate = range.startDate;
		while(currentDate <= range.endDate){
			dates.push(new Date(currentDate));
			currentDate = currentDate.addDays(1);
		}
		return dates;
	}

	
	return { init: init }
}())