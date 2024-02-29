const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { productsModel } = require('../../../src/models');

const {
  allProductsFromDB,
  allProductsFromModel,
  productFromDB,
  productFromModel,
  responseError,
  filteredProductsFromService,
} = require('../mocks/products.mock');
const { productsService } = require('../../../src/services');

const { expect } = chai;

chai.use(sinonChai);

describe('Testes da camada SERVICE - products:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve retornar o status correto e o array de produtos cadastrados', async function () {
    sinon.stub(productsModel, 'findAll').resolves(allProductsFromDB);

    const { status, data } = await productsService.findAll();

    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal(allProductsFromModel);
  });

  it('Deve retornar o status correto e o produto com o id pesquisado', async function () {
    sinon.stub(productsModel, 'findById').resolves(productFromDB);

    const productId = 42;
    const { status, data } = await productsService.findById(productId);
    
    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal(productFromModel);
  });

  it('Deve retornar uma mensagem de erro caso id não exista', async function () {
    sinon.stub(productsModel, 'findById').resolves();

    const productId = 999;
    const { status, data } = await productsService.findById(productId);
    
    expect(status).to.be.equal('NOT_FOUND');
    expect(data).to.be.deep.equal(responseError);
  });

  it('Deve retornar o status e o objeto do novo produto cadastrado', async function () {
    sinon.stub(productsModel, 'insertProduct').resolves(12);

    const newProduct = 'NewProductXX';
    const { status, data } = await productsService.insertProduct(newProduct);

    expect(status).to.be.equal('CREATED');
    expect(data).to.be.deep.equal({ id: 12, name: 'NewProductXX' });
  });

  it('Deve retornar o status e as informações corretas do produto atualizado', async function () {
    sinon.stub(productsModel, 'updateProduct').resolves(1);
    sinon.stub(productsModel, 'findById').resolves({ id: 10, name: 'Martelo do Super' });

    const newProductName = { id: 10, name: 'Martelo do Chapolim' };
    const { status, data } = await productsService.updateProduct(newProductName);

    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal({ id: 10, name: 'Martelo do Chapolim' });
  });

  it('Deve retornar o status e uma mensagem de erro para um produto que não existe', async function () {
    sinon.stub(productsModel, 'findById').resolves();

    const newProductName = { id: 999, name: 'Martelo Martelão' };
    const { status, data } = await productsService.updateProduct(newProductName);

    expect(status).to.be.equal('NOT_FOUND');
    expect(data).to.be.deep.equal({ message: 'Product not found' });
  });

  it('Deve retornar o status correto ao deletar um produto com sucesso', async function () {
    sinon.stub(productsModel, 'deleteProduct').resolves(1);

    const productId = 10;
    const { status } = await productsService.deleteProduct(productId);

    expect(status).to.be.equal('NO_CONTENT');
  });

  it('Deve retornar o status correto e uma mensagem de erro ao tentar deletar um produto que não existe', async function () {
    sinon.stub(productsModel, 'deleteProduct').resolves(0);

    const productId = 99;
    const { status, data } = await productsService.deleteProduct(productId);

    expect(status).to.be.equal('NOT_FOUND');
    expect(data).to.be.deep.equal({ message: 'Product not found' });
  });

  it('Deve buscar um produto pelo nome com sucesso', async function () {
    sinon.stub(productsModel, 'findAll').resolves(allProductsFromDB);

    const searchTerm = 'Mar';
    const { status, data } = await productsService.searchProduct(searchTerm);

    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal(filteredProductsFromService);
  });

  it('Deve buscar todos os produtos quando o parâmetro de busca está vazio', async function () {
    sinon.stub(productsModel, 'findAll').resolves(allProductsFromDB);

    const searchTerm = '';
    const { status, data } = await productsService.searchProduct(searchTerm);

    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal(allProductsFromModel);
  });

  it('Deve retornar um array vazio quando não há produtos correspondentes', async function () {
    sinon.stub(productsModel, 'findAll').resolves(allProductsFromDB);

    const searchTerm = 'ProdutoqNexiste';
    const { status, data } = await productsService.searchProduct(searchTerm);

    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.an('array');
    expect(data).to.be.deep.equal([]);
  });
});