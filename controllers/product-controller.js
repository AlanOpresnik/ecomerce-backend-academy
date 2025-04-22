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
        const files = req.files;

        if (!title || !description || !price) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No se subieron imágenes' });
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

        const uploadPromises = files.map((file) =>
            streamUpload(file.buffer)
        );

        const results = await Promise.all(uploadPromises);
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const newProduct = new Product({
            title,
            description,
            price,
            slug,
            images: results
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

const editProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, price,category } = req.body
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            title,
            description,
            category,
            slug,
            price
        }, { new: true });
        res.status(200).json({
            message: 'Producto actualizado con exito',
            product: updatedProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Error al actualizar el producto'
        })
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
    getProductById,
    editProduct
}