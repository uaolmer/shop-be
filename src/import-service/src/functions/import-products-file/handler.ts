import 'source-map-support/register';

import AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { IParams } from '../../interfaces/interface';
import { BUCKET } from '../../constants/constants';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  try {
    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const { name } = event.queryStringParameters;

    const params: IParams = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      ContentType: 'text/csv',
      Expires: 60*5,
    }
    
    const s3Reponse: string | Record<string, unknown> = await s3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse(200, s3Reponse);
  
  } catch (error) {
    return formatJSONResponse(500, { message: error.message });
  }
}

export const main = middyfy(importProductsFile);
