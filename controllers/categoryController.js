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

exports.create_get = (req, res) => {
  res.render('categories/form', { category: {}, formAction: '/categories/create' });
};

exports.create_post = async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2)',
      [name, description]
    );
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.send('Error creating category');
  }
};

exports.update_get = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    const category = result.rows[0];
    res.render('categories/form', {
      category,
      formAction: `/categories/${id}/update`
    });
  } catch (err) {
    console.error(err);
    res.send('Error loading category for update');
  }
};

exports.update_post = async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  try {
    await pool.query(
      'UPDATE categories SET name = $1, description = $2, updated_at = NOW() WHERE id = $3',
      [name, description, id]
    );
    res.redirect(`/categories/${id}`);
  } catch (err) {
    console.error(err);
    res.send('Error updating category');
  }
};

// --- DELETE ---
exports.delete_get = async (req, res) => {
  const id = req.params.id;
  try {
    const categoryResult = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    const category = categoryResult.rows[0];

    if (!category) {
      return res.send('Category not found');
    }

    // Get items in this category (to warn user)
    const itemsResult = await pool.query('SELECT * FROM items WHERE category_id = $1', [id]);

    res.render('categories/delete', { category, items: itemsResult.rows });
  } catch (err) {
    console.error(err);
    res.send('Error loading delete page');
  }
};

exports.delete_post = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    // Items will remain but category_id will automatically become NULL (due to ON DELETE SET NULL)
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.send('Error deleting category');
  }
};
