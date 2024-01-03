require("dotenv").config();
const express = require('express');
const app = express();
const protect = require('./src/middleware/protect');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readPreference: 'secondaryPreferred',
})
    .then(() => {
        console.log('connected to database');
    })
    .catch(() => {
        console.log('Mongodb connection error');
    });


app.use(cors());
app.options('*', cors());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type']
}));
app.use(
    bodyparser.urlencoded({
        limit: '3mb',
        extended: false,
    })
);
app.use(bodyparser.json({ limit: '3mb' }));

app.use(protect);

app.use('/api/auth', require('./src/router/auth'));

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));