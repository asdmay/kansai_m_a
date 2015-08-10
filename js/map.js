var message;
var cityCircle;

var citymap = [
    {
	name: 'Eating fish alive',
	center: new google.maps.LatLng(35.644291, 134.902585),//latitude,longitude
	mission: 'Eat lunch.',
	point: 600
    }
    ,
    {
	name: 'Sky diving',
	center: new google.maps.LatLng(35.516289, 134.789334),
	mission: 'Eat lunch.',
	point: 500
    }
    ,
    {
	name: 'Eat Ramen at deep in mountain',
	center: new google.maps.LatLng(34.381647, 135.901582),
	mission: 'Eat lunch.',
	point: 50
    }
    ,
    {
	name: 'Try Syakyo at temple',
	center: new google.maps.LatLng(34.891136, 134.658155),
	mission: 'Eat lunch.',
	point: 300
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
    var Potition_latitude = pos.coords.latitude; //latitude
    var Potition_longitude = pos.coords.longitude;//longitude
    initialize(Potition_latitude,Potition_longitude);
}

function errorCallback(error) {
    console.log("error");
}

function initialize(x,y) {
    var myLatlng = new google.maps.LatLng(35.644291, 134.902585);//USJ
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
            strokeOpacity: 0.8, 
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: citymap[city].center,
            radius: 50
        };
        // View circle on the map
        cityCircle = new google.maps.Circle(populationOptions);
    }

    //put a marker at the current location
    var marker = new google.maps.Marker({
    	position: myLatlng,
    	map: map,
    	title:"Your position",
	draggable: true
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
	}//displays the closest takumi point spot from the current location

	console.log(citymap[min_i]);
	var radius = 50;
	var point = 0;
	if(min<radius){
	    name = citymap[min_i].name;
	    point = citymap[min_i].point;
	    return  point;
	}}    

    function updateTakumiPoint() {
	var pos = marker.getPosition();
	var lat = pos.lat();
	var lng = pos.lng();
	var point = checkTakumiPoint(lat, lng);
	localStorage.setItem("lat",lat);
	localStorage.setItem("lng",lng);
	localStorage.setItem("point",point);
	localStorage.setItem("name",name);
	if(point == null){
	    point = 0 ;
	    name = ""; 
	}
	document.getElementById("show_point").innerHTML = point;
	document.getElementById("show_mission").innerHTML = name;
	//var temp = "";
	//for(i=0;i<citymap.length;i++){
	 //   temp += citymap[i].name + " "; 
//	}
//	  document.getElementById("show_mission").innerHTML = temp + "<br/>";
//	console.log(temp)
    }

    updateTakumiPoint();
}
//console.log(citymap[1].name);
//document.getElementById("test").innerHTML ="TEST"; //citymap[1].name;
   
google.maps.event.addDomListener(window, 'load', initialize);
