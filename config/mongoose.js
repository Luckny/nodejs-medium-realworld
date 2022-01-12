const mongoose = require('mongoose');
const dbURI = 'mongodb://127.0.0.1:27017/realworld-app';

if (process.env.NODE_ENV === 'production') {
   dbURI = process.env.DB_URI;
}

//MongoDB options
const options = { useNewUrlParser: true, useUnifiedTopology: true };

//The Database connection
module.exports.connectDb = async () => {
   await mongoose.connect(dbURI, options);
   console.log('MongoDB connected!');
};
