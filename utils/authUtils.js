const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, "8798761", (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role == 'admin') {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
const isBusiness = (req, res, next) => {
  if (req.user && req.user.role == 'business') {
    // if (req.params.store || req.body.store_id) {
    //   let storeIds = req.user.stores.map(({ store_id }) => {
    //     return store_id;
    //   });
    //   let availableStoreByParams = storeIds.includes(req.params.store);
    //   let availableStoreByStoreId = storeIds.includes(req.body.store_id);

    //   if (req.params.store == undefined) {
    //     availableStoreByParams = true;
    //   }
    //   if (req.body.store_id == undefined) {
    //     availableStoreByStoreId = true;
    //   }

    //   const conditionsArray = [availableStoreByParams, availableStoreByStoreId];

    //   if (conditionsArray.includes(false)) {
    //     return res.status(403).send({
    //       message: 'Unauthorized user 1',
    //     });
    //   }
    // }

    next();
  } else {
    res.status(401).send({ message: 'Invalid Business Token' });
  }
};

module.exports = {
  isAuth,
  isAdmin,
  isBusiness,
};
