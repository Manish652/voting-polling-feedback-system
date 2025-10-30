import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminModel from "./models/AdminModel.js";
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/votingSystemPro", { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const admin = new AdminModel({
      name: "ManishY",
      email: "manishbhunia89@gmail.com",
      password: "wer41234"
    });

    await admin.save();
    console.log("Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
