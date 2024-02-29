const conn = require('./connection');

const findAll = async () => {
  const [products] = await conn.execute('SELECT * FROM products');

  return products;
};

const findById = async (productId) => {
  const query = 'SELECT * FROM products WHERE id = ?';
  const [[product]] = await conn.execute(query, [productId]);

  return product;
};

const insertProduct = async (productName) => {
  const query = 'INSERT INTO products (name) VALUE (?)';
  const [{ insertId }] = await conn.execute(query, [productName]);

  return insertId;
};

const updateProduct = async ({ id, name }) => {
  const query = 'UPDATE products SET name = ? WHERE id = ?';
  const [{ affectedRows }] = await conn.execute(query, [name, id]);
  return affectedRows;
};

const deleteProduct = async (productId) => {
  const query = 'DELETE FROM products WHERE id = ?';
  const [{ affectedRows }] = await conn.execute(query, [productId]);
  return affectedRows;
};

module.exports = {
  findAll,
  findById,
  insertProduct,
  updateProduct,
  deleteProduct,
};
