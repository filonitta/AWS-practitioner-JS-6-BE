import products from './data/products.json';

export const getProductsList = async () => {
	return {
		statusCode: 200,
		body: JSON.stringify(products),
	};
};

export const getProductById = async (event) => {
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
