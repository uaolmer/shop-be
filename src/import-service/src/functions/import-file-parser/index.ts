import { handlerPath } from '@libs/handlerResolver';
import { BUCKET } from '../../constants/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [
          {
            prefix: 'uploaded/',
          },
        ],
      },
    },
  ],
};