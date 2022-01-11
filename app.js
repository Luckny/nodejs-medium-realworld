require('dotenv').config(); //to use .env variables
const express = require('express');
const loaders = require('./loaders');
const passport = require('passport');
const strategy = require('./loaders/passport');
const app = express();

passport.use(strategy)

async function startServer() {


    await loaders.init();

    app.listen(3000, () => {
        console.log('Serving on port 3000')
    })

}


app.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('since you are authenticated see this')
})


startServer();


