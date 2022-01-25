// const mongo = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb+srv://nati:WuX3NF5mghh8ncxh@cluster0.8k9zf.mongodb.net/brick_breaker?retryWrites=true&w=majority";

// // MongoClient.connect(url, function(err, db) {
// //   if (err) throw err;
// //   const dbo = db.db("brick_breaker");
// //   const myobj = { name: "nat", address: "home " };
// //   dbo.collection("scores").insertOne(myobj, function(err, res) {
// //     if (err) throw err;
// //     console.log("1 document inserted");
// //     db.close();
// //   });
// // });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("brick_breaker");
//   //Find all documents in the customers collection:
//   dbo.collection("scores").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });