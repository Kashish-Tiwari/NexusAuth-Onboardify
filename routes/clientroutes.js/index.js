const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const { validateSignup, validateVerifyOTP, validateClientCompleteProfile } = require('../../middlewares/client/validation')
const { createJwtTokenClient, decodeJwtTokenClient } = require('../../middlewares/client/jwtHelperClient');
const clientController = require("../../controllers/client/clientController")
const homeController = require("../../controllers/client/homeController")


const multer = require('multer');
const fileUpload = require('express-fileupload');




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


const processUpload = async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No files were uploaded.');
            next();
            return;
        }

        let file = req.files.image;
        
        let originalFilename = file.name;
     
        // let filename = Date.now() + '-' + file.name;
        // let filename =  file.name;
        var filename = Math.random().toString(20).slice(2, 8) + '' + originalFilename.replace(/\s/g, '');

        // Wrap the mv function in a Promise
        await new Promise((resolve, reject) => {
            file.mv('./public/uploads/' + filename, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

       
        req.fileName = filename; // if you want to keep filename for further middleware or routes.
        next();
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}



router.post('/signup', validateSignup, clientController.clientSignup);

router.post('/verify-otp', validateVerifyOTP, clientController.verifyOTP);
router.post('/complete-profile', validateClientCompleteProfile, decodeJwtTokenClient, processUpload, clientController.clientCompleteProfile);
router.post('/login', clientController.clientLogin);
router.get('/home-page', decodeJwtTokenClient, homeController.homePage);
module.exports = router;
