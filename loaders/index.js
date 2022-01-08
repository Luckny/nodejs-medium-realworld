const mongooseLoader = require('./mongoose');
module.exports.init = async () => {
    const mongoConnection = await mongooseLoader();
    console.log('MongoDb Initialized')
}