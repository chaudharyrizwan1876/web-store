import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB connected");

    // Force delete — chahe ho ya na ho
    const result = await mongoose.connection.collection("users").deleteOne({ email: "admin@webstore.com" });
    console.log("🗑️  Delete result:", result.deletedCount, "document(s) removed");

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    await mongoose.connection.collection("users").insertOne({
      firstName: "Admin",
      lastName: "User",
      email: "admin@webstore.com",
      password: hashedPassword,
      phone: "0000000000",
      address: "Admin Office",
      isAdmin: true,
      cart: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin created successfully!");
    console.log("   Email:    admin@webstore.com");
    console.log("   Password: Admin@12345");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();