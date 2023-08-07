const express = require('express');
const evaluateController = require('../controllers/evaluateController');

const router = express.Router();

router.get('/get_projects', evaluateController.getAllProjects);
router.get('/:project_id/get_news', evaluateController.getNewsByProject);
router.get('/evaluate', evaluateController.evaluate)
module.exports = router;
