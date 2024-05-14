const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET", "DELETE", "PATCH", "PUT"],
        credentials: true,
    })
);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/send-email', async (req, res) => {
    try {
        const { subject, text, html } = req.body;
        if (!subject || !text || !html) {
            return res.status(400).send('Missing required fields');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "info@allstatehelpllc.com",
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
