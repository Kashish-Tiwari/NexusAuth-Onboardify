
const db = require("../../config/db");

const clients = require("../../config/db").clients;
const { Op } = require("sequelize");
const address = require("../../config/db").address;

const otpGenerator = require("otp-generator");
const universal_helper = require("../../helpers/universal_helper");

const bcrypt = require("bcrypt");

const { body, validationResult } = require("express-validator");
const {
  createJwtTokenClient,
  decodeJwtToken,
} = require("../../middlewares/client/jwtHelperClient");
const nodemailer = require("nodemailer");
const { email_verification } = require("../../config/db");
const transporter = nodemailer.createTransport({
  service: "gmail", // replace with your email provider
  auth: {
    user: "senderaddress@gmail.com", // replace with your email
    pass: "your-password", // replace with your password
  },
});

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
console.log(accountSid, "accountSid");
const client = require("twilio")(accountSid, authToken);

// --------------------------  twillioSendMessage function ----------------------
const twilioSendMessage = async (mobile_number, OTP, phone_code) => {
  try {
    const messageBody = `Your 316 secured code is ${OTP} . Do not share this code`;
    // const fromNumber = "+447893951239";
    const fromNumber = "+91XXXXXXXXXX";
    let phone = mobile_number;
    console.log(mobile_number, "mob");
    if (mobile_number.startsWith(0, 0)) {
      phone = parseInt(mobile_number);
    }
    console.log(phone, "phone");
    let toNumber = phone_code + mobile_number;
    console.log(toNumber, "toNumber");
    let result = await client.messages
      .create({ body: messageBody, from: fromNumber, to: toNumber })
      .then((message) => {
        console.log(message.sid);
        return true;
      })
      .catch((error) => {
        throw error;
        console.error(error, "eeeeeee");
        // return false;
      });
    return result;
  } catch (error) {
    console.log("twilioSendMessage error", error);
    return error.message;
  }
};

const OtpGenerate = async () => {
  const OTP = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
  return OTP;
};
const uniqueCodeGen = async () => {
  const code = otpGenerator.generate(7, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
  return code;
};

const generateRandomDigits = (length) => {
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
};

const generateUniqueUsername = async (firstName) => {
  const baseUsername = firstName.substring(0, 4).toLowerCase(); // Get the first 4 characters of the first name
  let username = `${baseUsername}${generateRandomDigits(6)}`;
  let existingUser = await clients.findOne({ where: { username } });

  while (existingUser) {
    username = `${baseUsername}${generateRandomDigits(6)}`;
    existingUser = await clients.findOne({ where: { username } });
  }

  return username;
};

exports.clientSignup = async (req, res) => {
    try {
        console.log("test_one",req.body);
        const ONE_MINUTE = 5 * 60 * 1000;
        const validationError = validationResult(req);
        const data = req.body;
        if (!validationError.isEmpty()) {
          return res
            .status(400)
            .json({ status: false, message: validationError.errors[0].msg });
        }
    
        let users_data = await clients.findOne({
          where: {
            phone: req.body.phone,
            deleted_at: { [Op.is]: null },
          },
        });
        
        if (users_data && users_data.phone && users_data.password) {
            return res.status(400) .json({status: false, message: "Looks like you already have an account!",description:
                "Please sign into your account by using your email or phone number.",
            });
        }
        const OTP = await OtpGenerate();
      
        
      if (users_data && users_data.phone) {
            await clients.update({otp: OTP,  otp_time: new Date(Date.now() + ONE_MINUTE), updated_at: new Date(),},
                  { where: {  phone: req.body.phone, deleted_at: { [Op.is]: null }, },});
      } else {
           const cli= await clients.create({
              phone: req.body.phone,
              phone_code: req.body.phone_code,
              otp: OTP,
              otp_time: new Date(Date.now() + ONE_MINUTE),
              created_at: new Date(),
           });
          
        }
        return res.status(200).json({ status: true, message: "OTP sent successfully", otp: OTP });
      
     
  } catch (err) {
    console.log(err.message, "error");
    return res.status(400).json({ status: false, message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    function generateUniqueKey() {
      const timestamp = Date.now();
      const randomValue = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
      return `${timestamp}-${randomValue}`;
    }
    const uniqueKey = generateUniqueKey();
    console.log(uniqueKey, "uniqueKey");
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res
        .status(400)
        .json({ status: false, message: validationError.errors[0].msg });
    }
    let users_data = await clients.findOne({
      where: {
        phone: req.body.phone,
        deleted_at: { [Op.is]: null },
      },
    });

    // otp expired condition

    if (users_data) {
      if (users_data.otp == req.body.otp) {
         await clients.update(
           {
             remember_key: uniqueKey,
           },
           {
             where: { id: users_data.id },
           }
         );
        if (new Date() > users_data.dataValues.otp_time) {
          return res
            .status(400)
            .json({ status: false, message: "OTP has expired" });
        }
        let user_record = await clients.findOne({
          where: {
            id: users_data.id,
            deleted_at: { [Op.is]: null },
          },
        });
        let token = "";
        if (
          user_record.first_name &&
          user_record.last_name &&
          user_record.phone_code &&
          user_record.date_of_birth
        ) {
           
          token = await createJwtTokenClient(
            users_data.id,
            users_data.phone,
            uniqueKey,
            true
          );
          // const token_decode = jwt_decode(token);
          // const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
          const user = { ...users_data.dataValues };
          delete user.password;
          user.token = token;
          user.is_email_verified = user.email_verified_at ? true : false;
          console.log(user);

          user.avatar = process.env.UPLOADS + user.avatar;
          
          return res
            .status(200)
            .json({
              status: true,
              message: "Client Login successfully",
              client: user,
              // isComplete: token_decode.isComplete,
            });
        } else {
          token = await createJwtTokenClient(
            users_data.id,
            users_data.phone,
            uniqueKey,
            false
          );
          const user = { ...users_data.dataValues };
          delete user.password;
          user.token = token;
          user.is_email_verified = user.email_verified_at ? true : false;
          console.log(user);
          user.avatar = process.env.UPLOADS + user.avatar;
          return res
            .status(200)
            .json({
              status: true,
              message: "Otp Verify successfully",
              client: user,
              // isComplete: token_decode.isComplete,
            });
        }
      } else {
        return res.status(400).json({ status: false, message: "Invalid OTP" });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Record not found" });
    }
  } catch (err) {
    return res.status(400).json({ status: false, message: err.message });
  }
};

exports.clientCompleteProfile = async (req, res) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res
        .status(400)
        .json({
          status: false,
          message: validationError.array({ onlyFirstError: true })[0].msg,
        });
    }
    const data = req.body;
    const clientFind = req.client.id;
    req.module_type='Complete profile'
    req.message=`${req.body.first_name+" "+req.body.last_name} completing their profile`
    const profile = await clients.findOne({
      where: {
        id: req.client.id,
        deleted_at: { [Op.is]: null },
      },
    });
    const emailExist = await clients.findOne({
      where: {
        email: req.body.email,
        deleted_at: { [Op.is]: null },
      },
    });
    console.log(emailExist, "emailExist");
    if (profile) {
      if (emailExist === null) {
        var hashedPassword = "";
        if (data.password) {
          const saltRounds = 10;
          var myPassword = data.password;
          hashedPassword = await bcrypt.hash(myPassword, saltRounds);
          data.password = hashedPassword;
        }

        var firstLetterFirstName = req.body.first_name.charAt(0).toUpperCase();
        var firstLetterLastName = req.body.last_name.charAt(0).toUpperCase();
        var randomNumbers = Math.floor(10000000 + Math.random() * 90000000);

        var myReferalId =
          firstLetterFirstName + firstLetterLastName + randomNumbers;

        var referalFind = {};
        referalFind = await clients.findOne({
          where: {
            referral_code: myReferalId,
            deleted_at: { [Op.is]: null },
          },
        });
        if (referalFind != null) {
          myReferalId =
            req.body.first_name.substring(0, 4) +
            profile.dataValues.phone.substring(
              profile.dataValues.phone.length - 4
            );
          referalFind = await clients.findOne({
            where: {
              referral_code: myReferalId,
              deleted_at: { [Op.is]: null },
            },
          });
          if (referalFind != null) {
            let phone = profile.dataValues.phone;
            let middleStart = Math.floor(phone.length / 2) - 2; // Subtracting 2 to get the starting point of the 4 middle digits
            let middle4Digits = phone.substring(middleStart, middleStart + 4);
            myReferalId = req.body.first_name.substring(0, 4) + middle4Digits;
          }
        }
        console.log(myReferalId);
        req.body.first_name = req.body.first_name.trim();
        const FirstName=req.body.first_name
        req.body.first_name =
          req.body.first_name.charAt(0).toUpperCase() +
          req.body.first_name.slice(1);
        req.body.last_name = req.body.last_name.trim();
        req.body.last_name =
          req.body.last_name.charAt(0).toUpperCase() +
          req.body.last_name.slice(1);
        
        const username = await generateUniqueUsername(req.body.first_name);

        let setData = {
          username:username,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          avatar: req.files ? req.fileName : "default.png",
          email: req.body.email,
          referral_code: myReferalId,
          parent_id: req.body.parent_id ? req.body.parent_id : null,
          password: data.password,
          date_of_birth: req.body.date_of_birth,
          country_of_residence: req.body.country_of_residence,
          citizenship_country: req.body.citizenship_country,
          tax_residency: req.body.tax_residency,
          updated_at: new Date(),
        };
        let savedata = "";
        let updated = await clients.update(setData, {
          where: {
            id: req.client.id,
            deleted_at: { [Op.is]: null },
          },
        });
        console.log(updated, "updated");
        if (JSON.stringify(updated) === JSON.stringify([1])) {
          const updatedClient = await clients.findOne({
            where: {
              id: req.client.id,
              deleted_at: { [Op.is]: null },
            },
          });
          let saveAddress = {
            client_id: req.client.id,
            country: req.body.doc_country,
            street: req.body.street,
            apartment: req.body.apartment,
            state: req.body.state,
            city: req.body.city,
            postal_code: req.body.postal_code,
            address_type: req.body.address_type
              ? req.body.address_type
              : "home",
            is_primary: req.body.is_primary ? req.body.is_primary : true,
            is_delivery_primary: req.body.is_delivery_primary
              ? req.body.is_delivery_primary
              : true,
          };
          // const unique_code = await uniqueCodeGen();
          const unique_code = '89128128'

          const encoded_unique_code = encodeURIComponent(unique_code); // Encoding the unique_code
          console.log(encoded_unique_code, "codee");
          const link = `${process.env.SERVER_URL}/client/email-verify/${encoded_unique_code}`;

          let email_body = {
            to: req.body.email,
            subject: "Email Verification ",
            template: {
              template_name: "emailLinkTemplate",
              data: {
                otp: 121,
                name: req.body.first_name + " " + req.body.last_name,

                link: link,
              },
            },
          };
            let sendOtpStatus =  universal_helper.sendEmail(email_body);
             const notificationPreference = "general_notifications";

          if (sendOtpStatus) {
            const save_email_info = await email_verification.create({
              client_id: req.client.id,
              unique_id: unique_code,
              email: req.body.email,
              verified_at: new Date(),
              type: "Verification",
            });
          }
          const updateClient = { ...updatedClient.dataValues };
          updateClient
            ? (updateClient.avatar = process.env.UPLOADS + updateClient.avatar)
            : "default.png"; // grab all the values of the updated client
          delete updateClient.password;
          console.log(updateClient, "updateClient");
          const savedAddress = await address.create(saveAddress);
            return res
              .status(200)
              .json({
                status: true,
                message: "Bingo!",
                description: "Your account has been successfully created",
                data: updateClient,
                address: savedAddress,
              }); 
        } else {
          return res
            .status(400)
            .json({
              status: false,
              message: "Data does not updated Successfully",
              data: data,
            });
        }
      } else {
        return res
          .status(400)
          .json({
            status: false,
            message: "Looks like you already have an account!",
            description:
              "Please sign into your account by using your email or phone number.",
          });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Email of user does not exist" });
    }
  } catch (error) {
    console.log(error, "error");
    return res.status(400).json({ status: false, message: error.message });
  }
};

exports.clientLogin = async (req, res, next) => {
  const clientIPAddress = req.ip.replace("::ffff:", "");
  const ONE_MINUTE = 5 * 60 * 1000;
  let validationError = validationResult(req);
  const data = req.body;
  if (!validationError.isEmpty()) {
    return res
      .status(200)
      .json({
        status: true,
        message: validationError.array({ onlyFirstError: true })[0].msg,
      });
  }
  function generateUniqueKey() {
    const timestamp = Date.now();
    const randomValue = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
    return `${timestamp}-${randomValue}`;
  }

  const uniqueKey = generateUniqueKey();
  console.log(uniqueKey, "uniqueKey");
  try {
    const OTP = await OtpGenerate();
    let user_data;
    if (req.body.email != "") {
      user_data = await clients.findOne({
        where: {
          email: req.body.email,
          deleted_at: { [Op.is]: null },
        },
      });
    } else if (req.body.phone != "") {
      user_data = await clients.findOne({
        where: {
          phone: req.body.phone,
          deleted_at: { [Op.is]: null },
        },
      });
    } else {
      return res
        .status(200)
        .json({
          status: "false",
          message: "Either phone or email is required",
          description:"Please enter the required credentials"
        });
    }
    console.log(user_data, "user_data");

    let sendOtpStatus;
    if (req.body.email != "" && user_data) {
      const myPassword = await bcrypt.compare(
        req.body.password,
        user_data.dataValues.password
      );
      if (myPassword) {
         await clients.update(
           {
             remember_key: uniqueKey,
           },
           {
             where: { id: user_data.id },
           }
         );
        token = await createJwtTokenClient(user_data.id, user_data.phone, uniqueKey,true);
        const user = { ...user_data.dataValues, token };

        user.isComplete = true;
        delete user.password;
        user.is_email_verified = user.email_verified_at ? true : false;
        user.avatar = user.avatar
          ? process.env.UPLOADS + user.avatar
          : process.env.UPLOADS + "default.png";

        user.verification_doc_image = user.verification_doc_image
          ? process.env.UPLOADS + user.verification_doc_image
          : "null";
        console.log(process.env.UPLOADS + user.verification_doc_image, "image");
        user.verification_doc_id = user.verification_doc_id
          ? process.env.UPLOADS + user.verification_doc_id
          : "null";
        console.log(process.env.UPLOADS + user.verification_doc_image, "image");
        user.last_login=new Date() 
        return res
          .status(200)
          .json({
            status: true,
            message: "Client Login Successfully",
            data: user,
          });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Password is not match", description:"Please re-check your password and try again."});
      }
    } else if (req.body.phone != "" && user_data) {
    
      sendOtpStatus = true

      console.log(sendOtpStatus, "sendOtp");
      if (sendOtpStatus == false) {
        return res
          .status(200)
          .json({ status: "false", message: `Otp does not send successfully`, description:"We are unable to send otp at the moment please try in some time." });
      }
      if (sendOtpStatus == true) {
        const savedUser = await clients.update(
          {
            otp: OTP,
            otp_time: new Date(Date.now() + ONE_MINUTE),
            updated_at: new Date(),
            last_login: new Date(),
          },
          {
            where: {
              phone: req.body.phone,
              deleted_at: { [Op.is]: null },
            },
          }
        );
        return res
          .status(200)
          .json({ status: true, message: "OTP sent successfully", otp: OTP });
      } else {
        return res.status(200).json({
          status: "false",
          message:
            "Unable to send the OTP to your registered mobile number at the moment.",
          description:
            "Please ensure that your contact details are correctly registered with us and try again.",
        });
      }
    } else {
      return res
        .status(200)
        .json({
          status: "false",
          message: "Oops! We can't find an account with those details",
          description: "Please sign up to register",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, error: error.message });
  }
};