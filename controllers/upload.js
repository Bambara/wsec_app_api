const Upload = require('../models/upload');
const cloudinary = require('../lib/cloudinary');
const asyncHandler = require('express-async-handler');

uploadImage = (req, res) => {
  cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: 'image',
      folder: 'image',
    },

    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      var upload = new Upload({
        name: req.file.originalname,
        url: result.url,
        cloudinary_id: result.public_id,
        description: req.body.description,
      });
      upload.save((err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      });
    }
  );
};

const images = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    if (product.reviews.find((x) => x.name === req.user.name)) {
      return res
        .status(400)
        .send({ message: 'You already submitted a review' });
    }

    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      message: 'Review Created',
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      numReviews: product.numReviews,
      rating: product.rating,
    });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

module.exports = {
  images,
  uploadImage,
};
