const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connect successfully");
    } catch (error) {
        console.log('connect failed');
    }
}

module.exports = { connect };