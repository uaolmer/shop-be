import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

import schema from './schema';
import { dbOptions } from '../../dbOptions';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let client;

  try {
    console.log("Parameters", event.body);
    const { title, description, price, count } = event.body; 

    if (!title || price < 0 || count < 0) {
      return formatJSONResponse(400, {
        message: 'Bad request',
      });
    }

    client = new Client(dbOptions);
    await client.connect();
    await client.query('BEGIN');

    const { rows: response } = await client.query(
      'INSERT INTO products(title, description, price) VALUES($1, $2, $3) returning id',
      [title, description, price]
    );

    const { id } = response[0];

    await client.query(
      'INSERT INTO stocks(product_id, count) VALUES($1, $2)',
      [id, count]
    );

    await client.query('COMMIT');

    return formatJSONResponse(201, {
      id,
      title,
      description,
      price,
    });

  } catch (error) {
    console.log("ROLLBACK", error);
    await client.query('ROLLBACK');

    return formatJSONResponse(500, {
      message: 'Internal server error',
    });

  } finally {
    if (client) {
      client.end();
    }
  }
}

export const main = middyfy(createProduct);