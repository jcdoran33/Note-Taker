//lay out requires, Express, path, fs etc
const express = require("express");
const path = require("path");
const fs = require("fs");
//require UUID for user ID - use uudiv4(); to call
const { v4: uuidv4 } = require('uuid');
//variable definitions - app and PORT
const PORT = 3001;

const app = express();

//parse incoming stuff
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//designate the public folder
app.use(express.static('public'));

//main content

//HTML routes:
//GET /notes - return notes.html

//GET * should return the index.html

//API routes:
//GET api/notes should read the db.json file, and return all saved noes as JSON

//POST to apit/notes should receive a new note to save on the request body, add it to the db.json file, then return new note to client.
//Note - use a UUID generator