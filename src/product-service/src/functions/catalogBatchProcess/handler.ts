import 'source-map-support/register';

import AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

import schema from './schema';
import { dbOptions } from '../../dbOptions';
import { callbackify } from 'util';

export const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const sqs = new AWS.SQS();
    const records = JSON.parse(event.body);

    records.forEach(record => {
      sqs.sendMessage({
        QueueUrl: '',
        MessageBody: record
      }, () => {
        console.log('Send message for: ' + record)
      });
    });

    
}

export const main = middyfy(catalogBatchProcess);