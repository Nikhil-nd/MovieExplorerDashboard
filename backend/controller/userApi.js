import Movie from "./../Schema/movies.js";
import { movieTypeModel } from "../Schema/movieType.js";

export class userApi{

     static async getAllMovies(req,res){
        try {
              const [rows]=await Movie.find()

              if(rows.length>0){
                res.send({message:'success',status:200,data:rows[0]})
              }
        } catch (error) {
            res.status(500).send({message:'error',error:error.message})
        }
     
    }


    static async filterMovies(req,res){
     try {
      const { filterKey } = req.body; 
      

      const movie = await Movie.find({
        $or: [
          { title: { $regex: filterKey, $options: "i" } },
          { brand: { $regex: filterKey, $options: "i" } },
          { category: { $regex: filterKey, $options: "i" } }
        ]
      });

      if (movie.length > 0) {
        res.status(200).send({ message: "success", data: movie });
      } else {
        res.status(404).send({ message: "No movies found", data: [] });
      }
    } catch (error) {
      res.status(500).send({ message: "error", error: error.message });
    }
  

    }

    static async getMovieType(req,res){

      try {
        let movieTypes=movieTypeModel.find();
        if(movieTypes.length>0){
          res.status(200).send({message:'success',data:movieTypes})
        }
        
      } catch (error) {
        res.send({message:error.message, status:500})
      }
    }
}