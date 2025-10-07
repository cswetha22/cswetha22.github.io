// server.js - Backend API for Contact Form
// Install dependencies: npm install express cors nodemailer dotenv

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
    }
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Portfolio Contact API is running!' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill all required fields' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'swethachelluboina@gmail.com', // Your email
            subject: subject || `Portfolio Contact from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #8b5cf6; margin-bottom: 20px;">New Contact Form Submission</h2>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #333;">Name:</strong>
                            <p style="margin: 5px 0; color: #666;">${name}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #333;">Email:</strong>
                            <p style="margin: 5px 0; color: #666;">${email}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #333;">Subject:</strong>
                            <p style="margin: 5px 0; color: #666;">${subject || 'No subject provided'}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #333;">Message:</strong>
                            <p style="margin: 5px 0; color: #666; line-height: 1.6;">${message}</p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">
                            This email was sent from your portfolio contact form.
                        </p>
                    </div>
                </div>
            `,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Success response
        res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});