import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

import schema from './schema';
import { dbOptions } from '../../dbOptions';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let client;

  try {
    client = new Client(dbOptions);
    await client.connect();

    const { rows: products } = await client.query('SELECT p.*, s.count FROM products p LEFT JOIN stocks s ON p.id = s.product_id');
    return formatJSONResponse(200, products);

  } catch (error) {
    console.log("DB error:", error);
    return formatJSONResponse(500, { message: 'Internal server error' });
  
  } finally {
    if (client) {
      client.end();
    }
  }
}

export const main = middyfy(getProductsList);
