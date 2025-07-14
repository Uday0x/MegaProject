import nodemailer from 'nodemailer';

import Mailgen from 'mailgen';

//we are going to write in such a way its a utility function

const sendMail = async(options)=>{


    const mailGenerator = new Mailgen({
        theme :"default",
        product :{
            name:"Task managner",
            link:"hhtp://taskmanager.app" 
        },
    })


    const emailTextual = mailGenerator.generatePlaintext(options.MailgenContent)
    const emailHTML = mailGenerator.generate(options.MailgenContent)


    //creating the transporter function which is responsible for sending the mail
    const transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS,
        }
    })


    const mail = {
        from:"mail.taskmanager@example.com",
        to:options.mail, //receviers mail address
        subject:options.subject,
        text:emailTextual,
        html:emailHTML
    }


    try {
        await sendMail(mail)
    } catch (error) {
        console.error("plz check the credentials in .env file .some error in sending the email")
    }

}



const emailVerficationMailGenContent =(username ,verificationurl)=>{
    return {
        body :{
            name:username,
            intro :"Welcome to our app we are excited to have on board",
            action:{
                instructions:
                    "To verify your email plz click on the following button",
                button:{
                    color:"#22BC66",
                    text:"verify your email",
                    link:verificationurl
                },
            },
            outro :
             "If you have anu queries regarding this plz click reply back to this email"
        },

    };
};

export {
    sendMail,
    emailVerficationMailGenContent
}