const asyncHandler = require('express-async-handler');
let User = require('../models/user');
let Store = require('../models/store');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

const generateToken = require('../utils/generateToken');
const generateTokenVendor = require('../utils/generateTokenVendor');
uploadImage = (req, res) => {
  cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: 'image',
      folder: 'image',
    },

    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      var upload = new Upload({
        name: req.file.originalname,
        url: result.url,
        cloudinary_id: result.public_id,
        description: req.body.description,
      });
      upload.save((err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      });
    }
  );
};

const allUsers = asyncHandler(async (req, res) => {
  const bar = await User.find();
  res.json({ users: bar });
});

const testPopulate = asyncHandler(async (req, res) => {});

const getAllStoreByUser = asyncHandler(async (req, res) => {
  const uid = mongoose.Types.ObjectId(req.user._id);
  const st = await User.aggregate([
    { $match: { _id: uid } },
    {
      $project: {
        stores: {
          $slice: ['$stores', 1000],
        },
      },
    },
    {
      $project: {
        stores: {
          $map: {
            input: '$stores.store_id',
            as: 't',
            in: {
              $toObjectId: '$$t',
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'stores',
        let: {
          t: '$stores',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$t'],
              },
            },
          },
        ],
        as: 'stores',
      },
    },
  ]);

  //const user = await User.findById(req.user._id);
  res.json({ stores: st[0].stores });
});

const allUsersAuthStore = asyncHandler(async (req, res) => {
  const bar = await User.find({ isStore: req.user.isStore });
  res.json({ users: bar });
});

const addStore = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const store = {
    store_id: req.body.store_id,
  };
  if (user.stores.find((x) => x.store_id == req.body.store_id)) {
    return res.status(400).send({ message: 'You already submitted ' });
  }

  user.stores.push(store);
  const resStores = await user.save();
  res.json({ message: 'Store Added' });
});

const signin = asyncHandler(async (req, res) => {
  const user = await User.findOne(
    { email: req.body.email },
    { 'stores._id': 0, 'stores.createdAt': 0, 'stores.updatedAt': 0 }
  );
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      if (user.role === 'business') {
        res.send({
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          //stores: user.stores,
          token: generateTokenVendor(user),
        });
        return;
      } else {
        res.send({
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          token: generateToken(user),
        });
        return;
      }
    }
  }
  res.status(401).send({ err: 'Invalid email or password' });
});

const signup = asyncHandler(async (req, res) => {
  const newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    user_name: req.body.user_name,
    password: bcrypt.hashSync(req.body.password),
    address: {
      line_01: req.body.address.line_01,
      line_02: req.body.address.line_02,
      city: req.body.address.city,
      state: req.body.address.state,
      country: req.body.address.country,
      zip_code: req.body.address.zip_code,
    },
    mobile: req.body.mobile,
    role: req.body.role,
  });
  const user = await newUser.save();

  const userF = await User.findById(user._id);
  const store = {
    store_id: req.body.store_id,
  };

  userF.stores.push(store);
  const resStores = await userF.save();
  user.stores = resStores;
  res.send({
    message: 'Your account has been succesfully created!',
    user: user,
  });
});

const signupWithStore = asyncHandler(async (req, res) => {
  const usr = await User.findOne({ email: req.body.email });

  if (!usr) {
    const newStore = new Store({
      name: req.body.store.name,
      address: {
        line_01: req.body.store.address.line_01,
        line_02: req.body.store.address.line_02,
        city: req.body.store.address.city,
        state: req.body.store.address.state,
        country: req.body.store.address.country,
        zip_code: req.body.store.address.zip_code,
      },
      contact: {
        mobile_number: req.body.store.contact.mobile_number,
        work_number: req.body.store.contact.work_number,
        fax_number: req.body.store.contact.fax_number,
        email_address: req.body.store.contact.email_address,
        website: req.body.store.contact.website,
      },
      location: {
        latitude: req.body.store.location.latitude,
        longitude: req.body.store.location.longitude,
      },
      avatar: {
        id: req.body.store.avatar.id,
        name: req.body.store.avatar.name,
        url: req.body.store.avatar.url,
      },
      type: req.body.store.type,
    });
    const store = await newStore.save();

    const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      user_name: req.body.user_name,
      password: bcrypt.hashSync(req.body.password),
      address: {
        address: req.body.address,
        zip_code: req.body.zip_code,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      },
      mobile: req.body.mobile,
      role: 'business',
    });

    newUser.stores.push({ store_id: store._id });
    const user = await newUser.save();

    res.send({
      message: 'Your account has been succesfully created!',
      user: user,
    });
  } else {
    res.send({
      err: 'Email already exists ',
    });
  }
});

const update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  //if user exists
  if (user) {
    user.first_name = req.body.first_name || user.first_name;
    user.last_name = req.body.last_name || user.last_name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password);
    }

    const updateUser = await user.save();
    res.send({
      user: user,
    });
  } else {
    res.status(401).send({ message: 'User not Found!' });
  }
});
const updateStore = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  //if user exists
  if (user.role === 'business') {
    const updateUser = await user.save();
    res.send({
      user: updateUser,
    });
  } else {
    res.status(401).send({ message: ' not Found!' });
  }
});
const updateRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  //if user exists

  if (user) {
    if (req.body.role === 'business') {
      if (!req.body.Store_id) {
        res.send({
          err: 'Store_id is required ',
        });
      } else {
        user.role = req.body.role;
        user.isStore = req.body.Store_id;
        const updateUser = await user.save();
        res.send({
          user: updateUser,
        });
      }
    } else {
      user.role = req.body.role;
      user.isStore = undefined;

      const updateUser = await user.save();
      res.send({
        user: updateUser,
      });
    }
  } else {
    res.status(401).send({ message: 'User not Found!' });
  }
});

const userById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});
module.exports = {
  allUsers,
  signin,
  signup,
  update,
  userById,
  updateRole,
  signupWithStore,
  updateStore,
  getAllStoreByUser,
  allUsersAuthStore,
  addStore,
};
