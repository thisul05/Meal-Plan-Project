const express    = require('express');
const router     = express.Router();
const { authenticate } = require('../middleware/authenticate');
const savedPlansController = require('../controllers/savedPlansController');

// All saved-plan routes require a valid JWT
router.use(authenticate);

/**
 * @swagger
 * /api/saved-plans:
 *   get:
 *     summary: Get all saved plans for the logged-in user
 *     tags: [Saved Plans]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Save a meal plan
 *     tags: [Saved Plans]
 *     security:
 *       - bearerAuth: []
 */
router.get('/',    savedPlansController.getAll);
router.post('/',   savedPlansController.save);
router.delete('/:id', savedPlansController.remove);

module.exports = router;
