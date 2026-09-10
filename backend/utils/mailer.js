import { Resend } from "resend";



let resendClient = null;

const getResendClient = () => {
    if (!resendClient) {
        const apiKey = process.env.RESEND_API_KEY?.trim();
        if (!apiKey) {
            return null;
        }

        resendClient = new Resend(apiKey);
    }

    return resendClient;
};

const sendMail = async ({ to, subject, html }) => {
    const resend = getResendClient();

    if (!resend) {
        console.error(
            "Resend email not sent because RESEND_API_KEY is not configured.",
        );
        return;
    }

    try {
        await resend.emails.send({
            from:
                process.env.RESEND_FROM_EMAIL?.trim() ||
                "StoreDesk POS <onboarding@resend.dev>",
            to, 
            subject,
            html,
        });
    } catch (error) {
        
        
        
        console.error(
            "Failed to send email via Resend:",
            error?.message || error,
        );
    }
};

export { sendMail };