import { resendClient, sender } from '../lib/resend.js';
import { createWelcomeEmailTemplate } from './emailTemplates.js';

export const sendWelcomeEmail = async (recieverEmail, recieverName, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.email}`,
        to: recieverEmail,
        subject: 'Welcome to Chatify',
        html: createWelcomeEmailTemplate(recieverName, clientURL),
    });

    if (error) {
        return console.log(error.message);
    }
    console.log(`Welcome Email sent successfully`);
};
