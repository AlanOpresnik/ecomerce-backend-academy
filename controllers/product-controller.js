const Product = require('../models/ProductModel')
const cloudinary = require('../configs/cloudinary'); // Asegúrate de importar bien

const streamifier = require('streamifier');



const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if (!products) return new Error('No hay productos en la bd')
        res.status(200).json(products)
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
}


const postProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const file = req.file;

        if (!title || !description || !price || !file) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        // Convertimos buffer a stream para subirlo a Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(file.buffer);

        const newProduct = new Product({
            title,
            description,
            price,
            image: result.secure_url
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error al subir producto:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params

    try {
        const product = await Product.findById(id)
        if (!product) {
            res.status(502).json({
                message: `No se encontro el producto con el id ${id}`
            })
        }
        res.status(200).json({
            product
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id)
        if (!product) {
            res.status(502).json({
                message: `No se encontro el producto con el id ${id}`
            })
        }
        await Product.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Producto eliminado con exito'
        })
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    getAllProducts,
    postProduct,
    deleteProduct,
    getProductById
}