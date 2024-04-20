import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const dynamoDB = new DynamoDB.DocumentClient();

const productSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().allow(''),
	price: Joi.number().integer().required(),
	image: Joi.string(),
}).required();

const stockSchema = Joi.object({
	count: Joi.number().integer().required(),
}).required();

const combinedSchema = productSchema.concat(stockSchema).required();

// validate and insert data into the database
export const addProduct = async (productData) => {
	const { title, description, image, price, count } = productData;

	const id = uuidv4();
	const productItem = {
		id,
		title,
		description,
		image,
		price,
	};

	const productParams = {
		TransactItems: [
			{
				Put: {
					TableName: process.env.PRODUCTS_TABLE_NAME,
					Item: productItem,
				},
			},
			{
				Put: {
					TableName: process.env.STOCKS_TABLE_NAME,
					Item: {
						product_id: id,
						count,
					},
				},
			},
		],
	};

	try {
		await dynamoDB.transactWrite(productParams).promise();
		return { ...productItem, count };
	} catch (error) {
		console.error(`Error inserting into products & stocks tables: ${error}`);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: `Could not create product: ${error.message}` }),
		};
	}
};

export const createProduct = async (event) => {
	const parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

	const { error } = combinedSchema.validate(parsedBody);

	if (error) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: error.details[0].message }),
		};
	}

	try {
		const createdProduct = await addProduct(parsedBody);

		return {
			statusCode: 200,
			body: JSON.stringify(createdProduct),
		};
	} catch (error) {
		console.error(`Error inserting into products table: ${error}`);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: `Could not create product: ${error.message}` }),
		};
	}
};
