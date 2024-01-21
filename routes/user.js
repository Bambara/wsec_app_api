const router = require('express').Router();

const userController = require('../controllers/user');
const { isAuth, isAdmin, isBusiness } = require('../utils/authUtils');

router.get('/all', userController.allUsers);
router.get('/userStores', isAuth, isBusiness, userController.getAllStoreByUser);
router.post('/addStore', isAuth, isBusiness, userController.addStore);
router.get('/StoreUsers', isAuth, isBusiness, userController.allUsersAuthStore);
router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.post('/signupWithStore', userController.signupWithStore);
router.put('/update/:id', isAuth, userController.update);
router.put('/updateRole/:id', isAuth, isAdmin, userController.updateRole);
router.put('/updateStore/:id', isAuth, isAdmin, userController.updateStore);

module.exports = router;
