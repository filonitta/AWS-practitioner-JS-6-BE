import { getProductsList, getProductById } from './handler';
import products from './data/products.json';

describe("Product handlers", () => {
  test('getProductsList returns all products', async () => {
    const result = await getProductsList();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(products);
  });

  test('getProductById returns product with specified id', async () => {
    const testId = products[0].id;
    const result = await getProductById({ pathParameters: { id: testId } });
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(products[0]);
  });

  test('getProductById returns 404 error for non-existent product', async () => {
    const result = await getProductById({ pathParameters: { id: 'non-existent-id' } });
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ message: 'Product not found' });
  });
});
