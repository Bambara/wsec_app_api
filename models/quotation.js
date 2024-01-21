const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuotationSchema = new Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    number: { type: String, required: false },
    item_count: { type: String, required: false },
    requester_id: { type: String, required: false },
    responses_id: { type: String, required: false },
    dis_amount: { type: String, required: false },
    dis_percentage: { type: String, required: false },
    dis_qty: { type: String, required: false },

    total_buy_price: { type: String, required: false },
    total_buy_price: { type: String, required: false },
    total_line_discount: { type: String, required: false },

    quotation_products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        buy_price: { type: Number, required: true },
        sell_price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        line_dis_value: { type: Number, required: true },
        line_dis_prece: { type: Number, required: true },
      },
    ],
    status: { type: String, required: false, default: 'pending' },
  },
  {
    timestamps: true,
  }
);

const Quotation = mongoose.model('Quotation', QuotationSchema);
module.exports = Quotation;
