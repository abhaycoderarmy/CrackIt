// // routes/admin.js
// import express from 'express';
// import {
//   getAllUsers,
//   updateUserStatus,
//   getAllNewsletters,
//   toggleNewsletterStatus,
//   sendEmail
// } from '../controllers/adminController.js';
// import { getAllCompanies } from '../controllers/company.controller.js';

// const router = express.Router();

// // Protect these with admin check middleware
// router.get('/users', getAllUsers);
// router.put('/users/:id/status', updateUserStatus);

// router.get('/newsletters', getAllNewsletters);
// router.put('/newsletters/:id/status', toggleNewsletterStatus);
// router.post('/send-email', sendEmail);
// router.get('/companies', getAllCompanies);

// export default router;
// routes/admin.js
import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  getAllNewsletters,
  toggleNewsletterStatus,
  sendEmail,
  getAllCompanies,
  getAllJobs
} from '../controllers/adminController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Debug middleware to log all admin requests
router.use((req, res, next) => {
  console.log(`Admin route accessed: ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  next();
});

// Apply authentication middleware to all admin routes
router.use(isAuthenticated);

// Admin check middleware
const isAdmin = (req, res, next) => {
  console.log('Checking admin permissions for user:', req.user);
  
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  next();
};

// Apply admin check to all routes
router.use(isAdmin);

// Routes
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

router.get('/newsletters', getAllNewsletters);
router.put('/newsletters/:id/status', toggleNewsletterStatus);

router.get('/companies', getAllCompanies);
router.get('/jobs', getAllJobs);

router.post('/send-email', sendEmail);

export default router;