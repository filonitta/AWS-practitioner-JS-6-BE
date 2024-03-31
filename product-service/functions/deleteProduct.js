import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const deleteProduct = async (event) => {
	const { id } = event.pathParameters;

	const params = {
		TableName: 'products',
		Key: {
			id,
		},
	};

	try {
		await dynamoDB.delete(params).promise();
		return {
			statusCode: 200,
			body: JSON.stringify({ message: `Product with id: ${id} deleted` }),
		};
	} catch (error) {
		console.error('Error deleting product: ', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: `Error deleting product with id: ${id}` }),
		};
	}
};
