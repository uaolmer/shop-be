import 'source-map-support/register';

import AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import csvParser from 'csv-parser';

import { BUCKET, REGION, SQS_URL } from '../../constants/constants';

const importFileParser = async (event) => {
    try {
        const s3: AWS.S3  = new AWS.S3({ signatureVersion: 'v4', region: REGION });
        const SQS = new AWS.SQS({ region: REGION });
        const results: Array<string> = [];

        for (const record of event.Records) {
            const name = decodeURIComponent(record.s3.object.key);        
            const s3Stream = s3.getObject({
                Bucket: BUCKET,
                Key: name,
            }).createReadStream();
      
            s3Stream.pipe(csvParser())
                .on('data', async (data) => {
                    results.push(data);
                    const message: string = JSON.stringify(data);
                    const messageParams: AWS.SQS.SendMessageRequest = {
                        QueueUrl: SQS_URL,
                        MessageBody: message,
                    };

                    await SQS.sendMessage(messageParams).promise();
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
        };

        return formatJSONResponse(200, JSON.stringify(results));

    } catch (error) {
        return formatJSONResponse(500, { message: error.message });
    }

};

export const main = middyfy(importFileParser);