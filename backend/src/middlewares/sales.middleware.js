const { productsModel } = require('../models');

const validateSaleParams = ({ productId, quantity }) => {
  if (!productId) {
    return { status: 400, data: { message: '"productId" is required' } };
  }
  if (!quantity && quantity !== 0) {
    return { status: 400, data: { message: '"quantity" is required' } };
  }
  if (quantity < 1) {
    return { status: 422, data: { message: '"quantity" must be greater than or equal to 1' } };
  }
};
const validateSale = (req, res, next) => {
  const saleRequest = req.body;
  let errorResponse;
  let errorArr = [];

  if (Array.isArray(saleRequest)) {
    errorArr = saleRequest.map((sale) => validateSaleParams(sale));
  }
  if (errorArr.length > 0) {
    [errorResponse] = errorArr.filter((error) => error);
  }

  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.data);
  }

  next();
};

const checkArrayOnDb = async (saleArr) => {
  const promises = saleArr
    .map(async ({ productId }) => {
      const productExists = await productsModel.findById(productId);

      if (!productExists) {
        return { status: 404, data: { message: 'Product not found' } };
      }
    });
  
  const errorArr = await Promise.all(promises);

  if (errorArr.length) {
    return errorArr.filter((error) => error)[0];
  }
};
const checkObjOnDb = async (productId) => {
  const productExists = await productsModel.findById(productId);
  if (!productExists) {
    return { status: 404, data: { message: 'Product not found' } };
  }
};
const checkIfProductExistsOnDB = async (req, res, next) => {
  const saleRequest = req.body;
  let errorResponse;

  if (Array.isArray(saleRequest)) {
    errorResponse = await checkArrayOnDb(saleRequest);
  }
  if (!Array.isArray(saleRequest)) {
    const { productId } = saleRequest;
    errorResponse = await checkObjOnDb(productId);
  }

  if (errorResponse) {
    return res.status(errorResponse.status).json(errorResponse.data);
  }

  next();
};

module.exports = {
  validateSale,
  checkIfProductExistsOnDB,
};
