//lay out requires, Express, path, fs etc
const express = require("express");
const path = require("path");
const fs = require("fs");

//require UUID for user ID - use uudiv4(); to call
const { v4: uuidv4 } = require('uuid');
//variable definitions - app and PORT
const PORT = process.env.PORT || 3001;

const app = express();

//parse incoming stuff - middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//designate the public folder
app.use(express.static('public'));

//=======main content below=======

//HTML routes (catch-all moved to bottom):
//GET /notes - return notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"))
});

//API routes:
//GET api/notes should read the db.json file, and return all saved notes as JSON
app.get("/api/notes", (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(notes);

});

//POST to api/notes should receive a new note to save on the request body, add it to the db.json file, then return new note to client.
//Note - use a UUID generator
app.post("/api/notes", (req, res) => {
    //save current contents of db.json as a variable oldNotes
    let oldNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    //save the body of the incoming request as a variable "newNote"
    let newNote = req.body;
    //add a unique ID to each new note, using "id" key
    newNote.id = uuidv4();
    //push the new Note to the oldNotes array
    oldNotes.push(newNote);
    //now rewrite the db.json file, with the new combined array, oldNotes
    fs.writeFileSync("./db/db.json", JSON.stringify(oldNotes));
    //return the contents of db.json/oldNotes
    res.json(oldNotes);
});

//DELETE a note
app.delete("/api/notes/:id", (req, res) => {
    let noteId = req.params.id;
    let oldNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newArray = [];
    for (let i =0 ; i < oldNotes.length; i++) {
        if (oldNotes[i].id !== noteId) {
            newArray.push(oldNotes[i]);
        }
    };
    fs.writeFileSync("./db/db.json", JSON.stringify(newArray));
    res.json(newArray);
    //could also use .filter instead?
    //.filter()
    //let updatedNotes = oldNotes.filter((note) => note.id != noteId)
});

//catch-all
//GET * should return the index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
});

//app.listen on our PORT number
app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`));