import 'source-map-support/register';

import { S3 } from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const { BUCKET } = process.env; 

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const s3: S3 = new S3({ region: 'eu-west-1' });
    const catalogName: string = event.queryStringParameters.name;

    const params: object = {
      Bucket: BUCKET,
      Key: `uploaded/${catalogName}`,
      Expires: 60,
      ContentType: 'text/csv',
    }
    
    const s3Reponse: string | Record<string, unknown> = await s3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse(200, s3Reponse);
  
  } catch (error) {
    console.error(error);
    return formatJSONResponse(500, { message: error.message });
  }
}

export const main = middyfy(importProductsFile);
