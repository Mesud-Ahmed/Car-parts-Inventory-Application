const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');


router.get('/', categoryController.list);
router.get('/create', categoryController.create_get);
router.post('/create', categoryController.create_post);
router.get('/:id', categoryController.detail);
router.get('/:id/update', categoryController.update_get);
router.post('/:id/update', categoryController.update_post);
router.get('/:id/delete', categoryController.delete_get);
router.post('/:id/delete', categoryController.delete_post);

module.exports = router;
