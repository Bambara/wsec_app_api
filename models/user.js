const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const stores = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: false,
    },
  },
  {
    timestamps: false,
  }
);
const UserSchema = new Schema(
  {
    name: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    user_name: { type: String, required: true, unique: true },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false,
      },
    },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    address: {
      line_01: { type: String, required: false },
      line_02: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      country: { type: String, required: false },
      zip_code: { type: String, required: false },
    },
    avatar: {
      cloud_id: { type: String, required: false, default: 'avatar' },
      name: { type: String, required: false, default: 'avatar' },
      url: {
        type: String,
        required: false,
        default:
          'https://res.cloudinary.com/masterdevs/image/upload/v1657466213/avatars/60111_ysg3ky.jpg',
      }
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'business'],
      required: true,
    },
    stores: [stores],
    status: { type: String, required: false, default: 'active' },
  },
  {
    timestamps: false,
    versionKey: false
  }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
