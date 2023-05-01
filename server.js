const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
const jsonraw = fs.readFileSync('./db/db.json');
const notes = JSON.parse(jsonraw);

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// GET request for notes
app.get('/api/notes', (req, res) => {
  // Send a message to the client
  res.json(notes);
  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});



// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: notes.length + 1
    };
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});

// DELETE request for a note
app.delete('/api/notes/:id', (req, res) => {
  // Log that a DELETE request was received
  console.info(`${req.method} request received to delete a review`);
  if (req.params.id) {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex((note) => note.id == noteId);
    notes.splice(noteIndex, 1);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.status(200).json('Note deleted');
  } else {
    res.status(500).json('Error in deleting note');
  }
});
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);