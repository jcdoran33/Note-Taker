//lay out requires, Express, path, fs etc
const express = require("express");
const path = require("path");
const fs = require("fs");
//add api const definition (should link to index.js? in routes folder?)
const api = require("routes/index.js"); //unsure if I need this
//require UUID for user ID - use uudiv4(); to call
const { v4: uuidv4 } = require('uuid');
//variable definitions - app and PORT
const PORT = process.env.PORT || 3001;

const app = express();

//parse incoming stuff - middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api); //unsure if I need this
//designate the public folder
app.use(express.static('public'));

//main content

//HTML routes:
//GET /notes - return notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});
//GET * should return the index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

//API routes:
//GET api/notes should read the db.json file, and return all saved noes as JSON
app.get("/api/notes", (req, res) => {
    res.status(200).json(`${req.method} request received to get notes`);
    console.info(`${req.method} requst received to get notes`);
});
//POST to apit/notes should receive a new note to save on the request body, add it to the db.json file, then return new note to client.
//Note - use a UUID generator

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`));