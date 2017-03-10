$(document).ready(function(){
	$.material.init();
	$.material.ripples();
	$.material.input();
	$responseApp.init();
});

var $responseApp = (function(){
	var $emergencyStats =  $('#emergencyStats');
	var socket = io('http://localhost:3000');
	var map;
	var monthDates;
	var $recentContainer = $('#recentContainer');
	var date = new Date(), y = date.getFullYear(), m = date.getMonth(), t = date.getTime();
	var init = function(){
 		protos();
		monthDates = getThisMonth();
		map = createMap();
		displayReports();
		listenOnSos();
		createBarChart();
	}
	var createBarChart = function(){
		getEmergencyStatData(monthDates)
			.then(function(resp){
				createEmergencyAnalytics(barChartData(resp.data));
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
	var createMap = function(){
		switch(page){
			case 'dashboard':
				var gMap = new GMaps({
					el:'#map',
					lat:14.530355, 
					lng:121.071194,
					zoom:16,
					scrollwheel:false,
					mapTypeId: 'satellite'
				});
				var path=[[14.530367,121.067878],[14.529427,121.067703],[14.528076,121.067908],[14.526981,121.068159],[14.526717,121.068659],[14.526717,121.069236],[14.526923,121.069676],[14.527268,121.070032],[14.527642,121.070708],[14.527811,121.071739],[14.527569,121.072718],[14.527033,121.073287],[14.52751,121.073568],[14.527487,121.073742],[14.529302,121.072877],[14.529735,121.07381],[14.529706,121.073939],[14.530404,121.075343],[14.532567,121.074229],[14.532855,121.074012],[14.533257,121.074427],[14.533231,121.074617],[14.533083,121.074731],[14.533358,121.075621],[14.533685,121.075584],[14.534853,121.073948],[14.533674,121.073406],[14.532932,121.072827],[14.532473,121.072212],[14.532128,121.071483],[14.53171,121.069875],[14.531726,121.069894],[14.531665,121.06864],[14.530367,121.067878]];

				polygon = gMap.drawPolygon({
				  paths: path, // pre-defined polygon shape
				  strokeColor: '#F9A825',
				  strokeOpacity: 1,
				  strokeWeight: 3,
				  fillColor: '#FFEB3B',
				  fillOpacity: 0.4
				});
				return gMap
			break;
		}
	}

	var listenOnSos = function(){
		socket.on('sendSos', function(location){
			dashAlert();
			map.addMarker({
				lat:location.lat,
				lng:location.lng,
				title:"Sos",
				infoWindow:{
					content:'<h3>'+location.type+'</h3>'
				}
			})
			map.panTo({lat:location.lat, lng:location.lng})

		})
	}

	var dashAlert = function(){
		var iconElem = '<i class="material-icons">&#xE000;</i>';
		var messageElem = "An sos was recieved!"
		$('body').overhang({
			type:"warn",
			duration:3,
			html:true,
			message:iconElem+" "+messageElem
		})
	}
	var createEmergencyAnalytics = function(chartData){
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(function(){
			drawEmergencyStats(chartData)
		});
	}

	var drawEmergencyStats =function(chartData){
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

		var chart = new google.visualization.ColumnChart(document.getElementById('emergencyStats'));
		chart.draw(data, opts);
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


	var getEmergencyStatData = function(dates){
		return $.ajax({
					url:'/admin/get_stats?startDate='+dates.startDate+'&endDate='+dates.endDate,
					type:'GET'
				})
	}

	var getThisMonth = function(){
		var startDate = new Date(y, m, 1).withoutTime();
		var endDate = new Date(y, m + 1, 0).withoutTime();
		return { startDate:startDate, endDate:endDate };
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

	var getRecentReports = function(){
		return $.ajax({
			type:'GET',
			url:'/admin/get_recent_reports?limit=7'
		});
	}

	var displayReports = function(){
		getRecentReports()
			.then(function(resp){
				var reports = resp.reports;
				$.each(reports, function(ind, obj){
					var type = getTypeLblName(obj.report_type);
					var isValidated = obj.isValidated == true ? 'Resolved' : 'Not yet resolve';
					var elem = '<div class="list-group-item">';
					elem += 		'<div class="row-content">';
					elem += 			'<div class="least-content">'+moment(obj.date_reported).startOf('minute').fromNow()+'</div>';
					elem += 			'<h4 class="list-group-item-heading">'+obj.name+'</h4>';
					elem += 			'<p class="list-group-item-text">'+type.label+'</p>';
					elem += 			'<p class="list-group-item-text">'+isValidated+'</p>';
					elem += 		'</div>';
					elem +=		'</div>';
					elem +=		'<div class="list-group-separator"></div>';
					$recentContainer.prepend(elem);
				})
			})
	}

	return  { init: init }
}());