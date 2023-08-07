const express = require('express');
const modalController = require('../controllers/modalController')

const router = express.Router();

router.get('/get_summary_district', modalController.getSummaryByDistrict);
router.get('/get_project_info', modalController.getProjectInfor)
router.get('/get_detail_project', modalController.getDetailProject)
module.exports = router;
