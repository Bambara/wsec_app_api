const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: { type: Number, required: true },
        image: { type: String, required: false },
        sale_price: { type: Number, required: true },
        line_discount: { type: Number, default: 0 },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    discount: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String },
    total_price: { type: Number },
    total_line_discount: { type: Number },
    paid_amount: { type: String, required: false },
    creadit_amount: { type: String, required: false },
    isDelivered: { type: Boolean, required: true, default: false },

    paidAt: { type: Date },
    deliveredAt: { type: Date },

    status: { type: String, required: false, default: 'active' },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
