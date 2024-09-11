const express = require('express');
const taskController = require('../controllers/taskController');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

// Route to get all tasks for the logged-in user
router.get('/', taskController.getAllTasks);

// Route to add a new task
router.post('/add', taskController.addTask);

// Route to update a task
router.put('/update/:id', taskController.updateTask);

// Route to delete a task
router.post('/delete/:id', taskController.deleteTask); // Use POST method for deleting tasks

module.exports = router;
