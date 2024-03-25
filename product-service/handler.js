'use strict';

module.exports.getProductsList = async (event) => {
	const products = require('./mocks/products.json');

	return {
		statusCode: 200,
		body: JSON.stringify(products),
	};
};
