const conn = require('./connection');

const updateSaleProductQuantity = async ({ quantity, productId }) => {
  const query = 'UPDATE sales_products SET quantity = ? WHERE product_id = ?';
  const [{ affectedRows }] = await conn.execute(query, [quantity, productId]);

  return affectedRows;
};

module.exports = {
  updateSaleProductQuantity,
};
