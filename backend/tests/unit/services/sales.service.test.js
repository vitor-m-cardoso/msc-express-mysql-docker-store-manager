const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { salesModel } = require('../../../src/models');
const { allSalesFromModel, allSalesFromDB, salesByIdFromDB, salesByIdFromModel, newSaleFromDB, newSaleFromModel, newSaleSuccessful } = require('../mocks/sales.mock');
const { salesService } = require('../../../src/services');

const { expect } = chai;

chai.use(sinonChai);

describe('Testes da camada SERVICE - sales:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve retornar o status correto e o array de vendas cadastradas', async function () {
    sinon.stub(salesModel, 'getAllSales').resolves(allSalesFromDB);

    const { status, data } = await salesService.getAllSales();

    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal(allSalesFromModel);
  });

  it('Deve retornar o status correto e a venda com o id pesquisado', async function () {
    sinon.stub(salesModel, 'getSaleById').resolves(salesByIdFromDB);

    const saleId = 11;
    const { status, data } = await salesService.getSaleById(saleId);
    
    expect(status).to.be.equal('SUCCESSFUL');
    expect(data).to.be.deep.equal(salesByIdFromModel);
  });

  it('Deve retornar uma mensagem de erro caso id não exista', async function () {
    sinon.stub(salesModel, 'getSaleById').resolves([]);

    const saleId = 999;
    const { status, data } = await salesService.getSaleById(saleId);

    expect(status).to.be.equal('NOT_FOUND');
    expect(data).to.be.deep.equal({ message: 'Sale not found' });
  });

  it('Deve retornar o status correto e a nova venda cadastrada', async function () {
    sinon.stub(salesModel, 'insertSales').resolves(22);
    sinon.stub(salesModel, 'insertSalesProducts').resolves(newSaleFromDB[0]);

    const newSale = [{ productId: 1, quantity: 1 }];
    const { status, data } = await salesService.insertSales(newSale);

    expect(status).to.be.equal('CREATED');
    expect(data).to.be.deep.equal(newSaleSuccessful);
  });

  it('Deve retornar o status correto ao deletar uma venda com sucesso', async function () {
    sinon.stub(salesModel, 'deleteSales').resolves(1);

    const saleId = 10;
    const { status } = await salesService.deleteSales(saleId);

    expect(status).to.be.equal('NO_CONTENT');
  });

  it('Deve retornar o status correto e uma mensagem de erro ao tentar deletar um produto que não existe', async function () {
    sinon.stub(salesModel, 'deleteSales').resolves(0);

    const saleId = 99;
    const { status, data } = await salesService.deleteSales(saleId);

    expect(status).to.be.equal('NOT_FOUND');
    expect(data).to.be.deep.equal({ message: 'Sale not found' });
  });
});