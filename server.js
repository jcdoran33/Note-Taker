//lay out requires, Express, path, fs etc
const express = require("express");
const path = require("path");
const fs = require("fs");
//add api const definition (should link to index.js? in routes folder?)
const api = require("./routes/index.js"); //unsure if I need this
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

//main content below

//HTML routes:
//GET /notes - return notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});



//API routes:
//the below may be unecessary (the readFile part?) just need to return something to getNotes in the other index.js file
//GET api/notes should read the db.json file, and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
    // res.status(200).json(`${req.method} request received to get notes`);
    // console.info(`${req.method} request received to get notes`);
    // //should read db.json, return all saved notes as JSON
    // fs.readFile("/db/db.json", "utf8", (err, data) => {
    //     if (err){
    //         console.error(err);
    //     } else {
    //     console.log(data);
    //     const savedNotes = JSON.parse(data);
    //     // res.sendFile(path.join(__dirname, "./db/db.json"));
    //     return savedNotes; // should there be .then here instead of return?
    //     }
    // })
    // .then((savedNotes) => res.json(savedNotes));

    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);

});

//trying simpler method below (where we will manipulate in index.js instead of here)
// app.get("/api/notes", (req, res) => {
//     res.sendFile(path.join(__dirname, "db/db.json"));
// });

//POST to api/notes should receive a new note to save on the request body, add it to the db.json file, then return new note to client.
//Note - use a UUID generator
app.post("/api/notes", (req, res) => {
    let oldNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    newNote.id = uuidv4();
    oldNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(oldNotes));
    res.json(oldNotes)
});

//DELETE
app.delete("/api/notes/:id", (req, res) => {
    let noteId = req.params.id;
    let oldNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newArray = [];
    for (let i =0 ; i < oldNotes.length; i++) {
        if (oldNotes[i].id !== noteId) {
            newArray.push(oldNotes[i]);
        }
    };

    //.map() .filter()
    //let updatedNotes = oldNotes.filter((note) => note.id != noteId)

    fs.writeFileSync("./db/db.json", JSON.stringify(newArray));
    res.json(newArray);
});

//GET * should return the index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

//app.listen on our PORT number
app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`));