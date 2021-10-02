import 'source-map-support/register';

import S3 from 'aws-sdk/clients/s3';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import csvParser from 'csv-parser';

import { BUCKET } from '../../constants/constants';

const importFileParser = async (event) => {
    try {
        const s3: S3 = new S3({ region: 'eu-west-1' });
        const results: Array<object> = [];

        event.Records.forEach(async (record) => {
            const name = record.s3.object.key;        
            const s3Stream = s3.getObject({
                Bucket: BUCKET,
                Key: name,
            }).createReadStream();
      
            s3Stream.pipe(csvParser())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('error', error => {
                    throw new Error(`Reading file failed: ${error}`);
                })
                .on('end', async () => {
                    await s3.copyObject({
                        Bucket: BUCKET,
                        CopySource: `${BUCKET}/${name}`,
                        Key: name.replace('uploaded', 'parsed'),
                    }).promise();
                    await s3.deleteObject({
                        Bucket: BUCKET,
                        Key: name,
                    }).promise();
                });
        });

        return formatJSONResponse(200, JSON.stringify(results));

    } catch (error) {
        return formatJSONResponse(500, { message: error.message });
    }

};

export const main = middyfy(importFileParser);