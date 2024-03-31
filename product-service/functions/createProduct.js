import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDB.DocumentClient();

export const createProduct = async (event) => {
	const parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

	const { title, description, image, price } = parsedBody;

	if (!title) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: 'Invalid product data. Title must be provided and not null.',
			}),
		};
	}

	const params = {
		TableName: 'products',
		Item: {
			id: uuidv4(),
			title,
			description,
			image,
			price,
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
		console.log(`Error inserting into products table: ${error}`);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: `Could not create product: ${error.message}` }),
		};
	}
};
