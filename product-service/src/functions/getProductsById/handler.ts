import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

import schema from './schema';
import { dbOptions } from '../../dbOptions';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let client;

  try {
    const { productId } = event.pathParameters;

    if (!productId) {
      return formatJSONResponse(400, { message: 'Bad request' });
    }

    client = new Client(dbOptions);
    await client.connect();

    const { rows: products } = await client.query(
      'SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id WHERE p.id=$1',
      [productId]
    );

    const product = products[0];

    if (!product) {
      return formatJSONResponse(200, { message: 'Product not found' });
    }

    return formatJSONResponse(200, { product });

  } catch(error) {
    return formatJSONResponse(500, { message: 'Internal server error' });
  
  } finally {
    if (client) {
      client.end();
    }
  }
}

export const main = middyfy(getProductsById);
