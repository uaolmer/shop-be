import { main as importProductsFile } from "../functions/import-products-file/handler";
import * as S3 from 'aws-sdk/clients/s3';
import { IMock } from '../interfaces/interface';

import { BUCKET } from '../constants/constants';

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

    it('should properly call \'getSignedUrlPromise\' method of S3 object', async (): Promise<void> => {
      await importProductsFile(mock, undefined, undefined);

      const response = S3['mock'].instances[0].getSignedUrlPromise;

      expect(response).toHaveBeenCalledWith('putObject', {
        Bucket: BUCKET,
        Key: 'uploaded/mockedName',
        ContentType: 'text/csv',
        Expires: 60,
      });

      expect(response).toHaveBeenCalledTimes(1);
    });
  
});