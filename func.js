// 현재시간 - 방문시간이 2일 이내면 빨간색, 2~7일이면 주황색, 7일 이상이면 파란색 리턴
let getCircleColor = (data) => {
  let date = new Date(data)
  let now = new Date()
  let day = 86400000

  if (now - date < day * 2) {
    return userOptions.circleColor.red
  } else if (now - date > day * 2 && now - date < day * 7) {
    return userOptions.circleColor.orenge
  } else {
    return userOptions.circleColor.blue
  }
}

let getPastTime = (data) => {
  let date = new Date(data)
  let now = new Date()
  let day = 86400000

  return (now - date) / day
}
