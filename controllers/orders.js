const asyncHandler = require('express-async-handler');
let Order = require('../models/order');
const Product = require('../models/product');

const create = asyncHandler(async (req, res) => {
  let nameArr = req.body.items.map(({ productId }) => {
    return productId;
  });
  let count = await Product.count({
    store_id: req.params.id,
    _id: { $in: nameArr },
  });
  let all = count === nameArr.length;
  if (all == false) {
    return res.status(400).send({ message: 'Invalid product id ' });
  }

  const reqArray = req.body.items;
  const newOrder = new Order({
    orderItems: req.body.items.map((x) => ({ ...x, product: x._id })),
    shippingAddress: {
      fullName: req.body.fullName,
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
    },
    user: req.body.user,
    total_price: req.body.items.reduce((accumulator, object) => {
      return accumulator + object.sale_price;
    }, 0),
    total_line_discount: req.body.items.reduce((accumulator, object) => {
      return accumulator + object.line_discount;
    }, 0),
    user: req.user._id,
    orderItems: reqArray,
  });

  const order = await newOrder.save();

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
            'productPrices.$.quantity': count[0].quantity - item.quantity,
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
  res.json({ res: 'updated products', order: order });
});

const createOrder = asyncHandler(async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
  });

  const order = await newOrder.save();
  res.status(201).send({ message: 'New Order Created', order });
});
const summary = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({ users, orders, dailyOrders, productCategories });
});

const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});
const StoreOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isStore: req.user._id });
  res.send(orders);
});

const orderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

const deliverOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();
    res.send({ message: 'Order Delivered' });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

const test = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'email name'
  );
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
   
    

    res.send({ message: 'Order Paid', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

module.exports = {
  create,
  createOrder,
  myOrders,
  orderById,
  StoreOrders,
  deliverOrder,
};
