const asyncHandler = require('express-async-handler');
let Store = require('../models/store');
let User = require('../models/user');

const allCompanies = asyncHandler(async (req, res) => {
  const comp = await Store.find();
  res.json({ stores: comp });
});
const allStoreByUser = asyncHandler(async (req, res) => {
  const comp = await Store.find({});
  res.json({ stores: comp });
});

const addStore = asyncHandler(async (req, res) => {

  
  const newStore = new Store({
    name: req.body.name,
    address: {
      line_01: req.body.address.line_01,
      line_02: req.body.address.line_02,
      city: req.body.address.city,
      state: req.body.address.state,
      country: req.body.address.country,
      zip_code: req.body.address.zip_code,
    },
    contact: {
      mobile_number: req.body.contact.mobile_number,
      work_number: req.body.contact.work_number,
      fax_number: req.body.contact.fax_number,
      email_address: req.body.contact.email_address,
      website: req.body.contact.website,
    },
    location: {
      latitude: req.body.location.latitude,
      longitude: req.body.location.longitude,
    },
    avatar: {

      cloud_id: req.body.avatar.cloud_id,
      name: req.body.avatar.name,
      url: req.body.avatar.url,
    },
    type: req.body.type,
  });
  const store = await newStore.save();

  


    const user = await User.findById(req.user._id);
    const items = {
      store_id: store._id,
    };
    user.stores.push(items);
    const pushuser = await user.save();

  res.send({
    store_id: store._id,
  });
});

const update = asyncHandler(async (req, res) => {
  const storeId = req.params.id;
  const store = await Store.findById(storeId);
  if (store) {
    store.name = req.body.name;

    store.address.line_01 = req.body.address.line_01;
    store.address.line_02 = req.body.address.line_02;
    store.address.city = req.body.address.city;
    store.address.state = req.body.address.state;
    store.address.country = req.body.address.country;
    store.address.zip_code = req.body.address.zip_code;

    store.contact.mobile_number = req.body.contact.mobile_number;
    store.contact.work_number = req.body.contact.work_number;
    store.contact.fax_number = req.body.contact.fax_number;
    store.contact.email_address = req.body.contact.email_address;
    store.contact.website = req.body.contact.website;

    store.location.latitude = req.body.location.latitude;
    store.location.longitude = req.body.location.longitude;

    store.avatar.could_id = req.body.avatar.could_id;
    store.avatar.name = req.body.avatar.name;
    store.avatar.url = req.body.avatar.url;

    store.type = req.body.type;

    await store.save();
    res.send({ message: 'Store Updated' });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
module.exports = {
  allCompanies,
  addStore,
  update,
};
