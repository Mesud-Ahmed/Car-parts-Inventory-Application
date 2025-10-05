const pool = require('../db');

// Show all categories
exports.list = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.render('categories/list', { categories: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Error fetching categories');
  }
};

// Show one category and its items
exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const categoryResult = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    const itemsResult = await pool.query('SELECT * FROM items WHERE category_id = $1', [id]);

    res.render('categories/detail', {
      category: categoryResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.send('Error fetching category');
  }
};
