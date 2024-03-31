import { createProduct } from './createProduct';
import products from '../mocks/products.json';
import stocks from '../mocks/stocks.json';

export const loadProducts = async () => {
	for (const product of products) {
		const event = {
			body: JSON.stringify(product),
		};

		const result = await createProduct(event);

		if (result.statusCode >= 400) {
			console.error(`Error saving product ${product.title}: ${result.body}`);
		}
	}

	return {
		statusCode: 200,
		body: 'Products loaded successfully',
	};
};

export const loadStocks = async () => {
	for (const stock of stocks) {
		const event = {
			body: JSON.stringify(stock),
		};

		const parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

		const { product_id, count } = parsedBody;

		const params = {
			TableName: process.env.STOCKS_TABLE_NAME,
			Item: {
				product_id,
				count,
			},
		};

		try {
			const data = await dynamoDB.put(params).promise();
			console.log('Data: ', data);
			return {
				statusCode: 200,
				body: JSON.stringify(params.Item),
			};
		} catch (error) {
			console.error(`Error inserting into stocks table: ${error}`);
			return {
				statusCode: 500,
				body: JSON.stringify({ error: `Could not create stock: ${error.message}` }),
			};
		}
	}

	return {
		statusCode: 200,
		body: 'Stocks loaded successfully',
	};
};
