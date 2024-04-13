import { addProduct } from './createProduct';

export const catalogBatchProcess = async (event) => {
	const records = event.Records;

	for (let record of records) {
		const productData = JSON.parse(record.body);

		try {
			const createdProduct = await addProduct(productData);

			const message = `Product was created: ${JSON.stringify(createdProduct)}`;

			await sns
				.publish({
					Subject: 'A new product was created in the shop',
					Message: message,
					MessageAttributes: {
						event: {
							DataType: 'String',
							StringValue: 'ProductCreated',
						},
					},
					TopicArn: process.env.SNS_TOPIC_ARN,
				})
				.promise();
		} catch (error) {
			console.error(`Error creating product: ${error.message}`);
		}
	}
};
