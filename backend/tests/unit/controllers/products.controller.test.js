const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;

const {
  responseFromService,
  allProductsFromResponse,
  productResponseFromService,
  productFromResponse,
  productError,
  responseError,
  filteredProductsFromService,
  allProductsFromDB,
  allProductsFromModel,
} = require('../mocks/products.mock');
const { productsService } = require('../../../src/services');
const { productsController } = require('../../../src/controllers');
const { validateName, validateNameLength } = require('../../../src/middlewares/products.middleware');

chai.use(sinonChai);

describe('Testes da camada CONTROLLER - products:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve retornar todos os produtos com sucesso', async function () {
    sinon.stub(productsService, 'findAll').resolves(responseFromService);
    const req = { body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await productsController.findAll(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(allProductsFromResponse);
    expect(res.status).to.not.have.been.calledWith(404);
  });

  it('Deve retornar o produto com o id correto', async function () {
    sinon.stub(productsService, 'findById').resolves(productResponseFromService);
    const req = { params: { id: 11 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await productsController.findById(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.status).to.not.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith(productFromResponse);
  });

  it('Deve retornar uma mensagem de erro caso id não exista', async function () {
    sinon.stub(productsService, 'findById').resolves(productError);
    const req = { params: { id: 999 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await productsController.findById(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.status).to.not.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(responseError);
  });

  it('Deve retornar o produto cadastrado com sucesso junto com seu id', async function () {
    const createdProductFromService = { status: 'CREATED', data: { id: 12, name: 'ProdutoXX' } };
    sinon.stub(productsService, 'insertProduct').resolves(createdProductFromService);

    const req = { body: { name: 'ProdutoXX' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();

    validateName(req, res, next);
    validateNameLength(req, res, next);

    await productsController.insertProduct(req, res);

    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith({ id: 12, name: 'ProdutoXX' });
    expect(next).to.have.been.calledWith();
  });

  it('Não deve ser possível cadastrar um produto sem nome', async function () {
    const req = { body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    validateName(req, res, next);

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({ message: '"name" is required' });
  });

  it('Não deve ser possível cadastrar um produto com nome menor que 5 caracteres', async function () {
    const errorMessage = '"name" length must be at least 5 characters long';
    const req = { body: { name: 'Pro' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();

    validateNameLength(req, res, next);

    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith({ message: errorMessage });
  });

  it('Não deve ser possível alterar um produto sem o campo "name"', async function () {
    const req = { body: { } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    validateName(req, res, next);

    const productsSpy = sinon.spy(productsController, 'updateProduct');

    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({ message: '"name" is required' });
    expect(productsSpy).to.have.callCount(0);
  });

  it('Não deve ser possível alterar um produto com o campo "name" menor que 5 caracteres', async function () {
    const req = { body: { name: 'Spy' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    const next = sinon.stub().returns();
    
    validateNameLength(req, res, next);

    const productsSpy = sinon.spy(productsController, 'updateProduct');

    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith({ message: '"name" length must be at least 5 characters long' });
    expect(productsSpy).to.have.callCount(0);
  });

  it('Não deve ser possível alterar um produto que não existe', async function () {
    const serviceResponseNotFound = { status: 'NOT_FOUND', data: { message: 'Product not found' } };
    sinon.stub(productsService, 'updateProduct').resolves(serviceResponseNotFound);
    const req = {
      body: { name: 'Martelo martelão' },
      params: { id: 999 },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await productsController.updateProduct(req, res);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Product not found' });
  });

  it('Deve retornar a resposta correta ao deletar um produto com sucesso', async function () {
    sinon.stub(productsService, 'deleteProduct').resolves({ status: 'NO_CONTENT' });

    const req = { params: { id: 10 } };
    const res = { status: sinon.stub().returnsThis(), end: sinon.stub() };

    await productsController.deleteProduct(req, res);

    expect(res.status).to.have.been.calledWith(204);
    expect(res.end).to.have.been.calledWith();
  });

  it('Deve retornar a resposta correta ao tentar deletar um produto que não existe', async function () {
    const responseProductNotFound = { status: 'NOT_FOUND', data: { message: 'Product not found' } };
    sinon.stub(productsService, 'deleteProduct').resolves(responseProductNotFound);

    const req = { params: { id: 99 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await productsController.deleteProduct(req, res);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Product not found' });
  });

  it('Deve retornar a resposta correta ao buscar um produto pelo "name"', async function () {
    const responseSuccessful = { status: 'SUCCESSFUL', data: filteredProductsFromService };
    sinon.stub(productsService, 'searchProduct').resolves(responseSuccessful);

    const req = { query: { q: 'Mar' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await productsController.searchProduct(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith([{ id: 1, name: 'Martelo de Thor' }]);
  });

  it('Deve retornar todos os produtos quando passa a busca vazia', async function () {
    sinon.stub(productsService, 'searchProduct').resolves(responseFromService);

    const req = { query: { q: '' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await productsController.searchProduct(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(allProductsFromResponse);
  });

  it('Deve retornar um array vazio quando não há produtos correspondentes', async function () {
    const serviceResponse = { status: 'SUCCESSFUL', data: [] };
    sinon.stub(productsService, 'searchProduct').resolves(serviceResponse);

    const req = { query: { q: 'Produuuut' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await productsController.searchProduct(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith([]);
  });
});
