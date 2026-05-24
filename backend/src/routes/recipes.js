const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Fetch all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Array of all recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/', recipeController.getAll);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Fetch a single recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: A single recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: ID must be a number
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', recipeController.getById);

module.exports = router;
