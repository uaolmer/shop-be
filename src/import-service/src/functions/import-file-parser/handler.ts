import 'source-map-support/register';

import { S3 } from 'aws-sdk';
import { S3Event, S3EventRecord } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { Stream } from 'stream';
import { formatJSONResponse } from '@libs/apiGateway';
import * as csvParser from 'csv-parser';

const { BUCKET } = process.env;

const importFileParser = async (event: S3Event) => {
    try {
        const s3: S3 = new S3({ region: 'eu-west-1' });
        const results: Array<any> = [];

        event.Records.forEach(async (record: S3EventRecord) => {
            const name: string = record.s3.object.key;        
            const s3Stream: Stream = s3.getObject({
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