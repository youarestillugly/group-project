const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const User = require('../models/User'); // your Sequelize User model

// Email transporter setup (reuse for all email sends)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt with:', email);

  try {
    // Admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      console.log('Admin login successful');
      req.session.isAdmin = true;
      req.session.user = { email, name: 'Admin' };
      return res.redirect('/admin/dashboard');
    }

    // Regular user login
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('pages/login', { message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.render('pages/login', { message: 'Please verify your email before logging in.' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.render('pages/login', { message: 'Invalid credentials' });
    }

    // ✅ Store all required session data
    req.session.isAdmin = false;
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      course: user.course,  // ✅ Ensure this is included
    };

    console.log("Session user set:", req.session.user);

    res.redirect('user/home');

  } catch (err) {
    console.error('Login error:', err);
    res.render('pages/login', { message: 'An error occurred, please try again.' });
  }
};
exports.getLogin = (req, res) => {
  res.render('pages/login', { message: null });
};

// GET /signup
exports.getSignup = (req, res) => {
  res.render('pages/signup', { message: null });
};

// POST /signup
exports.postSignup = async (req, res) => {
  const { firstName, lastName, email, password, role, course } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('pages/signup', { message: '⚠️ Email already registered!' });
    }

    // Create verification token
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create user - password will be hashed automatically by Sequelize hook
    await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'student', // default to 'student'
      course: (role === 'student' || role === 'organizer') ? course : null, // course only for students
      verificationToken,
      isVerified: false,
    });

    // Verification email link
    const verifyUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;


    await transporter.sendMail({
      from: `"CEMS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '📩 Please verify your email',
      html: `
        <h3>Hello ${firstName},</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}" target="_blank" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin-bottom: 15px;">Verify Email</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    return res.render('pages/verify-message', { email, firstName });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.render('pages/signup', {
      message: '❌ Error during signup. Please try again.',
    });
  }
};

// GET /verify-email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Update user to mark verified and clear token
    await User.update(
      { isVerified: true, verificationToken: null },
      { where: { email } }
    );

    res.send('✅ Email verified successfully. You can now log in.');
  } catch (error) {
    res.send('❌ Invalid or expired verification link.');
  }
};

// GET /forgot-password
exports.getForgotPassword = (req, res) => {
  res.render('pages/forgot-password', { message: null });
};


// POST /forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('pages/forgot-password', { message: 'Email not found' });
    }

    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await User.update(
      { resetToken },
      { where: { email } }
    );

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password:\n\n${resetLink}`,
    });

    res.render('pages/forgot-password', { message: 'Password reset link has been sent to your email.' });

  } catch (error) {
    console.error(error);
    res.render('pages/forgot-password', { message: 'Something went wrong. Please try again.' });
  }
};

// GET /reset-password
exports.getResetPassword = (req, res) => {
  const { token } = req.query;
  res.render('pages/reset-password', { token, message: null });
};

// POST /reset-password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      // Token is valid but user not found — show success anyway for security
      return res.render('pages/reset-password', {
        message: 'Password reset successful.',
        token: '',
        success: true
      });
    }

    // Update password (Sequelize hook will hash automatically)
    user.password = newPassword;
    user.resetToken = null;
    await user.save();

    return res.render('pages/reset-password', {
      message: 'Password has been reset successfully.',
      token // keep token here in case you want to reuse or show message
    });
  } catch (error) {
    console.error(error);
    return res.render('pages/reset-password', {
      message: 'Invalid or expired token',
      token
    });
  }
};

// GET /logout
exports.logout = (req, res) => {
  console.log('🔁 Logout route hit');
  req.session.destroy(err => {
    if (err) console.error('Session destroy error:', err);
    res.clearCookie('jwt', { httpOnly: true, path: '/' });
    res.redirect('/login');
  });
};

