const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path')
const app = express();
const {createViewApi} = require('./public/api')
const {createRestApi} = require('./backend/api')
const {mailer} = require('./backend/otpserver')

const port = 9090;

app.use(bodyParser.json());

app.use(
    session({
        name: 'SESSION_ID',      // cookie name stored in the web browser
        secret: 'my_secret',     // helps to protect session
        cookie: {
            maxAge: 30 * 86400000, // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session is stored 30 days
        }
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.static(path.join(__dirname, 'public')))


createRestApi(app)
createViewApi(app)
mailer(app)

app.listen(port , () => {
    console.log('server running on port', port)
})