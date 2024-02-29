const conn = require('./connection');

const getAllSales = async () => {
  const query = `SELECT
    SL.id AS saleId,
    SL.date,
    PRD.id AS productId,
    SPRD.quantity
  FROM sales AS SL
    INNER JOIN sales_products AS SPRD
      ON SL.id = SPRD.sale_id
    INNER JOIN products AS PRD
      ON PRD.id = SPRD.product_id
  ORDER BY SL.id, PRD.id`;

  const [sales] = await conn.execute(query);
  return sales;
};

const getSaleById = async (saleId) => {
  const query = `SELECT
    SL.date,
    PRD.id AS productId,
    SPRD.quantity
  FROM sales AS SL
    INNER JOIN sales_products AS SPRD
      ON SL.id = SPRD.sale_id
    INNER JOIN products AS PRD
      ON PRD.id = SPRD.product_id
  WHERE SL.id = ?
  ORDER BY SL.id, PRD.id`;

  const [sales] = await conn.execute(query, [saleId]);
  return sales;
};

const insertSalesProducts = async ({ productId, quantity, saleId }) => {
  const spQuery = 'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?,?,?)';
  await conn.execute(spQuery, [saleId, productId, quantity]);
  return { saleId, productId, quantity };
};

const insertSales = async (newDate) => {
  const [{ insertId }] = await conn.execute('INSERT INTO sales (date) VALUE (?)', [newDate]);
  return insertId;
};

const deleteSales = async (saleId) => {
  const query = 'DELETE FROM sales WHERE id = ?';
  const [{ affectedRows }] = await conn.execute(query, [saleId]);

  return affectedRows;
};

module.exports = {
  getAllSales,
  getSaleById,
  insertSalesProducts,
  insertSales,
  deleteSales,
};
