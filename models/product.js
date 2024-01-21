const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imagesArray = new mongoose.Schema(
  {
    cloud_id: { type: String, required: false },
    name: { type: String, required: false },
    url: { type: String, required: false },
  },
  {
    timestamps: false,
  }
);
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    product_code: { type: String, required: false },
    bar_code: { type: String, required: false },
    package_type: { type: String, required: false },
    brand: { type: String, required: false },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    category: { type: String, required: false },
    productPrices: [
      {
        buy_price: { type: Number, required: false },
        sale_price: { type: Number, required: false },
        quantity: { type: Number, required: false },
      },
    ],
    description: { type: String, required: false },
    images: [imagesArray],
    status: { type: String, required: false, default: 'active' },
  },
  {
    timestamps: false,
    versionKey: false
  }
);
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
