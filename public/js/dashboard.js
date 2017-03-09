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
	var init = function(){
		map = createMap();
		createEmergencyAnalytics();
		listenOnSos();
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
	var createEmergencyAnalytics = function(){
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawEmergencyStats);
	}

	var drawEmergencyStats =function(){
		var data = google.visualization.arrayToDataTable([
        ['Emergency', 'Alerts Recieved', { role: 'style' } ],
        ['Fire',3,'color:#F44336'],
        ['Earthquake',4, 'color:#795548'],
        ['Flood',9,'color:color:#03A9F4'],
        ['Medical Emergency', 24,'color:#E91E63'],
        ['Burglary', 10,'color:#283593'],
        ['Intimidation', 12,'color:#009688'],
        ['Heinous Crime', 5,'color:#263238'],
        ['Accident', 1,'color:#FF5722'],
        ['Other', 34,'color:#FFFF00']
       
      ]);
	

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
	return  { init: init }
}());