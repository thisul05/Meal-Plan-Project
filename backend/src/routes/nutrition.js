const express = require('express');
const router = express.Router();
const { validateNutritionInput } = require('../middleware/validate');
const nutritionController = require('../controllers/nutritionController');

/**
 * @swagger
 * /api/nutrition/calculate:
 *   post:
 *     summary: Calculate BMR, TDEE, BMI, calorie target, and macros
 *     tags: [Nutrition]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfile'
 *     responses:
 *       200:
 *         description: Nutrition results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NutritionResult'
 *       400:
 *         description: Validation errors
 */
router.post('/calculate', validateNutritionInput, nutritionController.calculate);

module.exports = router;
