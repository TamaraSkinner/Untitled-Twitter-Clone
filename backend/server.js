require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/spells', require('./routes/spell.routes'));

// Start the server
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Wizard Server running on http://localhost:${port}`);
    })
    server.on('error', (err) => {
        if (err.code == 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
}

const initialPort = process.env.Port ? parseInt(process.env.port, 10) : 3000;
startServer(initialPort);