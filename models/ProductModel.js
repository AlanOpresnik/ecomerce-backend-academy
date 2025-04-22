const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ]

})

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product
