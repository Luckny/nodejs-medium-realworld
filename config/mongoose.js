const mongoose = require('mongoose');
const dbURI = 'mongodb://127.0.0.1:27017/realworld-app';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.DB_URI;
}
const options = { useNewUrlParser: true, useUnifiedTopology: true }

module.exports.connectDb = async () => {
    await mongoose.connect(dbURI, options);
    console.log('MongoDB connected!')
}




// /**mongoose.connect(dbURI, options);
//  * This function connects to mongodb
//  * @returns The mongoDB connection
//  */
// const mongooseLoader = async () => {
//     const connection = await mongoose.connect('mongodb://127.0.0.1:27017/realworld-app', { useNewUrlParser: true, useUnifiedTopology: true });
//     return connection.connection.db;
// }

// module.exports = mongooseLoader;