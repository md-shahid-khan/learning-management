import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const { email, subject, template, data } = options;
    // Get the template path
    const templatePath = path.join(__dirname, "../views", `${template}`);
    // Rendering the email template with EJS
    const html: string = await ejs.renderFile(templatePath, data);
    // Sending email to the user
    const emailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    };
    await transporter.sendMail(emailOptions);
}

// Example usage:
// const emailData = {
//     email: "user@example.com",
//     subject: "Welcome to our platform!",
//     template: "welcome",
//     data: { username: "User123", activationCode: "ABC123" },
// };

// sendMail(emailData).catch(console.error);

export default sendMail;








