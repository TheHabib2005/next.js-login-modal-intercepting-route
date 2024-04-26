import mongoose from "mongoose";

const conncetToDb = async () => {
  const connection: any = {};
  try {
    const db = await mongoose.connect(
      "mongodb+srv://cdxhabib:poiuuiop@cluster0.rr7ldlq.mongodb.net/next-js-projcets?retryWrites=true&w=majority&appName=Cluster0"
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database:" + error);
  }
};

export default conncetToDb;
