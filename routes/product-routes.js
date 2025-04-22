const { getAllProducts, postProduct, deleteProduct, getProductById, editProduct } = require('../controllers/product-controller');
const express = require('express')
const upload = require('../configs/multer');
const router = express.Router()

const app = express()


router.get('/get', getAllProducts)
router.get('/get/:id', getProductById)
router.post('/post', upload.array('images'), postProduct)
router.put('/edit/:id', upload.none(), editProduct)
router.delete('/delete/:id', deleteProduct)
module.exports = router