const express = require('express')
const router = express.Router()

const itemController = require('../controllers/item.controller')
const upload = require('../middlewares/uploads')

router.post('/', upload.single('image'), itemController.createItem)
router.get('/', itemController.getItem)
router.get('/:id', itemController.detailItem )
router.put('/:id', upload.single('image'), itemController.updateItem)
router.delete('/:id', itemController.deleteItem)

module.exports = router