// 현재시간 - 방문시간이 2일 이내면 빨간색, 2~7일이면 주황색, 7일 이상이면 파란색 리턴
let getCircleColor = (data) => {
  let date = new Date(data)
  let now = new Date()
  let day = 86400000

  if (now - date < day * 2) {
    return userOptions.circleColor.red
  } else if (now - date > day * 2 && now - date < day * 7) {
    return userOptions.circleColor.orenge
  } else if (now - date > day * 7 && now - date < day * 14) {
    return userOptions.circleColor.blue
  } else {
    return userOptions.circleColor.green
  }
}
//데이터를 받아 현재 시간 기준으로 얼마나 지났는지 반환
let getPastTime = (data) => {
  let date = new Date(data)
  let now = new Date()
  let day = 86400000

  return (now - date) / day
}

//확진자 정보를 눌렀을 때
function clickPeopleContent() {
  console.log("click")
  let id = this.id
  let value = this.value
  let num = id.substring(4)

  if (id === "li__0") {
    for (let i in arrPeopleList) {
      $("#li__" + arrPeopleList[i]).prop("value", value)
      $("#li__" + arrPeopleList[i]).trigger("click")
    }
    if (value % 2 === 0) {
      let sw = new kakao.maps.LatLng(36.291746, 127.318748),
        ne = new kakao.maps.LatLng(36.408766, 127.42385)

      let bounds = new kakao.maps.LatLngBounds(sw, ne) // 인자를 주지 않으면 빈 영역을 생성한다.
      map.panTo(bounds)
    }
  }
  // 클릭 해제
  if (value % 2 === 1) {
    $("#" + this.id).css("background-color", "white")
    if (num !== "0") {
      let i = 0
      while (i < 10) {
        if (markerList.has(num + "_" + i)) {
          markerList.get(num + "_" + i).setVisible(false)
          circleList.get(num + "_" + i).setMap(null)
          infowindow.close()
        } else {
          break
        }
        i++
      }
    }
    // 클릭
  } else {
    $("#" + this.id).css("background-color", " #ffbb93")
    if (num !== "0") {
      let i = 0
      while (i < 10) {
        if (markerList.has(num + "_" + i)) {
          markerList.get(num + "_" + i).setVisible(true)
          circleList.get(num + "_" + i).setMap(map)
          map.panTo(markerList.get(num + "_" + i).getPosition())
        } else {
          break
        }
        i++
      }
    }
  }

  value++
  $("#" + this.id).prop("value", value)
}
