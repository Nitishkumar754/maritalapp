

var all = {

  mail: {
    smtpConfig: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL 
      //service: 'Gmail',
      auth: {

        //xoauth2: xoauth2obj

        user: 'nitish@fisdom.com',
        pass: '9709089861'
      }
    },
    sender: '"Web Admin"<nitish1500kumar@gmail.com>' // sender address 
    
  }

}

module.exports = all;