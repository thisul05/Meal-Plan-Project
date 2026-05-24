const express = require('express');
const router  = express.Router();
const { authenticate }  = require('../middleware/authenticate');
const { searchFood }    = require('../controllers/foodController');

/**
 * @swagger
 * /api/food/search:
 *   get:
 *     summary: Search the USDA food database
 *     tags: [Food]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         description: Search term (e.g. "banana", "chicken breast")
 *     responses:
 *       200:
 *         description: Array of matching foods with macros per 100g
 */
router.get('/search', authenticate, searchFood);

module.exports = router;
