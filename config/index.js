/*****************************************************************
 *      This file requires and exports all the library configs
 *****************************************************************/
const mongooseLoader = require('./mongoose');

module.exports.init = async () => {
    const mongoConnection = await mongooseLoader();
    console.log('MongoDb Initialized');
}
