const nodemailer = require('nodemailer');
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

var secret = require('../config/environment/secrets');
const refresh_token = secret.google.refresh_token
const clientId = secret.google.clientId
const g_secret = secret.google.secret
const email = secret.google.email

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: clientId,
        clientSecret: g_secret
    }
});


const oauth2Client = new OAuth2(
     clientId,
     g_secret,
     "https://developers.google.com/oauthplayground" // Redirect URL
    );

module.exports.triggerMail = async function(to, subject=null, text=null, html, attachments, cc, cb){

    oauth2Client.setCredentials({
     refresh_token: refresh_token
    });
    const accessToken = await oauth2Client.getAccessToken();

    return transporter.sendMail({
        from: email,
        to: to,
        subject: subject,
        text: text,
        html:html,
        auth: {
            user: email,
            refreshToken: refresh_token,
            accessToken: accessToken,
            expires: 1484314697598
        }
    });

}

module.exports.mailer = transporter;