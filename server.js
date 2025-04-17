const express = require('express')
const productsRouter = require('./routes/product-routes');
const connection = require('./database/conecction')
const app = express()



connection()

app.get('/', (req, res) => {
    res.send('Pantalla de la api')
})

app.use(express.json());

app.use('/api/products', productsRouter)

const port = 8080

app.listen(port, () => {
    console.log('la aplicacion esta escuchando en el puerto' + port)
})

