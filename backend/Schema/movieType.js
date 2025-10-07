import mongoose from "mongoose";

const movieType=new mongoose.Schema({
    name:{type:String , required:true}
})
export const movieTypeModel=mongoose.model('moviesType',movieType)