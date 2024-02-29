const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const connection = require('../../../src/models/connection');
const { allProductsFromDB, allProductsFromModel, productFromDB, productFromModel } = require('../mocks/products.mock');
const { productsModel } = require('../../../src/models');

const { expect } = chai;

chai.use(sinonChai);

describe('Testes da camada MODEL - products:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve retornar todos os produtos do database com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([allProductsFromDB]);

    const products = await productsModel.findAll();

    expect(products).to.be.an('array');
    expect(products).to.be.deep.equal(allProductsFromModel);
  });

  it('Deve retornar o produto correto com o id pesquisado', async function () {
    sinon.stub(connection, 'execute').resolves([[productFromDB]]);

    const productId = 42;
    const product = await productsModel.findById(productId);

    expect(product).to.be.an('object');
    expect(product).to.be.deep.equal(productFromModel);
  });

  it('Deve cadastrar um produto com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([{ insertId: 12 }]);
    
    const inputData = { name: 'Novo produto' };
    const insertId = await productsModel.insertProduct(inputData);

    expect(insertId).to.be.a('number');
    expect(insertId).to.be.equal(12);
  });

  it('Deve atualizar um produto com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([{ affectedRows: 1 }]);

    const newProduct = { id: 10, name: 'Martelo do Chapolim' };
    const affectedRows = await productsModel.updateProduct(newProduct);

    expect(affectedRows).to.be.a('number');
    expect(affectedRows).to.be.equal(1);
  });

  it('Deve deletar um produto com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([{ affectedRows: 1 }]);

    const productId = 12;
    const affectedRows = await productsModel.deleteProduct(productId);

    expect(affectedRows).to.be.a('number');
    expect(affectedRows).to.be.equal(1);
  });

  it('Não deve ser possível deletar um produto que não existe', async function () {
    sinon.stub(connection, 'execute').resolves([{ affectedRows: 0 }]);

    const productId = 99;
    const affectedRows = await productsModel.deleteProduct(productId);

    expect(affectedRows).to.be.a('number');
    expect(affectedRows).to.be.equal(0);
  });
});