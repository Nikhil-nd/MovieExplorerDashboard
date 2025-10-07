// models/Movie.js
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String },
  Type:{ type: String },
  Director:{type:String}
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
