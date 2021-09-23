import type { AWS } from '@serverless/typescript';

import { importProductsFile, importFileParser } from '@functions/index';

const { BUCKET } = process.env;

const serverlessConfiguration: AWS = {
  service: 'import-service',
  package: {
    individually: true,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: [`arn:aws:s3:::${BUCKET}`],
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: [`arn:aws:s3:::${BUCKET}/*`],
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BUCKET,
    },
    lambdaHashingVersion: '20201221',
    stage: 'dev',
    region: 'eu-west-1',
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
