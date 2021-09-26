import { main as importProductsFile } from "../functions/import-products-file/handler";
import * as S3 from 'aws-sdk/clients/s3';
import { IMock } from '../interfaces/interface';


jest.mock('aws-sdk');

describe('service importProductsFile()', (): void => {
    let mock: IMock;
  
    beforeEach(() => {
        mock = {
            queryStringParameters: {
                name: 'mockedName',
            },
      };
    });
  
    it('should initialize S3 instance', async (): Promise<void> => {
      await importProductsFile(mock, undefined, undefined);
      expect(S3).toHaveBeenCalledTimes(1);
    });
  
});