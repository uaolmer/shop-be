import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getProduct } from './db';
import mockData from '../mock.json';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product: any = await getProduct(mockData, productId);
    
    if (typeof product == 'undefined' || Object.keys(product).length == 0)
      throw new Error('Product not found');

    return formatJSONResponse(200, product[1]);

  } catch(error) {
    return formatJSONResponse(500, error.message);
  }
}

export const main = middyfy(getProductsById);
