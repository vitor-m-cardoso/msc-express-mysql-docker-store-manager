const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { salesService } = require('../../../src/services');

const { expect } = chai;

const {
  salesServiceResponse,
  allSalesFromResponse,
  salesByIdFromService,
  salesResponseFromService,
  saleError,
  responseError,
  newSaleSuccessful,
  newSaleSuccessfulFromService,
} = require('../mocks/sales.mock');
const { salesController } = require('../../../src/controllers');
const { validateSale, checkIfProductExistsOnDB } = require('../../../src/middlewares/sales.middleware');
const { productsModel } = require('../../../src/models');

chai.use(sinonChai);

describe('Testes da camada CONTROLLER - sales:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve retornar todas as vendas com sucesso', async function () {
    sinon.stub(salesService, 'getAllSales').resolves(salesServiceResponse);
    const req = { body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await salesController.getAllSales(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(allSalesFromResponse);
  });

  it('Deve retornar as vendas com o id correto', async function () {
    sinon.stub(salesService, 'getSaleById').resolves(salesResponseFromService);
    const req = { params: { id: 11 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await salesController.getSaleById(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(salesByIdFromService);
  });

  it('Deve retornar uma mensagem de erro caso id não exista', async function () {
    sinon.stub(salesService, 'getSaleById').resolves(saleError);
    const req = { params: { id: 999 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await salesController.getSaleById(req, res);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith(responseError);
  });

  it('Deve retornar o status e objeto correto para venda cadastrada', async function () {
    sinon.stub(salesService, 'insertSales')
      .resolves({ status: 'CREATED', data: newSaleSuccessfulFromService });

    const req = { body: [
      { productId: 1, quantity: 1 },
    ] };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await salesController.insertSales(req, res);

    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith(newSaleSuccessful);
  });

  it('Não deve ser possível cadastrar uma venda sem o campo "productId"', async function () {
    const req = { body: [{ quantity: 1 }] };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    validateSale(req, res, next);

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({ message: '"productId" is required' });
  });

  it('Não deve ser possível cadastrar uma venda sem o campo "quantity"', async function () {
    const req = { body: [{ productId: 1 }] };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    validateSale(req, res, next);

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({ message: '"quantity" is required' });
  });

  it('Não deve ser possível cadastrar uma venda com o campo "quantity" menor ou igual a 0', async function () {
    const req = { body: [{ quantity: 0, productId: 1 }] };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    validateSale(req, res, next);

    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith({ message: '"quantity" must be greater than or equal to 1' });
  });

  it('Não deve ser possível cadastrar várias vendas com o campo "productId" inexistente', async function () {
    sinon.stub(productsModel, 'findById').resolves();
    const req = { body: [{ quantity: 1, productId: 13 }, { quantity: 1, productId: 1 }] };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    await checkIfProductExistsOnDB(req, res, next);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Product not found' });
  });

  it('Não deve ser possível cadastrar uma venda com o campo "productId" inexistente', async function () {
    sinon.stub(productsModel, 'findById').resolves();
    const req = { body: { quantity: 1, productId: 13 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    await checkIfProductExistsOnDB(req, res, next);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Product not found' });
  });

  it('Deve retornar a resposta correta ao deletar uma venda com sucesso', async function () {
    sinon.stub(salesService, 'deleteSales').resolves({ status: 'NO_CONTENT' });

    const req = { params: { id: 10 } };
    const res = { status: sinon.stub().returnsThis(), end: sinon.stub() };

    await salesController.deleteSales(req, res);

    expect(res.status).to.have.been.calledWith(204);
    expect(res.end).to.have.been.calledWith();
  });

  it('Deve retornar a resposta correta ao tentar deletar um produto que não existe', async function () {
    const responseSaleNotFound = { status: 'NOT_FOUND', data: { message: 'Sale not found' } };
    sinon.stub(salesService, 'deleteSales').resolves(responseSaleNotFound);

    const req = { params: { id: 99 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await salesController.deleteSales(req, res);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Sale not found' });
  });
});
