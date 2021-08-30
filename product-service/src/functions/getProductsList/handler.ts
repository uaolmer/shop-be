import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getProducts } from './db';
import mockData from '../mock.json';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const productsList: any = await getProducts(mockData);
    return formatJSONResponse(200, productsList);
  } catch (error) {
    return formatJSONResponse(500, error.message);
  }
};

export const main = middyfy(getProductsList);
