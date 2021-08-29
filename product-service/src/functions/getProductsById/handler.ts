import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getProduct } from './db';
import * as mockData from '../mock.json';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product: object = await getProduct(mockData, productId);
    
    if (typeof product == 'undefined' || Object.keys(product).length == 0)
      throw new Error('The product does not exist.');

    return formatJSONResponse({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product[1]),
    });
  } catch(error) {
    return formatJSONResponse({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: error.message }),
    });
  }
}

export const main = middyfy(getProductsById);
