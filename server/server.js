const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect('mongodb+srv://225060056:72022180978@cluster0.mnspxsd.mongodb.net/myDatabase ', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  ISBN: String,
  publicationYear: Number,
  genre: String,
});

const books = mongoose.model('books', bookSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const path = require('path');

app.get('/', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Create (Add a Book)
app.post('/books', async (req, res) => {
  try {
    const { title, author, ISBN, publicationYear, genre } = req.body;
    const newBook = new Book({
      title,
      author,
      ISBN,
      publicationYear,
      genre,
    });
    await newBook.save();
    res.status(201).send(newBook);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Read (View Books)
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update (Edit Book Details)
app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, ISBN, publicationYear, genre } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(id, {
      title,
      author,
      ISBN,
      publicationYear,
      genre,
    }, { new: true });
    res.send(updatedBook);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete (Remove a Book)
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
