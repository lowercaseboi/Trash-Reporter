// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Middleware function to verify JWT tokens
const verifyToken = (req, res, next) => {
    // Log the incoming request headers for debugging
    console.log("Incoming request headers:", req.headers);

    // Retrieve the token from the 'Authorization' header
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("Extracted token:", token); // Log the extracted token

    // Check if the token is not present
    if (!token) {
        console.log("No token found. Access denied."); // Log when no token is provided
        return res.status(403).json({ message: 'Token required' });
    }

    // Verify the token using the secret stored in environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // If there's an error during verification, log the error
        if (err) {
            console.log("Token verification failed:", err.message); // Log the error message
            return res.status(403).json({ message: 'Invalid token' });
        }

        // If verification is successful, store the user ID in the request object
        req.userId = decoded.id; // Store the user ID for later use
        console.log("Token verified. User ID:", req.userId); // Log the user ID

        // Call the next middleware or route handler
        next();
    });
};

// Export the middleware function for use in other parts of the application
module.exports = verifyToken;
