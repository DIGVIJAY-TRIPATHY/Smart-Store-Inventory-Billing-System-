import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) return null;

    const port = Number(process.env.SMTP_PORT) || 587;
    const secure =
        process.env.SMTP_SECURE !== undefined
            ? process.env.SMTP_SECURE === "true"
            : port === 465;

    transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });

    return transporter;
};

const sendMail = async ({ to, subject, html, text }) => {
    const mailTransporter = getTransporter();

    if (!mailTransporter) {
        console.error(
            "Email not sent: SMTP_HOST, SMTP_USER and SMTP_PASS must be configured.",
        );
        return;
    }

    try {
        await mailTransporter.sendMail({
            from:
                process.env.MAIL_FROM?.trim() ||
                `StoreDesk POS <${process.env.SMTP_USER.trim()}>`,
            to: Array.isArray(to) ? to.join(", ") : to,
            subject,
            html,
            text,
        });
    } catch (error) {
        console.error(
            "Failed to send email via SMTP:",
            error?.message || error,
        );
    }
};

export { sendMail };
