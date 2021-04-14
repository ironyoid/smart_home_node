const express = require("express");
const app = express();
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/pics"));
app.use(express.static(__dirname + "/public/pickerjs"));
app.use(express.static(__dirname + "/public/pickerjs/dist"));
app.use(express.static(__dirname + "/public/mobile-select/js"));
app.use(express.static(__dirname + "/public/mobile-select/css"));
// mongoClient.connect(function(err, client){
//
//   const db = client.db("usersdb");
//   const collection = db.collection("users");
//   let user = {name: "Tom", age: 24};
//   collection.insertOne(user, function(err, result){
//
//     if(err){
//       return console.log(err);
//     }
//     console.log(result.ops);
//     client.close();
//   });
// });
let data_storage = {
lamp: "ON",
  wireless_lamp: "OFF",
  ir_lamp: "OFF",
  pump: "OFF",
  music: "ON",
  container: "Full",
  backlight: "ON"
};

app.post("/buttons", jsonParser, function (request, response) {
  if(!request.body) return response.sendStatus(400);
  data_storage[request.body.button] = request.body.state ? "ON" : "OFF";
  console.log(data_storage);
  response.json(request.body);

});
// app.get(/sw_\d\/on$/, function (req, res) {
//
//   console.log("switch #" + req.path[4] + " is on");
//   res.send("hui1");
// });
//
// app.get(/sw_\d\/off$/, function (req, res) {
//
//   console.log("switch #" + req.path[4] + " is off");
//   res.send("hui2");
// });

app.get("/switch_status", function (req, res) {
  res.send({"pump_state":data_storage.container, "lamp_state":data_storage.lamp, "wireless_state":data_storage.wireless_lamp,
    "ir_state":data_storage.ir_lamp, "music_state": data_storage.music, "backlight": data_storage.backlight});
});

app.listen(3000);