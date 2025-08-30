import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import nodemailer from "nodemailer";
import hashPassword, { comparePassword } from '../utils/passwordHasher';
import passwordHasher from '../utils/passwordHasher'
import calculateAge from '../utils/dob';
import dotenv from 'dotenv';
import Redis from 'ioredis-mock';

dotenv.config();

const redis = new Redis({
  // host: '127.0.0.1', // or your Redis host
  // port: 6379,        // default Redis port
  // password: 'yourpassword', // if Redis is secured
  // db: 0 // optional DB index
});

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6321d776323228",
    pass: "c683bdb07dce84"
  }
});

const sendWelcomeEmail = (userEmail: string) => {
  const mailOptions = {
    from: "noreply@vaccinebookingsystem.com",
    to: userEmail,
    subject: "Welcome to Vaccine Booking System!",
    text: `Hello,

You have successfully registered for the Vaccine Booking System. 
We are excited to have you onboard!

Best regards,
Vaccine Booking Team`,
  };

  transport.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send({
        code: 400,
        status: 'FAILURE',
        message: 'Invalid user credentials!',
        data: {},
      });
    }

    const isMatch = await comparePassword(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).send({
        code: 400,
        status: 'FAILURE',
        message: 'Invalid user credentials!',
        data: {},
      });
    }

    const jwtToken = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(200).send({
      code: 200,
      status: 'SUCCESS',
      message: 'User logged in successfully!',
      data: jwtToken,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'FAILURE',
      message: 'Error logging in user',
      data: error,
    });
  }
};

export const authData = async (req: Request, res: Response) => {
  const { name, password, email, dob, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });
  // if (existingUser) {
  //   return res.status(200).send({ message: "User already exists" });
  // }

  try {
    const hashedPassword = await hashPassword(password); // await here
    const age = calculateAge(new Date(dob));
    const phoneNumberParsed = Number(phoneNumber);

    const newUser = new User({
      username: name,
      password: hashedPassword,
      email: email,
      mobileNumber: phoneNumberParsed,
      role: "user",
      isDeleted: false,
      profile: {
        age: age,
        dob: new Date(dob),
        specialization: "",
      },
    });

    const savedUser = await newUser.save();

    sendWelcomeEmail(email);

    console.log("savedUser", savedUser);

    res.status(200).send({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Error registering user");
  }
};

// const otpStore = new Map(); // Replace with DB or Redis in production
// redis.get(`user:${'id'}`)

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3c7102a5341760",
      pass: "cc4078aa648110"
    }
  });
  
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      code: 400,
      status: 'failure',
      message: 'Email is required',
      data: null,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: 'failure',
        message: 'User with this email does not exist',
        data: null,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // otpStore.set(email, { otp, createdAt: Date.now() });
    const otpObject = { otp, createdAt: Date.now() }
    await redis.set(email, JSON.stringify(otpObject), 'EX', 60);


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}`,
    };

    console.log('Sending OTP from:', process.env.EMAIL_USER, 'to:', email);

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      code: 200,
      status: 'success',
      message: 'OTP sent successfully',
      data: null,
    });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      code: 500,
      status: 'failure',
      message: 'Failed to send OTP. Please try again later.',
      data: null,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  // const record = otpStore.get(email);
  const redisRecord = await redis.get(email);
  const record = redisRecord ? JSON.parse(redisRecord) : null;

  if (!record) return res.status(400).json({ message: 'No OTP found for this email' });
  if (Date.now() - record.createdAt > 10 * 60 * 1000) {
    // otpStore.delete(email);
    res.status(400).json({
        code: 400,
        status: 'failure',
        message: 'OTP expired',
        data: null,
      });
  }

  if (otp === record.otp) {
    res.status(200).json({
        code: 200,
        status: 'success',
        message: 'OTP verified',
        data: null,
      });
  } else {
    res.status(400).json({
        code: 400,
        status: 'failure',
        message: 'Invalid OTP',
        data: null,
      });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;


  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: 'failure',
        message: 'User not found',
        data: null,
      });
    }

    const hashedPassword = await passwordHasher(newPassword);

    user.password = hashedPassword;
    

    console.log('resetPassword => ', user)

    await user.save();

    return res.status(200).json({
      code: 200,
      status: 'success',
      message: 'Password reset successfully',
      data: null,
    });

  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Internal server error',
      data: null,
    });
  }
};