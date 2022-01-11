const express = require('express');
const { User } = require('./models')
const config = require('./config');
const app = express();

async function startServer() {


    await config.init();

    app.listen(3000, () => {
        console.log('Serving on port 3000')
    })

}


startServer();


