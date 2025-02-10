import mongoose from "mongoose";
import config from "../config/config";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

async function connectToMongoDB() {
  const url = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
  await mongoose.connect(url, {
    authSource: "admin",
    user: dbConfig.username,
    pass: dbConfig.password,
  });
  console.log("Connected to MongoDB - ", url);
}

export default connectToMongoDB;
