import { main as importProductsFile } from "../functions/import-products-file/handler";
import { S3 } from 'aws-sdk';
import AWS from 'aws-sdk-mock';
import fs from 'fs';

import { BUCKET } from '../constants/constants';
import { IMock } from "src/interfaces/interface";

describe('service importProductsFile()', (): void => {
    const mockRequest: IMock = { 
      queryStringParameters: {
        name: "products.csv",
      }
    }
    
    beforeEach(() => {
        AWS.mock('S3', 'putObject', Buffer.from(fs.readFileSync('products.csv')));
    });
  
    it('should initialize S3 instance', async (): Promise<void> => {
      const s3 = new S3
      await importProductsFile(mockRequest, undefined, undefined);
      expect(AWS).toHaveBeenCalledTimes(1);
    });

    it('should properly call \'getSignedUrlPromise\' method of S3 object', async (): Promise<void> => {
      await importProductsFile(mockRequest, undefined, undefined);

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