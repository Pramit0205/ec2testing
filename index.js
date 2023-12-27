require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send("<h1> pramit's  your effect is happening by ci/cd pipeline NodeJS Demo Docker Apllication Successfully Deployed</h1>");
});
app.get("/home", (req, res) => {
    res.send("<h1> there NodeJS from home</h1>");
});
app.get("/pramit", (req, res) => {
    res.send("<h1>pramit's there NodeJS from home</h1>");
});
app.get("/hardik", (req, res) => {
    res.send("<h1>hello hardik</h1>");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));