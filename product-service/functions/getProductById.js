import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const getProductById = async (event) => {
	const { id } = event.pathParameters;

	const params = {
		TableName: process.env.PRODUCTS_TABLE_NAME,
		Key: {
			id: id,
		},
	};

	try {
		const data = await dynamoDB.get(params).promise();

		if (!data.Item) {
			return {
				statusCode: 404,
				body: JSON.stringify({ message: 'Product not found' }),
			};
		}

		return {
			statusCode: 200,
			body: JSON.stringify(data.Item),
		};
	} catch (error) {
		console.error(`Error retrieving product from DynamoDB: ${error}`);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: `Error retrieving product from DynamoDB: ${error}` }),
		};
	}
};
