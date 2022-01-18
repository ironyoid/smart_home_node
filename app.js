
const mongo = require("./db");
const express = require("express");
const cron = require('node-cron');
const app = express();
const jsonParser = express.json();

//mongo.GenerateTestDay("sensors_2")
//mongo.DropSensorsData("sensors_2");
// mongo.GetSensorsData({}, "sensors_2").then(docs => 
//   { 
//     console.log(docs)
//   }).catch(e => console.error(e))

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://192.168.0.100:1883')
const pump_err = [
  'PUMP_NO_WATER',
  'PUMP_FULL',
  'PUMP_TIMEOUT',
  'PUMP_ERR'
]
const daysofweek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
client.subscribe('/smart_home/#', function (err) {
  if (!err) {
    console.log("Successfuly subscribed...")
  }
})
let led_lenta_glb;

client.on('message', function (topic, message) {
  //console.log(topic.toString())
  //console.log(message.toString())
  if(topic == "/smart_home/temp/from/")
  {
    data_storage.temp = parseFloat(message);
  }
  if(topic == "/smart_home/hum/from/")
  {
    data_storage.hum = parseFloat(message);
  }
  if(topic == "/smart_home/pump_state/from/")
  {
    data_storage.container = pump_err[parseInt(message)];
  }
  if(topic == "/smart_home/wire_lamp/real_state/from/")
  {
    if(parseInt(message) == 1)
    {
      data_storage.lamp_real = "ON";
    } else if(parseInt(message) == 0)
    {
      data_storage.lamp_real = "OFF";
    }
  }
  if(topic == "/smart_home/wire_lamp/time/from/")
  {
    let tmp_wkn = message.toString().split(';');
    let tmp = tmp_wkn[0].split(',');
    week_storage.week_on_min = parseInt(tmp[0]);
    week_storage.week_off_min = parseInt(tmp[1]);
    tmp = tmp_wkn[1].split(',');
    week_storage.weekend_on_min = parseInt(tmp[0]);
    week_storage.weekend_off_min = parseInt(tmp[1]);
  }
  if(topic == "/smart_home/wire_lamp/ex_state/from/")
  {
    if(parseInt(message) == 1)
    {
      data_storage.lamp = "ON";
    } else if(parseInt(message) == 0)
    {
      data_storage.lamp = "OFF";
    }
  }
  if(topic == "/smart_home/wireless_lamp/from/")
  {
    if(parseInt(message) == 1)
    {
      data_storage.wireless_lamp = "ON";
    } else if(parseInt(message) == 0)
    {
      data_storage.wireless_lamp = "OFF";
    }
  }
  if(topic == "/smart_home/ir_lamp/from/")
  {
    if(parseInt(message) == 1)
    {
      data_storage.ir_lamp = "ON";
    } else if(parseInt(message) == 0)
    {
      data_storage.ir_lamp = "OFF";
    }
  }
  if(topic == "/smart_home/led_lenta/from/")
  {
    data_storage.backlight = LedLentaGet(message.toString().slice(0,-1));
  }
  if(topic == "/smart_home/water_schd/from/")
  {
    points_storage = ChartParse(message.toString().slice(0,-1))
    //console.log(points_storage)
    //console.log(ChartSend(points_storage))
  }
})

function div(val, by){
  return (val - val % by) / by;
}

function ChartParse(data)
{
  let storage = []
  let buf = data.split(';');
  for(let i = 0; i < buf.length; i++)
  {
    let tmp = buf[i].split(',');
    tmp[0] = parseInt(tmp[0]);
    tmp[1] = parseInt(tmp[1]);

    let week = div(tmp[0], 1440);
    let minute = tmp[0] - 1440 * week;
    let h_and_m = ParseWeek(minute);
    if(tmp[0] != 0)
    {
      let str_tmp = {weekday: daysofweek[week], time: h_and_m, mliters: tmp[1]};
      storage.push(str_tmp);
    }
  }
  return storage;
}

function ChartSend(data)
{
  function FindWeekNumber(weeklist, day)
  {
    for(let i = 0; i < weeklist.length; i++)
    {
      if(weeklist[i] == day)
      {
        return i;
      }
    }
    return -1;
  }
  let out_str = [
    "0,0;",
    "0,0;",
    "0,0;",
    "0,0;",
  ]
  for(let i = 0; i < data.length; i++)
  {
    let day = FindWeekNumber(daysofweek, data[i].weekday);
    let minute = WeekTimeParse(data[i].time);
    let sum = day*1440 + minute;
    //console.log(`day = ${day}, minute = ${minute}, sum = ${sum},`)
    out_str[i] = `${sum},${data[i].mliters};`;
  }
  let str = "";
  for(let i of out_str)
  {
    str = str + i;
  }
  client.publish('/smart_home/water_schd/to/', str);
  return str;
}

function LedLentaGet(data)
{
    let buf = data.split(',');
    let led_lenta = {
      r: buf[0],
      g: buf[1],
      b: buf[2],
      brg: buf[3],
      mode: buf[4],
    }
    //console.log(led_lenta);
    return led_lenta;
}
function LedLentaPut(data)
{
    return `${data.r},${data.g},${data.b},${data.brg},${data.mode};`;
}
function SendMQTT(topic, val)
{
  console.log(topic.toString())
  client.publish(topic, val ? '1' : '0')
}

function SendWeek(topic, val)
{
  console.log(topic.toString())
  let tmp = `${val.week_on_min},${val.week_off_min};${val.weekend_on_min},${val.weekend_off_min};`
  console.log(tmp)
  client.publish(topic, tmp)
}

function ParseWeek(data)
{
  let hour = ('0' + div(data, 60).toString()).slice(-2);
  let minute = ('0' + (data % 60).toString()).slice(-2);
  return `${hour}:${minute}`
}

function SendLED(topic, val)
{
  console.log(topic.toString())
  console.log(val.toString())
  client.publish(topic, val)
}

function WeekTimeParse(time){
  let tmp = time.split(':');
  tmp[0] = parseInt(tmp[0]);
  tmp[1] = parseInt(tmp[1]);
  let out_time = tmp[0]*60 + tmp[1];
  //console.log(out_time);
  return out_time;
}

app.use(express.static(__dirname + "/public_old/"));

let data_storage = {
  lamp: "OFF",
  lamp_real: "OFF",
  wireless_lamp: "OFF",
  ir_lamp: "OFF",
  pump: "OFF",
  music: "OFF",
  container: "Full",
  backlight: "",
  temp: 0,
  hum: 0,
};

let topics_storage = {
  lamp: "/smart_home/wire_lamp/ex_state/to/",
  wireless_lamp: "/smart_home/wireless_lamp/to/",
  ir_lamp: "/smart_home/ir_lamp/to/",
  music: "/smart_home/music/to/",
  backlight: "/smart_home/led_lenta/to/",
  week: "/smart_home/wire_lamp/time/to/"
};

let week_storage = {
  week_on_min: 0,
  week_off_min: 0,
  weekend_on_min: 0,
  weekend_off_min: 0,
};

let schedule_sw = {
  state: false
}
let points_storage = [];
points_storage[0] = {weekday: "Monday", time: "09:00",mliters: 100};
points_storage[1] = {weekday: "Monday", time: "10:00",mliters: 200};
points_storage[2] = {weekday: "Monday", time: "11:00",mliters: 300};
points_storage[3] = {weekday: "Monday", time: "12:00",mliters: 400};


FillTestStatistics = function(size) {
  let tmp_stat = []
  for(let i = 0; i < size; i++)
  {
    tmp_stat.push({x: Math.floor((Date.now() / 1000) + i * 100000), y: 2*i});
    //tmp_stat.push({x: i, y: 2*i});
  }
  return tmp_stat;
}

app.post("/buttons", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  data_storage[request.body.button] = request.body.state ? "ON" : "OFF";
  console.log(data_storage);
  SendMQTT(topics_storage[request.body.button], request.body.state);
  response.json(request.body);

});

app.post("/led_lenta_send", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  data_storage.backlight = request.body;
  SendLED(topics_storage.backlight, LedLentaPut(request.body));
  response.send(request.body);
});

app.post("/chart_t", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  points_storage = request.body;
  console.log(points_storage);
  ChartSend(points_storage);
  response.json(points_storage); //comments
});

app.get("/switch_status", function (req, res) {
  res.send({"pump_state":data_storage.container, "lamp_real":data_storage.lamp_real, "lamp_state":data_storage.lamp, "wireless_state":data_storage.wireless_lamp,
    "ir_state":data_storage.ir_lamp, "music_state": data_storage.music, "backlight": data_storage.backlight,
    "temp":data_storage.temp, "hum": data_storage.hum
  });
});

app.post("/led_lenta", jsonParser, function (req, res) {
  console.log(data_storage.backlight);
  res.send(data_storage.backlight);
});

app.post("/chart_status", jsonParser, function (req, res) {
  res.json(points_storage);
});

app.post("/week_status", jsonParser, function (req, res) {
  let tmp = {
    week_on: ParseWeek(week_storage.week_on_min),
    week_off: ParseWeek(week_storage.week_off_min),
    weekend_on: ParseWeek(week_storage.weekend_on_min),
    weekend_off: ParseWeek(week_storage.weekend_off_min),
  }
  res.json(tmp);
});

app.post("/week_on", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.week_on = req.body.time[0];
  week_storage.week_on_min = WeekTimeParse(week_storage.week_on);
  SendWeek(topics_storage.week, week_storage);
  res.json(req.body);
});

app.post("/week_off", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.week_off = req.body.time[0];
  week_storage.week_off_min = WeekTimeParse(week_storage.week_off);
  SendWeek(topics_storage.week, week_storage);
  res.json(req.body);
});

app.post("/weekend_on", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.weekend_on = req.body.time[0];
  week_storage.weekend_on_min = WeekTimeParse(week_storage.weekend_on);
  SendWeek(topics_storage.week, week_storage);
  res.json(req.body);
});

app.post("/weekend_off", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.weekend_off = req.body.time[0];
  week_storage.weekend_off_min = WeekTimeParse(week_storage.weekend_off);
  SendWeek(topics_storage.week, week_storage);
  res.json(req.body);
});

app.post("/schedule_sw", jsonParser, function (req, res) {
  console.log(req.body);
  schedule_sw.state = req.body.state;
  res.json(req.body);
});

app.post("/schedule_sw_status", function (req, res) {
  res.json(schedule_sw);
});

app.post("/statistics", jsonParser, function (req, res) {
  //let tmp = FillTestStatistics(10);
  console.log(req.body);
  mongo.FindDay(res, req.body)
  //res.json(tmp);
});

cron.schedule('* * * * *', function(){
  
  mongo.PeriodicDataPut(data_storage, "sensors_3");
});
//setInterval(PeriodicDataPut, 2000, PutSensorsData, data_storage);
app.listen(3000);