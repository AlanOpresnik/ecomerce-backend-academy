const mongoose = require('mongoose');

let connected = false;

const connection = async () => {
    if (connected === true) {
        console.log('Ya estás conectado');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:admin@ecommercecluster.wuddf95.mongodb.net/?retryWrites=true&w=majority&appName=EcommerceCluster', {
            dbName: 'Ecommerce-curso',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        connected = true;
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log('Error al conectar a MongoDB:', error);
    }
};

// Correcto: exportando la función connection
module.exports = connection;