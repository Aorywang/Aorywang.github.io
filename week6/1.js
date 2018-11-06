function updateTime(){
  var date = new Date()

  var timeHolder = document.querySelector("#time")
  timeHolder.innerHTML = date.getSeconds()

  var timeHolder2 = document.querySelector("#time2")
  timeHolder2.innerHTML = date.getSeconds()

  var timeHolder1 = document.querySelector("#time1")
  timeHolder1.innerHTML = date.getSeconds()

  var timeHolder2 = document.querySelector("#time2")
  timeHolder2.innerHTML = date.getSeconds()

  var timeHolder3 = document.querySelector("#time3")
  timeHolder3.innerHTML = date.getSeconds()

  var timeHolder4 = document.querySelector("#time4")
  timeHolder4.innerHTML = date.getSeconds()

  var timeHolder5 = document.querySelector("#time5")
  timeHolder5.innerHTML = date.getSeconds()

  var timeHolder6 = document.querySelector("#time6")
  timeHolder6.innerHTML = date.getSeconds()

  var timeHolder7 = document.querySelector("#time7")
  timeHolder7.innerHTML = date.getSeconds()


  if(date.getSeconds() == 0){
  timeHolder.style.color="Chocolate"
}
  if(date.getSeconds() < 30) {
    //turn the text red
    timeHolder.style.color="SaddleBrown"
    console.log("less than 30")
  } else {
    //turn the text blue
    timeHolder.style.color="LightSeaGreen"

    console.log("more than 30")
  }
}
updateTime()

setInterval(updateTime,1000)


function deg2rad(d) { return (2 * d / 360) * Math.PI; }
setInterval(() => {
  let minute = document.getElementById("minute");
  let hour = document.getElementById("hour");
  let second = document.getElementById("second");
  let S = new Date().getSeconds() * 6 - 90;
  let M = new Date().getMinutes() * 6 - 90;
  let H = new Date().getHours() * 30 - 90;

  second.style.transform = 'rotate(' + S + 'deg)';
  minute.style.transform = 'rotate(' + M + 'deg)';
  hour.style.transform = 'rotate(' + H + 'deg)';
  }, 10);

  function vec2ang(x, y) {
 angleInRadians = Math.atan2(y, x);
 angleInDegrees = (angleInRadians / Math.PI) * 180.0;
 return angleInDegrees;
}

let nc = document.getElementById("notch-container");
let angle = 0;
let rotate_x = 120;
let rotate_y = 0;

for (let i = 0; i < 60; i++) {
  let thin = document.createElement("div");
  let x = rotate_x * Math.cos(angle) - rotate_y * Math.cos(angle);
  let y = rotate_y * Math.cos(angle) + rotate_x * Math.sin(angle);
  let r = vec2ang(x, y);
  thin.className = "thin";
  thin.style.left = 122 + x + "px";
  thin.style.top = 127 + y + "px";
  thin.style.transform = "rotate(" + r + "deg)";
  nc.appendChild(thin);
  angle +=  (Math.PI / 300) * 10;
}

angle = 0; rotate_x = 120; rotate_y = 0;

for (let i = 0; i < 12; i++) {
  let notch = document.createElement("div");
  let x = rotate_x * Math.cos(angle) - rotate_y * Math.cos(angle);
  let y = rotate_y * Math.cos(angle) + rotate_x * Math.sin(angle);
  let r = vec2ang(x, y);
  notch.className = "notch";
  notch.style.left = 122 + x + "px";
  notch.style.top = 127 + y + "px";
  notch.style.transform = "rotate(" + r + "deg)";
  nc.appendChild(notch);
  angle +=  (Math.PI / 60) * 10;
}
