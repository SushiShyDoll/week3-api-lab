const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json()); // Enable JSON body parsing

// Dummy token for authentication
const AUTH_TOKEN = "securetoken123";

// Register Endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    res.status(201).json({ message: "User registered successfully" });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // In a real application, you'd generate a JWT instead of a dummy token
    res.status(200).json({ token: AUTH_TOKEN });
});

// Protected Endpoint
app.get('/api/protected', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) { // Fix: Template literal syntax was missing backticks
        return res.status(403).json({ message: "Forbidden: Invalid or missing token" });
    }

    res.status(200).json({ message: "Protected data accessed" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`); // Fix: Template literal syntax added
});
