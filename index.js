
const express = require("express");
const { createServer } = require("http");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const { Op } = require('sequelize');
const dotenv = require('dotenv').config();
require('./config/db.js');
const cors = require('cors');
const path = require('path');
const fileUpload = require("express-fileupload");
const clientRoutes = require('./routes/clientroutes.js/index.js')
const fs = require("fs")
const handlebars = require('handlebars');
const app = express();
const httpServer = createServer(app);


app.use(express.static(path.join(__dirname, '/public')));


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  fileUpload()
);


app.use('/client', clientRoutes);


app.use((req, res, next) => {
  const err = new Error(`${req.url} not found in this server`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ status: false, error: err.message });
});

const PORT = process.env.PORT;

httpServer.listen(PORT, function () {
  console.log("listening on *:" + PORT);
});

