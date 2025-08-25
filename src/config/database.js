const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://admin:admin@cluster0.frzl3z7.mongodb.net/');
}

module.exports = connectDB;