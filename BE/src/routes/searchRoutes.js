
const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

router.get('/get_news', searchController.getNearestDocuments);
router.get('/get_projects', searchController.getNearestProjects);
router.get('/get_statistic', searchController.getStatistic)
module.exports = router;
