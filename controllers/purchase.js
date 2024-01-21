const asyncHandler = require('express-async-handler');
let Purchase = require('../models/purchase');
let Product = require('../models/product');

const purchases = asyncHandler(async (req, res) => {
  const purchase = await Purchase.find({ store_id: req.params.id }).select(
    '-createdAt -updatedAt -__v '
  );
  res.json({ purchase: purchase });
});
const purchasesStore = asyncHandler(async (req, res) => {
  const purchase = await Purchase.find({ Store: req.user.isStore });
  res.json({ purchase: purchase });
});
const myPurchases = asyncHandler(async (req, res) => {
  const purchase = await Purchase.find({ Store: req.user._id });
  res.json({ purchase: purchase });
});

const create = asyncHandler(async (req, res) => {
  const reqArray = req.body.items;
  let nameArr = req.body.items.map(({ productId }) => {
    return productId;
  });
  let count = await Product.count({
    store_id: req.params.id,
    _id: { $in: nameArr },
  });
  let all = count === nameArr.length;
  if (all == false) {
    return res.status(400).send({
      invalIds: reqArray.length - count,
      message: 'Invalid product id ',
    });
  }

  const newPurchase = new Purchase({
    purchaseItems: req.body.items.map((x) => ({ ...x, product: x._id })),
    purchaseAddress: {
      fullName: req.body.fullName,
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
    },
    supplier: req.body.supplier,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
    store_id: req.params.id,
    purchaseItems: reqArray,
  });
  const order = await newPurchase.save();

  reqArray.forEach(async function (item) {
    const product = await Product.findById(item.productId);
    const nastedDoc = product.productPrices;
    let counter = 0;
    for (let i = 0; i < nastedDoc.length; i++) {
      if (nastedDoc[i].sale_price === item.sale_price) counter++;
    }
    const count = nastedDoc.filter((it) => it.sale_price === item.sale_price);
    if (count.length > 0) {
      await Product.updateOne(
        { _id: item.productId, 'productPrices.sale_price': item.sale_price },
        {
          $set: {
            'productPrices.$.quantity': count[0].quantity + item.quantity,
          },
        }
      );
    } else {
      const product = await Product.findById(item.productId);
      const items = {
        sale_price: item.sale_price,
        quantity: item.quantity,
      };
      product.productPrices.push(items);
      const pushProduct = await product.save();
    }
  });
  res.json({ res: 'Purchase created', purchase: order });
});

const createTest = asyncHandler(async (req, res) => {
  //res.status(201).send({ message: 'New Purchase Createds' });
  const newPurchase = new Purchase({
    purchaseItems: req.body.purchaseItems.map((x) => ({
      ...x,
      product: x._id,
    })),
    user: '633402fcc36f619bd1d567ab',
    // purchaseAddress: req.body.shippingAddress,
    // paymentMethod: req.body.paymentMethod,
    // itemsPrice: req.body.itemsPrice,
    // shippingPrice: req.body.shippingPrice,
    // taxPrice: req.body.taxPrice,
    // totalPrice: req.body.totalPrice,
  });

  const v = newPurchase.purchaseItems;
  v.map((x) => ({
    // const product = await Product.findById(x.productId)
    // if (product) {
    //   const img = {
    //     name: 'test',
    //     url: 'String',
    //     cloudinary_id: 'String',
    //     description: 'String',
    //   };
    //   product.images.push(img);
    //   const updatedProduct = await product.save();
    // if (v) {
    //   let img = {
    //     name: 'test',
    //     url: 'String',
    //     cloudinary_id: 'String',
    //     description: 'String',
    //   };
    //   v.push(img);
    //    await product.save();
  }));

  //const purchase = await newPurchase.save();
  res.status(201).send(v);

  // const newProduct = new Product({
  //   name: 'sample name ' + Date.now(),
  //   user: '633402fcc36f619bd1d567ab',
  //   slug: 'sample-name-' + Date.now(),
  //   image: '/images/p1.jpg',
  //   sale_price: 0,
  //   category: '63459aaa3535ec6ed69dfa69',
  //   brand: 'sample brand',
  //   countInStock: 0,
  //   rating: 0,
  //   numReviews: 0,
  //   description: 'sample description',
  // });
  // const product = await newProduct.save();
  // res.send({ message: 'Product Created', product });
});
module.exports = {
  purchases,
  myPurchases,
  purchasesStore,
  create,
};
