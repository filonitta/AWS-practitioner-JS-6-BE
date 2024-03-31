import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const getProductsList = async () => {
	const params = {
		TableName: process.env.PRODUCTS_TABLE_NAME,
	};

	try {
		const data = await dynamoDB.scan(params).promise();
		return {
			statusCode: 200,
			body: JSON.stringify(data.Items),
		};
	} catch (error) {
		console.error(`Error retrieving products from DynamoDB: ${error}`);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: `Error retrieving products from DynamoDB: ${error}` }),
		};
	}
};
