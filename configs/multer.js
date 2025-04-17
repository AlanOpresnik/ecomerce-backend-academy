const multer = require('multer');
const storage = multer.memoryStorage(); // Para trabajar con Cloudinary desde buffer
const upload = multer({ storage });

module.exports = upload;