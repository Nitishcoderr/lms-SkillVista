import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const connectionToDb = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/skillVista'
    )
    if (connection) {
      console.log(`Connected to MongoDb ${connection.host}`);
    }
  } catch (e) {
    console.log(e);
    process.exit(1)
  }
}

export default connectionToDb;