var nodemailer = require('nodemailer');
// email sender function
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'scientiapf@gmail.com',
      clientId: '275330116373-196624l5agp05j06nk8k20920gghfjsc.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04qggu9z7BfDZCgYIARAAGAQSNwF-L9IrK03e5MDDcRl35vV6w2rwWQDe1Too2SFvP9T1WpIeH9u3ce7qKVOfU1mfxAMnvv2FtGA',
      accessToken: 'ya29.a0AfH6SMDUv7teUjyw6ewwR7Tm_zhEaPVEuHAF0UMPoJymULv8FP5lQ7S5hkbmVMSCFi9eBwoystgf9StjBDuEqbbn9BxmIwc4sITLz-lBsFb4VRLIdYmGIuTYHDnmkdhPHD7maWsBLWw5Cl6w3K5lysGdaN2ORHJqBvA'
    }
      })
      
      async function sendEmail(to, subject, html, user) {
        const mailOptions = {
          from: user,
          to,
          subject,
          html
        }
        return transporter.sendMail(mailOptions, (err, res) => {
          if (err) {
            console.log(err)
          } else {
            console.log('email sent')
            //res.send('email sent successfully..!')
          }
        });
      }
      
      module.exports = sendEmail;