import products from '../mocks/products.json';

export const getProductsList = async () => {
	return {
		statusCode: 200,
		body: JSON.stringify(products),
	};
};
