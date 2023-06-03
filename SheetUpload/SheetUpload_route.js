const express = require('express');
const router = express.Router();
const SheetController = require('../SheetUpload/SheetUpload_controller');

router.post('/list', SheetController.sheetList);
router.post('/upload', SheetController.sheetUpload);

module.exports = router;
