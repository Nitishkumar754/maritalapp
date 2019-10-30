var nodemailer = require('nodemailer');
var config = require("../config/environment")
var Q = require('q');
console.log("config.mail.smtpConfig>>>>>>>>>>>>> ",config.mail.smtpConfig);
var transporter = nodemailer.createTransport(config.mail.smtpConfig);
    

module.exports.sendMail= function(from, to, subject, text, html, attachments, cc, cb) {
    
    //config.getToken();
    var mailOptions = createMailBody(from, to, subject, text, html, attachments, cc);
    // transporter.sendMail(mailOptions);
    transporter.sendMail(mailOptions, function(error, response) {
       if (error) {
            cb ? cb(error) : console.log("Mail error ===> ", error);
       } else {
            cb ? cb(null, response) : console.log("Mail Success");
       }
    });
    //This is for some functions who expect promise from this function
    return Promise.resolve();


    
    // transporter.sendMail({
    //     from: 'info@klj.com',
    //     to: 'testmail.klj@gmail.com',
    //     subject: 'hello world!',
    //     text: 'Authenticated with OAuth2'
    // }, function(error, response) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Message sent');
    //     }
    // });

}

function createMailBody(from, to, subject, text, html, attachments, cc) {
    //console.log('attachments---'+attachments);
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments,
        cc: cc
    };
    return mailOptions;
}
