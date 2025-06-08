// // controllers/adminController.js
// import { User } from '../models/user.model.js';

// import Newsletter from '../models/newsletter.model.js';
// import nodemailer from 'nodemailer';

// export const getAllUsers = async (req, res) => {
//   try {
//     console.log("Fetching users...");
//     const users = await User.find({}, '-password');
//     res.status(200).json({ success: true, users });
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// export const updateUserStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
//     res.status(200).json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getAllNewsletters = async (req, res) => {
//   try {
//     const newsletters = await Newsletter.find();
//     res.status(200).json({ success: true, newsletters });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const toggleNewsletterStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const newsletter = await Newsletter.findByIdAndUpdate(req.params.id, { status }, { new: true });
//     res.status(200).json({ success: true, newsletter });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const sendEmail = async (req, res) => {
//   const { to, content } = req.body;
//   if (!to || !content) {
//     return res.status(400).json({ success: false, message: "Missing email or content." });
//   }

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to,
//     subject: 'Message from Admin',
//     text: content
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return res.status(200).json({ success: true, message: 'Email sent successfully.' });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: 'Email failed.', error: error.message });
//   }
// };
// controllers/adminController.js
import { User } from '../models/user.model.js';
import { Company } from '../models/company.model.js';
import { Job } from '../models/job.model.js';
import Newsletter from '../models/newsletter.model.js';
import nodemailer from 'nodemailer';

export const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching users...");
    console.log("User making request:", req.user);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }
    
    const users = await User.find({}, '-password');
    console.log(`Found ${users.length} users`);
    
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    console.log("Fetching companies...");
    console.log("User making request:", req.user);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }
    
    const companies = await Company.find({});
    console.log(`Found ${companies.length} companies`);
    
    res.status(200).json({ success: true, companies });
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    console.log("Fetching jobs...");
    console.log("User making request:", req.user);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }
    
    const jobs = await Job.find({}).populate('company', 'name');
    console.log(`Found ${jobs.length} jobs`);
    
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    console.log("Updating user status...");
    console.log("User making request:", req.user);
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }
    
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    console.log("User status updated:", user);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllNewsletters = async (req, res) => {
  try {
    console.log("Fetching newsletters...");
    console.log("User making request:", req.user);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }
    
    const newsletters = await Newsletter.find({});
    console.log(`Found ${newsletters.length} newsletters`);
    
    res.status(200).json({ success: true, newsletters });
  } catch (err) {
    console.error("Error fetching newsletters:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleNewsletterStatus = async (req, res) => {
  try {
    console.log("Toggling newsletter status...");
    console.log("User making request:", req.user);
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }
    
    const { status } = req.body;
    const newsletter = await Newsletter.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!newsletter) {
      return res.status(404).json({ 
        success: false, 
        message: 'Newsletter not found' 
      });
    }
    
    console.log("Newsletter status updated:", newsletter);
    res.status(200).json({ success: true, newsletter });
  } catch (err) {
    console.error("Error toggling newsletter status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendEmail = async (req, res) => {
  try {
    console.log("Sending email...");
    console.log("User making request:", req.user);
    console.log("Request body:", req.body);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin role required.' 
      });
    }
    
    const { to, content } = req.body;
    if (!to || !content) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing email or content." 
      });
    }

    // Check if email environment variables are set
    if (!process.env.SMTP_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        message: "Email configuration not set up properly." 
      });
    }

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: 'Message from Admin',
      text: content
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully.' 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Email failed.', 
      error: error.message 
    });
  }
};