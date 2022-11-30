const express= require('express');
const dashboardController = require('./dashboardController')
const router= express.Router();

router.post('/',dashboardController.loadListClasses);

router.post('/addClass',dashboardController.addClass);

module.exports=router;