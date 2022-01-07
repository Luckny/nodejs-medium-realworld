const express = require('express');
const { User } = require('./models/users')
const loaders = require('./loaders');
const app = express();

async function startServer() {


    await loaders.init();

    app.listen(3000, () => {
        console.log('Serving on port 3000')
    })

}


startServer();


