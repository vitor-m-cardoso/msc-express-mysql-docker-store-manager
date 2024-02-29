const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const connection = require('../../../src/models/connection');

const { expect } = chai;

const {
  allSalesFromDB,
  allSalesFromModel,
  salesByIdFromDB,
  salesByIdFromModel,
  newSaleFromDB,
  newSaleFromModel,
} = require('../mocks/sales.mock');
const { salesModel } = require('../../../src/models');

chai.use(sinonChai);

describe('Testes da camada MODEL - sales:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve listar todas as vendas com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([allSalesFromDB]);

    const sales = await salesModel.getAllSales();

    expect(sales).to.be.an('array');
    expect(sales).to.be.deep.equal(allSalesFromModel);
  });

  it('Deve listar vendas específicas com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([salesByIdFromDB]);

    const saleId = 12;
    const salesById = await salesModel.getSaleById(saleId);

    expect(salesById).to.be.an('array');
    expect(salesById).to.be.deep.equal(salesByIdFromModel);
  });

  it('Não deve ser possível listar uma venda que não existe', async function () {
    sinon.stub(connection, 'execute').resolves([[]]);

    const saleId = 999;
    const saleNotFound = await salesModel.getSaleById(saleId);

    expect(saleNotFound).to.be.an('array');
    expect(saleNotFound).to.be.deep.equal([]);
  });

  it('Deve retornar o id correto para a venda cadastrada', async function () {
    sinon.stub(connection, 'execute').resolves([{ insertId: 22 }]);

    const newDate = '2024-02-28 14:27:36';
    const insertId = await salesModel.insertSales(newDate);

    expect(insertId).to.be.a('number');
    expect(insertId).to.be.equal(22);
  });

  it('Deve cadastrar uma venda com sucesso', async function () {
    sinon.stub(connection, 'execute')
      .onFirstCall()
      .resolves(newSaleFromDB[0])
      .onSecondCall()
      .resolves(newSaleFromDB[1]);

    const newSale = { saleId: 22, productId: 1, quantity: 1 };
    const firstSale = await salesModel.insertSalesProducts(newSale);
    const anotherSale = { saleId: 22, productId: 2, quantity: 5 };
    const secondSale = await salesModel.insertSalesProducts(anotherSale);

    expect(firstSale).to.be.an('object');
    expect(firstSale).to.be.deep.equal(newSaleFromModel[0]);
    expect(secondSale).to.be.an('object');
    expect(secondSale).to.be.deep.equal(newSaleFromModel[1]);
  });

  it('Deve deletar uma venda com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([{ affectedRows: 1 }]);

    const saleId = 12;
    const affectedRows = await salesModel.deleteSales(saleId);

    expect(affectedRows).to.be.a('number');
    expect(affectedRows).to.be.equal(1);
  });

  it('Não deve ser possível deletar uma venda que não existe', async function () {
    sinon.stub(connection, 'execute').resolves([{ affectedRows: 0 }]);

    const saleId = 99;
    const affectedRows = await salesModel.deleteSales(saleId);

    expect(affectedRows).to.be.a('number');
    expect(affectedRows).to.be.equal(0);
  });
});
