const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Book = require("../models/bookSchema.js");
const data = require("../init/bookData.js")

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET All Books
router.get('/home', async (req, res) => {
    try {
        res.json(data)

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//GET Single Book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid book ID' });
    }

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Update Book
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid book ID' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Update data cannot be empty' });
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found for update' });
        }

        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//  Add New Book
router.post('/addbook', async (req, res) => {
    const { title, author, image, tag, description } = req.body;
    // console.log(title,author, image ,tag, description)
    if (!title || !author || !tag || !image || !description) {
        return res.status(400).json({ message: 'Title, author, and tag are required.' });
    }

    try {
        // const newBook = new Book(req.body);
        const newBook = new Book({
            title,
            author,
            image,
            tag,
            description

        });
        await newBook.save();

        res.status(201).json(newBook);
        data.push(newBook)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



//  DELETE Book
router.delete("/:title", async (req, res) => {
    const { title } = req.params;

    try {
        console.log(title)
        // Ensure book exists before deletion
        const bookToDelete = await Book.findOne({ title: title });

        if (!bookToDelete) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Perform deletion
        await Book.findOneAndDelete({ title: title });

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});



router.get('/search', async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ message: 'Title query parameter is required' });
    }

    try {
        const books = await Book.find({ title: new RegExp(title, 'i') }); // Case-insensitive search
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;











// router.delete('/deleteByTitle', async (req, res) => {
//     const { title } = req.body;

//     if (!title) {
//         return res.status(400).json({ message: 'Title is required to delete a book' });
//     }

//     try {
//         const deletedBook = await Book.findOneAndDelete({ title });
//         if (!deletedBook) {
//             return res.status(404).json({ message: 'Book not found to delete' });
//         }

//         res.json({ message: 'Book deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });