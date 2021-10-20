import 'source-map-support/register';

import AWS from 'aws-sdk';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

import { dbOptions } from '../../dbOptions';

export const catalogBatchProcess = async (event) => {
  let client;

  const records = JSON.parse(event.Records[0].body);
  const { SNS_TOPIC_ARN } = process.env;
  const sns = new AWS.SNS({ region: "eu-west-1" });

  const { title, description, price, count } = records;
 
  try {
    client = new Client(dbOptions);
    await client.connect();
    await client.query('BEGIN');

    const { rows: response } = await client.query(
      'INSERT INTO products(title, description, price) VALUES($1, $2, $3) RETURNING id',
      [title, description, price]
    );
  
    const { id } = response[0];
  
    await client.query(
      'INSERT INTO stocks(product_id, count) VALUES($1, $2)',
      [id, count]
    );
  
    await client.query("COMMIT");

    const addedProduct = { id, title, description, price, count };

    await sns
      .publish({
        Subject: `${addedProduct.title} was processed`,
        Message: JSON.stringify(addedProduct),
        TopicArn: SNS_TOPIC_ARN,
        MessageAttributes: {
          price: {
            DataType: "Number",
            StringValue: `${addedProduct.price}`,
          },
        },
      })
      .promise();

    return formatJSONResponse(201, { message: 'Success!' });

  } catch (error) {
    return formatJSONResponse(500, { message: error.message });

  } finally {
    if (client) 
      client.end();
  }
}

export const main = middyfy(catalogBatchProcess);