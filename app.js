const express = require("express");
const app = express();
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
app.use(express.static(__dirname + "/public/"));

let data_storage = {
lamp: "ON",
  wireless_lamp: "OFF",
  ir_lamp: "OFF",
  pump: "OFF",
  music: "ON",
  container: "Full",
  backlight: "ON"
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
  response.json(request.body);

});

app.post("/chart_t", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  points_storage = request.body;
  console.log(points_storage);
  response.json(points_storage); //comment
});
app.get("/switch_status", function (req, res) {
  let str = JSON.stringify(points_storage);
  res.send({"pump_state":data_storage.container, "lamp_state":data_storage.lamp, "wireless_state":data_storage.wireless_lamp,
    "ir_state":data_storage.ir_lamp, "music_state": data_storage.music, "backlight": data_storage.backlight});
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