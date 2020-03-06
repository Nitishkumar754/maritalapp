const nodemailer = require('nodemailer');
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const refresh_token = '1//04CM2lTmYUZ80CgYIARAAGAQSNwF-L9Irq9C15SXnNTyh30S6AUJzaNid1_3Bw2Xb7kVrjDkoMLQHJ_6EUKU3ciLbCba68cANIys'

const clientId = '452012063702-liooo3jlq8b8dg9pstsqh3oq24l72e8s.apps.googleusercontent.com';

const secret = 'XBEYNGDUceBKhcsJ8ux5SXpp';



let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: clientId,
        clientSecret: secret
    }
});


const oauth2Client = new OAuth2(
     clientId,
     secret,
     "https://developers.google.com/oauthplayground" // Redirect URL
    );

module.exports.triggerMail = async function(to, subject=null, text=null, html, attachments, cc, cb){

    oauth2Client.setCredentials({
     refresh_token: refresh_token
    });
    const accessToken = await oauth2Client.getAccessToken();

    return transporter.sendMail({
        from: "nitish1500kumar@gmail.com",
        to: to,
        subject: subject,
        text: text,
        html:html,
        auth: {
            user: 'nitish1500kumar@gmail.com',
            refreshToken: refresh_token,
            accessToken: accessToken,
            expires: 1484314697598
        }
    });

}

module.exports.mailer = transporter;