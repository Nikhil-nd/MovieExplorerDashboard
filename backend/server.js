import express from 'express';
import cors from 'cors';
import {connectDB} from './connection.js'

import {userRoute} from './userRoute.js'


const app=express();
app.use(cors());

app.use(express.json());
  await connectDB();

app.use('/api',userRoute)


app.listen(3000,()=>{console.log('server is running on port 3000')});









