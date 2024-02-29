const { productsModel } = require('../models');

const findAll = async () => {
  const products = await productsModel.findAll();

  return { status: 'SUCCESSFUL', data: products };
};

const findById = async (productId) => {
  const product = await productsModel.findById(productId);

  if (!product) {
    return { status: 'NOT_FOUND', data: { message: 'Product not found' } };
  }
  return { status: 'SUCCESSFUL', data: product };
};

const insertProduct = async (productName) => {
  const insertId = await productsModel.insertProduct(productName);

  const newProduct = {
    id: insertId,
    name: productName,
  };

  return { status: 'CREATED', data: newProduct };
};

const updateProduct = async ({ id, name }) => {
  const product = await productsModel.findById(id);

  if (!product) {
    return { status: 'NOT_FOUND', data: { message: 'Product not found' } };
  }

  product.name = name;
  const affectedRows = await productsModel.updateProduct(product);
  if (affectedRows) {
    return { status: 'SUCCESSFUL', data: product };
  }
};

const deleteProduct = async (productId) => {
  const affectedRows = await productsModel.deleteProduct(productId);

  if (!affectedRows) {
    return { status: 'NOT_FOUND', data: { message: 'Product not found' } };
  }
  return { status: 'NO_CONTENT' };
};

const searchProduct = async (searchTerm) => {
  const allProducts = await productsModel.findAll();

  const filteredProducts = allProducts
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return { status: 'SUCCESSFUL', data: filteredProducts };
};

module.exports = {
  findAll,
  findById,
  insertProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};
