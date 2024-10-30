const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all equipment
router.get('/equipment', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM equipment');
    res.json(results);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add new equipment
router.post('/equipment', async (req, res) => {
  const { name, type, quantity, purchase_date } = req.body;
  try {
    await db.query(
      'INSERT INTO equipment (name, type, quantity, purchase_date) VALUES (?, ?, ?, ?)',
      [name, type, quantity, purchase_date]
    );
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update equipment
router.put('/equipment/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, quantity, purchase_date } = req.body;
    try {
      await db.query(
        'UPDATE equipment SET name = ?, type = ?, quantity = ?, purchase_date = ? WHERE id = ?',
        [name, type, quantity, purchase_date, id]
      );
      res.send('Equipment updated');
    } catch (error) {
      console.error('Error updating equipment:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Delete equipment
router.delete('/equipment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM equipment WHERE id = ?', [id]);
    res.send('Equipment deleted');
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
