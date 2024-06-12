const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors())
const {initializeDatabase} = require('./initialize');

app.use(express.json());

let db = null;


const initializeServer = async () => {
    try{
        db = await initializeDatabase();   
        app.listen(3005, () => console.log("Server Started at Port 3005...."));
    }
    catch(err){
        console.log(`Error: ${err}`);
        process.exit(1);
    }
}
initializeServer()
app.get('/transactions', async (req, res) => {
  try{
   const {page = 1, perPage=10, search=""} = req.query;
   const offset = (page - 1 ) * perPage;
   const searchQuery = search ? `WHERE title LIKE '%${search}%' OR description LIKE '%${search}%' OR price LIKE '%${search}%'` : "";
   const query = `
       SELECT *
        FROM
       transactions
       ${searchQuery} 
       LIMIT ${perPage} OFFSET ${offset}; 
   `;
   const transactionDetails = await db.all(query);
   res.send(transactionDetails);
  }
  catch(err){
   console.log(err)
   res.status(500).send("Internal Server Issue")
  }
})