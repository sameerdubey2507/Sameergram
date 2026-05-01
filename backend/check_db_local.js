require('dotenv').config();
const mongoose = require('mongoose');
const foodModel = require('./src/models/food.model');

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        const count = await foodModel.countDocuments();
        console.log("Food count:", count);
        const items = await foodModel.find();
        console.log("Items:", JSON.stringify(items, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkDb();
