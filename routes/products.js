const router = require('express').Router();

const productController = require('../controllers/product');
const { isAuth, isBusiness, isAdmin } = require('../utils/authUtils');

const upload = require('../multer');
const storage = require('../lib/multer');
router.get('/all/:store', isAuth, isBusiness, productController.products);
router.put('/update/:id', isAuth, isBusiness, productController.update);
router.put(
  '/updateImage/:id',
  isAuth,
  isBusiness,
  productController.updateImage
);
router.get('/productStock/:id', productController.productsStock);
router.get('/search', productController.search);
router.post('/create', productController.create);

router.post(
  '/uploadimg/:id',
  upload.array('image'),
  productController.uploadImg
);
router.post(
  '/uploadimg',
  upload.single('image'),
  productController.uploadImage
);

module.exports = router;
