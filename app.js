require('dotenv').config(); //to use .env variables
const express = require('express');
const loaders = require('./loaders');
const app = express();

async function startServer() {


    await loaders.init();

    app.listen(3000, () => {
        console.log('Serving on port 3000')
    })

}


startServer();


