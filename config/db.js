//jshint esversion:9


const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load env files
dotenv.config({ path: './config.env'});

const atlasUri = 'mongodb+srv://dbFritz:ma$19rie@cluster0-begoj.mongodb.net/giftapp?retryWrites=true&w=majority';
const localUri = 'mongodb://127.0.0.1:27017/giftapp';

const connectDB = async () => {
    const conn = await mongoose.connect(localUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }); 

    console.log(`mongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);

    
};

module.exports = connectDB;