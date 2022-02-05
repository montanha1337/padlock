import nodemailer from "nodemailer"
 
async function email(email, nome, mensagem){
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, //SSL/TLS
        auth: {
            user: 'vendi.api@gmail.com',
            pass: 'Vendi123456'
        }
      });
    
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Vendi" <vendi.api@gmail.com>', // sender address
        to: email, // list of receivers
        subject: nome, // Subject line
        text: mensagem, // plain text body
      });
      return ('Message sent successfully as '+info.messageId)
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com
    }

    module.exports={email}