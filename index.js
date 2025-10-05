const express = require('express');
const pool = require('./db');
const path = require("path")
const categoryRoutes = require('./routes/categories');
const expressLayouts = require('express-ejs-layouts');
const itemsRouter = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))
app.use(expressLayouts);
app.set('layout', 'layout');

app.use("/items", itemsRouter);
app.use('/categories', categoryRoutes);
app.use('/', categoryRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
