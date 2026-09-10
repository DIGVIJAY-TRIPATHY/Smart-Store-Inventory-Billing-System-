import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../../models/user.model.js";
import {DB_NAME} from "../../constants.js";




const seedAdmin = async () => {
    try {
        await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`,
        );
        console.log("MongoDB connected for seeding...");

        
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log(
                `Admin already exists: ${existingAdmin.username} (${existingAdmin.email}). Seed skip kar rahe hain.`,
            );
            process.exit(0);
        }

        
        const adminData = {
            fullName: process.env.ADMIN_FULLNAME || "Store Admin",
            email: process.env.ADMIN_EMAIL,
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            role: "admin",
        };

        if (!adminData.email || !adminData.username || !adminData.password) {
            throw new Error(
                "ADMIN_EMAIL, ADMIN_USERNAME aur ADMIN_PASSWORD .env mein set karna zaroori hai",
            );
        }

        
        
        const admin = await User.create(adminData);

        console.log("✅ Pehla Admin ban gaya:");
        console.log({
            username: admin.username,
            email: admin.email,
            role: admin.role,
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Admin seeding fail ho gaya:", error.message);
        process.exit(1);
    }
};

seedAdmin();
