const dateStr = '2024-02-28T01:16:12.000Z';

const allSalesFromDB = [
  {
    saleId: 1,
    date: dateStr,
    productId: 1,
    quantity: 5,
  },
  {
    saleId: 1,
    date: dateStr,
    productId: 2,
    quantity: 10,
  },
  {
    saleId: 2,
    date: dateStr,
    productId: 3,
    quantity: 15,
  },
];
const allSalesFromModel = [
  {
    saleId: 1,
    date: dateStr,
    productId: 1,
    quantity: 5,
  },
  {
    saleId: 1,
    date: dateStr,
    productId: 2,
    quantity: 10,
  },
  {
    saleId: 2,
    date: dateStr,
    productId: 3,
    quantity: 15,
  },
];
const allSalesFromResponse = [
  {
    saleId: 1,
    date: dateStr,
    productId: 1,
    quantity: 5,
  },
  {
    saleId: 1,
    date: dateStr,
    productId: 2,
    quantity: 10,
  },
  {
    saleId: 2,
    date: dateStr,
    productId: 3,
    quantity: 15,
  },
];

const salesServiceResponse = {
  status: 'SUCCESSFUL',
  data: allSalesFromModel,
};

const salesByIdFromDB = [
  {
    date: '2024-01-27T04:54:29.000Z',
    productId: 12,
    quantity: 87,
  },
  {
    date: '2024-02-27T04:54:29.000Z',
    productId: 12,
    quantity: 254,
  },
];
const salesByIdFromModel = [
  {
    date: '2024-01-27T04:54:29.000Z',
    productId: 12,
    quantity: 87,
  },
  {
    date: '2024-02-27T04:54:29.000Z',
    productId: 12,
    quantity: 254,
  },
];
const salesByIdFromService = [
  {
    date: '2024-01-27T04:54:29.000Z',
    productId: 12,
    quantity: 87,
  },
  {
    date: '2024-02-27T04:54:29.000Z',
    productId: 12,
    quantity: 254,
  },
];
const salesResponseFromService = {
  status: 'SUCCESSFUL',
  data: salesByIdFromModel,
};

const newSaleFromDB = [
  { saleId: 22, productId: 1, quantity: 1 },
  { saleId: 22, productId: 2, quantity: 5 },
];
const newSaleFromModel = [
  { saleId: 22, productId: 1, quantity: 1 },
  { saleId: 22, productId: 2, quantity: 5 },
];

const newSaleSuccessfulFromService = {
  id: 22,
  itemsSold: [{ productId: 1, quantity: 1 }],
};
const newSaleSuccessful = {
  id: 22,
  itemsSold: [{ productId: 1, quantity: 1 }],
};

const saleError = {
  status: 'NOT_FOUND',
  data: { message: 'Product not found' },
};
const responseError = {
  message: 'Product not found',
};

module.exports = {
  allSalesFromDB,
  allSalesFromModel,
  salesByIdFromDB,
  salesByIdFromModel,
  salesServiceResponse,
  allSalesFromResponse,
  salesResponseFromService,
  salesByIdFromService,
  saleError,
  responseError,
  newSaleFromDB,
  newSaleFromModel,
  newSaleSuccessful,
  newSaleSuccessfulFromService,
};
