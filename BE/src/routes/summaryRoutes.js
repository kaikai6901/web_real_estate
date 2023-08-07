const express = require('express');
const summaryController = require('../controllers/summaryController');

const router = express.Router();

router.get('/price_of_month', summaryController.getPriceAvgMonth);
router.get('/get_list_prices', summaryController.getListPrice);
router.get('/price_by_district', summaryController.getPricePerDistrict);
router.get('/get_news_district', summaryController.getNumberNewsByDistrict)
router.get('/get_list_project', summaryController.getListProject)
router.get('/get_list_news', summaryController.getListNews)
module.exports = router;
