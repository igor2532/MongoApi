const express = require('express')
const cors=require("cors");
// const store = require('./store.json')
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
const url = "mongodb://localhost:27017/";
// создаем объект MongoClient и передаем ему строку подключения
const corsOptions ={
   origin:'*', 
   credentials:false,          
   optionSuccessStatus:200,
}
const urlencodedParser = bodyParser.urlencoded({
  extended: false,
});
const client = new MongoClient(url);
client.connect().then(mongoClient=>{
    console.log("Подключение установлено");
    console.log(mongoClient.options.dbName); // получаем имя базы данных
});



const app = express()
app.use(cors())
app.use(express.json());



async function run() {
    try {
        await client.connect();
        const db = client.db("lpk_lidkon");
        const collection = db.collection("users");
        const count = await collection.countDocuments();
        const results = await collection.find().toArray();
        return results;
    }catch(err) {
        console.log(err);
    } finally {
        await client.close();
    }
}






app.get("/",(req,response)=>{
   console.log(run().catch(console.error).then((data)=>response.send(data)))
})


// app.listen(process.env.PORT)
app.listen(3001)