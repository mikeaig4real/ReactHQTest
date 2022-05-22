const express = require('express');
const router = express.Router();
const { getAllTasks,getSingleTask,createSingleTask,deleteSingleTask,updateSingleTask } = require('../controllers/tasks');

router.route('/').get(getAllTasks).post(createSingleTask);
router.route('/:id').get(getSingleTask).delete(deleteSingleTask).patch(updateSingleTask);


module.exports = router;