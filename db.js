let MongoClient = require('mongodb').MongoClient, assert = require('assert');

const url = "mongodb://localhost:27017/test";

let PutSensorsData = function(data, collection)
{
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    insertDocuments(data, db, collection, function(db) {
        db.close();
    });
  });
}

const GetSensorsData = (filter, collection) => new Promise((res, rej) => {
  MongoClient.connect(url, (err, db) => {
      if (err) return rej(err);
      assert.equal(null, err);
      console.log("Connected successfully to server");
      let tmp = findDocuments(db, collection, filter, (db, docs) => {
          db.close();
          res(docs);
      });
    });
});

let DropSensorsData = function(cll)
{
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    let collection = db.collection(cll).drop(function(err, result){
        db.close();
    });
  });
}

let insertDocuments = function(data, db, cll, callback) {
  let collection = db.collection(cll);
  collection.insertOne(data, function(err, result) {
    assert.equal(err, null);
    callback(db);
  });
}

let findDocuments = async function(db, cll, filter, callback) {
  let collection = db.collection(cll);
    collection.find(filter).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(db, docs);
  });
}

let PeriodicDataPut = function(data, cll) {
    let tm = Math.floor(Date.now() / 1000);
    console.log(`time = ${tm} hum = ${data.hum} temp = ${data.temp}`);
    PutSensorsData({time: tm, hum: data.hum, temp: data.temp}, cll);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

let GenerateTestDay = function(cll) {
    let start_time = 1640984400;
    let data = []
    for(let i = 0; i < 456; i++)
    {
        data.push({time: start_time + 60*60 * i, temp: Math.floor(getRandomArbitrary(0, 50))});
    }
    //console.log(data)
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        let collection = db.collection(cll);
        collection.insertMany(data, function(err, result) {
            assert.equal(err, null);
            db.close();
          });

      });
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function startOfMonth(date)
{  
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date)
{  
  return new Date(date.getFullYear(), 0, 1);
}

let FindDay = function(res, param) {
    let time = new Date()
    //console.log(time)

    let start_year_tm = startOfYear(time).getTime() / 1000;
    let start_month_tm = startOfMonth(time).getTime() / 1000;
    let end_day_tm = Math.floor(time / 1000);
    let start_day_tm = time.setUTCHours(0,0,0,0) / 1000;
    let start_week_tm = getMonday(time.getTime()) / 1000;
    //console.log(start_month)
    // console.log(param)
    // console.log(start_day_tm)
    // console.log(end_day_tm)
    // console.log(start_week_tm)
    // console.log(start_month_tm)
    // console.log(start_year_tm)
    let states = {
      'day':start_day_tm,
      'week':start_week_tm,
      'month':start_month_tm,
      'year':start_year_tm,
    }
    GetSensorsData({time: {$gte: states[param.radio], $lte: end_day_tm}}, "sensors_3").then(docs => 
    { 
      let tmp = AveragingData(docs);
      //console.log(docs)
      //console.log(tmp)
      res.json(tmp)

    }).catch(e => console.error(e))
}
// week = 168
// month = 744
// year = 8760
AveragingData = function(docs) {

  RemoveStep = function(buf, step)
  {

    console.log(`buf.len1 = ${buf.length}`)
    let tmp = []
    for(let i = 0; i < buf.length; i = i + step)
    {
      tmp.push(buf[i])
      console.log(`i = ${i}`)
    }
    console.log(`buf.len2 = ${tmp.length}`)
    return tmp
  }
  if(docs.length <= 40)
  {
    return docs;
  }
  else if((docs.length > 40) && (docs.length <= 168))
  {
    return RemoveStep(docs, 4);
  }
  else if((docs.length > 168) && (docs.length <= 744))
  {
    return RemoveStep(docs, 24);
  }
  else if((docs.length > 744))
  {
    return RemoveStep(docs, 219);
  }
}

//FindDay();

module.exports.FindDay = FindDay;
module.exports.DropSensorsData = DropSensorsData;
module.exports.GenerateTestDay = GenerateTestDay;
module.exports.GetSensorsData = GetSensorsData;
module.exports.PutSensorsData = PutSensorsData;
module.exports.PeriodicDataPut = PeriodicDataPut;