document.getElementById("map").style.height = window.innerHeight - 20 + "px"
var container = document.getElementById("map")
var options = {
  center: new kakao.maps.LatLng(36.350439, 127.384851),
  level: 3,
}

var map = new kakao.maps.Map(container, options)
