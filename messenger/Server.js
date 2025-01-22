const express = require('express');
const app = express();
const path = require('path')
const authRoutes = require('./GenRoutes/auth');
const chatRoutes = require('./GenRoutes/chats');

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Visited URL: ${req.originalUrl}`);
    next();
});

// const requireAdmin = (req, res, next) => {
//     const isAdmin = req.query.admin === 'true'; // Check if ?admin=true
//     console.log(`Admin Query Param: ${req.query.admin}`); // Debugging log
//     if (isAdmin) {
//         next();
//     } else {
//         res.status(403).send('Nothing here');
//     }
// };

// Routes
app.use('/auth', authRoutes); 
app.use('/chats', chatRoutes); 

const settingsRoutes = require('./GenRoutes/settings');
app.use('/settings', settingsRoutes);

app.use(express.static(path.join(__dirname, 'frontend')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'LogInPage.html'));
  });

  app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'SignupPage.html'));
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
