const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// List all items
router.get('/', itemController.item_list);

// Create
router.get('/create', itemController.item_create_get);
router.post('/create', itemController.item_create_post);

// Update
router.get('/:id/edit', itemController.item_update_get);
router.post('/:id/edit', itemController.item_update_post);

// Item detail
router.get('/:id', itemController.item_detail);



// Delete
router.post('/:id/delete', itemController.item_delete_post);

module.exports = router;
