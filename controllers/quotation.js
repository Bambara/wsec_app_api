const asyncHandler = require('express-async-handler');
let Quotation = require('../models/quotation');
var mongoose = require('mongoose');

const allQuotation = asyncHandler(async (req, res) => {
  const qid = mongoose.Types.ObjectId(req.params.id);
  const quotation = await Quotation.find({ store_id: qid });
  res.json({ quotations: quotation });
});
const pendingQuotation = asyncHandler(async (req, res) => {
  const qid = mongoose.Types.ObjectId(req.params.id);
  const quotation = await Quotation.find({ store_id: qid, status: 'pending' });
  res.json({ quotations: quotation });
});
const finishedQuotation = asyncHandler(async (req, res) => {
  const qid = mongoose.Types.ObjectId(req.params.id);
  const quotation = await Quotation.find({ store_id: qid, status: 'finished' });
  res.json({ quotations: quotation });
});

const create = asyncHandler(async (req, res) => {
  const reqArray = req.body.items;

  const newQuotation = new Quotation({
    quotation_products: req.body.quotation_products.map((x) => ({
      ...x,
      product: x._id,
    })),

    total_buy_price: req.body.quotation_products.reduce(
      (accumulator, object) => {
        return accumulator + object.buy_price;
      },
      0
    ),
    total_sell_price: req.body.quotation_products.reduce(
      (accumulator, object) => {
        return accumulator + object.sell_price;
      },
      0
    ),
    total_line_discount: req.body.quotation_products.reduce(
      (accumulator, object) => {
        return accumulator + object.line_dis_value;
      },
      0
    ),
    store_id: req.body.store_id,

    number: req.body.number,
    item_count: req.body.item_count,
    requester_id: req.body.requester_id,
    responses_id: req.body.responses_id,
    dis_amount: req.body.dis_amount,
    dis_percentage: req.body.dis_percentage,
    dis_qty: req.body.dis_qty,

    quotationItems: reqArray,
  });

  const quotation = await newQuotation.save();

  res.json({ res: 'Quatation created', quotation: quotation });
});

const changeStatus = asyncHandler(async (req, res) => {
  const user = await Quotation.findById(req.params.id);
  //if user exists
  if (user) {
    if (user.status === 'finished') {
      return res.status(400).send({ message: 'You already submitted ' });
    } else {
      user.status = 'finished';

      const updateQuotation = await user.save();
      res.send({
        quotation: updateQuotation,
      });
    }
  } else {
    res.status(401).send({ message: 'Quotation not Found!' });
  }
});
module.exports = {
  create,
  changeStatus,
  allQuotation,
  pendingQuotation,
  finishedQuotation,
};
