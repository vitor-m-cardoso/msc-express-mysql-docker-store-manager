const { salesModel, salesProductsModel } = require('../models');

const updateSaleProductQuantity = async ({ saleId, productId, quantity }) => {
  const sales = await salesModel.getSaleById(saleId);

  if (!sales.length) {
    return { status: 'NOT_FOUND', data: { message: 'Sale not found' } };
  }
  const saleProduct = await sales.find((sale) => sale.productId === Number(productId));

  if (!saleProduct) {
    return { status: 'NOT_FOUND', data: { message: 'Product not found in sale' } };
  }
  saleProduct.quantity = quantity;

  const affectedRows = await salesProductsModel.updateSaleProductQuantity(saleProduct);

  if (affectedRows) {
    return { status: 'SUCCESSFUL', data: saleProduct };
  }
};

module.exports = {
  updateSaleProductQuantity,
};
