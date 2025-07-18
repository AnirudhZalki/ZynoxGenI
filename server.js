// server.js - Illustrative Node.js Backend for ZynoxGenI

// Import necessary modules
const express = require('express'); // For creating the web server
const bodyParser = require('body-parser'); // For parsing incoming request bodies
const cors = require('cors'); // For enabling Cross-Origin Resource Sharing (important for frontend-backend communication)
const nodemailer = require('nodemailer'); // For sending emails

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000; // Define the port for the server to listen on

// --- CORS Configuration ---
// Define the specific origin(s) that are allowed to access your backend.
// Replace 'https://anirudhzalki.github.io' with your actual GitHub Pages URL.
const allowedOrigins = ['https://zynoxgeni.com/'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is in our allowed list.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests (if needed)
    optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};

// Apply CORS middleware with the defined options
app.use(cors(corsOptions));

// Middleware setup
// Parse JSON bodies from incoming requests
app.use(bodyParser.json());
// Parse URL-encoded bodies (e.g., from traditional HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// --- Nodemailer Transporter Setup ---
// Configure your email transporter using SMTP.
// IMPORTANT: You are getting "535-5.7.8 Username and Password not accepted."
// This means either:
// 1. "Less secure app access" is NOT enabled for zalkianirudh@gmail.com.
//    Go to https://myaccount.google.com/security and turn it ON.
// 2. The password below is NOT your correct REGULAR GMAIL PASSWORD for zalkianirudh@gmail.com.
//    Double-check it carefully.
//
// If you prefer better security, re-enable 2-Step Verification and use an App Password.
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email service provider (e.g., 'Outlook365', 'SendGrid')
    auth: {
        user: 'zalkianirudh@gmail.com', // Your Gmail address
        pass: 'ffim epka qlcf eenk' // <--- REPLACE THIS WITH YOUR REAL GMAIL PASSWORD
    }
});

// --- API Routes ---

// 1. Home Route (optional, just for testing if the server is running)
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
        from: 'zalkianirudh@gmail.com', // Sender address (must match the user in transporter.auth for Gmail)
        to: 'zynoxgeni.official@gmail.com', // Recipient address
        subject: `New Contact Form Submission from ${name}`, // Subject line
        html: `
            <p>You have a new contact form submission:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Message:</strong> ${message}</li>
            </ul>
            <p>Please respond to ${name} at ${email}.</p>
        ` // HTML body
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('--- New Contact Form Submission ---');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Message: ${message}`);
        console.log('Email sent successfully!');
        console.log('-----------------------------------');
        res.status(200).json({ message: 'Message received and email sent successfully!' });
    } catch (error) {
        // Log the full error object for better debugging
        console.error('Error sending email:', error);
        res.status(500).json({ message: `Failed to send message: ${error.message || 'Server error'}` });
    }
});

// 3. Example: Get Services Data (Illustrative API endpoint)
// You could serve dynamic content or data from your backend.
app.get('/api/services', (req, res) => {
    const services = [
        { id: 1, name: 'Custom Website Generation', description: 'Bespoke websites tailored to your needs.' },
        { id: 2, name: 'Website Management & Maintenance', description: 'Comprehensive support and optimization.' },
        { id: 3, name: 'SEO & Digital Marketing', description: 'Boost online visibility and reach.' },
        // ... more services
    ];
    res.status(200).json(services);
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`ZynoxGenI Backend server listening at http://localhost:${port}`);
    console.log('\nIMPORTANT: If emails are not sending, check the console for detailed error messages.');
    console.log('The current error "535-5.7.8 Username and Password not accepted" strongly suggests:');
    console.log('1. "Less secure app access" is NOT enabled for your Gmail account.');
    console.log('2. The password in server.js is incorrect.');
    console.log('Please verify these settings in your Google Account for zalkianirudh@gmail.com.');
});
