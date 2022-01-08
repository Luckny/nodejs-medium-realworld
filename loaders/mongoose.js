const mongoose = require('mongoose');
const mongooseLoader = async () => {
    const connection = await mongoose.connect('mongodb://localhost:27017/realworld-app', { useNewUrlParser: true, useUnifiedTopology: true });
    return connection.connection.db;
}

module.exports = mongooseLoader;