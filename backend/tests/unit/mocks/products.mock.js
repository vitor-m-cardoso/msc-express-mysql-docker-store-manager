const allProductsFromDB = [
  { id: 1, name: 'Martelo de Thor' },
  { id: 2, name: 'Traje de encolhimento' },
  { id: 3, name: 'Escudo do Capitão América' },
];
const allProductsFromModel = [
  { id: 1, name: 'Martelo de Thor' },
  { id: 2, name: 'Traje de encolhimento' },
  { id: 3, name: 'Escudo do Capitão América' },
];
const responseFromService = {
  status: 'SUCCESSFUL',
  data: allProductsFromModel,
};
const allProductsFromResponse = [
  { id: 1, name: 'Martelo de Thor' },
  { id: 2, name: 'Traje de encolhimento' },
  { id: 3, name: 'Escudo do Capitão América' },
];

const productFromDB = { id: 42, name: 'Machado do Super Homem' };
const productFromModel = { id: 42, name: 'Machado do Super Homem' };
const productResponseFromService = {
  status: 'SUCCESSFUL',
  data: productFromModel,
};
const productFromResponse = { id: 42, name: 'Machado do Super Homem' };

const productError = {
  status: 'NOT_FOUND',
  data: { message: 'Product not found' },
};
const responseError = {
  message: 'Product not found',
};

const filteredProductsFromService = [
  { id: 1, name: 'Martelo de Thor' },
];

module.exports = {
  allProductsFromDB,
  allProductsFromModel,
  responseFromService,
  allProductsFromResponse,
  productFromDB,
  productFromModel,
  productResponseFromService,
  productFromResponse,
  productError,
  responseError,
  filteredProductsFromService,
};