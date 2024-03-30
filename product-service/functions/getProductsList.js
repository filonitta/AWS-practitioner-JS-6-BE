import products from '../data/products.json';

export const getProductsList = async () => {
	return {
		statusCode: 200,
		body: JSON.stringify(products),
	};
};
