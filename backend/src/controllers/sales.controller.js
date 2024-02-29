const { salesService } = require('../services');
const mapStatusHTTP = require('../utils/mapStatusHTTP');

const getAllSales = async (_req, res) => {
  const { status, data } = await salesService.getAllSales();

  return res.status(mapStatusHTTP(status)).json(data);
};

const getSaleById = async (req, res) => {
  const { id } = req.params;
  const { status, data } = await salesService.getSaleById(id);

  return res.status(mapStatusHTTP(status)).json(data);
};

const insertSales = async (req, res) => {
  const saleData = req.body;
  const { status, data } = await salesService.insertSales(saleData);

  return res.status(mapStatusHTTP(status)).json(data);
};

const deleteSales = async (req, res) => {
  const { id } = req.params;

  const { status, data } = await salesService.deleteSales(id);

  if (status !== 'NO_CONTENT') {
    return res.status(mapStatusHTTP(status)).json(data);
  }
  return res.status(mapStatusHTTP(status)).end();
};

module.exports = {
  getAllSales,
  getSaleById,
  insertSales,
  deleteSales,
};
