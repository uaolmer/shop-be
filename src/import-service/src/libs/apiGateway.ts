import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, S3EventRecord } from "aws-lambda";

type ValidatedAPIGatewayProxyEvent = Omit<APIGatewayProxyEvent, 'body'> & { body: S3EventRecord }
export type ValidatedEventAPIGatewayProxyEvent = Handler<ValidatedAPIGatewayProxyEvent, APIGatewayProxyResult>

export const formatJSONResponse = (statusCode: number, response: string | Record<string, unknown>) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: statusCode,
    body: JSON.stringify(response),
  }
}