import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import 'dotenv/config';



const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/your-db-name";

const seedUser = async () => {
 
  try {
    
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const usersData = [
      {
        name: "admin",
        email: "admin@gmail.com",
        password: "12345678",
        role: "admin",
      },
      {
        name: "user1",
        email: "user1@gmail.com",
        password: "12345678",
        role: "user",
      },
      {
        name: "user2",
        email: "user2@gmail.com",
        password: "12345678",
        role: "user",
      },
    ];
    for (const user of usersData)  {
      const exists = await User.findOne({ email: user.email });
      if (exists) return;

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });

      await newUser.save();
    };
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedUser();
