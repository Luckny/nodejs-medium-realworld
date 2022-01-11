const mongoose = require('mongoose');
const mongooseLoader = async () => {
    const connection = await mongoose.connect('mongodb://127.0.0.1:27017/realworld-app', { useNewUrlParser: true, useUnifiedTopology: true });
    return connection.connection.db;
}

module.exports = mongooseLoader;