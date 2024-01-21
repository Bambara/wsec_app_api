const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema(
  {
    name: { type: String, required: true },
    address: {
      line_01: { type: String, required: false },
      line_02: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      country: { type: String, required: false },
      zip_code: { type: String, required: false },
    },
    contact: {
      mobile_number: { type: String, required: false },
      work_number: { type: String, required: false },
      fax_number: { type: String, required: false },
      email_address: { type: String, required: false },
      website: { type: String, required: false },
    },
    status: { type: String, required: false, default: 'active' },
    location: {
      latitude: { type: String, required: false },
      longitude: { type: String, required: false },
    },
    avatar: {
      cloud_id: { type: String, required: false,default:"avatar" },
      name: { type: String, required: false },
      url: { type: String, required: false },
    },
    type: { type: String, required: false },
  },
  {
    timestamps: false,
    versionKey: false
  }
);

const Store = mongoose.model('Store', StoreSchema);
module.exports = Store;
