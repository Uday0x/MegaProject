import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';


const sendMail = async(options)=>{
    var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

    //need to give both the options because some inboxes may not support HTML
    const emailBody = mailGenerator.generate(options.mailgenContent);
    const  emailText = mailGenerator.generatePlaintext(options.mailgenContent); 

//nodmailer is used to send the mails //here in this case mailgen used to craft the mails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});



const mail = await transporter.sendMail({
    from: 'manager@gmail.com',
    to: options.email,
    subject: options.subject,
    text: emailText, // plain‑text body
    html: emailBody, // HTML body
  });


  try {
    await transporter.sendMail(mail)
  } catch (error) {
    console.error("some error in sending the mail plz check again")
  }
}


const emailVerificationMailgenContent = async(username,verificationUrl)=>{
    return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
}


const forgotPasswordMailgenContent = async(username,passwordResetUrl)=>{
    return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
}

export {
    sendMail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent
}