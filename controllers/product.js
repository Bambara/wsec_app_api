const asyncHandler = require('express-async-handler');
let Product = require('../models/product');
const mongoose = require('mongoose');

//const cloudinary = require('../lib/cloudinary');

const cloudinary = require('../cloudinary');
const fs = require('fs');

// const uploadImage = asyncHandler(async (req, res) => {
//   cloudinary.uploader.upload(
//     req.file.path,
//     {
//       resource_type: 'image',
//       folder: 'image',
//     },
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send(err);
//       }
//       var upload = new Upload({
//         name: req.file.originalname,
//         url: result.url,
//         cloudinary_id: result.public_id,
//         description: req.body.description,
//       });
//       upload.save((err, result) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send(err);
//         }
//         return res.status(200).send(result);
//       });
//     }
//   );
// });

const products = asyncHandler(async (req, res) => {
  const products = await Product.find(
    { store_id: req.params.store },
    {  'images.createdAt': 0, 'images.updatedAt': 0 , 'images._id': 0 }
  ).select('-createdAt -updatedAt -__v -store_id ');

  res.json({ products: products });
});
const productsStock = asyncHandler(async (req, res) => {
  const paramsId = mongoose.Types.ObjectId(req.params.id);
  const products = await Product.aggregate([
    { $match : { store_id: paramsId, } },
    {
      $unwind: "$productPrices"
    },
    { $match : {  "productPrices.quantity": {$gte: 0}  } },

    { "$addFields": { 
      "productPrices._id": "$_id"      ,
      "productPrices.name": "$name",
      "productPrices.product_code": "$product_code",
      "productPrices.bar_code": "$bar_code",
      "productPrices.package_type": "$package_type",
      "productPrices.brand": "$brand",
      "productPrices.category": "$category",
      "productPrices.description": "$description",
      "productPrices.images": "$images",
      "productPrices.status": "$status",

   } },
    { $replaceRoot: { newRoot: { $mergeObjects: [ {  sale_price: "", quantity: "" }, "$productPrices" ] } } }
 
  ]);
  res.json({ stock: products });
});
const testAg = asyncHandler(async (req, res) => {
  const paramsId = mongoose.Types.ObjectId(req.params.id);
  const products = await Product.aggregate([
    { $match : { store_id: paramsId, } },
    {
      $unwind: "$productPrices"
    },
    { $match : {  "productPrices.quantity": {$gte: 0}  } },

    { "$addFields": { 
      "productPrices._id": "$_id"      ,
      "productPrices.product_code": "$product_code",
      "productPrices.bar_code": "$bar_code",
      "productPrices.package_type": "$package_type",
      "productPrices.brand": "$brand",
      "productPrices.store_id": "$store_id",
      "productPrices.category": "$category",
      "productPrices.description": "$description",
      "productPrices.images": "$images",
      "productPrices.status": "$status",

   } },
    { $replaceRoot: { newRoot: { $mergeObjects: [ {  sale_price: "", quantity: "" }, "$productPrices" ] } } }
 
  ]);
  res.json({ stock: products });
});
const test = asyncHandler(async (req, res) => {
  res.json({ route: '/products' });
});

const create = asyncHandler(async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    product_code: req.body.product_code,
    bar_code: req.body.bar_code,
    package_type: req.body.package_type,
    store_id: req.body.store_id,
    category: req.body.category,
    description: req.body.description,
    brand: req.body.brand,
    images: req.body.images,
    status: req.body.status,    
    productPrices: [
      {
          buy_price: 0,
          sale_price: 0,
          quantity: 0
      }
  ],
  });
  const product = await newProduct.save();



  res.send({ message: 'Product Created' });
});
// const createMany = asyncHandler(async (req, res) => {
//   Model.insertMany([ ... ], (err, docs) => {
//     ...
//   })
// });

const update = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.product_code = req.body.product_code;
    product.bar_code = req.body.bar_code;
    product.package_type = req.body.package_type;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.description = req.body.description;
    product.status = req.body.status;
    await product.save();
    res.send({ message: 'Product Updated' });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

const updateImage = asyncHandler(async (req, res) => {
  const productId = mongoose.Types.ObjectId(req.params.id);
  const imgId = mongoose.Types.ObjectId(req.body.imgId);
  const updateImg = await Product.updateOne(
    { _id: productId, 'images._id': imgId },
    {
      $set: {
        'images.$.name': req.body.name,
        'images.$.url': req.body.url,
      },
    }
  );

  res.status(404).send({ message: 'Image updated', img: updateImg });
});
const del = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.send({ message: 'Product Deleted' });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

const review = asyncHandler(async (req, res) => {
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

const search = asyncHandler(async (req, res) => {
  const { query } = req;
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const order = query.order || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...ratingFilter,
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...ratingFilter,
  });
  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

const productFindById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// const productFindBySlug = asyncHandler(async (req, res) => {
//   const product = await Product.findOne({ slug: req.params.slug });
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product Not Found' });
//   }
// });
const uploadImg = asyncHandler(async (req, res) => {
  const productId = mongoose.Types.ObjectId(req.params.id);
  const product = await Product.findById(productId);
  if (product) {
    const uploader = async (path) => await cloudinary.uploads(path, 'Images');
    if (req.method === 'POST') {
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
      await Product.updateOne(
        { _id: productId },
        { $addToSet: { images: { $each: urls } } }
      );
      res.status(201).send({
        message: 'images uploaded Successfully',
        data: urls,
      });
    } else {
      res.status(405).json({
        err: 'images not uploaded ',
      });
    }
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

module.exports = {
  test,
  testAg,
  products,
  productsStock,
  create,
  uploadImage,
  uploadImg,
  // productFindBySlug,
  productFindById,
  search,
  update,
  updateImage,
};
