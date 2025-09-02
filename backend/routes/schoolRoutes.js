const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const {
  addSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} = require('../controllers/schoolController');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Validation middleware
const schoolValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('School name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('School name must be between 2 and 100 characters'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  
  body('email_id')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

// Routes
router.post('/schools', upload.single('image'), schoolValidation, addSchool);
router.get('/schools', getAllSchools);
router.get('/schools/:id', getSchoolById);
router.put('/schools/:id', upload.single('image'), schoolValidation, updateSchool);
router.delete('/schools/:id', deleteSchool);

module.exports = router;
