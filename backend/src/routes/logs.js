const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/authenticate');
const logsController   = require('../controllers/logsController');

router.use(authenticate);

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get log entries for a date (?date=YYYY-MM-DD, defaults to today)
 *     tags: [Diary]
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     summary: Log a single meal
 *     tags: [Diary]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/',       logsController.getByDate);
router.post('/',      logsController.addLog);
router.post('/bulk',  logsController.addBulk);
router.delete('/:id', logsController.removeLog);

/**
 * @swagger
 * /api/logs/summary:
 *   get:
 *     summary: Weekly calorie/macro summary (?days=7)
 *     tags: [Diary]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/summary', logsController.getSummary);

module.exports = router;
