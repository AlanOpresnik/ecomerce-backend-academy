const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'db3krhfka',
    api_key: '165464214522676',
    api_secret: 'LEk0wr8sptiCMEAJfBQQob0yuec'
});

module.exports = cloudinary;