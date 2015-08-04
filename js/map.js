var message;
var cityCircle;

function start_func(){
	get_location();
}
// ( 1 )位置情報を取得します。
function get_location(){
	if (navigator.geolocation) {
        // 現在の位置情報取得を実施 正常に位置情報が取得できると、
        // successCallbackがコールバックされます。
        navigator.geolocation.getCurrentPosition
        (successCallback,errorCallback);
    } else {
        console.log("error");
    }
}
// ( 2 )位置情報が正常に取得されたら
function successCallback(pos) {
	var Potition_latitude = pos.coords.latitude; //緯度
	var Potition_longitude = pos.coords.longitude;　//軽度

    // 位置情報が取得出来たらGoogle Mapを表示する
    initialize(Potition_latitude,Potition_longitude);
}

function errorCallback(error) {
    console.log("error");
}

// ( 3 )Google Map API を使い、地図を読み込み
function initialize(x,y) {

    // Geolocationで取得した座標を代入
    // FirefoxOS端末及びシミュレータが現在地をただしくとれないため一時的に固定
    var myLatlng = new google.maps.LatLng(34.664722, 135.433056);//USJ
    // var myLatlng = new google.maps.LatLng(34.706193, 135.494145);//総情
    //var myLatlng = new google.maps.LatLng(x,y);

    var mapOptions = {
    	zoom: 14,
    	center: myLatlng,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    // MapTypeId に、地図タイプを指定
    // HYBRID 衛星画像と主要な通りが表示されます
    // ROADMAP 通常の地図画像が表示されます
    // SATELLITE 衛生画像が表示されます。
    // TERRAIN 地形や植生などのマッピングをします。

    var map = new google.maps.Map
    (document.getElementById("map_canvas"), mapOptions);


        var populationOptions = {
            strokeColor: red,
            strokeOpacity: 0.8, //透明度
            strokeWeight: 2,
            fillColor: red,
            fillOpacity: 0.35,
            map: map,
            center: new google.maps.LatLng(34.664722, 135.433056),
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
	updateHajiraiPoint();
    });

    function checkHajiraiPoint(lat, lng) {
	var min = Number.MAX_VALUE;
	var min_i = 0;
	
	for( var i = 0; i < citymap.length; i++){
	    var distance = google.maps.geometry.spherical.computeDistanceBetween(citymap[i].center, new google.maps.LatLng(lat, lng));
  	    if( min > distance ){
 		min = distance;
   		min_i = i;
   	    }
	}//一番近い大阪の集客数の多いところを表示させる
	var radius = Math.sqrt(citymap[min_i].area/Math.PI);
	var point = 0;
	if(min<radius){
	    point = citymap[min_i].population;
	}
	return point;
    }

    function updateHajiraiPoint() {
	var pos = marker.getPosition();
	var lat = pos.lat();
	var lng = pos.lng();
	var point = checkHajiraiPoint(lat, lng);
	localStorage.setItem("lat",lat);
	localStorage.setItem("lng",lng);
	localStorage.setItem("point",point);
	document.getElementById("show_point").innerHTML = point;
    }

    updateHajiraiPoint();

google.maps.event.addDomListener(window, 'load', initialize);
