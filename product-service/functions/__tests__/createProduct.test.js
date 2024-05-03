import { addProduct, createProduct } from './../createProduct';

let mockPromise = jest.fn();

jest.mock('aws-sdk', () => {
	return {
		DynamoDB: {
			DocumentClient: jest.fn(() => ({
				transactWrite: jest.fn(() => ({ promise: mockPromise })),
			})),
		},
	};
});

jest.mock('uuid', () => {
	return {
		v4: jest.fn().mockReturnValue('uniqueUUID'),
	};
});

describe('addProduct', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation();
	});

	beforeEach(() => {
		process.env.PRODUCTS_TABLE_NAME = 'Products';
		process.env.STOCKS_TABLE_NAME = 'Stocks';
		mockPromise.mockClear();
	});

	it('should insert product data into the db and return the product', async () => {
		mockPromise.mockResolvedValueOnce({});

		const productData = {
			title: 'Test Title',
			description: 'Test Description',
			image: 'Test Image',
			price: 25,
			count: 5,
		};

		const result = await addProduct(productData);

		expect(result).toEqual({
			id: 'uniqueUUID',
			...productData,
		});
	});

	it('should handle db error gracefully', async () => {
		mockPromise.mockRejectedValueOnce(new Error('DB error'));

		const productData = {
			title: 'Test Title',
			description: 'Test Description',
			image: 'Test Image',
			price: 25,
			count: 5,
		};

		try {
			await addProduct(productData);
		} catch (error) {
			expect(error.message).toEqual('Could not create product: DB error');
		}
	});
});

describe('createProduct', () => {
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation();
	});

	it('should validate the input data and return an error for invalid data', async () => {
		const event = {
			body: JSON.stringify({
				title: 'Test Title',
				description: 'Test Description',
				image: 'Test Image',
				price: '25abc',
				count: 5,
			}),
		};

		const result = await createProduct(event);

		expect(result.statusCode).toBe(400);
		expect(JSON.parse(result.body)).toEqual({
			error: '"price" must be a number',
		});
	});

	it('should create a product when the input data is valid', async () => {
		const event = {
			body: JSON.stringify({
				title: 'Test Title',
				description: 'Test Description',
				image: 'Test Image',
				price: 25,
				count: 5,
			}),
		};

		mockPromise.mockResolvedValueOnce({});

		const result = await createProduct(event);

		expect(result.statusCode).toBe(200);
		expect(JSON.parse(result.body)).toEqual({
			id: 'uniqueUUID',
			title: 'Test Title',
			description: 'Test Description',
			image: 'Test Image',
			price: 25,
			count: 5,
		});
	});

	it('should handle db error gracefully when creating a product', async () => {
		const event = {
			body: JSON.stringify({
				title: 'Test Title',
				description: 'Test Description',
				image: 'Test Image',
				price: 25,
				count: 5,
			}),
		};

		mockPromise.mockRejectedValueOnce(new Error('DB error'));

		const result = await createProduct(event);

		expect(JSON.parse(result.body)).toEqual({
			statusCode: 500,
			body: '{"error":"Could not create product: DB error"}',
		});
	});
});
