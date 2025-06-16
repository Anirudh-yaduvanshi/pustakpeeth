const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Book title is required']
        },
        author: {
            type: String,
            required: [true, 'Author name is required']
        },
        tag: {
            type: String,
            required: [true, 'Book genre is required']
        },
        image: {
            type: String,
            default: "https://th.bing.com/th/id/OIP.1RYZ4VVdZY6c8gmGS6LBiAHaKZ?w=1200&h=1685&rs=1&pid=ImgDetMain"
        },
        description: {
            type: String,
            required: [true, 'Book description is required']
        }
    }
);

module.exports = mongoose.model("Book", bookSchema);