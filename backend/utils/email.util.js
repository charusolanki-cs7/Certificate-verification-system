const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog.model');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send certificate notification email
exports.sendCertificateNotification = async (certificateData) => {
  const { studentName, studentEmail, studentId, certificateId, certificateObj, studentObj } = certificateData;

  // Create email log entry (pending)
  const emailLog = await EmailLog.create({
    recipient: studentEmail,
    recipientName: studentName,
    subject: 'Your Internship Certificate is Ready!',
    certificateId: certificateId,
    studentId: studentId,
    certificate: certificateObj,
    student: studentObj,
    status: 'pending'
  });

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Certificate System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: 'Your Internship Certificate is Ready! 🎓',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .certificate-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Congratulations ${studentName}!</h1>
              <p>Your Internship Certificate is Ready</p>
            </div>
            <div class="content">
              <p>Dear ${studentName},</p>
              <p>We are pleased to inform you that your internship certificate has been successfully generated and is now ready for download.</p>
              
              <div class="certificate-box">
                <h3>Certificate Details:</h3>
                <p><strong>Certificate ID:</strong> ${certificateId}</p>
                <p><strong>Student ID:</strong> ${studentId}</p>
                <p><strong>Student Name:</strong> ${studentName}</p>
              </div>

              <h3>How to Access Your Certificate:</h3>
              <ol>
                <li>Visit our certificate verification portal: <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/search">${process.env.CLIENT_URL || 'http://localhost:3000'}/search</a></li>
                <li>Enter your Certificate ID: <strong>${certificateId}</strong></li>
                <li>Click "Search Certificate"</li>
                <li>View and download your certificate in PDF format</li>
              </ol>

              <center>
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/certificate/${certificateId}" class="button">View Certificate Now</a>
              </center>

              <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
                <strong>⚠️ Important:</strong> Keep your Certificate ID safe. You will need it to access your certificate anytime.
              </p>

              <p>If you have any questions or need assistance, please contact your administrator.</p>

              <p>Best regards,<br><strong>Certificate Verification System</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>© ${new Date().getFullYear()} Certificate Verification System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Update email log with success
    emailLog.status = 'sent';
    emailLog.sentAt = new Date();
    emailLog.attemptCount += 1;
    await emailLog.save();

    console.log(`✅ Email sent to ${studentEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, emailLog };

  } catch (error) {
    // Update email log with failure
    emailLog.status = 'failed';
    emailLog.error = error.message;
    emailLog.attemptCount += 1;
    await emailLog.save();

    console.error(`❌ Email failed to ${studentEmail}:`, error.message);
    return { success: false, error: error.message, emailLog };
  }
};

// Retry failed emails
exports.retryFailedEmail = async (emailLogId) => {
  try {
    const emailLog = await EmailLog.findById(emailLogId)
      .populate('certificate')
      .populate('student');

    if (!emailLog) {
      throw new Error('Email log not found');
    }

    if (emailLog.status === 'sent') {
      return { success: false, message: 'Email already sent' };
    }

    // Retry sending
    const result = await exports.sendCertificateNotification({
      studentName: emailLog.recipientName,
      studentEmail: emailLog.recipient,
      studentId: emailLog.studentId,
      certificateId: emailLog.certificateId,
      certificateObj: emailLog.certificate._id,
      studentObj: emailLog.student._id
    });

    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
