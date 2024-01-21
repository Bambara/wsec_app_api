const router = require('express').Router();

const StoreController = require('../controllers/store');
const { isAuth, isAdmin, isBusiness } = require('../utils/authUtils');

router.get('/all', isAuth, isAdmin, StoreController.allCompanies);
router.post('/create', isAuth, isBusiness, StoreController.addStore);
router.put('/update/:id', isAuth, isBusiness, StoreController.update);

module.exports = router;
