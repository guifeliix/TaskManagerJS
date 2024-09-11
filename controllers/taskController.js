const db = require('../app');  // Import the db connection from app.js

// Get all tasks for the logged-in user
exports.getAllTasks = async (req, res) => {
    try {
      const [tasks] = await req.db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
      res.render('tasks', { tasks });
    } catch (error) {
      console.error('Error fetching tasks: ', error);
      res.status(500).send('Server Error');
    }
  };
  
// Add a new task
exports.addTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;  // Assuming user ID is stored in the session or JWT

    try {
        // Check if the user exists
        const [user] = await req.db.query('SELECT id FROM users WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(400).send('User does not exist');
        }

        // Add the new task
        await req.db.query('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)', [userId, title, description]);
        res.redirect('/tasks');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error adding task');
    }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;  // Assuming user ID is stored in the session or JWT

    try {
        await req.db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?', [title, description, id, userId]);
        res.redirect('/tasks');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating task');
    }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  // Assuming user ID is stored in the session or JWT

    try {
        await req.db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        res.redirect('/tasks');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting task');
    }
};