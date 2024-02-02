const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// ready made middleware
app.use(cors());
app.use(express.json());


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // add database function here
    const UserCollection = client.db("endgametaskManagementApp").collection("user");

    const TaskCollection = client.db("endgametaskManagementApp").collection("task");


// user api

app.post("/user",async(req,res)=>{
  const user=req.body;
  console.log(user)
    const query={email:user.email}
    const existingUser=await UserCollection.findOne(query)
    if(existingUser){
      return res.send({message:"user already exists",insertedId:null})
    }
    const result=await UserCollection.insertOne(user)
    console.log(result)
    res.send(result)
})
app.get("/user",async(req,res)=>{
    const result=await UserCollection.find().toArray();
    console.log(result)
    res.send(result)
})



// add task
app.post("/addtask",async(req,res)=>{
  const task=req.body;
  const result=await TaskCollection.insertOne(task)
  res.send(result)
})

app.get("/addtask",async(req,res)=>{
  const result=await TaskCollection.find().toArray();
  res.send(result)
  })

  // user added task
  app.get("/userAddedtask",async(req,res)=>{
    console.log(req.query.email);
    let query = {};
    if (req.query?.email) {
        query = { email: req.query.email }
    }
    const result=await TaskCollection.find(query).toArray();
      res.send(result)
  })

// delete
app.delete("/deletetask/:id",async(req,res)=>{
const id=req.params.id;
const query={_id:new ObjectId(id)}
console.log("deleted id",query)
const result=await TaskCollection.deleteOne(query)
res.send(result)
})

// update task

app.get("/updatetask/:id",async(req,res)=>{
const id=req.params.id;
console.log(id)
const query={_id:new ObjectId(id)}
const result=await TaskCollection.findOne(query);
console.log("update",result)
res.send(result)
})

app.patch("/updatetask/:id", async (req, res) => {
const id = req.params.id;
const filter = {
  _id: new ObjectId(id)
}
const item = req.body;
const updatedItem = {
  $set: {
    title:item.title,
    description:item.description,
    visibility:item.visibility,
    
  }
}
const result = await TaskCollection.updateOne(filter, updatedItem);
res.send(result)
})

// update task status
app.patch("/updateTaskStatus/:id", async (req, res) => {
const id = req.params.id;
const status = req.body.status;

const filter = {
  _id: new ObjectId(id)
};

const update = {
  $set: {
    status: status
  }
};

const result = await TaskCollection.updateOne(filter, update);
console.log(result)
res.send(result);
});

// // Create Task API
// app.post("/create-task",async(req,res)=>{
//   const task=req.body;
//     const result=await TasksCollection.insertOne(task)
//     console.log(result)
//     res.send(result)
// })
// app.get("/all-task",async(req,res)=>{
//     const result=await TasksCollection.find().toArray();
//     res.send(result)
// })


//get logged in user info

app.get("/currentUserInfo/:email", async(req,res)=>{
  const email=req.params.email;
  console.log(email);

  const query={
    email: email
  }

  const result= await UserCollection.findOne(query);

  res.send(result);
})


// update user profile info

app.put("/updateUserInfo/:email", async(req,res)=>{
  const email=req.params.email;
  const userInfo=req.body;
  console.log(userInfo);
  console.log(email);

  const query={
    email: email,

  }

  const updateDoc={
    $set: {
      displayName: userInfo?.userName,
      photoURL: userInfo?.userImage
    }
  }

  const result= await UserCollection.updateOne(query, updateDoc);

  res.send(result);
})







    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// root api
app.get("/", (req, res) => {
  res.send("Taskflow server is have running");
});



// where the server port is
app.listen(port, () => {
  console.log(`Taskflow is running on port: ${port}`);
});
