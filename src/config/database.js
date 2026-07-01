const mongoose = require("mongoose");

const connectDB = async () => {

    await mongoose.connect("mongodb+srv://rupinder7298_db_user:R7KugJrCb2bq0XY4@nodeproject.o66bjng.mongodb.net/TechTinder")
}

module.exports = connectDB;
