const cloudinary = require('cloudinary');

const dotenv = require('dotenv');
const Product = require('./models/product');
dotenv.config();
cloudinary.config({
  cloud_name: "masterdevs",
  api_key: "779932374944839",
  api_secret: "TsDKG-3kQxXlKSBBOHUYecdRYgQ",
});
exports.uploads = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          cloudinary_id: result.public_id,
          url: result.url,
        });
      },
      {
        resource_type: 'auto',
        folder: folder,
      }
    );
  });
};
