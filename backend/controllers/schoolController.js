const { validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const fs = require('fs').promises;

// Add a new school
const addSchool = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If file was uploaded, delete it
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, address, city, state, contact, email_id } = req.body;

    // Check if image file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'School image is required'
      });
    }

    // Upload image to Cloudinary
    const imageUploadResult = await uploadImage(req.file);
    
    // Delete the temporary file
    await fs.unlink(req.file.path).catch(console.error);

    if (!imageUploadResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to upload image',
        error: imageUploadResult.error
      });
    }

    // Check if school with same email already exists
    const [existingSchool] = await pool.execute(
      'SELECT id FROM schools WHERE email_id = ?',
      [email_id]
    );

    if (existingSchool.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A school with this email already exists'
      });
    }

    // Insert school data into database
    const [result] = await pool.execute(
      `INSERT INTO schools (name, address, city, state, contact, image, email_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, contact, imageUploadResult.url, email_id]
    );

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        city,
        state,
        contact,
        image: imageUploadResult.url,
        email_id
      }
    });

  } catch (error) {
    console.error('Add school error:', error);
    
    // Clean up uploaded file if exists
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
};

// Get all schools
const getAllSchools = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    console.log('Query params:', { page, limit, search, offset });

    let query, queryParams;
    let countQuery, countParams;

    // Build queries based on search
    if (search && search.trim()) {
      const searchParam = `%${search.trim()}%`;
      query = `SELECT * FROM schools 
               WHERE name LIKE ? OR city LIKE ? OR state LIKE ? 
               ORDER BY created_at DESC 
               LIMIT ${parseInt(limit)} OFFSET ${offset}`;
      queryParams = [searchParam, searchParam, searchParam];
      
      countQuery = `SELECT COUNT(*) as total FROM schools 
                    WHERE name LIKE ? OR city LIKE ? OR state LIKE ?`;
      countParams = [searchParam, searchParam, searchParam];
    } else {
      query = `SELECT * FROM schools 
               ORDER BY created_at DESC 
               LIMIT ${parseInt(limit)} OFFSET ${offset}`;
      queryParams = [];
      
      countQuery = `SELECT COUNT(*) as total FROM schools`;
      countParams = [];
    }

    console.log('Executing query:', query);
    console.log('With params:', queryParams);

    // Get schools data
    const [schools] = await pool.execute(query, queryParams);

    // Get total count
    console.log('Executing count query:', countQuery);
    console.log('With count params:', countParams);
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: schools,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get schools error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schools',
      error: error.message
    });
  }
};

// Get school by ID
const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;

    const [schools] = await pool.execute(
      'SELECT * FROM schools WHERE id = ?',
      [id]
    );

    if (schools.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.json({
      success: true,
      data: schools[0]
    });

  } catch (error) {
    console.error('Get school by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school',
      error: error.message
    });
  }
};

// Update school
const updateSchool = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, address, city, state, contact, email_id } = req.body;

    // Check if school exists
    const [existingSchool] = await pool.execute(
      'SELECT * FROM schools WHERE id = ?',
      [id]
    );

    if (existingSchool.length === 0) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    let imageUrl = existingSchool[0].image;

    // If new image is uploaded, upload to Cloudinary
    if (req.file) {
      const imageUploadResult = await uploadImage(req.file);
      await fs.unlink(req.file.path).catch(console.error);

      if (imageUploadResult.success) {
        imageUrl = imageUploadResult.url;
      }
    }

    // Update school data
    await pool.execute(
      `UPDATE schools SET name = ?, address = ?, city = ?, state = ?, 
       contact = ?, image = ?, email_id = ? WHERE id = ?`,
      [name, address, city, state, contact, imageUrl, email_id, id]
    );

    res.json({
      success: true,
      message: 'School updated successfully',
      data: {
        id,
        name,
        address,
        city,
        state,
        contact,
        image: imageUrl,
        email_id
      }
    });

  } catch (error) {
    console.error('Update school error:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update school',
      error: error.message
    });
  }
};

// Delete school
const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if school exists
    const [existingSchool] = await pool.execute(
      'SELECT * FROM schools WHERE id = ?',
      [id]
    );

    if (existingSchool.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Delete school from database
    await pool.execute('DELETE FROM schools WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'School deleted successfully'
    });

  } catch (error) {
    console.error('Delete school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete school',
      error: error.message
    });
  }
};

module.exports = {
  addSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
};
