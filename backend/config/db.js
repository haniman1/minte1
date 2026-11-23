import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  if (connected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    connected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
  }
};

export default connectDB;
