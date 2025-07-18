// server.js - Illustrative Node.js Backend for ZynoxGenI

// Import necessary modules
const express = require('express'); // For creating the web server
const bodyParser = require('body-parser'); // For parsing incoming request bodies
const cors = require('cors'); // For enabling Cross-Origin Resource Sharing
const nodemailer = require('nodemailer'); // For sending emails

// Initialize the Express app
const app = express();
// Define the port for the server to listen on.
// process.env.PORT is used for deployment environments like Render.
const port = process.env.PORT || 3000;

// --- CORS Configuration ---
// Define the specific origin(s) that are allowed to access your backend.
// This is crucial for security and to prevent "Access-Control-Allow-Origin" errors.
const allowedOrigins = [
    'http://localhost:8000', // For local development (adjust if your local dev server uses a different port)
    'http://localhost:5500', // Common for VS Code's Live Server extension
    'http://127.0.0.1:5500', // Another common local host variation
    'https://anirudhzalki.github.io', // Your GitHub Pages domain
    'https://zynoxgeni.com', // Your primary production domain
    // Add any other specific domains your frontend might be hosted on
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is explicitly in our allowed list.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // If the origin is not allowed, return an error.
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods for your API
    credentials: true, // Allows cookies and authorization headers to be sent
    optionsSuccessStatus: 204 // Set status for preflight OPTIONS requests to 204 (No Content)
};

// Apply CORS middleware with the defined options
app.use(cors(corsOptions));

// Middleware setup
// Parse JSON bodies from incoming requests (e.g., for POST requests with JSON payload)
app.use(bodyParser.json());
// Parse URL-encoded bodies (e.g., from traditional HTML forms, if you were using them)
app.use(bodyParser.urlencoded({ extended: true }));

// --- Nodemailer Transporter Setup ---
// Configure your email transporter using SMTP.
//
// !!!!!!!!!! WARNING: SECURITY RISK !!!!!!!!!!
// Hardcoding sensitive credentials like email and password directly in the code
// is HIGHLY discouraged, especially for production.
// If your code repository becomes public, these credentials will be exposed.
// It is strongly recommended to use environment variables (e.g., with `dotenv` locally
// and Render's environment variables for deployment).
//
// To resolve "535-5.7.8 Username and Password not accepted." error:
// 1. You MUST use a Google "App Password" here, NOT your regular Gmail password.
//    If 2-Step Verification is enabled on your Google Account (highly recommended),
//    you MUST generate an App Password.
//    Go to: myaccount.google.com/security -> "App passwords" (under "How you sign in to Google").
//    Generate a new password for "Mail" / "Other". Copy the 16-character password exactly.
// 2. Replace 'your_16_char_google_app_password' below with your actual generated App Password.
const EMAIL_USER = 'zalkianirudh@gmail.com'; // Your Gmail address
const EMAIL_PASS = 'zjwg nsyq poln iecd'; // <--- REPLACE THIS WITH YOUR REAL GOOGLE APP PASSWORD

const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail's SMTP service
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// --- API Routes ---

// 1. Home Route (optional, just to check if the server is running)
app.get('/', (req, res) => {
    res.status(200).send('ZynoxGenI Backend is running!');
});

// 2. Contact Form Submission Route
// This endpoint will receive data from the frontend contact form and send an email.
app.post('/api/contact', async (req, res) => {
    // Extract data from the request body
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        // If any required field is missing, send a 400 Bad Request response
        return res.status(400).json({ message: 'All fields (name, email, message) are required.' });
    }

    // Email content
    const mailOptions = {
        from: EMAIL_USER, // Sender address (must match the user in transporter.auth for Gmail)
        to: 'zynoxgeni.official@gmail.com', // Recipient address for your business inquiries
        subject: `New Contact Form Submission from ${name}`, // Subject line for the email
        html: `
            <p>You have a new contact form submission:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Message:</strong> ${message}</li>
            </ul>
            <p>Please respond to ${name} at ${email}.</p>
        ` // HTML body of the email
    };

    try {
        // Attempt to send the email
        await transporter.sendMail(mailOptions);
        // Log success messages to your server console (for debugging and monitoring)
        console.log('--- New Contact Form Submission ---');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Message: ${message}`);
        console.log('Email sent successfully!');
        console.log('-----------------------------------');
        // Send a success response back to the frontend
        res.status(200).json({ message: 'Message received and email sent successfully!' });
    } catch (error) {
        // Log the full error object for better debugging on the server side
        console.error('Error sending email:', error);
        // Send an error response back to the frontend
        res.status(500).json({ message: `Failed to send message: ${error.message || 'Server error'}` });
    }
});

// 3. Example: Get Services Data (Illustrative API endpoint)
// You can uncomment and expand this if you plan to fetch services dynamically.
/*
app.get('/api/services', (req, res) => {
    const services = [
        { id: 1, name: 'Custom Website Generation', description: 'Bespoke websites tailored to your needs.' },
        { id: 2, name: 'Website Management & Maintenance', description: 'Comprehensive support and optimization.' },
        { id: 3, name: 'SEO & Digital Marketing', description: 'Boost online visibility and reach.' },
        // ... add more services as needed
    ];
    res.status(200).json(services);
});
*/

// --- Server Start ---
// Start the Express server and listen for incoming requests on the defined port.
app.listen(port, () => {
    console.log(`ZynoxGenI Backend server listening at http://localhost:${port}`);
    console.log('\n--- IMPORTANT EMAIL AUTHENTICATION NOTE ---');
    console.log('If you are seeing "535-5.7.8 Username and Password not accepted" errors, this is critical:');
    console.log('1. You MUST use a Google "App Password" for Nodemailer, NOT your regular Gmail password.');
    console.log('   Generate it from myaccount.google.com/security -> "App passwords".');
    console.log('2. Replace `your_16_char_google_app_password` in server.js with your actual App Password.');
    console.log('3. FOR DEPLOYMENT ON RENDER, you will STILL need to set EMAIL_USER and EMAIL_PASS');
    console.log('   as environment variables directly in your Render dashboard (Environment tab).');
    console.log('   Hardcoded values in the file are NOT secure for public repositories or production environments.');
    console.log('-------------------------------------------');
});
