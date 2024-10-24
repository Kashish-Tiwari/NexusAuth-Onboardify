
const {
  createJwtTokenClient,
  decodeJwtTokenClient,
} = require("../middlewares/client/jwtHelperClient");
const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const sequelize = require("sequelize");
const { Op } = require("sequelize"); 

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
       port: 465,
    secure: true,
    auth: {
      user: 'youremailaddress.com',
      pass: 'your-passowrd',
    },
    tls: {
        rejectUnauthorized: true,
    },
});
exports.sendEmail = async (data) => {
        data.html = await this.readEmailTemplate(data.template)
    
        let mailOptions = {
            from: 'OnBoardingProject <youremailaddress.com>',
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            html: data.html, // plain text body
        };
    
        try {
            let info = await transporter.sendMail(mailOptions);
            console.log(`Message sent: ${info.response}`);
            console.log("Message sent: %s", info.messageId);
            return true;
        } catch (error) {
            console.error(`Problem sending email: ${error}`);
            return false;
        }
    
    }

    exports.readEmailTemplate = async (htmldata) => {
        try {
          const emailLinkTemplate = fs.readFileSync(
            `./templates/${htmldata.template_name}.html`,
            "utf8"
          );
          var template = handlebars.compile(emailLinkTemplate);
      
          return template(htmldata.data);
        } catch (error) {
          console.error(`Problem sending email: ${error}`);
          return false;
        }
      };

    