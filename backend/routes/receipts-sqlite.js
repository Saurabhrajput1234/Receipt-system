const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt-sqlite');

// Get next receipt number
router.get('/next-number', async (req, res) => {
  try {
    const nextNumber = await Receipt.getNextReceiptNumber();
    
    res.json({
      success: true,
      data: {
        nextReceiptNumber: nextNumber
      }
    });
  } catch (error) {
    console.error('Error getting next receipt number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get next receipt number',
      error: error.message
    });
  }
});

// Get receipt statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Receipt.getReceiptStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting receipt stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipt statistics',
      error: error.message
    });
  }
});

// Create a new receipt
router.post('/', async (req, res) => {
  try {
    const receiptData = req.body;
    
    // Validate required fields
    if (!receiptData.receiptNo || !receiptData.receiptNo.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receipt number is required' 
      });
    }

    // Additional validation
    if (receiptData.mobile && !/^\d{10}$/.test(receiptData.mobile.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // Check for duplicate receipt number
    const existingReceipt = await Receipt.findByReceiptNo(receiptData.receiptNo);
    if (existingReceipt) {
      return res.status(400).json({
        success: false,
        message: 'Receipt number already exists. Please use a different number.'
      });
    }

    const receipt = await Receipt.create(receiptData);
    
    res.status(201).json({
      success: true,
      message: 'Receipt created successfully',
      data: receipt
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create receipt',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all receipts
router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.findAll();
    
    res.json({
      success: true,
      data: receipts,
      count: receipts.length
    });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipts',
      error: error.message
    });
  }
});

// Get receipt by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findById(id);
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }
    
    res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipt',
      error: error.message
    });
  }
});

module.exports = router;