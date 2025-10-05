// controllers/itemController.js
const pool = require('../db');

// List all items
exports.item_list = async (req, res) => {
  try {
    const { rows: items } = await pool.query(`
      SELECT items.*, categories.name AS category_name
      FROM items
      LEFT JOIN categories ON items.category_id = categories.id
      ORDER BY items.id
    `);
    res.render('items/list', { items });
  } catch (err) {
    console.error(err);
    res.send('Error fetching items');
  }
};

// Show item details
exports.item_detail = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: items } = await pool.query(`
      SELECT items.*, categories.name AS category_name
      FROM items
      LEFT JOIN categories ON items.category_id = categories.id
      WHERE items.id = $1
    `, [id]);

    if (items.length === 0) return res.send('Item not found');

    res.render('items/detail', { item: items[0] });
  } catch (err) {
    console.error(err);
    res.send('Error fetching item');
  }
};

// Display form to create a new item
exports.item_create_get = async (req, res) => {
  const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY name');
  res.render('items/form', { title: 'Add New Item', item: {}, categories });
};

// Handle item create
exports.item_create_post = async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;
  await pool.query(
    'INSERT INTO items (name, description, price, stock_quantity, category_id) VALUES ($1, $2, $3, $4, $5)',
    [name, description, price, quantity, category_id || null]
  );
  res.redirect('/items');
};

// Display form to edit an item
exports.item_update_get = async (req, res) => {
  const { id } = req.params;
  const { rows: items } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY name');
  res.render('items/form', { title: 'Edit Item', item: items[0], categories });
};

// Handle item update
exports.item_update_post = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category_id } = req.body;
  await pool.query(
    'UPDATE items SET name=$1, description=$2, price=$3, stock_quantity=$4, category_id=$5 WHERE id=$6',
    [name, description, price, quantity, category_id || null, id]
  );
  res.redirect('/items');
};

// Handle item delete (POST)
exports.item_delete_post = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.redirect('/items');
  } catch (err) {
    console.error(err);
    res.send('Error deleting item');
  }
};
