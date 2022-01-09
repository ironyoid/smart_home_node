const express = require("express");
const app = express();
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://192.168.0.100:1883')
const pump_err = [
  'PUMP_NO_WATER',
  'PUMP_FULL',
  'PUMP_TIMEOUT',
  'PUMP_ERR'
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
    led_lenta_glb = LedLentaParse(message.toString().slice(0,-1));
  }
})

function LedLentaParse(data)
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

function SendMQTT(topic, val)
{
  console.log(topic.toString())
  client.publish(topic, val ? '1' : '0')
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
  backlight: "OFF",
  temp: 0,
  hum: 0,
  led_lenta: "0,0,0,0,5"
};

let topics_storage = {
  lamp: "/smart_home/wire_lamp/ex_state/to/",
  wireless_lamp: "/smart_home/wireless_lamp/to/",
  ir_lamp: "/smart_home/ir_lamp/to/",
  music: "/smart_home/music/to/",
  backlight: "/smart_home/led_lenta/to/",
};

let points_storage = [
  {time: "ON"},
  {mliters: 0},

];
let week_storage = {
  week_on: "9:00",
  week_off: "21:00",
  weekend_on: "11:00",
  weekend_off: "21:00"
};
let schedule_sw = {
  state: false
}
points_storage[0] = {weekday: "Monday", time: "09:00",mliters: 100};
points_storage[1] = {weekday: "Monday", time: "10:00",mliters: 200};
points_storage[2] = {weekday: "Monday", time: "11:00",mliters: 300};
points_storage[3] = {weekday: "Monday", time: "12:00",mliters: 400};

app.post("/buttons", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  data_storage[request.body.button] = request.body.state ? "ON" : "OFF";
  console.log(data_storage);
  SendMQTT(topics_storage[request.body.button], request.body.state);
  response.json(request.body);

});

app.post("/backlight", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  console.log(request.body);
  response.json(request.body);
});
app.post("/chart_t", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  points_storage = request.body;
  console.log(points_storage);
  response.json(points_storage); //comments
});

app.get("/switch_status", function (req, res) {
  let str = JSON.stringify(points_storage);
  res.send({"pump_state":data_storage.container, "lamp_real":data_storage.lamp_real, "lamp_state":data_storage.lamp, "wireless_state":data_storage.wireless_lamp,
    "ir_state":data_storage.ir_lamp, "music_state": data_storage.music, "backlight": data_storage.backlight,
    "temp":data_storage.temp, "hum": data_storage.hum, "led_lenta":led_lenta_glb
  });
});

app.post("/chart_status", jsonParser, function (req, res) {
  res.json(points_storage);
});

app.post("/week_status", jsonParser, function (req, res) {
  res.json(week_storage);
});

app.post("/week_on", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.week_on = req.body.time;
  res.json(req.body);
});

app.post("/week_off", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.week_off = req.body.time;
  res.json(req.body);
});

app.post("/weekend_on", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.weekend_on = req.body.time;
  res.json(req.body);
});

app.post("/weekend_off", jsonParser, function (req, res) {
  console.log(req.body);
  week_storage.weekend_off = req.body.time;
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

app.listen(3000);