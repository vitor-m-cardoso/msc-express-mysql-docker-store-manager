const router = require('express').Router();
const { productsController } = require('../controllers');
const { productsMiddlewares } = require('../middlewares');

const validationProductsParams = [
  productsMiddlewares.validateName,
  productsMiddlewares.validateNameLength,
];

router.get('/search', productsController.searchProduct);
router.get('/:id', productsController.findById);
router.get('/', productsController.findAll);

router.post('/', validationProductsParams, productsController.insertProduct);

router.put('/:id', validationProductsParams, productsController.updateProduct);

router.delete('/:id', productsController.deleteProduct);

module.exports = router;