const { MongoClient, ObjectID } = require("mongodb");

const Express = require("express");

const Cors = require("cors");

const BodyParser = require("body-parser");

const { request } = require("express");

const uri = "mongodb+srv://sdavis:ADSWQWR81,.@cluster0.8k9zf.mongodb.net/brick_breaker?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const server = Express();

server.use(BodyParser.json());

server.use(BodyParser.urlencoded({ extended: true }));

server.use(Cors());

var collection;

server.post("/create", async (request, response) => {});

server.get("/get", async (request, response) => {});

server.get("/getNearLocation", async (request, response) => {});

server.listen("3000", async () => {
    try {
        await client.connect();
        collection = client.db("brick_breaker").collection("scores");
        collection.createIndex({ "location": "2dsphere" });
    } catch (e) {
        console.error(e);
    }
});

server.post("/create", async (request, response) => {
  try {
      let result = await collection.insertOne(
          {
              "username": request.body.username,
              "score": request.body.score,
              "location": request.body.location
          }
      );
      response.send({ "_id": result.insertedId });
  } catch (e) {
      response.status(500).send({ message: e.message });
  }
});

server.get("/get", async (request, response) => {
  try {
      let result = await collection.find({}).sort({ score: -1 }).limit(3).toArray();
      response.send(result);
  } catch (e) {
      response.status(500).send({ message: e.message });
  }
});

server.get("/getNearLocation", async (request, response) => {
  try {
      let result = await collection.find({
          "location": {
              "$near": {
                  "$geometry": {
                      "type": "Point",
                      "coordinates": [
                          parseFloat(request.query.longitude),
                          parseFloat(request.query.latitude)
                      ]
                  },
                  "$maxDistance": 25000
              }
          }
      }).sort({ score: -1 }).limit(3).toArray();
      response.send(result);
  } catch (e) {
      response.status(500).send({ message: e.message });
  }
});