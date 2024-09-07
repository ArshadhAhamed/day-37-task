
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/', studentController.createStudent);
router.put('/:studentId/mentor', studentController.assignOrChangeMentor);
router.get('/:studentId/mentor', studentController.getCurrentMentorForStudent);

module.exports = router;
