

var all = {

  mail: {
    smtpConfig: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL 
      //service: 'Gmail',
      auth: {

        //xoauth2: xoauth2obj

        user: 'nitish1500kumar@gmail.com',
        pass: '9024522281'
      }
    },
    sender: '"Web Admin"<nitish1500kumar@gmail.com>' // sender address 
    
  },
  secrets: {
    secret: 'marital-app-secret',
    adminsecret : 'marital-app-admin-secret'
  },

  client_url : 'localhost:4000',

  userRoles : ['admin']

}



module.exports = all;