const router = require('express').Router();

const { salesController, salesProductsController } = require('../controllers');
const { salesMiddlewares, salesProductsMiddlewares } = require('../middlewares');

const insertSalesMiddlewares = [
  salesMiddlewares.validateSale,
  salesMiddlewares.checkIfProductExistsOnDB,
];

router.get('/:id', salesController.getSaleById);
router.get('/', salesController.getAllSales);

router.post('/', insertSalesMiddlewares, salesController.insertSales);

router.put(
  '/:saleId/products/:productId/quantity',
  salesProductsMiddlewares.validateQuantity,
  salesProductsController.updateSaleProductQuantity,
);

router.delete('/:id', salesController.deleteSales);

module.exports = router;