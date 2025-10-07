import express from 'express';
import { userApi } from './controller/userApi.js';

 export  const userRoute=express.Router();

userRoute.post('/searchAllMovies',userApi.getAllMovies)
userRoute.post('/filter',userApi.filterMovies)
userRoute.post('/searchMovieType',userApi.getMovieType)