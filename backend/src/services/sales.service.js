const { salesModel } = require('../models');
const getFormattedDate = require('../utils/getFormattedDate');

const getAllSales = async () => {
  const sales = await salesModel.getAllSales();

  return { status: 'SUCCESSFUL', data: sales };
};

const getSaleById = async (saleId) => {
  const saleById = await salesModel.getSaleById(saleId);

  if (!saleById.length) {
    return { status: 'NOT_FOUND', data: { message: 'Sale not found' } };
  }
  return { status: 'SUCCESSFUL', data: saleById };
};

const insertSales = async (salesData) => {
  const newDate = getFormattedDate();
  const saleId = await salesModel.insertSales(newDate);
  const promises = salesData.map(async (sale) => {
    const { productId, quantity } = await salesModel.insertSalesProducts({ ...sale, saleId });
    return { productId, quantity };
  });
  
  const saleArr = await Promise.all(promises);

  const newSale = {
    id: saleId,
    itemsSold: saleArr,
  };

  return { status: 'CREATED', data: newSale };
};

const deleteSales = async (saleId) => {
  const affectedRows = await salesModel.deleteSales(saleId);

  if (!affectedRows) {
    return { status: 'NOT_FOUND', data: { message: 'Sale not found' } };
  }
  return { status: 'NO_CONTENT' };
};

module.exports = {
  getAllSales,
  getSaleById,
  insertSales,
  deleteSales,
};
