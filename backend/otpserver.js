const nodemailer = require('nodemailer');

const  mailer = (app) =>  {

    // Configure Nodemailer with your email service provider details
    const transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'Gmail', 'SendGrid', etc.
        auth: {
            user: 'rajeshnktech@gmail.com',
            pass: 'ywbkdxtrtokrekbv'
        }
    });

    // Define an API endpoint for sending the OTP email
    app.post('/send-otp', (request, response) => {
        const { email, otp } = request.body;

        console.log(email)
        // Create the email message
        const mailOptions = {
            from: 'rajeshnktech@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is : ${otp}`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error:', error);
                response.status(500).json({ success: false, message: 'Failed to send OTP' });
            } else {
                console.log('Email sent:', info.response);
                response.json({ success: true, message: 'OTP sent successfully' });
            }
        });
    });
}

module.exports = {
    mailer
}