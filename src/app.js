require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');
const rawMaterialRoutes = require('./routes/RawMaterial.routes');
const productRawMaterialRoutes = require('./routes/ProductRawMaterial.routes');
const productionRoutes = require('./routes/production.routes');

const app = express(); 

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API running');
});

app.use(productRoutes);
app.use(rawMaterialRoutes);
app.use(productRawMaterialRoutes);
app.use(productionRoutes);

module.exports = app;