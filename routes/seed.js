const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const data = require('../data');
//let User = require('../models/user');
const Category = require('../models/category');

router.route('/').get(
  asyncHandler(async (req, res) => {
    // await Product.remove({});
    // const createdProducts = await Product.insertMany(data.products);
    // await User.remove({});
    //   const createdUsers = await User.insertMany(data.users);
    // await Store.remove({});
    // const createdCompanies = await Store.insertMany(data.companies);
    const createdCat = await Category.insertMany(data.category);
    // await Store.remove({});
    // const createdCompanies = await Store.insertMany(data.companies);
    res.send({ createdCat });
  })
);

module.exports = router;
