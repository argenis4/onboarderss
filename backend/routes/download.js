const express = require('express');
const { filterLeadsAndUpdateCount } = require('../services/googleSheets');
const router = express.Router();

router.post('/', async (req, res) => {
  const filters = req.body;
  try {
    const csvData = await filterLeadsAndUpdateCount(filters);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csvData);
  } catch (error) {
    res.status(500).send('Error processing the request');
  }
});

module.exports = router;