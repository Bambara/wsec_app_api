const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    bar_code: { type: String, required: false },
    supplier: {
      type: String,
      required: true,
    },
    purchaseItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: { type: Number, required: true },
        image: { type: String, required: false },
        sale_price: { type: Number, required: true },
        buy_price: { type: Number, required: true },
      },
    ],
    purchaseAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    status: { type: String, required: false, default: 'active' },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;
