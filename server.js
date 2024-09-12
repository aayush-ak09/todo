// /*
//  Build a To Do todo and fulfill the below User stories.

//  User story 1 : Your page should be divided in two parts.
//  The left pane contains a list of tasks which 'll be fetched from the server. 
//  The right pane, by default contains a task form.
// */
const express = require('express');
const path = require('path');
// const multer = require('multer'); // For handling file uploads
const todo = express();
const bodyParser = require('body-parser');



todo.use(bodyParser.json());

// Set up EJS views
todo.set('views', path.join(__dirname, 'views'));
todo.set('view engine', 'ejs');

//setup static routes 
todo.use('/public/css/',express.static(path.join(__dirname, '/public/css')));
todo.use('/public/js/',express.static(path.join(__dirname, '/public/js')));
todo.use('/imgs',express.static(path.join(__dirname, 'imgs')));

// Routes for your app
todo.get('/', (req, res) => {
    res.render('homepage', { username: req.query.username || null });
});

//routs for task 
todo.get('/views/todo.ejs', (req,res)=>{
    res.render('todo',{username: req.query.username ||null});
})

const dataarray = [];

//handle submit button
todo.post("/api/submit", (req, res) => {
    const data = req.body.data;
    dataarray.push({ task: data, completed: false });
    console.log(dataarray);
    res.json({ message: 'Data received and stored successfully!' });
});

todo.get('/api/data', (req, res) => {
    res.json(dataarray);
});

todo.get('*', (req,res) =>{
    console.log(req.url);
})


todo.put('/api/task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const completed = req.body.completed;
    dataarray[taskId].completed = completed;
    res.json(dataarray);
});

todo.delete('/api/task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    dataarray.splice(taskId, 1);
    res.json(dataarray);
});

const port = 1234;
todo.listen(port, () => {
    console.log('Currently running on port', port);
});
