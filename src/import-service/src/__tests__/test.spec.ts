import { importProductsFile } from "../functions/import-products/handler";
//import { main as getProductsList }  from "../functions/getProductsList/handler";
//import mockData from "../functions/mock.json";

test('importProductsFile lambda: status code by Id to be returned', async () => {
    let productEvent = { pathParameters: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' };
    const expected = await importProductsFile(productEvent);
    expect(expected.statusCode).toBe(200);
});