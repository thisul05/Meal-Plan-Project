const express = require('express');
const router = express.Router();
const mealplanController = require('../controllers/mealplanController');

/**
 * @swagger
 * /api/mealplan/generate:
 *   post:
 *     summary: Generate a daily meal plan matching calorie and macro targets
 *     tags: [Meal Plan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealPlanRequest'
 *     responses:
 *       200:
 *         description: Generated meal plan (withinTolerance indicates if targets were met)
 *       400:
 *         description: Missing or invalid request body
 *       422:
 *         description: Could not generate any plan (empty recipe pool)
 */
router.post('/generate', mealplanController.generate);

module.exports = router;
