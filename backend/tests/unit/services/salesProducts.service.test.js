const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;

const { salesProductsService } = require('../../../src/services');
const { salesModel, salesProductsModel } = require('../../../src/models');

chai.use(sinonChai);

describe('Testes da camada SERVICE - salesProducts:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Não deve ser possível alterar uma venda que não existe', async function () {
    sinon.stub(salesModel, 'getSaleById').resolves([]);

    const saleInput = { saleId: 99, productId: 10, quantity: 20 };
    const { status, data } = await salesProductsService.updateSaleProductQuantity(saleInput);

    expect(status).to.be.equal('NOT_FOUND');
    expect(data).to.be.deep.equal({ message: 'Sale not found' });
  });

  it('Não deve ser possível realizar alterações em uma venda com "productId" inexistente', async function () {
    const salesProductModelResponse = [{ date: '2024-02-29T02:45:42.000Z', productId: 12, quantity: 20 }];
    sinon.stub(salesModel, 'getSaleById').resolves(salesProductModelResponse);

    const saleInput = { saleId: 10, productId: 99, quantity: 20 };
    const { status, data } = await salesProductsService.updateSaleProductQuantity(saleInput);

    expect(status).to.be.equal('NOT_FOUND');
    expect(data).to.be.deep.equal({ message: 'Product not found in sale' });
  });

  it('Deve retornar o status correto junto com as informações da venda', async function () {
    const salesProductModelResponse = [{ date: '2024-02-29T02:45:42.000Z', productId: 12, quantity: 20 }];
    sinon.stub(salesModel, 'getSaleById').resolves(salesProductModelResponse);
    sinon.stub(salesProductsModel, 'updateSaleProductQuantity').resolves(1);

    const saleInput = { saleId: 10, productId: 12, quantity: 20 };
    const { status, data } = await salesProductsService.updateSaleProductQuantity(saleInput);

    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal({ date: '2024-02-29T02:45:42.000Z', productId: 12, quantity: 20 });
  });
});