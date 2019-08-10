import { urlencoded, json } from 'body-parser';
import express from 'express';
import cors from 'cors';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose'

import schema from './schema'


const app = express();

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())

// Connecting to the database
const url = "mongodb://127.0.0.1:27017/mydb"
mongoose.connect(url,{useNewUrlParser: true}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
}); 

app.use('/graphql',graphqlHttp({
    schema : schema,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.send("Hi")
});


app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});