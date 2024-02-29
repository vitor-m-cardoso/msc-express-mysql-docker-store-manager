const { salesProductsService } = require('../services');
const mapStatusHTTP = require('../utils/mapStatusHTTP');

const updateSaleProductQuantity = async (req, res) => {
  const { saleId, productId } = req.params;
  const { quantity } = req.body;

  const { status, data } = await salesProductsService
    .updateSaleProductQuantity({ saleId, productId, quantity });

  if (status !== 'SUCCESSFUL') {
    return res.status(mapStatusHTTP(status)).json(data);
  }
  return res.status(mapStatusHTTP(status)).json({ ...data, saleId: Number(saleId) });
};

module.exports = {
  updateSaleProductQuantity,
};
