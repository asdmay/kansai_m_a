var message;
var cityCircle;

var citymap = [
    {
	name: 'USJ',
	center: new google.maps.LatLng(34.664722, 135.433056),//緯度,経度
	point: 10
    }
    ,
    {
	name: '海遊館',
	center: new google.maps.LatLng(34.654472, 135.428889),
	point: 20
    }
    ,
    {
	name: '大阪市立科学館',
	center: new google.maps.LatLng(34.691306, 135.491583),
	point: 30
    }
    ,
    {
	name: '交通科学博物館',
	center: new google.maps.LatLng(34.670715, 135.461895),
	point: 40
    }
];

function start_func(){
    get_location();
}

function get_location(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition
        (successCallback,errorCallback);
    } else {
        console.log("error");
    }
}

function successCallback(pos) {
    var Potition_latitude = pos.coords.latitude; //緯度
    var Potition_longitude = pos.coords.longitude;//軽度
    initialize(Potition_latitude,Potition_longitude);
}

function errorCallback(error) {
    console.log("error");
}

function initialize(x,y) {
    var myLatlng = new google.maps.LatLng(34.664722, 135.433056);//USJ
    //var myLatlng = new google.maps.LatLng(x,y); 
    
    var mapOptions = {
    	zoom: 14,
    	center: myLatlng,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var map = new google.maps.Map
    (document.getElementById("map_canvas"), mapOptions);
    
    for (var city in citymap) {
        var populationOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8, //透明度
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: citymap[city].center,
            radius: 50
        };
        // マップへcityのための円を加える
        cityCircle = new google.maps.Circle(populationOptions);
    }

    //現在地にマーカーを置く
    var marker = new google.maps.Marker({
    	position: myLatlng,
    	map: map,
    	title:"Your position",
	draggable: true//マーカーを動かせるようにする
    });
    google.maps.event.addListener(marker, 'dragend', function(ev){
	updateTakumiPoint();
    });


    function checkTakumiPoint(lat, lng) {
	var min = Number.MAX_VALUE;
	var min_i = 0;

	for( var i = 0; i < citymap.length; i++){
	    var distance = google.maps.geometry.spherical.computeDistanceBetween(citymap[i].center, new google.maps.LatLng(lat, lng));

  	    if( min > distance ){
 		min = distance;
   		min_i = i;
   	    }
	}//一番近い大阪の集客数の多いところを表示させる

	console.log(citymap[min_i]);


	var radius = 50;
	var point = 0;
	if(min<radius){
	    point = citymap[min_i].point;
	}
	return point;
    }

    function updateTakumiPoint() {
	var pos = marker.getPosition();
	var lat = pos.lat();
	var lng = pos.lng();
	var point = checkTakumiPoint(lat, lng);
	localStorage.setItem("lat",lat);
	localStorage.setItem("lng",lng);
	localStorage.setItem("point",point);
	document.getElementById("show_point").innerHTML = point;
    }

    updateTakumiPoint();
}

google.maps.event.addDomListener(window, 'load', initialize);
