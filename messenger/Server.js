const express = require('express');

const app = express();
const path = require('path')
const authRoutes = require('./GenRoutes/auth');
const chatRoutes = require('./GenRoutes/chats');
const messageRoutes = require('./GenRoutes/messages');
const userRoutes = require('./GenRoutes/users');
const messengerRoutes = require('./GenRoutes/messenger');
const connectDB = require('./db');

connectDB();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Visited URL: ${req.originalUrl}`);
  next();
});


// Routes
app.use('/messages', messageRoutes);
app.use('/auth', authRoutes); 
app.use('/chats', chatRoutes); 
app.use('/users', userRoutes)
app.use('/messenger', messengerRoutes);

app.use(express.static(path.join(__dirname, 'frontend')))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'SignupPage.html'));
});

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'LogInPage.html'));
  });



app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'settings.html'));
});


// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const port = 6970;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
