'use strict';

const express = require('express');
const router = express.Router();

const propertiesController = require('../controllers/properties');

router.post('', propertiesController.create);
router.get('/:id', propertiesController.get);
router.get('', propertiesController.list);


module.exports = router;
