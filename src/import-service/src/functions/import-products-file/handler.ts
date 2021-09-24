import 'source-map-support/register';

import S3 from 'aws-sdk/clients/s3';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { IParams } from '../../interfaces/interface';

const { BUCKET } = process.env; 

const importProductsFile: ValidatedEventAPIGatewayProxyEvent = async (event) => {
  try {
    const s3: S3 = new S3({ region: 'eu-west-1' });
    const catalog: string = event.queryStringParameters.name;

    const params: IParams = {
      Bucket: BUCKET,
      Key: `uploaded/${catalog}`,
      Expires: 60,
      ContentType: 'text/csv',
    }
    
    const s3Reponse: string | Record<string, unknown> = await s3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse(200, s3Reponse);
  
  } catch (error) {
    return formatJSONResponse(500, { message: error.message });
  }
}

export const main = middyfy(importProductsFile);
