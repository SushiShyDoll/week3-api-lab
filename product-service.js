const express = require('express');
const app = express();
const PORT = 4000; // The port on which the server will run

// Add a startup log to indicate the server script has started
console.log('Starting the server script...');

app.use(express.json()); // Middleware to parse JSON bodies

// Sample Products Data
const products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' }
];

// Public Endpoint
app.get('/api/products', (req, res) => {
    console.log('GET /api/products endpoint called'); // Debug log to verify endpoint activity
    res.status(200).json(products); // Send the products array as a JSON response with status 200
});

// Error Handling Middleware (optional for better error messages)
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`); // Log to indicate server is running
});
