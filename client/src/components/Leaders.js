import React from "react";
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://nati:WuX3NF5mghh8ncxh@cluster0.8k9zf.mongodb.net/brick_breaker?retryWrites=true&w=majority";

let leadersScore; 
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("brick_breaker");
//   //Find all documents in the customers collection:
//   dbo.collection("scores").find({}).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     leadersScore = result;
//     db.close();
//   });
// });

function Leaders () {
  
  return (
  <html>
	<head>
	    <title>LeaderBoard</title>
	</head>

	<body>
		<h2>High Scores</h2>
		<table>
			<tr>
				<td>Ranking</td>
				<td>UserName</td>
				<td>Score</td>
			</tr>
        </table>
    </body>
  </html>
  )
};

export default Leaders;
