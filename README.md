# NexusAuth-Onboardify
NexusAuth-Onboardify is an authentication and onboarding system built with Node.js, Express, and Sequelize. This project provides commonly used authentication APIs like signup, verify OTP, complete profile, login, and a home page for user interaction. It's designed for easy integration into various applications to handle user registration, authentication, and profile management.
It incorporates tools like Twilio for phone-based signup, Nodemailer for email-based verification, JWT for secure authentication, and Multer for file uploads. The project follows the MVC architecture for organized code management and scalability.

# Table of Contents
1. Features
2. Tech Stack
3. Setup Instructions
4. API Endpoints
  * Signup
  * Verify OTP
  * Complete Profile
  * Login
  * Home Page
5. Environment Variables
6. Utilities
7. Contributing

# Features
  * Signup via Email & Phone: Users can sign up using their email or phone number.
  * OTP Verification: OTPs are sent via email and phone using Nodemailer and Twilio, respectively, for secure user verification.
  * Profile Completion: Users can upload an avatar/profile photo using Multer during profile completion.
  * Login: Login supports both email-based and phone-based authentication.
  * JWT Authentication: Secure authentication and authorization with JSON Web Tokens (JWT).
  * Email Verification: Users receive an email verification link upon signup, handled by Nodemailer.
  * Global Pagination: Built-in pagination functions for managing large datasets in API responses.
  * MVC Architecture: Organized code with models, views, and controllers for scalability and maintainability.

# Tech Stack
  * Node.js: JavaScript runtime for server-side development.
  * Express: Web framework for building the API.
  * Sequelize: ORM for interacting with MySQL database.
  * MySQL: Database management system used for storing user data (managed via phpMyAdmin).
  * Twilio: API for sending OTPs via SMS for phone number verification.
  * Multer: Middleware for handling file uploads (avatar/profile photo).
  * Nodemailer: Used to send email verification links to users.
  * JWT (jsonwebtoken): For token-based user authentication.
  * Express Validator: For validating input data such as email, phone number, and other user inputs.

# Setup Instructions
  1. Clone the Repository
      git clone https://github.com/your-username/NexusAuth-Onboardify.git
      cd NexusAuth-Onboardify
  2. Install Dependencies
  Run the following command to install the required dependencies:
      npm install
  3. Set Up MySQL Database (via phpMyAdmin)
    To set up the MySQL database using phpMyAdmin, follow these steps:

  * Log into phpMyAdmin: Open your browser and go to the phpMyAdmin dashboard (usually http://localhost/phpmyadmin).

  * Create a Database: In phpMyAdmin, click on the Databases tab. Create a new database for your project. Name it nexus_auth or any name of your choice.

    Database Name: nexus_auth
    Collation: Choose utf8_general_ci (or any other preferred collation).
  * Create a Database User (optional): If you need a specific user to manage the database, go to the User Accounts section and create a new user with access to your database.

    Username: your_db_username
    Password: your_db_password
    Host: localhost
  * Run Sequelize Migrations: After setting up the database, you'll need to run Sequelize migration commands to create the necessary tables.

        npx sequelize-cli db:migrate
This will create the necessary tables in the nexus_auth database.  
  4. Set Up Environment Variables
  Create a .env file in the root directory and add the following environment variables:
    # Twilio credentials
    ACCOUNTSID=your_twilio_account_sid
    AUTHTOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    
    # Nodemailer SMTP credentials
    SMTP_HOST=smtp.your-email-provider.com
    SMTP_PORT=587
    SMTP_USER=your-smtp-email@example.com
    SMTP_PASS=your-smtp-email-password
    
    # JWT secret for token signing
    JWT_SECRET=TOKEN
    
    # Database credentials (for Sequelize)
    DB_HOST=localhost
    DB_PORT=3006
    DB_USER=your_db_username
    DB_PASSWORD=your_db_password
    DB_NAME=nexus_auth
  5. Run the Development Server
  # Start the development server by running:
    npm start
  the project will be accessible at http://localhost:3000.


# API Endpoints
1. Signup
POST /client/signup

Create a new user by providing either an email or a phone number.

Request Body:
{   "phone_code": "+91",
    "phone": "123357890"
}
Response:
{
  "success": true,
  "message": "OTP sent successfully."
}
2. Verify OTP
POST /client/verify-otp

Verify the OTP sent to the user's email or phone.

Request Body:

{
    "phone_code": "+91",
    "phone": "123357890",
     "otp": "1549"

}
Response:
{
  "success": true,
  "message": "OTP verified successfully."
}
3. Complete Profile
POST /client/complete-profile

Complete the user's profile by uploading an avatar or profile photo.

Request Body (Form-data):
image/file: Avatar/profile photo (multipart/form-data)
json:{
    "first_name": "your firstname",
    "middle_name":"yourmiddle name",
    "last_name": "your lastname",
    "email": "abc@gmail.com",
    "password": "abc@123",
    "phone":"123357890",
    "date_of_birth": "your dob",
    "country_of_residence": "India",
    "citizenship_country": "India",
    "tax_residency": "your country",
    "country": "your country",
    "street": "your address street",
    "apartment": "your apartment",
    "state": "your state",
    "city": "your city",
    "postal_code": your postal code,
    "address_type": "Home",
    "is_primary": true,
    "citizenship_type":"personal",
    "house_number":"your house number"
}
Response:
{
  "success": true,
  "message": "Profile completed successfully."
}

4. Login
POST /client/login

Log in the user using either their email or phone number.

Request Body:

{
  "email": "user@example.com",
  "phone": "+phone_code yourphone",  // +91123578890
  "password": "yourpassword"
}
Response:
{
  "status": true,
  "message": "Client Login Successfully",
   "data":{"id": 1323,
        "username": "yourusername",
        "first_name": "your firstname",
        "middle_name":"yourmiddle name",
        "last_name": "your lastname",
        "last_password": null"
        "phone": "yourphone",
        "phone_code": 91,...
        "date_of_birth": "2001-09-18",
        "postal_code": your postal code,
        "address": null,
        "email": "youremail",
        "email_verified_at": "2024-09-18T10:40:28.000Z",
        "country_of_residence": "your country",
        "otp": 6788,
        "avatar": "http://localhost:3006/uploads/default.png",
        "doc_verified_at": "2024-09-18T10:41:22.000Z",
        "doc_verified_status": "approved",
        "doc_verify_reason": null,
        "doc_image_verified_at": "2024-09-18T10:41:27.000Z",
        "doc_sumbission_time": "2024-09-18T10:40:53.000Z",
        "doc_image_verified_status": "approved",
        "doc_image_verify_reason": null,
        "doc_approval_date": "2024-09-18T10:41:27.000Z",
        "parent_id": null,
        "referral_code": "your_generated_referral_code",
        "otp_time": "2024-09-18T10:40:00.000Z",
        "citizenship_country": "your country",
        "tax_residency": "your country",
        "placed_on": "uniqueGeneratedID",
        "email_activation": true,
        "phone_activation": true,
        "reward_bonus": "0.00",
        "status": "ACTIVE",
        "last_login": "2024-11-09T17:02:31.963Z",
        "save_activity_logs": true,
        "email_unusual_activity": false,
        "created_at": "2024-09-18T10:35:00.000Z",
        "remember_key": "1730098446190-941475",
        "updated_at": "2024-10-28T06:54:06.000Z",
        "deleted_at": null,
        "token": "your_token",
        "isComplete": true,
        "is_email_verified": true
}
}

5. Home Page
GET /client/home-page

Retrieve the authenticated user's home page details.
Request Header:
Authorization: Bearer jwt_token
{
  "status": true,
  "message": "Welcome to your home page.",
  "data": {
        "profile": {
        "username": "yourusername",
        "first_name": "your firstname",
        "middle_name":"yourmiddle name",
        "last_name": "your lastname",...
        }
      }
}

# Environment Variables
Make sure to set up the following environment variables in .env file:

Variable - Description
TWILIO_ACCOUNT_SID - Your Twilio Account SID for sending OTPs
TWILIO_AUTH_TOKEN -	Your Twilio Auth Token
TWILIO_PHONE_NUMBER -	Your Twilio phone number
SMTP_HOST -	SMTP server host for sending verification emails
SMTP_PORT -	SMTP server port (e.g., 587 for Gmail)
SMTP_USER	- SMTP username (your email address)
SMTP_PASS	- SMTP password (or app-specific password)
JWT_SECRET -	JWT secret key for signing authentication tokens
DB_HOST -	Hostname for your MySQL database
DB_PORT -	Port for your MySQL database (e.g., 3306 for MySQL)
DB_USER	- Your MySQL database username
DB_PASSWORD -	Your MySQL database password
DB_NAME -	Name of your MySQL database

# Utilities
Create Token: Function to generate a JWT token for authenticated users.
Decode Token: Function to decode and verify the JWT token.
Global Pagination: A utility function for consistent pagination across API responses.
Send Mail: Function to send mails using nodemailer.

# Contributing
I welcome contributions to NexusAuth-Onboardify! If you find a bug, or have an idea for a new feature, feel free to open an issue or submit a pull request.

Steps to Contribute:
 1. Fork the repository.
 2. Create a new branch (git checkout -b feature/your-feature).
 3. Make your changes.
 4. Commit your changes (git commit -am 'Add new feature'). 
 5. Push to the branch (git push origin feature/your-feature).
 6. Open a Pull Request.

# Acknowledgments
 * Twilio
 * Sequelize
 * Nodemailer
 * JWT (jsonwebtoken)
 * Multer
 * Express Validator




 
 
