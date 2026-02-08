require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.set('socket.io', io);

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/spells', require('./routes/spell.routes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

io.on('connection', (socket) => {
    console.log('A wizard has connected: ' + socket.id);
});

// Start the server
function startServer(port) {
    server.listen(port, () => {
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