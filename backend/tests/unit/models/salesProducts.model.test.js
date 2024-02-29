const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const connection = require('../../../src/models/connection');

const { expect } = chai;

const { salesProductsModel } = require('../../../src/models');

chai.use(sinonChai);

describe('Testes da camada MODEL - salesProducts:', function () {
  beforeEach(function () { sinon.restore(); });

  it('Deve atualizar a quantidade de um produto em uma venda com sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([{ affectedRows: 1 }]);

    const updateSale = { quantity: 20, productId: 10 };
    const affectedRows = await salesProductsModel.updateSaleProductQuantity(updateSale);

    expect(affectedRows).to.be.a('number');
    expect(affectedRows).to.be.equal(1);
  });
});