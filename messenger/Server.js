const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path')
require('dotenv').config();

const authRoutes = require('./GenRoutes/auth');
const chatRoutes = require('./GenRoutes/chats');
const messageRoutes = require('./GenRoutes/messages');
const userRoutes = require('./GenRoutes/users');
const messengerRoutes = require('./GenRoutes/messenger');
const settingsRoutes = require('./GenRoutes/settings');


const app = express();

const connectDB = require('./db');


// Initializing db
connectDB();

// "First" middlewares:
// express.json() used for converting req.body to JSON by express framework
app.use(
	express.json({ limit : '1mb' })
);
// to work with cookies
app.use(cookieParser())

// Middleware for avoiding error JSON from client
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }
    next();
});

// Logging middleware
// TODO: modify
app.use((req, res, next) => {
  	console.log(`[${new Date()}] Visited URL: ${req.originalUrl}`);
  	next();
});

// Setting static files path middleware
app.use(
    express.static(
        path.join(__dirname, 'frontend')
    )
)


// Routes
app.use('/messages', messageRoutes);
app.use('/auth', authRoutes); 
app.use('/chats', chatRoutes); 
app.use('/users', userRoutes)
app.use('/messenger', messengerRoutes);
app.use('/settings', settingsRoutes);

// Main path controller
app.get('/', (req, res) => {
    res.redirect('/messenger');
});


// "Last" middlewares:
// Not found middleware
app.use((req, res, next) => {
    const notFoundPath = path.join(__dirname, 'frontend', 'notFound.html');
	res.sendFile(notFoundPath);
});


// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});


const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
