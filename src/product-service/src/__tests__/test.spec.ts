import { main as getProductsById } from "../functions/getProductsById/handler";
//import { main as getProductsList }  from "../functions/getProductsList/handler";
//import mockData from "../functions/mock.json";

test('getProductsById lambda: status code by Id to be returned', async () => {
    let productEvent = { pathParameters: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' };
    const expected = await getProductsById(productEvent);
    expect(expected.statusCode).toBe(200);
});