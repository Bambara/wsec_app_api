const router = require('express').Router();

const purchaseController = require('../controllers/purchase');
const { isAuth, isBusiness, isAdmin } = require('../utils/authUtils');

router.get('/all/:id', isAuth, isBusiness, purchaseController.purchases);
router.get('/myPurchases', isAuth, isBusiness, purchaseController.myPurchases);
router.get(
  '/purchasesStore',
  isAuth,
  isBusiness,
  purchaseController.purchasesStore
);
router.post('/create/:id', isAuth, isBusiness, purchaseController.create);

module.exports = router;
