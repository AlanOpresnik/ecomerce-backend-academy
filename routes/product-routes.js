const { getAllProducts, postProduct, deleteProduct, getProductById } = require('../controllers/product-controller');
const express = require('express')
const upload = require('../configs/multer');
const router = express.Router()

const app = express()


router.get('/get', getAllProducts)
router.get('/get/:id', getProductById)
router.post('/post', upload.single('image'), postProduct)
router.delete('/delete/:id', deleteProduct)
module.exports = router