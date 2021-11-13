const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId=require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxij5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
try{
    await client.connect();
    const database = client.db("product-car");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders")
    const exploreCollection = database.collection("explore")
    const reviewCollection = database.collection("review");
    const userCollection = database.collection("users");

//GET API
app.get("/services", async(req, res) => {
    const cursor = serviceCollection.find({});
    const services = await cursor.toArray();
    res.send(services)
  });
  // GET SINGLE SERVICES
  app.get("/services/:id", async(req, res) => {
const id = req.params.id;
const query ={_id: ObjectId(id)};
const service = await serviceCollection.findOne(query)
res.json(service)
  })
//POST API
app.post('/services', async(req, res)=>{
    const service = req.body;
    console.log('hitted the post', service)

    const result = await serviceCollection.insertOne(service)
    console.log(result);
    res.json(result)
})
//DELETE API
app.delete('/dltOrders/:id', async(req, res)=>{
    const id = req.params.id;
    console.log(id)
    const query ={_id: ObjectId(id)};
    const results = await orderCollection.deleteOne(query)
    console.log(results)
    res.json(results)
})

//GET ANOTHER API
app.get("/orders", async(req, res) => {
  const cursor = orderCollection.find({});
  const orders = await cursor.toArray();
  res.send(orders)
});
//POST ANOTHER API
app.post('/addOrders', async(req, res)=>{
  const order = req.body;
  console.log('hitted the post', order)

  const result = await orderCollection.insertOne(order)
  console.log(result);
  res.json(result)
})
//GET Explore API
app.get("/explore", async(req, res) => {
    const cursor = exploreCollection.find({});
    const explores = await cursor.toArray();
    res.send(explores)
  });
  //POST explore API
  app.post('/explore', async(req, res)=>{
    const explore = req.body;
    console.log('hitted the post', explore)
  
    const result = await exploreCollection.insertOne(explore)
    console.log(result);
    res.json(result)
  })
 //GET Review API
app.get("/review", async(req, res) => {
  const cursor = reviewCollection.find({});
  const explores = await cursor.toArray();
  res.send(explores)
});
//POST Review API
app.post('/review', async(req, res)=>{
  const explore = req.body;
  console.log('hitted the post', explore)

  const result = await reviewCollection.insertOne(explore)
  console.log(result);
  res.json(result)
})
app.post('/users', async (req, res) => {
  const user = req.body;
  user.role = "user";
  const result = await usersCollection.insertOne(user)
  console.log(result)
  res.json(result)
})
app.put('/users', async (req, res) => {
  const user = req.body.user;

  const filter = { email: user.email }
  const options = { upsert: true }
  const updateDoc = { $set: user }

  const result = await usersCollection.updateOne(filter, updateDoc, options);
  console.log(result)
  res.json(result)

})


}
    finally {
      //  await client.close();
      }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log("hello", port);
});
