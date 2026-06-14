const express    = require('express');
const router     = express.Router();
const { authenticate } = require('../middleware/authenticate');
const weightController = require('../controllers/weightController');

router.use(authenticate);

router.get('/',    weightController.getWeight);
router.post('/',   weightController.logWeight);
router.delete('/:id', weightController.deleteWeight);

module.exports = router;
