const router = require('express').Router();

const quotationController = require('../controllers/quotation');
const { isAuth, isBusiness } = require('../utils/authUtils');

router.post('/create', isAuth, isBusiness, quotationController.create);
router.get('/all/:id', isAuth, isBusiness, quotationController.allQuotation);
router.get(
  '/pending/:id',
  isAuth,
  isBusiness,
  quotationController.pendingQuotation
);
router.get(
  '/finished/:id',
  isAuth,
  isBusiness,
  quotationController.finishedQuotation
);
router.put('/finish/:id', isAuth, isBusiness, quotationController.changeStatus);

module.exports = router;
