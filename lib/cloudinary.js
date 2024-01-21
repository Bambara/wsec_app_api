const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'masterdevs',
  api_key: '779932374944839',
  api_secret: 'TsDKG-3kQxXlKSBBOHUYecdRYgQ',
});

module.exports = cloudinary;
