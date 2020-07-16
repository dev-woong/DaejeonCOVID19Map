document.getElementById("map").style.height = window.innerHeight - 20 + "px"
let dirJson = ""
if (
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1" ||
  location.hostname === ""
) {
  dirJson = "/data.json"
} else {
  dirJson = "/DeajeonCOVID19Map/data.json"
}
$.ajaxSetup({
  async: false,
})
let jsonData = $.getJSON(dirJson, function (data) {
  return data
})
let container = document.getElementById("map")
// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
let options = {
  center: new kakao.maps.LatLng(36.350439, 127.384851),
  level: 3,
}

let userOptions = {
  circleSize: 200,
  circleColor: {
    red: "#ef5350",
    orenge: "#ffa726",
    blue: "#42a5f5",
  },
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
  let ps = new kakao.maps.services.Places()

  // 키워드로 장소를 검색합니다
  ps.keywordSearch(txtSearch, placesSearchCB)

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      let bounds = new kakao.maps.LatLngBounds()

      for (let i = 0; i < data.length; i++) {
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
    let marker = new kakao.maps.Marker({
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

// document.getElementsByClassName("people__content")[0].onclick = function () {}

$(function () {
  let data = jsonData.responseJSON

  // 주소-좌표 변환 객체를 생성합니다
  let geocoder = new kakao.maps.services.Geocoder()

  //확진자 번호
  for (let i in data) {
    let elem = document.createElement("li")
    elem.innerHTML = data[i].confirmer + "번 " + data[i].place
    document.getElementsByClassName("people__content")[0].append(elem)
    for (let j in data[i].route) {
      if (getPastTime(data[i].route[j].dateOfExposure[length + 1]) > 14) return false
      let circleColor = getCircleColor(data[i].route[j].dateOfExposure[length + 1])
      // 주소로 좌표를 검색합니다
      geocoder.addressSearch("대전" + data[i].route[j].location, function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          let coords = new kakao.maps.LatLng(result[0].y, result[0].x)

          // 결과값으로 받은 위치를 마커로 표시합니다
          let marker = new kakao.maps.Marker({
            map: map,
            position: coords,
          })

          // 마커에 커서가 오버됐을 때 마커 위에 표시할 인포윈도우를 생성합니다
          var iwContent = '<div style="padding:5px;">' + data[i].route[j].mutual + "</div>" // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

          // 인포윈도우를 생성합니다
          var infowindow = new kakao.maps.InfoWindow({
            content: iwContent,
          })

          // 마커에 마우스오버 이벤트를 등록합니다
          kakao.maps.event.addListener(marker, "mouseover", function () {
            // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
            infowindow.open(map, marker)
          })

          // 마커에 마우스아웃 이벤트를 등록합니다
          kakao.maps.event.addListener(marker, "mouseout", function () {
            // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
            infowindow.close()
          })

          // 지도에 표시할 원을 생성합니다
          let circle = new kakao.maps.Circle({
            center: coords, // 중심 좌표
            radius: userOptions.circleSize, // 미터 단위의 원의 반지름입니다
            strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            fillColor: circleColor, // 채우기 색깔입니다
            fillOpacity: 0.5, // 채우기 불투명도 입니다
          })

          // 지도에 원을 표시합니다
          circle.setMap(map)
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords)
        }
      })
    }
  }
})
