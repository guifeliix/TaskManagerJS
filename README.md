# TaskManagerJS
Task Manager

A simple task management application built with Node.js, MySQL, and Handlebars. This application allows users to register, log in, manage tasks, and update their profile information.

# Features
-User Authentication: Register, log in, and log out.
-Task Management: Add, update, view, and delete tasks.
-Profile Management: View and update user profile information.

# Technologies Used
-Backend: Node.js, Express.js
-Database: MySQL
-Templating Engine: Handlebars
-Authentication: JWT (JSON Web Tokens)
-Password Hashing: bcryptjs

# Setup and Installation
-Prerequisites
-Node.js
-MySQL


# Instalation
1. Clone the Repository
-git clone https://github.com/guifeliix/TaskManagerJS
-cd your-repository

2. Install Dependencies
- npm install

3. Set Up Environment Variables
-Create an .env file with the mysql credentials
    -DATABASE_NAME = taskmanager-login
    -DATABASE_HOST = localhost
    -DATABASE_USER = root
    -DATABASE_PASSWORD = 
    -JWT_SECRET=hire_me_please

4. Create and Initialize Database Tables

Run the application to create the necessary tables:
- node app.js

5. Start the application

-The application will be accessible at http://localhost:3000.

# Usage
- Home Page: Provides navigation to login, register, and view tasks.
- Register: Create a new user account.
- Login: Authenticate and access the task management system.
- Profile: View and update user profile information.
- Tasks: Manage your tasks (add, update, view, delete).

# Contact
For any questions or issues, please reach out to:

Name: Guilherme Felix Carlini de Lima
Email: g.felixcarlinidelima@gmail.com