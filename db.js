var mongo = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://sdavis:goojyRunWG7AzblS@cluster0.8k9zf.mongodb.net/brick_breaker?retryWrites=true&w=majority";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("brick_breaker");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("scores").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
