// http://localhost:8080/PustakMandi/home/

const express = require("express");
const connectDB = require("./config/db.js");
// const seedBooks = require("./init/sampleData.js");
require('dotenv').config();
const bookRoutes = require('./routes/bookRoutes.js');
const app = express();
const PORT = process.env.PORT || 5000;


const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5173', 'https://pushtakmanadi.onrender.com/'], // Add production origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Include PATCH method
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'auth-token'], // Add auth-token here
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision', 'X-Custom-Header'], // Add a custom exposed header if needed
    credentials: true, // Allow cookies/auth headers
    optionsSuccessStatus: 204, // Prevent 200 response for OPTIONS requests
    preflightContinue: false, // Stop passing preflight requests to next middleware
    maxAge: 600 // Cache preflight requests for 10 minutes
}));

app.use(express.json());
const bodyParser = require('body-parser');


const authRoutes = require('./routes/authRoutes.js'); 
app.use('/api/auth', authRoutes);






app.use('/uploads', express.static('uploads'));

//Routes
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.send('Hello World! chal rha hu bkl')

  })


// Handle unknown routes
app.use((req, res) => {
    res.status(404).send('404 Not Found: This route does not exist.');
});

(async () => {
    await connectDB();
    // await seedBooks(); // Optional: if we want to start our mongo with some data 

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port http://localhost:${PORT}`);
    });
})();





