const express = require('express');
const productsRouter = ('./products');
const RawMaterialRouter = ('./RawMaterial.routes');
const ProductRawMaterialRouter = ('./ProductRawMaterial.routes');
const productionRouter = require('./production.routes');

Module.exports = (app) => {
    app.use(
        express.json(),
        productsRouter,
        RawMaterialRouter,
        ProductRawMaterialRouter,
        productionRouter
    )
}