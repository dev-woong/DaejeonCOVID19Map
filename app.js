document.getElementById("map").style.height = window.innerHeight - 20 + "px"
let container = document.getElementById("map")
// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
let options = {
  center: new kakao.maps.LatLng(36.350439, 127.384851),
  level: 3,
}
//맵 생성
let map = new kakao.maps.Map(container, options)

// 주소 검색
document.getElementById("btnSearch").onclick = function () {
  let txtSearch = document.getElementById("txtSearch").value
  if (txtSearch === "") {
    alert("검색어를 입력해주세요.")
    return false
  }

  //키워드 대전으로 한정
  txtSearch = "대전 " + txtSearch

  // 장소 검색 객체를 생성합니다
  var ps = new kakao.maps.services.Places()

  // 키워드로 장소를 검색합니다
  ps.keywordSearch(txtSearch, placesSearchCB)

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new kakao.maps.LatLngBounds()

      for (var i = 0; i < data.length; i++) {
        displayMarker(data[i])
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds)
    }
  }

  // 지도에 마커를 표시하는 함수입니다
  function displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
    })

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, "click", function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent(
        '<div style="padding:5px;font-size:12px;">' + place.place_name + "</div>"
      )
      infowindow.open(map, marker)
    })
  }
}
