import mongoose from "mongoose";

  const dbConnect = async ()=>{
      try{
          mongoose.set("strictQuery", false);
          const connected =await  mongoose.connect(process.env.MONGO_URL);

          console.log(`Mongodb connected ${connected.connections.host}`);
      }
      catch (error){
          console.log(`Error: ${error.message}`);
          process.exit(1);
      }
  };


  export default dbConnect;

// i0mBWW4FK8KoblP0
// mongodb+srv://mhd-azz:<password>@e-commerce-website.p1dglum.mongodb.net/?retryWrites=true&w=majority




// 28Y2IY3Tvg5hv33y
//
// 28Y2IY3Tvg5hv33y


// mongodb+srv://mhd-azz:28Y2IY3Tvg5hv33y@e-commerce-project.0xplufz.mongodb.net/?retryWrites=true&w=majority