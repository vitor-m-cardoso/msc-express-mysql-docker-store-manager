const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { salesProductsService } = require('../../../src/services');
const { salesProductsController } = require('../../../src/controllers');
const { salesProductsMiddlewares } = require('../../../src/middlewares');

const { expect } = chai;

chai.use(sinonChai);

describe('Testes da camada CONTROLLER - salesProducts:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve alterar a quantidade de um produto de uma venda com sucesso', async function () {
    const salesProductsServiceResponse = { status: 'SUCCESSFUL', data: { date: '2024-02-29T02:45:42.000Z', productId: 10, quantity: 20 } };
    const response = { date: '2024-02-29T02:45:42.000Z', productId: 10, quantity: 20, saleId: 10 };

    sinon.stub(salesProductsService, 'updateSaleProductQuantity').resolves(salesProductsServiceResponse);

    const req = {
      params: { saleId: 10, productId: 10 },
      body: { quantity: 20 },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await salesProductsController.updateSaleProductQuantity(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(response);
  });

  it('Não deve ser possível realizar alterações em uma venda sem o campo "quantity"', async function () {
    const req = { body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();

    salesProductsMiddlewares.validateQuantity(req, res, next);

    const saleProductsSpy = sinon.spy(salesProductsController, 'updateSaleProductQuantity');

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({ message: '"quantity" is required' });
    expect(saleProductsSpy).to.have.callCount(0);
  });

  it('Não deve ser possível realizar alterações em uma venda com o campo "quantity" menor ou igual a zero', async function () {
    const req = { body: { quantity: 0 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();

    salesProductsMiddlewares.validateQuantity(req, res, next);

    const saleProductsSpy = sinon.spy(salesProductsController, 'updateSaleProductQuantity');

    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith({ message: '"quantity" must be greater than or equal to 1' });
    expect(saleProductsSpy).to.have.callCount(0);
  });
});