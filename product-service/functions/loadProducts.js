import { createProduct } from './createProduct';
import products from '../mocks/products.json';

export const loadProducts = async () => {
	for (const product of products) {
		const event = {
			body: JSON.stringify(product),
		};

		const result = await createProduct(event);

		if (result.statusCode >= 400) {
			console.error(`Error saving product ${product.title}: ${result.body}`);
			return {
				statusCode: result.statusCode,
				body: `Error saving product ${product.title}: ${result.body}`,
			};
		}
	}

	return {
		statusCode: 200,
		body: 'Products loaded successfully',
	};
};
