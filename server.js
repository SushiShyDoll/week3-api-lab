require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000; // Port from .env or default to 3000
const SECRET_KEY = process.env.SECRET_KEY || "your_jwt_secret"; // Secret key from .env or fallback

// Debugging Logs
console.log("Starting server...");
console.log("PORT:", PORT);
console.log("SECRET_KEY:", SECRET_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// In-memory Users Array (For demonstration purposes only)
let users = [];

// Register Endpoint
app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        // Check if username already exists
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "An error occurred during registration", error });
    }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate Token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login", error });
    }
});

// Protected Route
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

// Token Verification Middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied: Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}

// Root Endpoint
app.get("/", (req, res) => {
    res.send("Welcome to the API.");
});

// Start Server
try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (error) {
    console.error("Error starting server:", error);
}
