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

let markerList = new Map()
let circleList = new Map()

let userOptions = {
  circleSize: 200,
  circleColor: {
    red: "#ef5350",
    orenge: "#ffa726",
    blue: "#42a5f5",
    green: "#66bb6a",
  },
}

let arrPeopleList = []

document.getElementById("map").style.height = window.innerHeight - 20 + "px"
//맵 생성
let options = {
  center: new kakao.maps.LatLng(36.350439, 127.384851),
  level: 5,
}
let map = new kakao.maps.Map(container, options)

// 메뉴 숨김 버튼 클릭 시
$("#hideMenu__checkbox").change(function () {
  if ($("#hideMenu__checkbox").is(":checked")) {
    // $("#search__checkbox").prop("checked", true)
    if (window.innerWidth > 768) {
      $(".menu").css("-webkit-animation-name", "bicScreenHideMenu")
    } else {
      $(".menu").css("-webkit-animation-name", "smallScreenHideMenu")
    }
  } else {
    $(".menu").css("-webkit-animation-name", "showMenu")
    if (window.innerWidth > 768) {
      $(".menu").css("-webkit-animation-name", "bicScreenShowMenu")
    } else {
      $(".menu").css("-webkit-animation-name", "smallScreenShowMenu")
    }
  }
})

kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  infowindow.close()
})

$(function () {
  let data = jsonData.responseJSON
  let reverseData = data.reverse()

  $("#people__checkbox").prop("checked", true)

  // 주소-좌표 변환 객체를 생성합니다
  let geocoder = new kakao.maps.services.Geocoder()

  //전체 선택 li element 및 event 추가
  let li = document.createElement("li")
  li.innerHTML = "전체 선택"
  li.className = "li__0"
  li.id = "li__0"
  li.value = 0
  document.getElementsByClassName("people__content")[0].append(li)
  let liId = document.getElementById("li__0")
  liId.addEventListener("click", clickPeopleContent, false)

  //확진자 li element 및 event 추가
  for (let i in reverseData) {
    arrPeopleList.push(data[i].confirmer)
    let li = document.createElement("li")
    li.innerHTML = data[i].confirmer + "번 " + data[i].place
    li.className = "li__" + data[i].confirmer
    li.id = "li__" + data[i].confirmer
    li.value = 0
    document.getElementsByClassName("people__content")[0].append(li)
    let liId = document.getElementById("li__" + data[i].confirmer)
    liId.addEventListener("click", clickPeopleContent, false)
  }

  //확진자 번호
  for (let i in data) {
    for (let j in data[i].route) {
      if (getPastTime(data[i].route[j].dateOfExposure[length + 1]) > 30) return false
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

          kakao.maps.event.addListener(marker, "click", function () {
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            infowindow.setContent(
              '<div style="padding:5px;font-size:12px;">' +
                data[i].confirmer +
                "번 " +
                "<br/>" +
                data[i].route[j].dateOfExposure[length] +
                "<br/>" +
                data[i].route[j].mutual +
                "</div>"
            )
            infowindow.open(map, marker)
            // infowindow.close()
          })

          // 지도에 표시할 원을 생성합니다
          let circle = new kakao.maps.Circle({
            center: coords, // 중심 좌표
            radius: userOptions.circleSize, // 미터 단위의 원의 반지름입니다
            strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            fillColor: circleColor, // 채우기 색깔입니다
            fillOpacity: 0.4, // 채우기 불투명도 입니다
          })

          // 지도에 원을 표시합니다
          circle.setMap(map)
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          // map.setCenter(coords)
          markerList.set(data[i].confirmer + "_" + j, marker)
          marker.setVisible(false)

          circleList.set(data[i].confirmer + "_" + j, circle)
          circle.setMap(null)
        }
      })
    }
  }
})
