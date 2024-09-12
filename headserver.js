const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const mongodb = require('mongodb');

const app = express();
const port = process.env.PORT || 3100;

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// MongoDB connection
const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb+srv://programmers472:Aabra24%40Dabra@cluster0.49efpgj.mongodb.net/CQ1'; // Replace with your MongoDB connection URL
const dbName = 'mytasks';

// Serve static files (like images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public/css/',express.static(path.join(__dirname, '/public/css')));
app.use('/public/js/',express.static(path.join(__dirname, '/public/js')));
app.use('/imgs',express.static(path.join(__dirname, 'imgs')));

// Serve the index page at the root URL ('/')
app.get('/', async (req, res) => {
    try {
        const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
        const db = client.db(dbName);

        const tasksCollection = db.collection('tasks');
        const tasks = await tasksCollection.find().toArray();

        client.close();

        res.render('todo', { tasks: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from the database.');
    }
});

// Handle form submission from index.ejs
app.post('/submit', upload.single('image'), async (req, res) => {
    const task = req.body.task;
    const imagePath = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes

    try {
        const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
        const db = client.db(dbName);

        const tasksCollection = db.collection('tasks');
        await tasksCollection.insertOne({ task: task, imagePath: imagePath });

        client.close();

        res.redirect('/'); // Redirect to the index page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving data to the database.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
