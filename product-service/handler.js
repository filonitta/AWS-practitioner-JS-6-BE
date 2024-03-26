'use strict';

module.exports.getProductsList = async (event) => {
	const products = require('./data/products.json');

	return {
		statusCode: 200,
		body: JSON.stringify(products),
	};
};

module.exports.getProductById = async (event) => {
	const products = require('./data/products.json');
	const { id } = event.pathParameters;
	const product = products.find((product) => product.id === id);

	if (!product) {
		return {
			statusCode: 404,
			body: JSON.stringify({ message: 'Product not found' }),
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify(product),
	};
};
