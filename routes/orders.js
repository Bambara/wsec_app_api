const router = require('express').Router();

const ordersController = require('../controllers/orders');
const { isAuth, isBusiness } = require('../utils/authUtils');

router.get('/StoreOrders', isAuth, ordersController.StoreOrders);
router.get('/myOrders', isAuth, ordersController.myOrders);
router.post('/create', isAuth, ordersController.create);
router.put('/deliverOrder/:id', isAuth, ordersController.deliverOrder);
router.post('/updateStatus', isAuth, ordersController.create);

module.exports = router;
