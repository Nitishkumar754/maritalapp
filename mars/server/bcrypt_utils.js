const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'mypass';
const someOtherPlaintextPassword = 'not_bacon';


bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        console.log("hash>>>>>>>>>>>>>  ", hash);
    });
});