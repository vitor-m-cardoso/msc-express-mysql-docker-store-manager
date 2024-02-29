const { productsService } = require('../services');
const mapStatusHTTP = require('../utils/mapStatusHTTP');

const findAll = async (_req, res) => {
  const { status, data } = await productsService.findAll();
  return res.status(mapStatusHTTP(status)).json(data);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const { status, data } = await productsService.findById(id);

  return res.status(mapStatusHTTP(status)).json(data);
};

const insertProduct = async (req, res) => {
  const { name } = req.body;
  const { status, data } = await productsService.insertProduct(name);

  return res.status(mapStatusHTTP(status)).json(data);
};

const updateProduct = async (req, res) => {
  const { 
    body: { name },
    params: { id },
  } = req;

  const { status, data } = await productsService.updateProduct({ id, name });

  return res.status(mapStatusHTTP(status)).json(data);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const { status, data } = await productsService.deleteProduct(id);

  if (status !== 'NO_CONTENT') {
    return res.status(mapStatusHTTP(status)).json(data);
  }
  return res.status(mapStatusHTTP(status)).end();
};

const searchProduct = async (req, res) => {
  const { q } = req.query;
  
  const { status, data } = await productsService.searchProduct(q);

  return res.status(mapStatusHTTP(status)).json(data);
};

module.exports = {
  findAll,
  findById,
  insertProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};
